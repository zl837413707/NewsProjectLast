export const CollapsedReducer = (prevState = {
  isCollapsed: false, // 初始化不折叠
}, action) => {
  let { type } = action
  switch (type) {
    case 'changeCollapsed':
      return { ...prevState, isCollapsed: !prevState.isCollapsed }
    default:
      return prevState
  }
}