import React from 'react'
import './App.css'
import './assets/styles/andtEdit/part_andt_edit.scss'
import HomePage from './views/HomePage'
import { BrowserRouter as Router } from 'react-router-dom'
import { connect } from 'react-redux'
import { setAuthArr } from './store/action'

class App extends React.Component {
  componentDidMount() {
    const { setAuthArr } = this.props
    // 这里发请求获取权限
    setTimeout(() => {
      const authArr = [
        '首页权限',
        '表格',
        '表单',
        '二级菜单',
        '二级菜单-1',
        '三级菜单',
        '三级菜单-1',
        '三级菜单-2',
        '三级菜单-2-1',
        // 'express测试'
      ]
      setAuthArr(authArr)
    })
  }

  render() {
    return (
      <Router basename="/react-admin-template">
        <HomePage></HomePage>
      </Router>
    )
  }
}

const mapDispatchToProps = {
  setAuthArr
}

export default connect(null, mapDispatchToProps)(App)
