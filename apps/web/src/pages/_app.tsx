import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Head from "next/head";
import React from "react";
import { NextUIProvider } from "@nextui-org/react";


const Layout: React.FC<React.PropsWithChildren> = ({ children }) => {
  return (
    <NextUIProvider>
      <main className="dark text-foreground bg-background flex justify-center w-full h-dvh p-10">
        <Head>
          <title>Callisto | BitMetro</title>
          <meta name="description" content="Pluginable virtual assistant" />
          <link rel="icon" href="/favicon.ico" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        </Head>

        <div className="w-full max-w-[400px] flex flex-col items-center justify-between">
          {children}
        </div>
      </main>
    </NextUIProvider>
  )
}

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
}
