import { createContext, useReducer, useEffect } from "react";
import AuthReducer, { AuthAction } from "./authReducer";
import Fetch from "isomorphic-fetch";
import { useRouter } from "next/router";
import { User } from "../lib/users";

interface AppState {
  token: string | null;
  loggedIn: boolean;
  user: User | null;
  urlToRedirectAfterLogin: string;
  rememberMe: boolean;
  fetch<T>(
    RequestInfo,
    opts?: RequestInit
  ): Promise<{ res: Response; data: T | any }>;
  loginUser(token: string, user: User);
  startLoginForProvider(provider: string, rememberMe);
}

function getInitialState() {
  return typeof window !== "undefined"
    ? {
        token: localStorage.getItem("token") || null,
        loggedIn: false,
        user: null,
        urlToRedirectAfterLogin:
          localStorage.getItem("urlToRedirectAfterLogin") || "/",
        rememberMe: localStorage.getItem("rememberMe") === "true"
      }
    : {
        token: null,
        loggedIn: false,
        user: null,
        urlToRedirectAfterLogin: "/",
        rememberMe: false
      };
}

const initialState = getInitialState();

export const AppContext = createContext<AppState>(undefined);

const AppProvider = ({ children }) => {
  console.log("TODO: update the api url in AppProvider.fetch");
  const [authState, dispatchAuth] = useReducer(AuthReducer, initialState);
  const router = useRouter();

  //This is a wrapper around fetch that injects the bearer token
  const fetch = async (url: RequestInfo | string, opts?: RequestInit) => {
    if (typeof url === "string") {
      //TODO: Fix this
      url = new URL(url, "http://localhost:3000/api/").toString();
      console.log(url);
    } else {
      throw new Error(
        "Implementation of RequestInfo in globalProvider#fetch is not done."
      );
    }
    opts = opts || { headers: {} };
    opts.headers = opts.headers || {};
    if (authState.token) {
      opts = {
        ...opts,
        headers: {
          ...opts.headers,
          authorization: `Bearer ${authState.token}`
        }
      };
    }
    try {
      const res = await Fetch(url, opts);
      return { res, data: await res.json() };
    } catch (err) {
      throw err;
    }
  };
  async function startLoginForProvider(provider: string, rememberMe: boolean) {
    const returnUrl = router.asPath;
    dispatchAuth({ action: AuthAction.SetReturnUrl, payload: returnUrl });
    dispatchAuth({ action: AuthAction.SetRememberMe, payload: rememberMe });
    if (typeof window !== "undefined") {
      localStorage.setItem("returnUrl", returnUrl);
      localStorage.setItem("rememberMe", rememberMe.toString());
      window.location.href = `http://localhost:3000/api/auth/${provider}`;
    }
  }

  async function loginUser(token, user?) {
    console.log(`loginUser: token: ${token}`);
    console.log(`loginUser: user: ${user}`);
    if (!user) {
      console.log("no user data. fetching");
      const { res, data } = await fetch("me");
      if (res.status === 200) {
        user = data.user;
        token = data.token;
      } else {
        console.log(`Receieved ${res.status} from /me`);
        return false;
      }
    }
    if (authState.rememberMe) {
      localStorage.setItem("token", token);
    }
    dispatchAuth({ type: AuthAction.Login, payload: { token, user } });
    return true;
  }

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token && !authState.loggedIn) {
      loginUser(token);
    }
  }, []);

  const state: AppState = {
    ...authState,
    loginUser,
    fetch,
    startLoginForProvider
  };

  return (
    <AppContext.Provider value={state}>{{ ...children }}</AppContext.Provider>
  );
};
export default AppProvider;
