import { Mail, Lock, User } from 'lucide-react';
import React from 'react';

type ButtonProps = {
  children?: React.ReactNode;
  loading?: boolean;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

const Button : React.FC<ButtonProps> = ({ children, loading, onClick }) => (
  <button
    onClick={onClick}
    disabled={loading}
    className="w-full bg-gradient-to-r from-purple-500 to-purple-600 text-white py-3 rounded-lg font-medium hover:from-purple-600 hover:to-purple-700 focus:ring-4 focus:ring-purple-200 transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
  >
    {loading ? 'Processing...' : children}
  </button>
);
export default Button;