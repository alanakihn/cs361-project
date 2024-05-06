import { ReactNode, useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "./AuthContext";

interface HeaderProps {
  children: ReactNode,
  pageName: string,
}

const Header = ({ children, pageName }: HeaderProps) => {
  const { details } = useContext(AuthContext);

  return (
    <>
      <div className="flex items-center w-full justify-between p-2 bg-orange-500">
        <div className="bg-white p-2 px-4 rounded">
          <h2 className="text-black text-xl font-bold">
            {pageName}
          </h2>
        </div>

        <h1 className="text-2xl font-bold text-white">
          ForkFolio
        </h1>

        <div>
          { details ? (
            <div className="bg-white p-2 px-4 rounded">
              <h2 className="text-black text-xl font-bold">
                Welcome back, {details.username}!
              </h2>
            </div>
          ) : (
            <Link to="/login">
              <button className="button-secondary">
                Login
              </button>
            </Link>
          )}
        </div>
      </div>
      {children}
    </>
  );
};

export default Header;
