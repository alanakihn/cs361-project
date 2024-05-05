import { createContext, useState, ReactNode, useEffect } from "react";

const TokenTimeout = 1000 * 60 * 60 * 24;

interface AuthContextType {
  authToken: AuthToken;
  login: (token: string) => void;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType>(null!);
type AuthToken = string | null;

interface AuthProviderProps {
  children: ReactNode;
}

const AuthProvider = ({ children }: AuthProviderProps) => {
  const [authToken, setAuthToken] = useState<AuthToken>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (authToken === null) {
      const localAuthToken = localStorage.getItem("authToken");
      if (localAuthToken) {
        const localAuthTokenTime = localStorage.getItem("authTokenTime");
        if (localAuthTokenTime) {
          const localAuthTokenTimeNum = parseInt(localAuthTokenTime);
          const now = Date.now();
          if (now - localAuthTokenTimeNum > TokenTimeout) {
            localStorage.removeItem("authToken");
            localStorage.removeItem("authTokenTime");
          } else {
            setAuthToken(localAuthToken);
          }
        }
      } else {
        setIsLoading(false);
      }
    }
  }, [authToken]);

  const login = (token: string) => {
    setIsLoading(true);
    setAuthToken(token);
    localStorage.setItem("authToken", token);
    localStorage.setItem("authTokenTime", Date.now().toString());
  };

  const logout = () => {
    setAuthToken(null);
    localStorage.removeItem("authToken");
    localStorage.removeItem("authTokenTime");
  };

  return (
    <AuthContext.Provider value={{ authToken, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
export { AuthContext };
