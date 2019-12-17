import React from 'react'
import { Result, Button } from 'antd'
import { withRouter } from 'react-router-dom'

class NoMatch extends React.Component {
  render() {
    return (
      <Result
        status="404"
        title="404"
        subTitle="对不起，您访问的页面不存在！~"
        extra={<Button onClick={this.handleClick} type="primary">返回首页</Button>}
      />
    )
  }

  handleClick = () => {
    this.props.history.replace('/Dashboard')
  }
}

export default withRouter(NoMatch)