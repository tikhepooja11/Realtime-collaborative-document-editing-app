import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { validateFormData } from "../utilities/validate";
import Header from "./Header";
import { useAuth } from "./AuthProvider";
import io from "socket.io-client";
const socket = io("http://localhost:3000");

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    password: "",
  });
  const [errorMessage, setErrorMessage] = useState(null);

  const toggleSignInForm = () => {
    navigate("/"); // Navigate to login page if already registered
  };

  const handleRegisterButtonClick = async () => {
    const message = validateFormData(formData.email, formData.password);
    setErrorMessage(message);
    if (message) return;
    const response = await register(formData);
    console.log(JSON.stringify(response.data));

    // after registration immediately map new userId with websocket clientID
    socket.emit("userid-to-clientId-map", {
      fullname: response?.data?.fullname,
      email: response.data.email,
      clientId: socket.id,
    });
    navigate("/"); // Redirect to login page after successful registration
  };

  return (
    <div>
      <Header />
      <div className="flex justify-center items-center h-screen bg-grey-700">
        <div className="max-w-screen-lg mx-auto p-4 bg-white rounded-lg shadow-lg flex items-center space-x-8">
          {/* Left Section with Image */}
          <div className="w-1/2 h-full">
            <img
              className="object-cover w-full h-full rounded-lg"
              src="https://media.licdn.com/dms/image/D4D12AQE5tHC0fWyEyg/article-cover_image-shrink_720_1280/0/1692376418099?e=2147483647&v=beta&t=bsGV3H8crWFb9noVTa3otA7J5T-lUW_CHGtGDsgAvWU"
              alt="background"
            />
          </div>

          {/* Right Section with Login Form */}
          <div className="w-1/2">
            <h1 className="text-3xl font-bold mb-6">Registration</h1>

            <form onSubmit={(e) => e.preventDefault()}>
              <div className="mb-4 relative">
                <input
                  value={formData.fullname}
                  type="text"
                  placeholder="Enter Full Name"
                  className="input-field p-4 mx-auto w-full"
                  onChange={(e) =>
                    setFormData({ ...formData, fullname: e.target.value })
                  }
                />
              </div>

              <div className="mb-6 relative">
                <input
                  value={formData.email}
                  type="text"
                  placeholder="Email Address"
                  className="input-field p-4 mx-auto w-full"
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
              </div>

              <div className="mb-4 relative">
                <input
                  value={formData.password}
                  type="password"
                  placeholder="Password"
                  className="input-field p-4 mx-auto w-full "
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                />
              </div>

              {errorMessage && (
                <p className="text-red-700 font-bold text-lg py-2">
                  {errorMessage}
                </p>
              )}

              <button
                onClick={handleRegisterButtonClick}
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-full w-full"
              >
                Register
              </button>

              <p
                onClick={toggleSignInForm}
                className="text-sm mt-4 text-center text-gray-600"
              >
                Already registered?{" "}
                <Link to="/register" className="text-blue-500 hover:underline">
                  Sign in now
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
