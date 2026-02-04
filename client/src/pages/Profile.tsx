import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { PostCard } from '../components/PostCard';
import { Camera, MapPin, Briefcase, GraduationCap, Heart, UserPlus, UserCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

export const Profile: React.FC = () => {
  const { id } = useParams();
  const { user: currentUser } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('posts');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, [id]);

  const fetchProfile = async () => {
    try {
      const userId = id === 'me' ? currentUser?.id : id;
      const { data } = await axios.get(`http://localhost:5000/api/users/${userId}`);
      setProfile(data);
    } catch (error) {
      console.error('Failed to fetch profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFriendRequest = async () => {
    try {
      await axios.post(`http://localhost:5000/api/friends/request/${profile.id}`);
      fetchProfile();
    } catch (error) {
      console.error('Failed to send request');
    }
  };

  if (isLoading || !profile) {
    return <div className="min-h-screen bg-facebook-gray pt-20 text-center">Loading...</div>;
  }

  const isOwnProfile = currentUser?.id === profile.id;
  const friendStatus = profile.friendship?.status;

  return (
    <div className="min-h-screen bg-facebook-gray">
      <Navbar />
      
      <div className="bg-white">
        <div className="max-w-4xl mx-auto">
          {/* Cover Photo */}
          <div className="h-96 bg-gradient-to-r from-blue-400 to-blue-600 relative">
            <button className="absolute bottom-4 right-4 bg-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 hover:bg-gray-100">
              <Camera className="w-5 h-5" />
              Add Cover Photo
            </button>
          </div>
          
          {/* Profile Info */}
          <div className="px-4 pb-4">
            <div className="flex flex-col md:flex-row items-end md:items-center -mt-12 mb-4">
              <div className="relative">
                <div className="w-40 h-40 rounded-full border-4 border-white bg-gray-300 overflow-hidden">
                  {profile.avatar ? (
                    <img src={profile.avatar} alt={profile.firstName} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-facebook-blue text-white flex items-center justify-center text-6xl font-bold">
                      {profile.firstName[0]}
                    </div>
                  )}
                </div>
                <button className="absolute bottom-2 right-2 bg-gray-200 p-2 rounded-full hover:bg-gray-300">
                  <Camera className="w-5 h-5" />
                </button>
              </div>
              
              <div className="md:ml-6 mt-4 md:mt-0 flex-1">
                <h1 className="text-3xl font-bold text-facebook-text">
                  {profile.firstName} {profile.lastName}
                </h1>
                <p className="text-facebook-secondary font-medium">1.2K friends</p>
              </div>
              
              {!isOwnProfile && (
                <div className="flex gap-2 mt-4 md:mt-0">
                  {friendStatus === 'ACCEPTED' ? (
                    <button className="bg-gray-200 px-4 py-2 rounded-lg font-medium flex items-center gap-2">
                      <UserCheck className="w-5 h-5" />
                      Friends
                    </button>
                  ) : friendStatus === 'PENDING' ? (
                    <button className="bg-gray-200 px-4 py-2 rounded-lg font-medium">
                      Request Sent
                    </button>
                  ) : (
                    <button 
                      onClick={handleFriendRequest}
                      className="bg-facebook-blue text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 hover:bg-facebook-dark"
                    >
                      <UserPlus className="w-5 h-5" />
                      Add Friend
                    </button>
                  )}
                  <button className="bg-gray-200 px-4 py-2 rounded-lg font-medium">
                    Message
                  </button>
                </div>
              )}
            </div>
            
            {/* Tabs */}
            <div className="border-t flex gap-6 mt-4">
              {['Posts', 'About', 'Friends', 'Photos'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab.toLowerCase())}
                  className={`py-4 font-medium border-b-4 transition ${activeTab === tab.toLowerCase() ? 'border-facebook-blue text-facebook-blue' : 'border-transparent text-facebook-secondary hover:bg-gray-100 px-2'}`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Left Column: Info */}
        <div className="space-y-4">
          <div className="bg-white rounded-lg shadow p-4">
            <h2 className="text-xl font-bold mb-4">Intro</h2>
            <div className="space-y-3 text-facebook-secondary">
              <div className="flex items-center gap-2">
                <Briefcase className="w-5 h-5" />
                <span>Software Engineer at Tech Corp</span>
              </div>
              <div className="flex items-center gap-2">
                <GraduationCap className="w-5 h-5" />
                <span>Studied Computer Science</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                <span>Lives in San Francisco, CA</span>
              </div>
              <div className="flex items-center gap-2">
                <Heart className="w-5 h-5" />
                <span>Single</span>
              </div>
            </div>
            <button className="w-full bg-gray-200 py-2 rounded-lg font-medium mt-4 hover:bg-gray-300">
              Edit Details
            </button>
          </div>
        </div>

        {/* Right Column: Posts */}
        <div className="md:col-span-2 space-y-4">
          {profile.posts?.map((post: any) => (
            <PostCard 
              key={post.id} 
              post={{...post, author: profile}} 
              onUpdate={fetchProfile} 
            />
          ))}
        </div>
      </div>
    </div>
  );
};