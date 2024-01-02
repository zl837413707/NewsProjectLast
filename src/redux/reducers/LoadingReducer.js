export const LoadingReducer = (prevState = {
  isLoading: true, // 初始化不loading
}, action) => {
  let { type, payload } = action
  switch (type) {
    case 'changeLoading':
      return { ...prevState, isLoading: payload }
    default:
      return prevState
  }
}