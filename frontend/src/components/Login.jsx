// import React, { useState } from "react";
// import axios from "axios";

// const Login = ({ setIsAuthenticated, toggleToSignup }) => {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [loading, setLoading] = useState(false);

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     setLoading(true);
  
//     const payload = new URLSearchParams();
//     payload.append("username", email); // 'username' is required by OAuth2PasswordRequestForm
//     payload.append("password", password);
  
//     try {
//       const response = await axios.post("http://127.0.0.1:8000/login", payload, {
//         headers: {
//           "Content-Type": "application/x-www-form-urlencoded",
//         },
//       });
//       localStorage.setItem("token", response.data.access_token);
//       setIsAuthenticated(true);
//     } catch (error) {
//       console.error("Login failed:", error);
//       alert("Invalid credentials, please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };
  

//   return (
//     <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
//       <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Log In</h2>
//       <form onSubmit={handleLogin}>
//         <div className="mb-4">
//           <label htmlFor="email" className="block text-gray-700 font-medium mb-2">
//             Email ID
//           </label>
//           <input
//             type="email"
//             id="email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             placeholder="Enter your email"
//             className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none"
//             required
//           />
//         </div>
//         <div className="mb-6">
//           <label htmlFor="password" className="block text-gray-700 font-medium mb-2">
//             Password
//           </label>
//           <input
//             type="password"
//             id="password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             placeholder="Enter your password"
//             className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none"
//             required
//           />
//         </div>
        
//         <button
//           type="submit"
//           disabled={loading}
//           className="w-full bg-indigo-500 text-white py-2 px-4 rounded-lg hover:bg-indigo-600 focus:ring-4 focus:ring-indigo-300 focus:outline-none transition duration-300"
//         >
//           {loading ? "Logging in..." : "Log In"}
//         </button>
//       </form>
//       <p className="text-center text-gray-600 mt-4">
//         Don’t have an account?{" "}
//         <button
//           className="text-indigo-500 font-medium hover:underline"
//           onClick={toggleToSignup}
//         >
//           Sign Up
//         </button>
//       </p>
//     </div>
//   );
// };

// export default Login;

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Login = ({ setIsAuthenticated }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    const payload = new URLSearchParams();
    payload.append("username", email); // 'username' is required by OAuth2PasswordRequestForm
    payload.append("password", password);

    try {
      const response = await axios.post("http://127.0.0.1:8000/login", payload, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });
      localStorage.setItem("token", response.data.access_token);
      setIsAuthenticated(true);
    } catch (error) {
      console.error("Login failed:", error);
      alert("Invalid credentials, please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Log In</h2>
      <form onSubmit={handleLogin}>
        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-700 font-medium mb-2">
            Email ID
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none"
            required
          />
        </div>
        <div className="mb-6">
          <label htmlFor="password" className="block text-gray-700 font-medium mb-2">
            Password
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none"
            required
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-500 text-white py-2 px-4 rounded-lg hover:bg-indigo-600 focus:ring-4 focus:ring-indigo-300 focus:outline-none transition duration-300"
        >
          {loading ? "Logging in..." : "Log In"}
        </button>
      </form>
      <p className="text-center text-gray-600 mt-4">
        Don’t have an account?{" "}
        <button
          className="text-indigo-500 font-medium hover:underline"
          onClick={() => navigate("/signup")}
        >
          Sign Up
        </button>
      </p>
    </div>
  );
};

export default Login;
