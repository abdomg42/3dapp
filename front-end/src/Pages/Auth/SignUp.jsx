import React, { useState } from 'react';
import SignUpImage from '../../assets/auth/SignUp.png';
import { useUserStore } from '../../store/UserStore';
import { Link, useNavigate } from 'react-router-dom';

const SignUp = () => {
  const signup = useUserStore((state) => state.signup);
  const loading = useUserStore((state) => state.loading);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await signup({ name, email, password, confirmPassword });
    if (result?.success) {
      navigate("/signup-success");
    }
  };

  return (
    <div className="flex h-screen bg-white" style={{ fontFamily: "'Poppins', sans-serif" }}>
      {/* Left side with background image */}
      <div className="w-1/2 h-full">
        <img src={SignUpImage} alt="Modern house" className="w-[90%] h-full object-cover" />
      </div>

      {/* Right side with form */}
      <div className="w-1/2 flex flex-col justify-center items-center px-16">
        <h1 className="text-5xl font-bold mb-8 self-center text-center w-full text-black">Sign up</h1>

        <form className="w-full" onSubmit={handleSubmit}>
          {/* Username */}
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-medium mb-3" htmlFor="username">
              Username
            </label>
            <input
              className="w-full h-12 px-4 bg-white text-black rounded-md focus:outline-none ring-2 ring-gray-500"
              id="username"
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              required
            />
          </div>

          {/* Email */}
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-medium mb-3" htmlFor="email">
              Email
            </label>
            <input
              className="w-full h-12 px-4 bg-white text-black rounded-md focus:outline-none ring-2 ring-gray-500"
              id="email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Password */}
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-medium mb-3" htmlFor="password">
              Password
            </label>
            <input
              className="w-full h-12 px-4 bg-white text-black rounded-md focus:outline-none ring-2 ring-gray-500"
              id="password"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>

          {/* Password again */}
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-medium mb-3" htmlFor="password-again">
              Password again
            </label>
            <input
              className="w-full h-12 px-4 bg-white text-black rounded-md focus:outline-none ring-2 ring-gray-500"
              id="password-again"
              type="password"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          {/* Terms and conditions */}
          <div className="flex items-center mb-6">
            <input
              type="checkbox"
              id="terms"
              className="w-5 h-5 accent-black"
              required
            />
            <label htmlFor="terms" className="ml-2 text-gray-600">
              By clicking you agree to the <a href="#" className="underline">termes</a> and <a href="#" className="underline">conditions</a>
            </label>
          </div>

          {/* Sign up button */}
          <button
            className="w-full h-12 bg-black text-white font-bold rounded-full hover:bg-gray-800 transition duration-300"
            type="submit"
            disabled={loading}
          >
            {loading ? 'Signing up...' : 'Sign up'}
          </button>
        </form>

        {/* Log in link */}
        <p className="mt-8 text-gray-600">
          You already have an account? <Link to="/login" className="underline font-bold">Log in</Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp;