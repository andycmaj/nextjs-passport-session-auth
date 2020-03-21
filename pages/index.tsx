import React from "react";
// import { useIdentity } from "../lib/withIdentity";

export default () => {
  // const identity = useIdentity();
  // if (!identity) {
  //   return null;
  // }

  return (
    <main>
      {/* <h1>{JSON.stringify(identity)}</h1> */}
      <p>Log in to use</p>
      <p>
        <a href="/api/auth/github">Sign in with github</a>
      </p>
      <p>
        <a href="/api/auth/google">Sign in with google</a>
      </p>
    </main>
  );
};
