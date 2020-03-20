export enum AuthAction {
  SetReturnUrl = "SET_RETURN_URL",
  Login = "LOGIN",
  Logout = "LOGOUT",
  SetRememberMe = "REMEMBER_ME"
}

export default function(state, action) {
  switch (action.type) {
    case AuthAction.SetReturnUrl:
      return { ...state, urlToReturnAfterLogin: action.payload };
    case AuthAction.SetRememberMe:
      return { ...state, rememberMe: action.payload };
    case AuthAction.Login:
      return {
        ...state,
        loggedIn: true,
        token: action.payload.token,
        user: action.payload.user
      };
    case AuthAction.Logout:
      return {
        ...state,
        loggedIn: false,
        token: undefined,
        user: undefined,
        rememberMe: false
      };
    default:
      return state;
  }
}
