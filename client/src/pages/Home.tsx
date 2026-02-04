import React, { useEffect, useState } from 'react';
import { Navbar } from '../components/Navbar';
import { Sidebar } from '../components/Sidebar';
import { CreatePost } from '../components/CreatePost';
import { PostCard } from '../components/PostCard';
import { RightSidebar } from '../components/RightSidebar';
import axios from 'axios';

export const Home: React.FC = () => {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchPosts = async () => {
    try {
      const { data } = await axios.get('http://localhost:5000/api/posts/feed');
      setPosts(data);
    } catch (error) {
      console.error('Failed to fetch posts');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <div className="min-h-screen bg-facebook-gray">
      <Navbar />
      
      <div className="max-w-7xl mx-auto pt-4 px-4 flex gap-4">
        <Sidebar />
        
        <div className="flex-1 max-w-2xl">
          <CreatePost onPostCreated={fetchPosts} />
          
          {isLoading ? (
            <div className="text-center py-8 text-gray-500">Loading...</div>
          ) : (
            posts.map((post: any) => (
              <PostCard key={post.id} post={post} onUpdate={fetchPosts} />
            ))
          )}
        </div>
        
        <RightSidebar />
      </div>
    </div>
  );
};