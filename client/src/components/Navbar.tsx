import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Home, Users, Bell, MessageCircle, LogOut, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const navigate = useNavigate();

  const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    
    if (query.length > 2) {
      const { data } = await axios.get(`http://localhost:5000/api/users/search/${query}`);
      setSearchResults(data);
    } else {
      setSearchResults([]);
    }
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
        {/* Left: Logo & Search */}
        <div className="flex items-center gap-4 flex-1">
          <Link to="/" className="text-facebook-blue text-3xl font-bold tracking-tighter">
            facebook
          </Link>
          
          <div className="relative hidden md:block">
            <div className="bg-facebook-gray rounded-full flex items-center px-4 py-2 w-64">
              <Search className="w-5 h-5 text-gray-500 mr-2" />
              <input
                type="text"
                placeholder="Search Facebook"
                className="bg-transparent outline-none w-full text-sm"
                value={searchQuery}
                onChange={handleSearch}
              />
            </div>
            
            {searchResults.length > 0 && (
              <div className="absolute top-full mt-2 bg-white shadow-lg rounded-lg w-64 py-2">
                {searchResults.map((result) => (
                  <div
                    key={result.id}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center gap-2"
                    onClick={() => {
                      navigate(`/profile/${result.id}`);
                      setSearchQuery('');
                      setSearchResults([]);
                    }}
                  >
                    <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-sm font-bold">
                      {result.firstName[0]}
                    </div>
                    <span>{result.firstName} {result.lastName}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Center: Navigation */}
        <div className="hidden md:flex items-center gap-8 flex-1 justify-center">
          <Link to="/" className="text-facebook-blue border-b-4 border-facebook-blue h-14 flex items-center px-4">
            <Home className="w-6 h-6" />
          </Link>
          <Link to="/friends" className="text-gray-500 h-14 flex items-center px-4 hover:bg-gray-100 rounded-lg">
            <Users className="w-6 h-6" />
          </Link>
        </div>

        {/* Right: Profile & Actions */}
        <div className="flex items-center gap-3 flex-1 justify-end">
          <button className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200">
            <Bell className="w-5 h-5" />
          </button>
          <button className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200">
            <MessageCircle className="w-5 h-5" />
          </button>
          
          <div className="relative group">
            <button className="w-10 h-10 rounded-full bg-gray-300 overflow-hidden">
              {user?.avatar ? (
                <img src={user.avatar} alt={user.firstName} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-facebook-blue text-white font-bold">
                  {user?.firstName[0]}
                </div>
              )}
            </button>
            
            <div className="absolute right-0 top-full mt-2 bg-white shadow-lg rounded-lg py-2 hidden group-hover:block w-48">
              <Link to="/profile/me" className="px-4 py-2 hover:bg-gray-100 flex items-center gap-2">
                <User className="w-4 h-4" />
                Profile
              </Link>
              <button 
                onClick={logout}
                className="w-full px-4 py-2 hover:bg-gray-100 flex items-center gap-2 text-red-600"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};