import React, { Suspense } from 'react'
import { Route, Switch, Redirect } from 'react-router-dom'
import hasPermission from '@/assets/utils/hasPermission'

import { connect } from 'react-redux'
import { RouteConfig } from '@/route'

class AppMain extends React.Component {
  render() {
    const { redirectArr, routeArr } = this.produceRoute(RouteConfig)
    return (
      <Suspense fallback={<div>Loading...</div>}>
        <Switch>
          <Redirect exact from="/" to="/Dashboard" />
          {routeArr}
          {redirectArr}
        </Switch>
      </Suspense>
    )
  }

  produceRoute = RouteConfigs => {
    let routeArr = []
    let redirectArr = []
    const itera = routeList => {
      for (let i = 0; i < routeList.length; i++) {
        if (hasPermission.call(this, routeList[i].role)) {
          if (routeList[i].hasOwnProperty('component')) {
            routeArr.push(
              <Route
                exact
                path={routeList[i].path}
                name={routeList[i].role}
                component={routeList[i].component}
                key={routeList[i].path}
              />
            )
          } else {
            if (routeList[i].hasOwnProperty('redirect')) {
              redirectArr.push(
                <Redirect
                  exact
                  from={routeList[i].path}
                  to={routeList[i].redirect}
                  key={routeList[i].path}
                />
              )
            }
            itera(routeList[i].children)
          }
        }
      }
    }
    itera(RouteConfigs)
    return {
      routeArr,
      redirectArr
    }
  }
}

const mapStateToProps = state => {
  return {
    authArr: state.authArr
  }
}

export default connect(mapStateToProps, null)(AppMain)
