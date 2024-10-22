import { AxiosError } from "axios";
import { GetServerSidePropsResult, Redirect } from "next";
import { ErrorResponseAPI } from "../types/error";
import { myToast, Toast } from "./myToast";

type SignOut = () => void;

export const myError = (
  error: AxiosError<ErrorResponseAPI>,
  toast: Toast,
  signOut: SignOut
) => {
  if (error.response?.data) {
    if (error.response.status === 401) {
      myToast.warning(toast, "Silahkan login kembali!");
      signOut();
      return;
    }
    if (error.response.data?.error?.message === "Token has expired") {
      myToast.warning(toast, "Silahkan login kembali!");
      signOut();
      return;
    }

    myToast.error(
      toast,
      `[${error.response.status}] - ${error.response.data?.error?.message}`
    );
    console.log("error response: ", error.response.data);
    return;
  }

  if (error.code) {
    myToast.error(toast, `[${error.code}] - ${error.message}`);
    console.log("error code: ", error.code, error.message);
    return;
  }

  myToast.error(toast, `${error}`);
  console.log("error mutate: ", error);
};

export const myErrorBlob = async (
  error: AxiosError<any>,
  toast: Toast,
  signOut: SignOut
) => {
  const errorJson = JSON.parse(await error.response?.data.text());
  if (error.response?.data) {
    if (error.response.status === 401) {
      myToast.warning(toast, "Silahkan login kembali!");
      signOut();
      return;
    }
    if (errorJson.error?.message === "Token has expired") {
      myToast.warning(toast, "Silahkan login kembali!");
      signOut();
      return;
    }

    myToast.error(
      toast,
      `[${error.response.status}] - ${errorJson.error?.message}`
    );
    console.log("error response: ", errorJson);
    return;
  }

  if (error.code) {
    myToast.error(toast, `[${error.code}] - ${error.message}`);
    console.log("error code: ", error.code, error.message);
    return;
  }

  myToast.error(toast, `${error}`);
  console.log("error mutate: ", error);
};

export const myErrorBasic = (
  error: AxiosError<ErrorResponseAPI>,
  toast: Toast
) => {
  if (error.response?.data) {
    myToast.error(
      toast,
      `[${error.response.status}] - ${error.response.data?.error?.message}`
    );
    console.log("error response: ", error.response.data);
    return;
  }

  if (error.code) {
    myToast.error(toast, `[${error.code}] - ${error.message}`);
    console.log("error code: ", error.code, error.message);
    return;
  }

  myToast.error(toast, `${error}`);
  console.log("error mutate: ", error);
};

export const myErrorSSR = <P>(
  error: AxiosError<ErrorResponseAPI>
): GetServerSidePropsResult<P> => {
  if (error.response?.data) {
    if (error.response.status === 401) {
      return {
        redirect: {
          permanent: false,
          destination: "/auth",
        },
      };
    }
    if (error.response.data?.error?.message === "Token has expired") {
      return {
        redirect: {
          permanent: false,
          destination: "/auth",
        },
      };
    }

    return {
      redirect: {
        permanent: false,
        destination: `/error-request?error=${error.response.status}&message=${error.response.data?.error?.message}`,
      },
    };
  }

  if (error.code) {
    return {
      redirect: {
        permanent: false,
        destination: `/error-request?error=${error.code}&message=${error.message}`,
      },
    };
  }

  console.log("error get data: ", error);
  return {
    redirect: {
      permanent: false,
      destination: `/error-request?error=0&message=${error}`,
    },
  };
};
