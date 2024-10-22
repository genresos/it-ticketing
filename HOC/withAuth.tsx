import { useContext } from "react";
import { useRouter } from "next/router";
import { AuthContext } from "../store/AuthContext";
import { NextPage } from "next";
type MyComponent = NextPage<any>;

const withAuth = (WrappedComponent: MyComponent, protectedPage?: number[]) => {
  // eslint-disable-next-line react/display-name
  return (props: any) => {
    const { isLoading, userData, userToken } = useContext(AuthContext);

    if (typeof window !== "undefined") {
      const Router = useRouter();

      if (isLoading) {
        console.log("loading from with auth");
        return null;
      }

      if (protectedPage?.indexOf(userData.approval_level) === -1) {
        Router.replace("/need-permission");

        return null;
      }

      if (!userToken) {
        Router.replace("/auth");
        return null;
      }

      return <WrappedComponent {...props} />;
    }
    return null;
  };
};

export default withAuth;
