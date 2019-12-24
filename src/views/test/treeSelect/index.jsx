import React, { useState } from 'react'
import { TreeSelect } from 'antd'

// export default class TreeSelectDemo extends React.Component {

// }
const initTreeData = [
  { id: 1, pId: 0, value: '1', title: 'Expand to load', selectable: false },
  { id: 2, pId: 0, value: '2', title: 'Expand to load' },
  { id: 3, pId: 0, value: '3', title: 'Tree Node', isLeaf: true }
]

function TreeSelectDemo() {
  const [treeValue, setTreeValue] = useState(undefined)
  const [treeData, setTreeData] = useState(initTreeData)

  function getTreeNode(parentId, isLeaf) {
    const random = Math.random()
      .toString(36)
      .substring(2, 6)
    return {
      id: random,
      pId: parentId,
      value: random,
      title: isLeaf ? 'Tree Node' : 'Expand to load',
      isLeaf,
      selectable: isLeaf
    }
  }

  function handeChange(value) {
    setTreeValue(value)
  }

  function onLoadData(treeNode) {
    return new Promise(resolve => {
      const { id } = treeNode.props
      const arr = treeData.concat([
        getTreeNode(id, false),
        getTreeNode(id, true)
      ])
      setTreeData(arr)
      resolve()
    })
  }

  return (
    <div style={{
      width: '220px'
    }}>
      <TreeSelect
        treeDataSimpleMode
        style={{ width: '100%' }}
        value={treeValue}
        dropdownMenuStyle={{ maxHeight: 400, overflow: 'auto' }}
        placeholder={'请选择'}
        onChange={handeChange}
        loadData={onLoadData}
        treeData={treeData}
      ></TreeSelect>
    </div>
  )
}

export default TreeSelectDemo
