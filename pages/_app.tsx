import App from "next/app";
import React from "react";
import AppProvider from "../context/AppProvider";

class MyApp extends App {
  render() {
    const { Component, pageProps } = this.props;
    return (
      <AppProvider>
        <Component {...pageProps} />
      </AppProvider>
    );
  }
}

export default MyApp;
//export default withIdentity(MyApp)
