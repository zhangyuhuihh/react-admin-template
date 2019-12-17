export default function hasPermission(v) {
  // const env = process.env.NODE_ENV
  // if (env === 'development') {
  //   return true
  // } else {
  return this.props.authArr.includes(v)

  // }
}
