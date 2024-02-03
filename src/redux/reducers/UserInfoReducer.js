export const UserInfoReducer = (prevState = {
  userInfo: [], 
}, action) => {
  let { type, payload } = action
  switch (type) {
    case 'userInfoAdd':
      if (payload.rightContent && payload.rightContent.trim() !== '') {
        const children = payload.rightContent.split(",").map((item) => item.replace(/"/g, '').trim());
        return {
          ...payload,
          rightContent: children,
        };
      }
      return prevState
    default:
      return prevState
  }
}