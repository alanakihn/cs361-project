import { useState } from "react";
import Header from "./components/Header"
import { Link, useNavigate } from "react-router-dom";
import { createNewAccount } from "./api/auth";

const Signup = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  const onFormSubmit = (e: any) => {
    e.preventDefault();
    // talk to auth microservice
    
    createNewAccount({
      username,
      password,
    }).then((result) => {
        console.log(result);
        navigate('/login');
      });
  };

  return (
    <Header pageName="Signup Page">
      <div className="w-full h-full flex items-center justify-center">
        <div className="w-[600px] h-[400px] flex flex-col items-center mt-6 shadow-xl border rounded-lg">
          <div className="w-full px-4 h-[50px] rounded-tl-lg rounded-tr-lg flex items-center bg-orange-500">
            <h1 className='font-bold text-2xl text-white'>Signup</h1>
          </div>

          <form onSubmit={onFormSubmit} className="flex flex-col items-center h-[300px] justify-center">
            <div className="w-[350px] flex items-center justify-between">
              <label className="mr-2 font-bold">
                Username:
              </label>
              <input 
                value={username}
                className="border p-2 border-gray-300 rounded my-1 w-[250px]"
                placeholder="enter username"
                onChange={(e: any) => {
                  e.preventDefault();
                  setUsername(e.target.value);
                }}
              />
            </div>
            <div className="w-[350px] flex items-center justify-between">
              <label className="mr-2 font-bold">
                Password:
              </label>
              <input 
                value={password}
                className="border p-2 border-gray-300 rounded my-1 w-[250px]"
                placeholder="enter password"
                type="password"
                onChange={(e: any) => {
                  e.preventDefault();
                  setPassword(e.target.value);
                }}
              />
            </div>
            <div className="w-[350px] flex items-center justify-between">
              <label className="mr-2 font-bold w-[70px]">
                Confirm password:
              </label>
              <input 
                value={confirmPassword}
                className="border p-2 border-gray-300 rounded my-1 w-[250px]"
                placeholder="confirm password"
                type="password"
                onChange={(e: any) => {
                  e.preventDefault();
                  setConfirmPassword(e.target.value);
                }}
              />
            </div>

            <button type="submit" className="button-primary w-[100px] mt-2">
              Signup
            </button>

            <div className="mt-2">
              <Link to="/login">
                Already have an account? Click here.
              </Link>
            </div>
          </form>
        </div>
      </div>
    </Header>
  )
}

export default Signup;
