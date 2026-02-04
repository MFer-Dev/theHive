import React, { useState } from 'react';
import { Image, Smile, MapPin } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

interface Props {
  onPostCreated: () => void;
}

export const CreatePost: React.FC<Props> = ({ onPostCreated }) => {
  const { user } = useAuth();
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (!content.trim()) return;
    
    setIsLoading(true);
    try {
      await axios.post('http://localhost:5000/api/posts', { content });
      setContent('');
      onPostCreated();
    } catch (error) {
      console.error('Failed to create post');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-4 mb-4">
      <div className="flex gap-3 mb-4">
        <div className="w-10 h-10 rounded-full bg-gray-300 flex-shrink-0 overflow-hidden">
          {user?.avatar ? (
            <img src={user.avatar} alt={user.firstName} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-facebook-blue text-white flex items-center justify-center font-bold">
              {user?.firstName[0]}
            </div>
          )}
        </div>
        <input
          type="text"
          placeholder={`What's on your mind, ${user?.firstName}?`}
          className="bg-facebook-gray rounded-full px-4 py-2 flex-1 outline-none hover:bg-gray-200 transition"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
      </div>
      
      <div className="border-t pt-3 flex justify-between items-center">
        <div className="flex gap-4">
          <button className="flex items-center gap-2 text-gray-500 hover:bg-gray-100 px-3 py-1 rounded-lg transition text-sm font-medium">
            <Image className="w-5 h-5 text-green-500" />
            Photo/Video
          </button>
          <button className="flex items-center gap-2 text-gray-500 hover:bg-gray-100 px-3 py-1 rounded-lg transition text-sm font-medium">
            <Smile className="w-5 h-5 text-yellow-500" />
            Feeling/Activity
          </button>
          <button className="flex items-center gap-2 text-gray-500 hover:bg-gray-100 px-3 py-1 rounded-lg transition text-sm font-medium">
            <MapPin className="w-5 h-5 text-red-500" />
            Check in
          </button>
        </div>
        
        <button
          onClick={handleSubmit}
          disabled={!content.trim() || isLoading}
          className="bg-facebook-blue text-white px-6 py-2 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-facebook-dark transition"
        >
          {isLoading ? 'Posting...' : 'Post'}
        </button>
      </div>
    </div>
  );
};