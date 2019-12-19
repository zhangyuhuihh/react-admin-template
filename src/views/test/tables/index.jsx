import React from 'react'
import { Table } from 'antd'
const columns = [
  {
    title: 'Name',
    dataIndex: 'name',
    width: 150
  },
  {
    title: 'Age',
    dataIndex: 'age',
    width: 150
  },
  {
    title: 'Address',
    dataIndex: 'address'
  }
]

const data = []
for (let i = 0; i < 100; i++) {
  data.push({
    key: i,
    name: `苦逼小前端 ${i}枚`,
    age: 32,
    address: `埃塞俄比亚难民${i}`
  })
}

export default class Tables extends React.Component {
  render() {
    return (
      <Table
        columns={columns}
        dataSource={data}
        pagination={{ pageSize: 50 }}
        scroll={{ y: 600 }}
      />
    )
  }
}
