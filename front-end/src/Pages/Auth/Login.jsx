import React, { useState } from 'react';
import LoginImage from '../../assets/auth/SignUp.png';
import { useUserStore } from '../../store/UserStore';
import { Link, useNavigate } from 'react-router-dom';

const Login = () => {
  const login = useUserStore((state) => state.login);
  const loading = useUserStore((state) => state.loading);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      // If login is successful, navigate to home
      navigate("/");
    } catch (error) {
      // Error is already handled in the store with toast
      console.log("Login failed:", error);
      // Stay on login page, loading state is already cleared in the store
    }
  };

  return (
    <div className="flex h-screen bg-white" style={{ fontFamily: "'Poppins', sans-serif" }}>
      {/* Left side with form */}
      <div className="w-1/2 flex flex-col justify-center items-center px-16">
        <h1 className="text-5xl font-bold mb-16 self-center text-center w-full text-[#333333]">Log in</h1>
        <form className="w-full" onSubmit={handleSubmit}>
          {/* Email */}
          <div className="mb-10">
            <label className="block text-gray-700 text-sm font-medium mb-3" htmlFor="email">
              Email
            </label>
            <input
              className="w-full h-12 px-4 bg-white text-[#333333] rounded-md focus:outline-none ring-2 ring-gray-500"
              id="email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              disabled={loading}
            />
          </div>
          {/* Password */}
          <div className="mb-10">
            <label className="block text-gray-700 text-sm font-medium mb-3" htmlFor="password">
              Password  
            </label>
            <input
              className="w-full h-12 px-4 bg-white text-[#333333] rounded-md focus:outline-none ring-2 ring-gray-500"
              id="password"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              disabled={loading}
            />
          </div>
          {/* Log in button */}
          <button
            className="w-full h-12 bg-[#333333] text-white font-bold rounded-full hover:bg-gray-800 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            type="submit"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Log in'}
          </button>
        </form>
        {/* Sign up link */}
        <p className="flex mt-8 text-gray-600 justify-end  items-end">
          You didn't have an account? <Link to="/signup" className="underline font-bold">Sign up</Link>
        </p>
      </div>
      {/* Right side with background image */}
      <div className="w-1/2 h-full">
        <img src={LoginImage} alt="Login visual" className="w-full h-full object-cover" />
      </div>
    </div>
  );
};

export default Login;