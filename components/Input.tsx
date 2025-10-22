import { Mail, Lock, User } from 'lucide-react';
import React from 'react';
type IconType = React.ComponentType<React.SVGProps<SVGSVGElement>>;

type InputProps = {
  icon: IconType;
  error?: string | null;
} & React.InputHTMLAttributes<HTMLInputElement>;

const Input :React.FC<InputProps> = ({ icon: Icon, error, ...props }) => (
  <div className="mb-4">
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Icon className="h-5 w-5 text-purple-500" />
      </div>
      <input
        {...props}
        className={`w-full pl-10 pr-4 py-3 border ${
          error ? 'border-red-400' : 'border-gray-200'
        } rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent placeholder-purple-300 text-black outline-none transition-all duration-200 bg-white`}
      />
    </div>
    {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
  </div>
);

export default Input;
