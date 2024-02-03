export const SortReducer = (prevState = {
  payload: 'publishTimeL',
}, action) => {
  let { type, payload } = action
  switch (type) {
    case 'getSortResult':
      return { payload }
    default:
      return prevState
  }
}