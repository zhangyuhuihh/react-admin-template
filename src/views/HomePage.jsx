import React from 'react'
import { Route, Switch, Redirect, withRouter } from 'react-router-dom'
import MyLayOut from './layOut/LayOut'
import noMatch from './test/noMatch'
import { RouteConfig, SingleRoutes } from '@/route'
import { flattern } from '@/assets/utils/helper'

const FlatternRouteConfig = flattern(RouteConfig, 'children')
const SingleRoutePathLists = SingleRoutes.map(v => v.path).concat('/')

class HomePage extends React.Component {
  renderSingleRoutes() {
    return SingleRoutes.map(v => {
      return <Route key={v.path} exact path={v.path} component={v.component} />
    })
  }

  render() {
    const { pathname } = this.props.location
    const targetRouter = FlatternRouteConfig.some(v => v.path === pathname)

    if (targetRouter || SingleRoutePathLists.includes(pathname)) {
      return (
        <Switch>
          {this.renderSingleRoutes()}
          <Route
            path="/"
            render={() => {
              return sessionStorage.getItem('userId') ? (
                <MyLayOut />
              ) : (
                <Redirect to="/Login" />
              )
            }}
          ></Route>
        </Switch>
      )
    } else {
      return (
        <Switch>
          <Route component={noMatch}></Route>
        </Switch>
      )
    }
  }
}

export default withRouter(HomePage)
