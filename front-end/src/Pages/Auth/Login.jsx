import React, { useState } from 'react';
import LoginImage from '../../assets/auth/SignUp.png';
import { useUserStore } from '../../store/UserStore';

const Login = () => {
  const login = useUserStore((state) => state.login);
  const loading = useUserStore((state) => state.loading);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(email, password);
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
            />
          </div>
          {/* Log in button */}
          <button
            className="w-full h-12 bg-[#333333] text-white font-bold rounded-full hover:bg-gray-800 transition duration-300"
            type="submit"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Log in'}
          </button>
        </form>
        {/* Sign up link */}
        <p className="flex mt-8 text-gray-600 justify-end  items-end">
          You didn't have an account? <a href="/signup" className="underline font-bold">Sign up</a>
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