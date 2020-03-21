import React, { useContext } from "react";
// import { useIdentity } from "../lib/withIdentity";
import { AppState, AppContext } from "../context/AppProvider";

export default () => {
  // const identity = useIdentity();
  // if (!identity) {
  //   return null;
  // }
  const ctx = useContext<AppState>(AppContext);
  const user = ctx.user;
  return (
    <main>
      {/* <h1>{JSON.stringify(identity)}</h1> */}
      <h3>Log in to use</h3>
      <p>
        <a href="/api/auth/github">Sign in with github</a>
      </p>
      <p>
        <a href="/api/auth/google">Sign in with google</a>
      </p>
      <div>
        <h3>User: </h3>
        <pre>{JSON.stringify(user)}</pre>
      </div>
    </main>
  );
};
