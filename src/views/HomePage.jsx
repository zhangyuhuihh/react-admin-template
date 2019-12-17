import React from 'react'
import { Route, Switch, Redirect, withRouter } from 'react-router-dom'
import MyLayOut from './layOut/LayOut'
import noMatch from './test/noMatch'
import { RouteConfig, SingleRoutes } from '@/route'
import { flattern } from '@/assets/utils/helper'
import { connect } from 'react-redux'

const FlatternRouteConfig = flattern(RouteConfig, 'children')
const whiteRoutePaths = SingleRoutes.map(v => v.path).concat('/')

class HomePage extends React.Component {
  renderSingleRoutes() {
    return SingleRoutes.map(v => {
      return <Route key={v.path} exact path={v.path} component={v.component} />
    })
  }

  render() {
    const { authArr } = this.props
    const { pathname } = this.props.location
    const menuRoute = FlatternRouteConfig.find(v => v.path === pathname)
    let targetRouter = null
    if (menuRoute) {
      targetRouter = authArr.some(v => v === menuRoute.role)
    }
    if (targetRouter || whiteRoutePaths.includes(pathname)) {
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
    }
    return (
      <Switch>
        <Route component={noMatch}></Route>
      </Switch>
    )
  }
}

const mapStateToProps = state => {
  return {
    authArr: state.authArr
  }
}

export default connect(mapStateToProps)(withRouter(HomePage))
