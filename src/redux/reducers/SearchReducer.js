export const SearchReducer = (prevState = {
  searchResult: [],
}, action) => {
  let { type, payload } = action
  switch (type) {
    case 'getSearchResult':
      return { ...payload }
    default:
      return prevState
  }
}