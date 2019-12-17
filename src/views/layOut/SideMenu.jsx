import React from 'react'
import { Menu, Icon } from 'antd'
import { RouteConfig } from '@/route'
import { Link, withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import _ from 'lodash'

const { SubMenu } = Menu

// 适用上述格式多层级菜单,这里由于迭代，算重了，所以返回结果去重
function finddefaultOpenKeys(menuList, pathname) {
  const saveMenuList = _.cloneDeep(menuList)
  let arr = []
  const itera = (menuList, pathname) => {
    for (let i in menuList) {
      if (menuList[i].hasOwnProperty('children')) {
        for (let k in menuList[i].children) {
          if (menuList[i].children[k].path === pathname) {
            arr.unshift(menuList[i].path)
            // 关键迭代
            itera(saveMenuList, menuList[i].path)
          } else {
            itera(menuList[i].children, pathname)
          }
        }
      }
    }
  }
  itera(menuList, pathname)
  return _.uniq(arr)
}

function produceNewMenuList(RouteConfig) {
  let arr = []
  for (let i in RouteConfig) {
    if (RouteConfig[i].hasOwnProperty('children')) {
      arr[i] = {
        ..._.omit(RouteConfig[i], ['component']),
        children: produceNewMenuList(RouteConfig[i].children)
      }
    } else {
      arr[i] = _.omit(RouteConfig[i], ['component'])
    }
  }
  return arr
}

const menuList = produceNewMenuList(RouteConfig)

class SideMenu extends React.Component {
  constructor(props) {
    super(props)
    const { pathname } = this.props.history.location
    const ownDefaultOpenKeys = finddefaultOpenKeys(menuList, pathname)

    this.menuList = menuList
    this.state = {
      menuList: menuList,
      ownDefaultOpenKeys: ownDefaultOpenKeys,
      ownDefaultSelectedKeys: [pathname],
      cacheOpenKeys: ownDefaultOpenKeys,
      prePropsCollapsed: this.props.keyForCollapesd
    }
  }

  static getDerivedStateFromProps(props, state) {
    const { pathname } = props.history.location
    const { cacheOpenKeys } = state
    if (pathname !== state.ownDefaultSelectedKeys[0]) {
      return {
        ownDefaultSelectedKeys: [pathname],
        ownDefaultOpenKeys: _.uniq(
          finddefaultOpenKeys(menuList, pathname).concat(cacheOpenKeys)
        )
      }
    }
    if (props.keyForCollapesd !== state.prePropsCollapsed) {
      return {
        cacheOpenKeys: [],
        prePropsCollapsed: props.keyForCollapesd
      }
    }
    return null
  }

  // 适用上述格式多层级菜单
  iterateMenu(menuList) {
    let target = []
    for (let i in menuList) {
      if (this.hasPermission(menuList[i].role) && !menuList[i].hidden) {
        if (menuList[i].hasOwnProperty('children')) {
          target[i] = (
            <SubMenu
              key={menuList[i].path}
              title={
                <span>
                  {menuList[i].icon ? <Icon type={menuList[i].icon} /> : null}
                  <span>{menuList[i].name}</span>
                </span>
              }
              onTitleClick={this.handleSubMenuClick}
            >
              {this.iterateMenu(menuList[i].children)}
            </SubMenu>
          )
        } else {
          target[i] = (
            <Menu.Item
              key={menuList[i].path}
              onClick={v => this.handleChangeMenu(v, menuList[i])}
            >
              <Link to={menuList[i].path}>
                {menuList[i].icon ? <Icon type={menuList[i].icon} /> : null}
                <span>{menuList[i].name}</span>
              </Link>
            </Menu.Item>
          )
        }
      }
    }
    return target
  }

  hasPermission = v => {
    const env = process.env.NODE_ENV
    if (env === 'development') {
      return true
    } else {
      return this.props.authArr.includes(v)
    }
  }

  handleChangeMenu = (params, menu) => {
    this.props.history.push(menu.path)
  }

  handleSubMenuClick = ({ key }) => {
    let newdefaultOpenKeys = []
    const { cacheOpenKeys } = this.state
    const isHave = cacheOpenKeys.includes(key)
    if (isHave) {
      newdefaultOpenKeys = cacheOpenKeys.filter(v => v !== key)
    } else {
      newdefaultOpenKeys = [...cacheOpenKeys, key]
    }
    this.setState({
      cacheOpenKeys: newdefaultOpenKeys
    })
  }

  renderMenu() {
    return this.iterateMenu(this.state.menuList)
  }

  render() {
    const { menuList, ownDefaultOpenKeys, ownDefaultSelectedKeys } = this.state
    const { collapsed } = this.props
    return (
      <React.Fragment>
        <div className="logo" />
        <div
          style={{
            width: '217px',
            overflowY: 'scroll',
            height: 'calc(100vh - 64px)',
            marginRight: '-17px'
          }}
        >
          <Menu
            key={ownDefaultSelectedKeys}
            defaultSelectedKeys={ownDefaultSelectedKeys}
            defaultOpenKeys={ownDefaultOpenKeys}
            mode="inline"
            theme="dark"
            collapsed={collapsed}
          >
            {this.iterateMenu(menuList)}
          </Menu>
        </div>
      </React.Fragment>
    )
  }
}

const mapStateToProps = state => {
  return {
    authArr: state.authArr
  }
}

export default withRouter(connect(mapStateToProps)(SideMenu))
