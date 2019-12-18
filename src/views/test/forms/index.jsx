import React from 'react'

import { Form, Input, Icon, Button } from 'antd'
import _ from 'lodash'
const firstformItemLayout = {
  labelCol: {
    xs: { span: 4 }
    // sm: { span: 8 }
  },
  wrapperCol: {
    xs: { span: 20 }
    // sm: { span: 16 }
  }
}

const secondformItemLayOut = {
  labelCol: {
    xs: { span: 4 }
  },
  wrapperCol: {
    xs: { span: 20 }
  }
}
const formItemLayoutWithOutLabel = {
  wrapperCol: {
    xs: { span: 20, offset: 4 }
    // sm: { span: 10, offset: 4 }
  }
}

// tree的数据结构
const treeData = [
  // {
  //   location: '1',
  //   name: '第一层',
  //   coreList: [{ location: '4', name: '第一层子一' }]
  // },
  {
    location: '2',
    name: '第一层',
    coreList: [
      {
        location: '6',
        name: '第一层子一'
      }
    ]
  }
  // {
  //   location: '3',
  //   name: '第一层',
  //   coreList: [
  //     { location: '7', name: '第一层子一' },
  //     { location: '8', name: '第一层子er' },
  //     { location: '9', name: '第一层子san' }
  //   ]
  // }
]

let id = 0

// function getObjectByPath(obj, path) {
//   let tempObj = obj
//   let keyArr = path.split('.')
//   for (let i = 0; i < keyArr.length; i++) {
//     let key = keyArr[i]
//     if (key in obj) {
//       // in操作符会从对象原型上寻找
//       tempObj = tempObj[key]
//     } else {
//       throw new Error('请输入一个正确的对象路径')
//     }
//   }
//   return { ...tempObj }
// }

class DynamicFieldSet extends React.Component {
  constructor() {
    super()
    this.state = {
      muiltFormItems: treeData,
      renderCommonFormItems: []
    }
  }
  remove1 = index => {
    const { muiltFormItems } = this.state
    const newMuiltFormItems = muiltFormItems.filter((v, i) => i !== index)
    this.setState({
      muiltFormItems: newMuiltFormItems
    })
  }

  remove2 = (index1, index2) => {
    const { form } = this.props
    const currentFormData = form.getFieldsValue()
    console.log('删除之前currentFormData: ', currentFormData)
    let newFormData = _.cloneDeep(currentFormData)

    newFormData.locationAndCount[index1].coreList.splice(index2, 1)
    console.log('newFormData: ', newFormData)

    const { muiltFormItems } = this.state
    let o = _.cloneDeep(muiltFormItems)
    o[index1].coreList.splice(index2, 1)
    console.log('o: ', o)
    this.setState({
      muiltFormItems: o
    })

    let obj = {}
    for (
      let i = 0;
      i < newFormData.locationAndCount[index1].coreList.length;
      i++
    ) {
      obj[`locationAndCount.${index1}.coreList.${i}.name`] =
        newFormData.locationAndCount[index1].coreList[i].name
    }
    form.setFieldsValue({
      ...obj
    })
  }

  add = () => {
    // 增加第一级
    const { muiltFormItems } = this.state
    // todo 这里要修改一个初始值,初始化的对象结构要完整
    let item = {
      location: new Date().getTime(),
      name: '',
      coreList: [
        {
          location: new Date().getTime(),
          name: ''
        }
      ]
    }
    this.setState({
      muiltFormItems: muiltFormItems.concat(item)
    })
  }

  add2(index1) {
    // 增加第二级
    const { muiltFormItems } = this.state
    let o = _.cloneDeep(muiltFormItems)
    o[index1].coreList.push({
      location: new Date().getTime(),
      name: ''
    })
    this.setState({
      muiltFormItems: o
    })
  }

  handleSubmit = e => {
    e.preventDefault()
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const { keys, names } = values
        console.log('Received values of form: ', values)
        console.log(
          'Merged values:',
          keys.map(key => names[key])
        )
      }
    })
  }

  renderMuiltFormItemsFirst() {
    const { getFieldDecorator } = this.props.form
    const { muiltFormItems } = this.state
    // getFieldDecorator('all.locationAndCount', { initialValue: [] });

    return muiltFormItems.map((item1, index1) => {
      return (
        <React.Fragment key={item1.location}>
          <Form.Item {...firstformItemLayout} label={'第一级'} required={false}>
            {getFieldDecorator(`locationAndCount.${index1}.name`, {
              validateTrigger: ['onChange', 'onBlur'],
              initialValue: item1.name,
              rules: [
                {
                  required: true,
                  whitespace: true,
                  message: '请输入第一层'
                }
              ]
            })(
              <Input
                placeholder="第一层输入框"
                style={{ width: '220px', marginRight: 8 }}
              />
            )}
            {muiltFormItems.length > 1 ? (
              <Icon
                className="dynamic-delete-button"
                type="minus-circle-o"
                onClick={() => this.remove1(index1)}
              />
            ) : null}
          </Form.Item>
          <div
            style={{
              marginLeft: '50px'
            }}
          >
            {this.renderMuiltFormItemsSecond(item1, index1)}
          </div>
        </React.Fragment>
      )
    })
  }

  renderMuiltFormItemsSecond(item1, index1) {
    const { getFieldDecorator } = this.props.form
    return (
      <div style={{ position: 'relative' }}>
        <div style={{ position: 'absolute', right: '60px', top: '5px' }}>
          <Button type="dashed" onClick={() => this.add2(index1)}>
            <Icon type="plus" />
            添加
          </Button>
        </div>
        {item1.coreList.map((items2, index2) => {
          return (
            <div key={items2.location} style={{ width: '300px' }}>
              <Form.Item
                {...secondformItemLayOut}
                label={'第二级'}
                required={false}
              >
                {/* 这里的id，如果${}里面的是数字，那么产生的是数组，如果是字符串，那么产生的是对象属性 */}
                {getFieldDecorator(
                  `locationAndCount.${index1}.coreList.${index2}.name`,
                  {
                    validateTrigger: ['onChange', 'onBlur'],
                    initialValue: items2.name,
                    rules: [
                      {
                        required: true,
                        whitespace: true,
                        message: '请输入第二层'
                      }
                    ]
                  }
                )(
                  <Input
                    placeholder="第二层输入框"
                    style={{ width: '203px', marginRight: 8 }}
                  />
                )}
                <Icon
                  type="minus-circle-o"
                  onClick={() => this.remove2(index1, index2)}
                />
              </Form.Item>
            </div>
          )
        })}
      </div>
    )
  }

  renderCommonFormItems() {
    return <div>这里是正常的表单</div>
  }

  render() {
    return (
      <div style={{ width: '500px', position: 'relative' }}>
        <Form onSubmit={this.handleSubmit}>
          {this.renderMuiltFormItemsFirst()}
          {/* {this.renderCommonFormItems()} */}
          <Form.Item {...formItemLayoutWithOutLabel}>
            <Button type="dashed" onClick={this.add} style={{ width: '220px' }}>
              <Icon type="plus" />
              添加第一级
            </Button>
          </Form.Item>
          <Form.Item {...formItemLayoutWithOutLabel}>
            <Button type="primary" htmlType="submit">
              提交
            </Button>
          </Form.Item>
        </Form>
      </div>
    )
  }
}

const WrappedDynamicFieldSet = Form.create({ name: 'dynamic_form_item' })(
  DynamicFieldSet
)
export default WrappedDynamicFieldSet
