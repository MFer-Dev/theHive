import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Users, Bookmark, Calendar, Clock, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Sidebar: React.FC = () => {
  const { user } = useAuth();

  const menuItems = [
    { icon: Users, label: 'Friends', path: '/friends' },
    { icon: Bookmark, label: 'Saved', path: '#' },
    { icon: Calendar, label: 'Events', path: '#' },
    { icon: Clock, label: 'Memories', path: '#' },
  ];

  return (
    <div className="hidden lg:block w-80 sticky top-20 h-[calc(100vh-5rem)] overflow-y-auto pr-4">
      <div className="space-y-1">
        <Link to="/profile/me" className="flex items-center gap-3 p-3 hover:bg-gray-200 rounded-lg cursor-pointer transition">
          <div className="w-9 h-9 rounded-full bg-gray-300 overflow-hidden">
            {user?.avatar ? (
              <img src={user.avatar} alt={user.firstName} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-facebook-blue text-white flex items-center justify-center font-bold">
                {user?.firstName[0]}
              </div>
            )}
          </div>
          <span className="font-medium text-facebook-text">{user?.firstName} {user?.lastName}</span>
        </Link>

        {menuItems.map((item) => (
          <Link 
            key={item.label} 
            to={item.path}
            className="flex items-center gap-3 p-3 hover:bg-gray-200 rounded-lg cursor-pointer transition"
          >
            <item.icon className="w-7 h-7 text-facebook-blue" />
            <span className="font-medium text-facebook-text">{item.label}</span>
          </Link>
        ))}

        <button className="w-full flex items-center gap-3 p-3 hover:bg-gray-200 rounded-lg cursor-pointer transition">
          <div className="w-7 h-7 rounded-full bg-gray-300 flex items-center justify-center">
            <ChevronDown className="w-5 h-5" />
          </div>
          <span className="font-medium text-facebook-text">See more</span>
        </button>
      </div>

      <div className="border-t my-4 pt-4">
        <h3 className="text-facebook-secondary font-semibold text-sm mb-2 px-3">Your shortcuts</h3>
        <div className="space-y-1">
          <div className="flex items-center gap-3 p-3 hover:bg-gray-200 rounded-lg cursor-pointer transition">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600" />
            <span className="font-medium text-facebook-text">React Developers</span>
          </div>
        </div>
      </div>
    </div>
  );
};