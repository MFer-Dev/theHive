import React, { useState } from 'react';
import { ThumbsUp, MessageCircle, Share2, MoreHorizontal } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { Link } from 'react-router-dom';

interface Comment {
  id: string;
  content: string;
  createdAt: string;
  author: {
    id: string;
    firstName: string;
    lastName: string;
    avatar?: string;
  };
}

interface Post {
  id: string;
  content: string;
  image?: string;
  createdAt: string;
  author: {
    id: string;
    firstName: string;
    lastName: string;
    avatar?: string;
  };
  likes: { id: string }[];
  comments: Comment[];
  _count: {
    likes: number;
    comments: number;
  };
}

interface Props {
  post: Post;
  onUpdate: () => void;
}

export const PostCard: React.FC<Props> = ({ post, onUpdate }) => {
  const { user } = useAuth();
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [isLiked, setIsLiked] = useState(post.likes.length > 0);
  const [likeCount, setLikeCount] = useState(post._count.likes);

  const handleLike = async () => {
    try {
      const { data } = await axios.post(`http://localhost:5000/api/posts/${post.id}/like`);
      setIsLiked(data.liked);
      setLikeCount(prev => data.liked ? prev + 1 : prev - 1);
    } catch (error) {
      console.error('Failed to like post');
    }
  };

  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    
    try {
      await axios.post(`http://localhost:5000/api/posts/${post.id}/comment`, {
        content: commentText
      });
      setCommentText('');
      onUpdate();
    } catch (error) {
      console.error('Failed to comment');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow mb-4">
      {/* Header */}
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link to={`/profile/${post.author.id}`}>
            <div className="w-10 h-10 rounded-full bg-gray-300 overflow-hidden cursor-pointer">
              {post.author.avatar ? (
                <img src={post.author.avatar} alt={post.author.firstName} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-facebook-blue text-white flex items-center justify-center font-bold">
                  {post.author.firstName[0]}
                </div>
              )}
            </div>
          </Link>
          <div>
            <Link to={`/profile/${post.author.id}`}>
              <h3 className="font-semibold text-facebook-text hover:underline cursor-pointer">
                {post.author.firstName} {post.author.lastName}
              </h3>
            </Link>
            <p className="text-xs text-facebook-secondary">
              {formatDistanceToNow(new Date(post.createdAt))} ago
            </p>
          </div>
        </div>
        <button className="text-gray-500 hover:bg-gray-100 p-2 rounded-full">
          <MoreHorizontal className="w-5 h-5" />
        </button>
      </div>

      {/* Content */}
      <div className="px-4 pb-3">
        <p className="text-facebook-text whitespace-pre-wrap">{post.content}</p>
      </div>
      
      {post.image && (
        <div className="w-full">
          <img src={post.image} alt="Post content" className="w-full max-h-96 object-cover" />
        </div>
      )}

      {/* Stats */}
      <div className="px-4 py-2 flex items-center justify-between text-facebook-secondary text-sm">
        <div className="flex items-center gap-1">
          <div className="bg-facebook-blue rounded-full p-1">
            <ThumbsUp className="w-3 h-3 text-white" />
          </div>
          <span>{likeCount}</span>
        </div>
        <div className="flex gap-3">
          <span className="hover:underline cursor-pointer">{post._count.comments} comments</span>
          <span className="hover:underline cursor-pointer">0 shares</span>
        </div>
      </div>

      {/* Actions */}
      <div className="px-4 py-1 border-t border-b flex items-center justify-between">
        <button
          onClick={handleLike}
          className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg hover:bg-gray-100 transition font-medium ${isLiked ? 'text-facebook-blue' : 'text-gray-500'}`}
        >
          <ThumbsUp className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
          Like
        </button>
        <button
          onClick={() => setShowComments(!showComments)}
          className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg hover:bg-gray-100 transition font-medium text-gray-500"
        >
          <MessageCircle className="w-5 h-5" />
          Comment
        </button>
        <button className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg hover:bg-gray-100 transition font-medium text-gray-500">
          <Share2 className="w-5 h-5" />
          Share
        </button>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="p-4 bg-gray-50">
          {post.comments.map((comment) => (
            <div key={comment.id} className="flex gap-2 mb-3">
              <div className="w-8 h-8 rounded-full bg-gray-300 flex-shrink-0 overflow-hidden">
                {comment.author.avatar ? (
                  <img src={comment.author.avatar} alt={comment.author.firstName} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-facebook-blue text-white flex items-center justify-center text-xs font-bold">
                    {comment.author.firstName[0]}
                  </div>
                )}
              </div>
              <div className="bg-gray-200 rounded-2xl px-3 py-2 flex-1">
                <Link to={`/profile/${comment.author.id}`}>
                  <p className="font-semibold text-sm hover:underline cursor-pointer">
                    {comment.author.firstName} {comment.author.lastName}
                  </p>
                </Link>
                <p className="text-sm text-gray-700">{comment.content}</p>
              </div>
            </div>
          ))}
          
          <form onSubmit={handleComment} className="flex gap-2 mt-3">
            <div className="w-8 h-8 rounded-full bg-gray-300 flex-shrink-0 overflow-hidden">
              {user?.avatar ? (
                <img src={user.avatar} alt={user.firstName} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-facebook-blue text-white flex items-center justify-center text-xs font-bold">
                  {user?.firstName[0]}
                </div>
              )}
            </div>
            <input
              type="text"
              placeholder="Write a comment..."
              className="bg-gray-200 rounded-full px-4 py-2 flex-1 outline-none text-sm"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
            />
          </form>
        </div>
      )}
    </div>
  );
};