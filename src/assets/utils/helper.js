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
