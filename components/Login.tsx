import React from 'react';
import { UserRole, User } from '../types';
import { mockUsers } from '../services/mockData';

interface LoginProps {
  onLogin: (user: User) => void;
}

const PowerIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path fillRule="evenodd" d="M3 6a3 3 0 013-3h12a3 3 0 013 3v12a3 3 0 01-3 3H6a3 3 0 01-3-3V6zm14.25 1.55a.75.75 0 00-.97-.69l-3 1.5a.75.75 0 000 1.38l3 1.5a.75.75 0 00.97-.69V7.55zm-8.25-.69a.75.75 0 00-.97.69v5.84a.75.75 0 00.97.69l3-1.5a.75.75 0 000-1.38l-3-1.5z" clipRule="evenodd" />
  </svg>
);

const Login: React.FC<LoginProps> = ({ onLogin }) => {

  const handleSelect = (role: UserRole) => {
    // For simplicity, we log in as the first user found with that role.
    const userToLogin = mockUsers.find(u => u.role === role);
    if (userToLogin) {
      onLogin(userToLogin);
    } else {
      console.error("No user found for role:", role);
    }
  };
  
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <div className="w-full max-w-md p-8 space-y-8 bg-gray-800 rounded-lg shadow-lg">
        <div className="text-center">
            <PowerIcon className="w-16 h-16 mx-auto text-amber-500" />
          <h1 className="mt-4 text-4xl font-bold tracking-tight text-white">POWERGRID</h1>
          <p className="mt-2 text-lg text-gray-400">Centralized IT Helpdesk</p>
        </div>
        <div className="space-y-4">
          <p className="text-center text-gray-300">Select your role to continue</p>
          <button
            onClick={() => handleSelect(UserRole.USER)}
            className="w-full px-4 py-3 font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-blue-500 transition-transform transform hover:scale-105"
          >
            User
          </button>
          <button
            onClick={() => handleSelect(UserRole.TECHNICIAN)}
            className="w-full px-4 py-3 font-semibold text-white bg-amber-600 rounded-md hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-amber-500 transition-transform transform hover:scale-105"
          >
            IT Technician
          </button>
          <button
            onClick={() => handleSelect(UserRole.ADMIN)}
            className="w-full px-4 py-3 font-semibold text-gray-800 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-gray-100 transition-transform transform hover:scale-105"
          >
            Administrator
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
