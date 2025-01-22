import React from "react";

const Login = ({ toggleToSignup }) => {
  return (
    <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
        Log In
      </h2>
      <form>
        <div className="mb-4">
          <label
            htmlFor="email"
            className="block text-gray-700 font-medium mb-2"
          >
            Email ID
          </label>
          <input
            type="email"
            id="email"
            placeholder="Enter your email"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none"
            required
          />
        </div>
        <div className="mb-6">
          <label
            htmlFor="password"
            className="block text-gray-700 font-medium mb-2"
          >
            Password
          </label>
          <input
            type="password"
            id="password"
            placeholder="Enter your password"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-indigo-500 text-white py-2 px-4 rounded-lg hover:bg-indigo-600 focus:ring-4 focus:ring-indigo-300 focus:outline-none transition duration-300"
        >
          Log In
        </button>
      </form>
      <p className="text-center text-gray-600 mt-4">
        Don’t have an account?{" "}
        <button
          className="text-indigo-500 font-medium hover:underline"
          onClick={toggleToSignup}
        >
          Sign Up
        </button>
      </p>
    </div>
  );
};

export default Login;
