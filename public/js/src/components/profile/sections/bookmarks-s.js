import React from 'react'
import { connect } from 'react-redux'
import { FadeIn } from 'animate-components'
import Nothing from '../../others/nothing'
import End from '../../others/end'
import { Me, profile_scroll } from '../../../utils/utils'
import Spinner from '../../others/spinner'
import { getBookmarkedPosts } from '../../../store/actions/post-a'
import Post from '../../post/post'
import Title from '../../others/title'
import Suggested from '../../others/suggested/suggested'

@connect(store => (
  {
    bookmarks: store.Post.bookmarks,
    ud: store.User.user_details
  }
))

export default class Bookmarks extends React.Component {

  state = {
    loading: true
  }

  componentDidMount = () => {
    profile_scroll()
    let { dispatch, ud: { id } } = this.props
    dispatch(getBookmarkedPosts(id))
  }

  componentWillReceiveProps({ dispatch, ud, ud: { id } }) {
    this.props.ud != ud ? dispatch(getBookmarkedPosts(id)) : null
    this.setState({ loading: false })
  }

  render() {
    let
      { loading } = this.state,
      { param: username, ud: { id }, bookmarks } = this.props,
      len = bookmarks.length,
      map_posts = bookmarks.map(p =>
        <Post key={p.post_id} {...p} when='bookmarks' />
      )

    return (
      <div>
        <FadeIn duration='300ms' >

          { loading ? <Spinner/> : null }

          <Title value={`Momentos salvos de ${username}`} />

          <div className={`app_sections pro_app_sections ${loading ? 'cLoading' : ''}`} >

            <div className='app_static_sections'>
              <Suggested/>
            </div>

            <div className='app_personal_sections'>
              {
                len == 0
                  ? <Nothing
                    mssg={Me(id) ? 'Você não tem momentos salvos' : `${username} não tem momentos salvos`}
                  />
                  : <FadeIn duration='500ms'>{ map_posts }</FadeIn>
              }
            </div>

          </div>

          { len != 0 && !loading ? <End/> : null }

        </FadeIn>
      </div>
    )
  }
}
