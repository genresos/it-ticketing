import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icon.png"></link>
        <meta name="theme-color" content="#fff" />
      </Head>
      <title>IT Ticketing System</title>
      <meta name="description" content="IT Ticketing Sistem Web Admin" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link rel="icon" href="/adw-favicon.png" />
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
