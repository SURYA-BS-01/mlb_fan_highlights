// import React, { useState } from "react";
// import Login from "./Login";

// const Signup = () => {
//   const [isLogin, setIsLogin] = useState(false);

//   if (isLogin) {
//     return <Login toggleToSignup={() => setIsLogin(false)} />;
//   }

//   return (
//     <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
//       <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
//         Sign Up
//       </h2>
//       <form>
//         <div className="mb-4">
//           <label
//             htmlFor="email"
//             className="block text-gray-700 font-medium mb-2"
//           >
//             Email ID
//           </label>
//           <input
//             type="email"
//             id="email"
//             placeholder="Enter your email"
//             className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none"
//             required
//           />
//         </div>
//         <div className="mb-4">
//           <label
//             htmlFor="password"
//             className="block text-gray-700 font-medium mb-2"
//           >
//             Password
//           </label>
//           <input
//             type="password"
//             id="password"
//             placeholder="Enter your password"
//             className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none"
//             required
//           />
//         </div>
//         <div className="mb-6">
//           <label
//             htmlFor="favourite-team"
//             className="block text-gray-700 font-medium mb-2"
//           >
//             Favourite Team
//           </label>
//           <input
//             type="text"
//             id="favourite-team"
//             placeholder="e.g., Lakers, Manchester United"
//             className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none"
//             required
//           />
//         </div>
//         <button
//           type="submit"
//           className="w-full bg-indigo-500 text-white py-2 px-4 rounded-lg hover:bg-indigo-600 focus:ring-4 focus:ring-indigo-300 focus:outline-none transition duration-300"
//         >
//           Sign Up
//         </button>
//       </form>
//       <p className="text-center text-gray-600 mt-4">
//         Already have an account?{" "}
//         <button
//           className="text-indigo-500 font-medium hover:underline"
//           onClick={() => setIsLogin(true)}
//         >
//           Log In
//         </button>
//       </p>
//     </div>
//   );
// };

// export default Signup;


// import React, { useState } from "react";
// import axios from "axios";

// const Signup = ({ setIsAuthenticated, toggleToLogin }) => {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [team, setTeam] = useState("");
//   const [loading, setLoading] = useState(false);

//   const handleSignup = async (e) => {
//     e.preventDefault();

//     const payload = {
//       email: e.target.email.value,
//       password: e.target.password.value,
//       fav_team: e.target.fav_team.value, // Match schema
//     };

//     try {
//       const response = await axios.post("http://127.0.0.1:8000/users/", payload);
//       alert("User registered successfully");
//     } catch (error) {
//       console.error("Error during signup:", error);
//       alert("Failed to sign up. Please try again.");
//     }
// };

//   return (
//     <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
//       <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Sign Up</h2>
//       <form onSubmit={handleSignup}>
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
//         <div className="mb-4">
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
//         <div className="mb-6">
//           <label htmlFor="fav_team" className="block text-gray-700 font-medium mb-2">
//             Favourite Team
//           </label>
//           <input
//             type="text"
//             id="fav_team"
//             value={team}
//             onChange={(e) => setTeam(e.target.value)}
//             placeholder="e.g., Lakers, Manchester United"
//             className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none"
//             required
//           />
//         </div>
//         <button
//           type="submit"
//           disabled={loading}
//           className="w-full bg-indigo-500 text-white py-2 px-4 rounded-lg hover:bg-indigo-600 focus:ring-4 focus:ring-indigo-300 focus:outline-none transition duration-300"
//         >
//           {loading ? "Signing up..." : "Sign Up"}
//         </button>
//       </form>
//       <p className="text-center text-gray-600 mt-4">
//         Already have an account?{" "}
//         <button
//           className="text-indigo-500 font-medium hover:underline"
//           onClick={toggleToLogin}
//         >
//           Log In
//         </button>
//       </p>
//     </div>
//   );
// };

// export default Signup;


import React, { useState } from "react";
import axios from "axios";

const Signup = ({ setIsAuthenticated, toggleToLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [favTeam, setFavTeam] = useState(""); // Assuming a 'fav_team' field is required
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post("http://127.0.0.1:8000/users", {
        email,
        password,
        fav_team: favTeam,
      });

      // Log in the user immediately after successful signup
      const loginResponse = await axios.post(
        "http://127.0.0.1:8000/login",
        new URLSearchParams({
          username: email,
          password,
        }),
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );

      // Store JWT token and set authentication
      localStorage.setItem("token", loginResponse.data.access_token);
      setIsAuthenticated(true);
    } catch (error) {
      console.error("Signup failed:", error);
      alert("Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Sign Up</h2>
      <form onSubmit={handleSignup}>
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
        <div className="mb-4">
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
        <div className="mb-6">
          <label htmlFor="favTeam" className="block text-gray-700 font-medium mb-2">
            Favorite Team
          </label>
          <input
            type="text"
            id="favTeam"
            value={favTeam}
            onChange={(e) => setFavTeam(e.target.value)}
            placeholder="Enter your favorite team"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none"
            required
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-500 text-white py-2 px-4 rounded-lg hover:bg-indigo-600 focus:ring-4 focus:ring-indigo-300 focus:outline-none transition duration-300"
        >
          {loading ? "Signing up..." : "Sign Up"}
        </button>
      </form>
      <p className="text-center text-gray-600 mt-4">
        Already have an account?{" "}
        <button
          className="text-indigo-500 font-medium hover:underline"
          onClick={toggleToLogin} // This will toggle to the login page
        >
          Log In
        </button>
      </p>

    </div>
  );
};

export default Signup;
