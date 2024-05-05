import { ReactNode } from "react";
import { Link } from "react-router-dom";

interface HeaderProps {
  children: ReactNode,
  pageName: string,
}

const Header = ({ children, pageName }: HeaderProps) => {
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
          <Link to="/login">
            <button className="button-secondary">
              Login
            </button>
          </Link>
        </div>
      </div>
      {children}
    </>
  );
};

export default Header;
