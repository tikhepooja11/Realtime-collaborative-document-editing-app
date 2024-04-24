import React, { useState } from "react";
import { useAuth } from "./AuthProvider";
import { Link, useNavigate } from "react-router-dom";
import Header from "./Header";
import { validateFormData } from "../utilities/validate";

const Login = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate(); // Get access to history object
  const [errorMessage, setErrorMessage] = useState(null);

  const handleLogin = async () => {
    try {
      const message = validateFormData(email, password);
      setErrorMessage(message);
      if (message) {
        return;
      }
      await login(email, password);
      navigate("/editor"); // Redirect to editor route after successful login
    } catch (error) {
      setErrorMessage(error);
    }
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
            <h1 className="text-3xl font-bold mb-6">Login</h1>

            <div className="mb-4 relative">
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                className="input-field p-4 mx-auto w-full"
              />
            </div>

            <div className="mb-6 relative">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="input-field p-4 mx-auto w-full "
              />
            </div>

            <p className="text-red-700 font-bold text-lg py-2">
              {errorMessage}
            </p>

            <button
              onClick={handleLogin}
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-full w-full"
            >
              Login
            </button>

            <p className="text-sm mt-4 text-center text-gray-600">
              New here?{" "}
              <Link to="/register" className="text-blue-500 hover:underline">
                Register now
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
