export const LoadingReducer = (prevState = {
  isLoading: true,
}, action) => {
  let { type, payload } = action
  switch (type) {
    case 'changeLoading':
      return { ...prevState, isLoading: payload }
    default:
      return prevState
  }
}