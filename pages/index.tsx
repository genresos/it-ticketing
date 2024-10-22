import React, { useContext, useEffect } from "react";
import { useRouter } from "next/router";
import { AuthContext } from "../store/AuthContext";
import { Spalsh } from "../components/Main";

const Home = () => {
  const router = useRouter();

  const { isLoading, userToken } = useContext(AuthContext);

  useEffect(() => {
    if (!isLoading) {
      if (userToken) {
        router.push("/dashboard");
      } else {
        router.push("/auth");
      }
    }
  }, [userToken, isLoading, router]);

  return <Spalsh />;
};

export async function getStaticProps() {
  return {
    props: {
      layoutType: "Auth",
    },
  };
}

export default Home;
