import React from 'react'
import { FadeIn } from 'animate-components'
import Title from '../others/title'
import { connect } from 'react-redux'
import { getUnreadNotifications } from '../../store/actions/notification-a'
import { getUnreadMessages } from '../../store/actions/message-a'
import { forGroup, Me, isAdmin } from '../../utils/utils'
import { Redirect, Route, Switch } from 'react-router-dom'
import GroupBanner from './group-banner'
import Loading from '../others/loading'
import GroupNav from './group-nav'
import Nothing from '../others/nothing'

import GroupPosts from './sections/posts-s'
import GroupGallery from './sections/gallery-s'
import AboutGroup from './sections/about-s'
import EditGroup from './sections/edit-s'
import GroupMembers from './sections/members/members-s'
import AddGroupMembers from './sections/add-members-s'

@connect(store => (
  {
    gd: store.Group.group_details,
    joined: store.Group.joined
  }
))

export default class Group extends React.Component {

  state = {
    loading: true,
    title: ''
  }

  inv_grp = () =>
    this.props.history.push('/error/group_nf')

  componentDidMount = () => {
    let {
      dispatch,
      match: { params: { grp_id } }
    } = this.props
    forGroup({ grp_id, dispatch, invalidGroup: this.inv_grp })
    dispatch(getUnreadNotifications())
    dispatch(getUnreadMessages())
  }

  componentWillReceiveProps = ({ dispatch, match, gd }) => {
    if (this.props.match.url != match.url) {
      forGroup({ grp_id: match.params.grp_id, dispatch, invalidGroup: this.inv_grp })
    }

    this.setState({
      loading: false,
      title: gd.name
    })
  }

  render() {
    let
      { loading, title } = this.state,
      { gd, joined, match: { url, params: { grp_id } } } = this.props

    return (
      <div>

        <Title
          value={title}
          desc=''
        />

        <div
          className='group_details'
          data-group-id={grp_id}
          data-group-name={gd.name}
        ></div>

        { loading ? <Loading/> : null }

        <FadeIn duration='300ms' className={loading ? 'cLoading' : ''} >
          <GroupBanner/>
          {
            Me(gd.admin) || gd.group_type == 'publico' || joined || isAdmin() ?
              <div>
                <GroupNav url={url} admin={gd.admin} />
                <div className='hmm'>
                  <Switch>
                    <Route path={`${url}`} exact component={() => <GroupPosts grp_id={grp_id} />} />
                    <Route path={`${url}/gallery`} component={GroupGallery} />
                    <Route path={`${url}/about`} component={AboutGroup} />
                    <Route path={`${url}/edit`} component={() => <EditGroup grp_id={grp_id} />} />
                    <Route path={`${url}/members`} component={GroupMembers} />
                    <Route path={`${url}/add-members`} component={() => <AddGroupMembers grp_id={grp_id} />} />
                    <Redirect to='/error' />
                  </Switch>
                </div>
              </div>
              :
              <div style={{ marginTop: 85 }}>
                <Nothing mssg={`${gd.name} é privado.`} />
              </div>
          }
        </FadeIn>

      </div>
    )
  }
}
