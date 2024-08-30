import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Head from "next/head";
import React from "react";

const Layout: React.FC<React.PropsWithChildren> = ({ children }) => {
  return (
    <>
      <Head>
        <title>Callisto | BitMetro</title>
        <meta name="description" content="Pluginable virtual assistant" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {children}
    </>
  )
}

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
}
