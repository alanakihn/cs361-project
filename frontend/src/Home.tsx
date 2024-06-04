import { Link } from "react-router-dom";
import Header from "./components/Header";

const Home = () => {
  return (
    <Header pageName="Home Page">
      <div className="w-full h-full flex items-center justify-center">
        <div className="w-[600px] h-[450px] flex flex-col items-center mt-6 shadow-xl border rounded-lg">
          <div className="w-full bg-orange-400 rounded-tl-lg rounded-tr-lg p-2 text-center flex flex-col justify-center h-[175px]">
            <h1 className="font-bold text-2xl">Welcome to ForkFolio</h1>
            <p>A website where you can create, share and browse recipes!</p>
            <p>This site is designed to be <span className="italic">free to users</span> and <span className="italic">easy to navigate</span>.</p>
            <p>Please select one of the options below to get started...</p>
          </div>
          
          <div className="flex flex-col items-center h-[220px] mt-6 justify-evenly">
            <Link to="/profile">
              <button className="button-primary">
                View Your Profile
              </button>
            </Link>
            <Link to="/recipes">
              <button className="button-primary">
                View Community Recipes
              </button>
            </Link>
            <Link to="/recipes/new">
              <button className="button-primary">
                Create Recipe
              </button>
            </Link>
          </div>
        </div>
      </div>
    </Header>
  );
};

export default Home;
