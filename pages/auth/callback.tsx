import React, { useContext, useEffect } from "react";
import { AppContext } from "../../context/AppProvider";
import fetch from "isomorphic-fetch";
import { useRouter } from "next/router";
import { NextPage } from "next";

interface CallbackProps {
  user?: any;
  token?: string;
  isLoggedIn: boolean;
}

const CallbackPage: NextPage<CallbackProps> = ({ user, token }) => {
  const { loginUser, urlToRedirectAfterLogin, rememberMe } = useContext(
    AppContext
  );
  console.log("remmeberMe from CallbackPage", rememberMe);
  const router = useRouter();
  useEffect(() => {
    if (loginUser(token, user)) {
      router.push(urlToRedirectAfterLogin);
    } else {
      router.push("/login");
    }
  }, [token]);

  return <div>...</div>;
};

CallbackPage.getInitialProps = async ctx => {
  const failure = { isLoggedIn: false };
  try {
    console.log("in getInitialProps for pages/auth/callback");
    const token = ctx.query.token;
    if (token) {
      const res = await fetch("http://localhost:3000/api/me", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (res.status === 200) {
        const { user, token } = await res.json();
        return { user, token, isLoggedIn: true };
      }
    }
    return failure;
  } catch (e) {
    return failure;
  }
};
export default CallbackPage;
