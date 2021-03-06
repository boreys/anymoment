import React from 'react'
import { FadeIn } from 'animate-components'
import { Scrollbars } from 'react-custom-scrollbars'
import Spinner from '../../others/spinner'
import { connect } from 'react-redux'
import { getConDetails } from '../../../store/actions/message-a'
import { Link } from 'react-router-dom'
import { humanReadable, Me } from '../../../utils/utils'
import TimeAgo from 'handy-timeago'
import Nothing from '../../others/nothing'

@connect(store => (
  { conDetails: store.Message.conDetails }
))

export default class AboutConversation extends React.Component {

  state = {
    loading: true,
  }

  componentDidMount = () => {
    let { dispatch, con_id, conWith: { user } } = this.props
    dispatch(getConDetails(con_id, user))
  }

  componentWillReceiveProps = () =>
    this.setState({ loading: false })

  back = e => {
    e.preventDefault()
    this.props.back()
  }

  render() {
    let
      { loading } = this.state,
      {
        conWith: { user, username, firstname, surname },
        conDetails: { con_time, mssgsCount, media, mutualFollowersCount },
      } = this.props,
      map_media = media ? media.map(m =>
        <img
          key={m.imgSrc}
          src={`/messages/${m.imgSrc}`}
          className='sli_media_img'
          title={`por ${Me(m.mssg_by) ? 'você' : m.mssg_by_username}`}
        />
      ) : null

    return (
      <div className='modal modal_big' >

        <FadeIn duration='300ms' >
          <div className='modal_header'>
            <span className='title' >Conversa</span>
          </div>

          <Scrollbars style={{ height: 450 }} className='modal_middle' >

            { loading ? <Spinner/> : null }

            <div className={`modal_main ${loading ? 'cLoading' : ''}`} style={{ padding: 0 }} >
              <div className='about_con'>

                <div className='sli_with_div'>
                  <span className='sli_label'>Conversando com</span>
                  <div className='sli_with'>
                    <img src={`/users/${user}/avatar.jpg`} />
                    <div className='sli_with_cont'>
                      <Link to={`/profile/${username}`} >{username}</Link>
                      <span className='sli_w'>
                        {
                          mutualFollowersCount == 0
                            ? `${firstname} ${surname}`
                            : humanReadable(mutualFollowersCount, 'seguidores em comum')
                        }
                      </span>
                    </div>
                  </div>
                </div>

                <div className='sli_time'>
                  <span className='sli_label'>Desde</span>
                  <span className='sli_bold'>{`${TimeAgo(con_time)}`}</span>
                </div>

                <div className='sli_mssg_count'>
                  <span className='sli_label'>Mensagens</span>
                  <span className='sli_bold'>{ humanReadable(mssgsCount, 'mensagens') }</span>
                </div>

                <div className='sli_media'>
                  <span className='sli_label'>Arquivos</span>
                  {
                    media
                      ? media.length == 0 ? <Nothing whenMessage={true} showMssg={false} /> : map_media
                      : null
                  }
                </div>

              </div>
            </div>

          </Scrollbars>

          <div className='modal_bottom'>
            <a href='#' className='pri_btn' onClick={this.back} >Voltar</a>
          </div>
        </FadeIn>

      </div>
    )
  }
}
