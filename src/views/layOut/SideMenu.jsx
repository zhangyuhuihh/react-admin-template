import React from 'react'
import { Menu, Icon } from 'antd'
import { RouteConfig } from '@/route'
import { Link, withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import hasPermission from '@/assets/utils/hasPermission'
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

    this.state = {
      openKeys: ownDefaultOpenKeys,
      selectedKeys: [pathname]
    }
  }

  static getDerivedStateFromProps(props, state) {
    const { pathname } = props.history.location
    const { openKeys } = state
    if (pathname !== state.selectedKeys[0]) {
      return {
        selectedKeys: [pathname],
        // 这里加了一个concat(openKeys)之后，便不会闪烁
        openKeys: _.uniq(finddefaultOpenKeys(menuList, pathname).concat(openKeys))
      }
    }
    return null
  }

  // 适用上述格式多层级菜单
  iterateMenu(menuList) {
    let target = []
    for (let i in menuList) {
      if (hasPermission.call(this, menuList[i].role) && !menuList[i].hidden) {
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
            <Menu.Item key={menuList[i].path}>
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

  handleMenuItemClick = ({ key }) => {
    this.props.history.push(key)
    this.setState({
      selectedKeys: key
    })
  }

  handleSubMenuClick = ({ key }) => {
    const { openKeys } = this.state
    let newOpenKeys
    const isHave = openKeys.find(v => v === key)
    if (isHave) {
      newOpenKeys = openKeys.filter(v => v !== key)
    } else {
      newOpenKeys = openKeys.concat(key)
    }
    this.setState({
      openKeys: newOpenKeys
    })
  }

  renderMenu() {
    return this.iterateMenu(menuList)
  }

  render() {
    const { selectedKeys, openKeys } = this.state
    const { collapsed } = this.props
    return (
      <React.Fragment>
        <div className='logo' />
        <div
          style={{
            width: '217px',
            overflowY: 'scroll',
            height: 'calc(100vh - 64px)',
            marginRight: '-17px'
          }}
        >
          <Menu
            selectedKeys={selectedKeys}
            openKeys={openKeys}
            mode='inline'
            theme='dark'
            collapsed={collapsed}
            onClick={this.handleMenuItemClick}
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
