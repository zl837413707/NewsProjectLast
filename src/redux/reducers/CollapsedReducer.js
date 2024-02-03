export const CollapsedReducer = (prevState = {
  isCollapsed: false,
}, action) => {
  let { type } = action
  switch (type) {
    case 'changeCollapsed':
      return { ...prevState, isCollapsed: !prevState.isCollapsed }
    default:
      return prevState
  }
}