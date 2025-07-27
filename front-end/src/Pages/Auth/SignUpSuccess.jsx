import React from "react";
import { Link } from "react-router-dom";
import SignUpImage from '../../assets/auth/SignUp.png';

const SignUpSuccess = () => (
  <div className="flex h-screen bg-white" style={{ fontFamily: "'Poppins', sans-serif" }}>
    {/* Left side with background image */}
    <div className="w-1/2 h-full">
      <img src={SignUpImage} alt="Modern house" className="w-[90%] h-full object-cover" />
    </div>
    {/* Right side with card */}
    <div className="w-1/2 flex flex-col justify-center items-center px-16">
      <div className="bg-white shadow-lg rounded-2xl p-10 flex flex-col items-center max-w-md w-full">
        <h1 className="text-4xl font-bold text-green-600 mb-4 text-center">Account Created!</h1>
        <p className="text-lg text-gray-700 mb-8 text-center">Your account was created successfully. You can now log in.</p>
        <Link
          to="/login"
          className="px-6 py-2 bg-green-600 text-white rounded-full font-semibold hover:bg-green-700 transition"
        >
          Go to Login
        </Link>
      </div>
    </div>
  </div>
);

export default SignUpSuccess; 