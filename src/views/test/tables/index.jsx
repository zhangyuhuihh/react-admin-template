import React, { useState, useEffect } from 'react'
import { Table, Modal, Button, Form, Input } from 'antd'
import SearchBar from './SearchBar'
import moduleCss from './testScss.module.scss'

const initlistData = [
  {
    key: '1',
    name: 'John Brown',
    age: 32,
    address: 'New York No. 1 Lake Park'
  },
  {
    key: '2',
    name: 'Jim Green',
    age: 42,
    address: 'London No. 1 Lake Park'
  },
  {
    key: '3',
    name: 'Joe Black',
    age: 32,
    address: 'Sidney No. 1 Lake Park'
  }
]

function TableDemo() {
  const [listData, setListData] = useState([])

  const [modalTitle, setModalTitle] = useState('新增')

  const [addOrEditVisible, setAddOrEditVisible] = useState(false)

  const [initFormValues, setInitFormValues] = useState({ name: '' })

  const [currentFormId, setCurrentFormId] = useState(null)

  const [pagination] = useState({
    total: 500
  })
  // let formRef = useRef(null)
  let formRef

  useEffect(() => {
    setTable()
    // 这里进行table初始化(setTable)
  }, [])

  const actionRender = (text, record, index) => {
    return (
      <div className={moduleCss.btn_container}>
        <Button
          onClick={() => {
            handleCheckDetail(record)
          }}
          type='primary'
          size={'small'}
        >
          查看
        </Button>
        <Button
          style={{ marginLeft: '10px' }}
          onClick={() => {
            handleEdit(record)
          }}
          type='primary'
          size={'small'}
        >
          编辑
        </Button>
        <Button
          style={{ marginLeft: '10px' }}
          onClick={() => {
            handleDelete(record)
          }}
          type='danger'
          size={'small'}
        >
          删除
        </Button>
      </div>
    )
  }
  const columns = [
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
      render: text => <span>{text}</span>
    },
    {
      title: '年龄',
      dataIndex: 'age',
      key: 'age'
    },
    {
      title: '地址',
      dataIndex: 'address',
      key: 'address'
    },
    {
      title: '操作',
      key: 'action',
      render: actionRender
    }
  ]

  const handleConfirmAddOrEdit = () => {
    const formToValidate = formRef.props.form
    formToValidate.validateFields((errors, values) => {
      console.log('errors, values: ', errors, values)
      if (errors) {
        return
      } else {
        setListData([])
        setAddOrEditVisible(false)
      }
      // const formData = formTovalidate.getFieldsValue()
      // this.setState({
      //   addOrEditVisible: false
      // })
    })
  }

  const handleCancelAddEditModel = () => {
    setAddOrEditVisible(false)
  }

  const ModelClose = () => {
    formRef.props.form.resetFields()
    setInitFormValues({
      name: ''
    })
  }

  const handleAdd = () => {
    setModalTitle('新增')
    setCurrentFormId('newForAdd')
    // 这里虽然更新了，但是form表单被缓存的输入值并没有改变，所以还是存在之前关闭的值在里面
    // 就和之前的动态表单删除时之输入的值还在的时候的这个问题相同
    setAddOrEditVisible(true)
  }

  const handleEdit = record => {
    setCurrentFormId(record.key)
    setAddOrEditVisible(true)
    setInitFormValues({
      name: record.name
    })
  }

  const handleDelete = () => {}

  const handleCheckDetail = () => {}

  const handleSearch = () => {}

  const renderBar = () => {
    return (
      <div style={{ overflow: 'hidden' }}>
        <div className={moduleCss.bar_left}>
          <Button onClick={handleAdd} type='primary'>
            新增
          </Button>
        </div>
        <div className={moduleCss.bar_right}>
          <SearchBar handleSearch={handleSearch} />
        </div>
      </div>
    )
  }

  const renderAddOrEditModel = () => {
    return (
      <Modal
        title={modalTitle}
        visible={addOrEditVisible}
        onOk={handleConfirmAddOrEdit}
        onCancel={handleCancelAddEditModel}
        afterClose={ModelClose}
      >
        <div>
          <WrappredAddOrEditForm
            key={currentFormId}
            wrappedComponentRef={form => (formRef = form)}
            initValue={initFormValues}
          />
        </div>
      </Modal>
    )
  }

  const renderDetailModel = () => {}

  const handleSizeChange = () => {}

  const renderTable = () => {
    return (
      <Table
        bordered
        columns={columns}
        dataSource={listData}
        pagination={{
          ...pagination,
          showSizeChanger: true,
          size: 'small',
          pageSizeOptions: ['10', '30', '50'],
          onShowSizeChange: handleSizeChange
        }}
      />
    )
  }

  const setTable = async (queryParams = {}) => {
    setListData(initlistData)
  }

  return (
    <div className={moduleCss.main_container}>
      <div className={moduleCss.main_container_bar}>{renderBar()}</div>
      <div className={moduleCss.main_container_table}>{renderTable()}</div>
      {renderDetailModel()}
      {renderAddOrEditModel()}
    </div>
  )
}

class addOrEditForm extends React.Component {
  render() {
    const { getFieldDecorator } = this.props.form
    const { initValue } = this.props
    return (
      <Form>
        <Form.Item label='姓名'>
          {getFieldDecorator('name', {
            initialValue: initValue.name,
            rules: [
              {
                required: true,
                message: '请输入姓名'
              }
            ]
          })(<Input placeholder='请输入姓名' />)}
        </Form.Item>
      </Form>
    )
  }
}

const WrappredAddOrEditForm = Form.create({ name: 'addOrEdit' })(addOrEditForm)

export default TableDemo
