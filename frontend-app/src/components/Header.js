import React from "react";
import { Card, CardBody } from "reactstrap";
import useOnlineStatus from "../utilities/useOnlineStatus";
import { useAuth } from "./AuthProvider";
import { useNavigate } from "react-router-dom";

function Header() {
  const onlineStatus = useOnlineStatus();
  const navigate = useNavigate();
  const { user: loggedInUser, logout } = useAuth();
  const loggedInUserFullName = loggedInUser?.fullname;
  const handleSignOut = async () => {
    await logout();
    navigate("/");
  };
  return (
    <div>
      <div>
        <Card className="my-2">
          <CardBody className="bg-blue-200 bg-opacity-100 shadow-2xl flex justify-between items-center p-4 ">
            <div>
              <h1 className="font-bold text-3xl">
                Realtime Collaboratibve document editor
              </h1>
            </div>
            <div className="flex items-center font-bold text-1xl">
              <div className="flex items-center ">
                <h5 className="mr-2 ">Online Status:</h5>
                <span className="text-xl">{onlineStatus ? "✅" : "🔴"}</span>
              </div>
              {loggedInUser && (
                <button
                  onClick={handleSignOut}
                  className=" ms-3 px-4 my-2 mr-4 rounded-md text-white  h-10 text-center bg-red-600  font-bold hover:underline"
                >
                  Sign Out
                </button>
              )}
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}

export default Header;
