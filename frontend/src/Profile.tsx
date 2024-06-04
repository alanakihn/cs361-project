import { useContext, useEffect } from "react";
import Header from "./components/Header";
import { AuthContext } from "./components/AuthContext";
import { useNavigate } from "react-router-dom";

const getDateString = (dateStr: string | undefined): string => {
  if (!dateStr) {
    return '[...]';
  }
  const parsedDate = new Date(dateStr);

  const options: Intl.DateTimeFormatOptions = {
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: true
  };

  const dateFormatter = new Intl.DateTimeFormat('en-US', options);
  const formattedDate = dateFormatter.format(parsedDate);

  const [monthDay, time] = formattedDate.split(' at ');
  const [month, day] = monthDay.split(' ');

  const dayInt = parseInt(day, 10);
  const daySuffix = (dayInt % 10 === 1 && dayInt !== 11) ? 'st' :
                    (dayInt % 10 === 2 && dayInt !== 12) ? 'nd' :
                    (dayInt % 10 === 3 && dayInt !== 13) ? 'rd' : 'th';

  return `${month} ${day}${daySuffix} at ${time}`;
}

const Profile = () => {
  const { details, logout, isLoading } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !details) {
      navigate('/');
    }
  }, [isLoading, details]);

  return (
    <Header pageName="Your Profile">
      <div className="flex justify-center mt-10">
        <div className="w-[400px] shadow bg-gray-100 rounded border">
          <div className="bg-orange-500 rounded-tl rounded-tr p-1 px-2">
            <h1 className="text-2xl text-white">{details?.username || '[...]'}</h1>
          </div>
          <div className="p-2">
            Account created on {getDateString(details?.createdAt)}
          </div>

          <div className="flex justify-center mb-3 mt-1">
            <button className="button-primary" onClick={() => {
              logout()
              navigate('/');
            }}>
              Logout
            </button>
          </div>
        </div>
      </div>
    </Header>
  );
};

export default Profile;
