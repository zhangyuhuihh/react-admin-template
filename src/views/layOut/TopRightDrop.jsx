import React from 'react'
import { Dropdown, Menu, Modal, message, Avatar } from 'antd'
import { Link, withRouter } from 'react-router-dom'

class TopRightDrop extends React.Component {
  renderRoleDrop = () => {
    const menu = (
      <Menu>
        <Menu.Item>
          <Link to="/Dashboard">首页</Link>
        </Menu.Item>
        <Menu.Divider />
        <Menu.Item onClick={this.handleLogOut}>
          <span>退出</span>
        </Menu.Item>
      </Menu>
    )

    return (
      <Dropdown overlay={menu}>
        <span style={{ cursor: 'pointer', paddingLeft: '10px' }}>
          <span>超级管理员</span>
        </span>
      </Dropdown>
    )
  }

  handleLogOut = () => {
    Modal.confirm({
      title: '登出',
      content: '确认登出?',
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        this.doLogOut()
      },
      onCancel: () => {
        message.info('取消登出')
      }
    })
  }

  doLogOut = () => {
    setTimeout(() => {
      sessionStorage.clear()
      message.success('成功登出')
      this.props.history.push('/Login')
    })
  }

  render() {
    return (
      <div>
        <div
          style={{
            float: 'right',
            marginRight: '20px',
            display: 'flex',
            alignItems: 'center'
          }}
        >
          <Avatar style={{ backgroundColor: '#1890ff' }} icon="user" />
          {this.renderRoleDrop()}
        </div>
      </div>
    )
  }
}

export default withRouter(TopRightDrop)
