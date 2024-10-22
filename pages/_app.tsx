import "../styles/globals.css";
import "react-datepicker/dist/react-datepicker.css";
import "../styles/chakra-react-datepicker.css";
import type { AppProps } from "next/app";
import Router from "next/router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ChakraProvider } from "@chakra-ui/react";
import ProgressBar from "@badrap/bar-of-progress";
import AuthProvider from "../store/AuthContext";
import { AuthLayout, MainLayout } from "../components/Layout";

const queryClient = new QueryClient();

const progress = new ProgressBar({
  size: 4,
  color: "#4FD1C5",
  className: "z-100",
  delay: 100,
});

Router.events.on("routeChangeStart", progress.start);
Router.events.on("routeChangeComplete", progress.finish);
Router.events.on("routeChangeError", progress.finish);

export default function App({ Component, pageProps }: AppProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ChakraProvider>
          {pageProps.layoutType === "Auth" ? (
            <AuthLayout>
              <Component {...pageProps} />
            </AuthLayout>
          ) : (
            <MainLayout>
              <Component {...pageProps} />
            </MainLayout>
          )}
        </ChakraProvider>
      </AuthProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
