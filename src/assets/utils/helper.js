import _ from 'lodash'

export function flattern(tree, childKey) {
  let arr = []
  const itera = list => {
    for (let i = 0; i < list.length; i++) {
      const element = list[i]
      if (element.hasOwnProperty(childKey)) {
        itera(element.children)
      }
      arr.push(_.omit(element, [childKey]))
    }
  }
  itera(tree)
  return arr
}

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
