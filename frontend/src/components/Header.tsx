import { ReactNode } from "react";

interface HeaderProps {
  children: ReactNode,
}

const Header = ({ children }: HeaderProps) => {
  return (
    <>
      <div className="flex items-center w-full justify-between p-2 bg-orange-500">
        <div>
          <button className="p-1 bg-gray-200 border-2 border-gray-300 rounded px-3 font-bold text-lg">
            Signup Page
          </button>
        </div>

        <h1 className="text-2xl font-bold">
          ForkFolio
        </h1>

        <div>
          <button className="p-1 bg-gray-200 border-2 border-gray-300 rounded px-3 font-bold text-lg">
            Login
          </button>
        </div>
      </div>
      {children}
    </>
  );
};

export default Header;
