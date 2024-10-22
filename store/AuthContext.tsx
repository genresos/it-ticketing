import React, {
  createContext,
  useCallback,
  useEffect,
  useReducer,
} from "react";
import { useCookies } from "react-cookie";
import { UserData } from "../types/userData";
import { decryptJson, encryptJson } from "../utils/myFunction";

enum ActionKind {
  RETRIEVE_DATA = "RETRIEVE_DATA",
  LOGIN = "LOGIN",
  LOGOUT = "LOGOUT",
  USER_DATA_UPDATE = "USER_DATA_UPDATE",
}

enum StorageKind {
  userData = "userData",
}

enum CookieKind {
  ictAuth = "ictAuth",
}

interface SignIn {
  user: UserData;
  token: string;
}

type ACTIONTYPE =
  | {
      type: ActionKind.RETRIEVE_DATA;
      isLoading?: boolean;
      userData: UserData;
      userToken: string;
    }
  | {
      type: ActionKind.LOGIN;
      isLoading?: boolean;
      userData: UserData;
      userToken: string;
    }
  | {
      type: ActionKind.LOGOUT;
      isLoading?: boolean;
      userData?: UserData;
      userToken?: string;
    }
  | {
      type: ActionKind.USER_DATA_UPDATE;
      isLoading?: boolean;
      userData: UserData;
    };

interface State {
  isLoading: boolean;
  userData: UserData;
  userToken: string;
  signIn: ({ user, token }: SignIn) => void;
  signOut: () => void;
  setUserData: (data: UserData) => void;
}

interface Props {
  children: React.ReactNode;
}

const initialUserData: UserData = {
  id: 0,
  old_id: 0,
  emp_no: 0,
  emp_id: "",
  name: "",
  person_id: 0,
  division_id: 0,
  approval_level: 0,
  role_id: 0,
  email: "",
  phone_number: "",
  signature: 0,
  images: 0,
  profile_images: "",
  firebase_token: "",
  inactive: 0,
  created_at: "",
  updated_at: "",
};

const initialState: State = {
  isLoading: true,
  userData: initialUserData,
  userToken: "",
  signIn: () => {},
  signOut: () => {},
  setUserData: () => {},
};

export const AuthContext = createContext<State>(initialState);

const loginReducer = (prevState: State, action: ACTIONTYPE) => {
  switch (action.type) {
    case ActionKind.RETRIEVE_DATA:
      return {
        ...prevState,
        userData: action.userData,
        userToken: action.userToken,
        isLoading: false,
      };
    case ActionKind.LOGIN:
      return {
        ...prevState,
        userData: action.userData,
        userToken: action.userToken,
        isLoading: false,
      };
    case ActionKind.LOGOUT:
      return {
        ...prevState,
        userData: initialUserData,
        userToken: "",
        isLoading: false,
      };
    case ActionKind.USER_DATA_UPDATE:
      return {
        ...prevState,
        userData: action.userData,
        isLoading: false,
      };
    default:
      return {
        ...prevState,
        isLoading: false,
      };
  }
};

const AuthProvider = ({ children }: Props): JSX.Element => {
  const [state, dispatch] = useReducer(loginReducer, initialState);
  const [cookies, setCookie, removeCookie] = useCookies();

  useEffect(() => {
    const getInitialData = () => {
      try {
        const userStorage = localStorage.getItem(StorageKind.userData);
        const userToken = cookies.ictAuth ? cookies.ictAuth : "";
        const userDataParse = userStorage
          ? (decryptJson(userStorage) as UserData)
          : initialUserData;

        const userData = userDataParse.emp_id ? userDataParse : initialUserData;

        return dispatch({
          type: ActionKind.RETRIEVE_DATA,
          userData,
          userToken,
        });
      } catch (error) {
        console.log(error);
        return dispatch({
          type: ActionKind.RETRIEVE_DATA,
          userData: initialUserData,
          userToken: "",
        });
      }
    };

    getInitialData();
  }, [cookies.ictAuth]);

  const signIn = useCallback(
    ({ user, token }: SignIn) => {
      setCookie(CookieKind.ictAuth, token, { path: "/" });
      localStorage.setItem(StorageKind.userData, encryptJson(user));

      return dispatch({
        type: ActionKind.LOGIN,
        userData: user,
        userToken: token,
      });
    },
    [setCookie]
  );

  const signOut = useCallback(() => {
    removeCookie(CookieKind.ictAuth, { maxAge: -1, path: "/" });
    localStorage.removeItem(StorageKind.userData);

    return dispatch({
      type: ActionKind.LOGOUT,
    });
  }, [removeCookie]);

  const setUserData = useCallback((data: UserData) => {
    localStorage.setItem(StorageKind.userData, encryptJson(data));

    return dispatch({
      type: ActionKind.USER_DATA_UPDATE,
      userData: data,
    });
  }, []);

  return (
    <AuthContext.Provider
      value={{
        ...state,
        signIn,
        signOut,
        setUserData,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
