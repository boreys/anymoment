import React, { Fragment } from 'react'
import { FadeIn } from 'animate-components'
import Title from '../others/title'
import { connect } from 'react-redux'
import { getUnreadNotifications } from '../../store/actions/notification-a'
import { getConversations } from '../../store/actions/message-a'
import ConversationTeaser from './conTeaser'
import SearchFollowings from '../others/search-followings'
import Nothing from '../others/nothing'
import Loading from '../others/loading'
import { humanReadable } from '../../utils/utils'
import { newConversation } from '../../utils/message-utils'
import Conversation from './conversation/conversation'
import $ from 'jquery'
import OnlineUsers from './online-users/onlineUsers'
import Overlay from '../others/overlay'

@connect(store => (
  { conversations: store.Message.conversations }
))

export default class Messages extends React.Component {

  state = {
    loading: true,
    getUsersForNewCon: false,
    showConversation: false,
    showOnlineUsers: false,
    conDetails: {},
  }

  componentDidMount = () => {
    let { dispatch } = this.props
    dispatch(getUnreadNotifications())
    dispatch(getConversations())
  }

  componentWillReceiveProps = () =>
    this.setState({ loading: false })

  _toggle = (e, what) => {
    e ? e.preventDefault() : null
    this.setState({
      [what]: !this.state[what]
    })
  }

  createConversation = async (user, username) => {
    let { dispatch } = this.props
    newConversation({
      user, username, dispatch,
      done: () => {
        this._toggle(null, 'newCon')
        this._toggle(null, 'getUsersForNewCon')
      }
    })
  }

  selectConversation = det => {
    $('.mssg_sr').removeClass('mssg_sr_toggle')
    $(`.mt_${det.con_id}`).addClass('mssg_sr_toggle')
    this.setState({
      conDetails: det,
      showConversation: true
    })
  }

  render() {
    let
      { getUsersForNewCon, loading, showConversation, conDetails, showOnlineUsers } = this.state,
      { conversations } = this.props,
      conLen = conversations.length,
      map_conversations = conversations.map(c =>
        <ConversationTeaser
          key={c.con_id}
          {...c}
          select={() => this.selectConversation(c)}
        />
      )

    return (
      <div>

        { loading ? <Loading/> : null }

        <Title value='Mensagens' />

        <FadeIn duration='300ms' className={`messages_app_sections ${loading ? 'cLoading' : ''}`} >

          <div className='mssg_left'>

            <div className='mssg_new'>
              <a href='#' className='pri_btn' onClick={e => this._toggle(e, 'getUsersForNewCon')} >
                <i className='fas fa-plus'></i>
                <span>Nova conversa</span>
              </a>
              <a href='#' className='pri_btn' onClick={e => this._toggle(e, 'showOnlineUsers')} >
                <i className='fas fa-globe'></i>
                <span>Online</span>
              </a>
            </div>

            {
              getUsersForNewCon ?
                <FadeIn duration='300ms'>
                  <SearchFollowings
                    placeholder='Buscar...'
                    when='new_con'
                    done={(user, username) =>
                      this.createConversation(user, username)
                    }
                  />
                </FadeIn>
                : null
            }

            <span className='con_count' >{ humanReadable(conLen, 'conversas') }</span>

            {/* CONVERSATIONS */}
            {
              conLen == 0 ?
                <Nothing
                  whenMessage={true}
                  mssg='Não há conversas'
                />
                : <FadeIn duration='300ms'>{map_conversations}</FadeIn>
            }

          </div>

          <div className='mssg_right'>

            {/* SHOW CONVERSATION */}
            {
              showConversation ?
                <Conversation
                  conDetails={conDetails}
                  hideConversation={() => this._toggle(null, 'showConversation')}
                />
                : <div style={{ marginTop: 77 }} >
                  <Nothing mssg='' />
                </div>
            }

          </div>

        </FadeIn>

        {
          showOnlineUsers ?
            <Fragment>
              <Overlay />
              <OnlineUsers
                back={() => this.setState({ showOnlineUsers: false })}
              />
            </Fragment>
            : null
        }

      </div>
    )
  }
}
