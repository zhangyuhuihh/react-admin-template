import { combineReducers } from 'redux'
import { RouteConfig } from '@/route'
import { flattern } from '@/assets/utils/helper'

const routeWhiteList = ['首页']
const defaultMenus = flattern(RouteConfig, 'children').map(v => v.role)

const authReducer = (state = [...defaultMenus], action) => {
  switch (action.type) {
    case 'SET_AUTHARR':
      return routeWhiteList.concat(action.authArr)
    default:
      return state
  }
}

const visitedViewsReducer = (
  state = [
    {
      routeName: '首页',
      path: '/Dashboard'
    }
  ],
  action
) => {
  switch (action.type) {
    case 'ADD_VISITIEDVIEWS':
      const isHave = state.find(v => v.path === action.visitedObj.path)
      if (isHave === undefined) {
        return state.concat(action.visitedObj)
      } else {
        isHave.state = action.visitedObj.state
        return state
      }
    case 'REMOVE_VISITIEDVIEWS':
      return state.filter(v => v.path !== action.visitedObj.path)
    default:
      return state
  }
}

const allReducers = combineReducers({
  // 这边authArr才是最终的state的key
  authArr: authReducer,
  visitiedViews: visitedViewsReducer
})

export default allReducers
