import React from "react";
import App, { Container } from "next/app";
import Head from "next/head";
import getConfig from "next/config";
import { ThemeProvider } from "@material-ui/styles";
import CssBaseline from "@material-ui/core/CssBaseline";

const { publicRuntimeConfig } = getConfig();
const { NO_GOOGLE_ANALYTICS } = publicRuntimeConfig;

class MyApp extends App {
  componentDidMount() {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector("#jss-server-side");
    if (jssStyles) {
      jssStyles.parentNode.removeChild(jssStyles);
    }
  }

  render() {
    const { Component, pageProps } = this.props;

    return (
      <Container>
        <Head>
          <title>ゲーセンマップ</title>
          {!NO_GOOGLE_ANALYTICS && (
            <>
              <script async src="https://www.googletagmanager.com/gtag/js?id=UA-89581468-3" />
              <script>
                {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'UA-89581468-3');
            `}
              </script>
            </>
          )}
        </Head>
        <ThemeProvider>
          {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
          <CssBaseline />
          <Component {...pageProps} />
        </ThemeProvider>
      </Container>
    );
  }
}

export default MyApp;
