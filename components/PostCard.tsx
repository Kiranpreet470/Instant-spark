import React, { useState } from 'react';
import { Heart, MessageCircle, Send, Bookmark, MoreHorizontal, Zap, Gift } from 'lucide-react';
import { Post } from '../types';
import PaymentModal from './PaymentModal';

interface PostCardProps {
  post: Post;
  onSendGift?: (amount: number, recipientId: string) => void;
}

const PostCard: React.FC<PostCardProps> = ({ post, onSendGift }) => {
  const [liked, setLiked] = useState(post.isLiked);
  const [likesCount, setLikesCount] = useState(post.likes);
  const [isGiftModalOpen, setIsGiftModalOpen] = useState(false);

  // Check if eligible for monetization (Blue or Golden Spark)
  const canReceiveGifts = post.user.verificationType === 'blue' || post.user.verificationType === 'golden';

  const toggleLike = () => {
    if (liked) {
      setLikesCount(p => p - 1);
    } else {
      setLikesCount(p => p + 1);
    }
    setLiked(!liked);
  };

  const handleGiftSuccess = (amount: number) => {
    if (onSendGift) {
      onSendGift(amount, post.user.id);
    }
    // Could add a toast notification here
  };

  return (
    <>
      <div className="w-full max-w-[470px] mx-auto border-b border-gray-800 pb-4 mb-4 sm:border sm:rounded-lg sm:bg-black sm:border-gray-800">
        {/* Header */}
        <div className="flex items-center justify-between p-3">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-yellow-400 to-fuchsia-600 p-[2px]">
              <div className="w-full h-full rounded-full border-2 border-black overflow-hidden">
                <img src={post.user.avatar} alt={post.user.username} className="w-full h-full object-cover" />
              </div>
            </div>
            <div className="flex items-center">
              <span className="text-sm font-semibold text-white mr-1">{post.user.username}</span>
              {post.user.verificationType === 'blue' && (
                <Zap size={14} className="text-blue-500 fill-blue-500 ml-0.5" />
              )}
              {post.user.verificationType === 'golden' && (
                <Zap size={14} className="text-yellow-400 fill-yellow-400 ml-0.5" />
              )}
              {post.user.verificationType === 'black' && (
                <Zap size={14} className="text-white fill-black ml-0.5" />
              )}
            </div>
            <span className="text-xs text-gray-500">• {new Date(post.timestamp).getHours()}h</span>
          </div>
          <button className="text-white hover:opacity-50">
            <MoreHorizontal size={20} />
          </button>
        </div>

        {/* Media */}
        <div className="w-full bg-gray-900 aspect-square overflow-hidden flex items-center justify-center relative group">
          {post.type === 'video' ? (
            <video 
              src={post.url} 
              className="w-full h-full object-cover" 
              controls 
              playsInline
              muted
            />
          ) : (
            <img src={post.url} alt="Post content" className="w-full h-full object-cover" />
          )}
          
          {/* Quick Gift Overlay on Hover for Desktop */}
          {canReceiveGifts && (
             <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  onClick={() => setIsGiftModalOpen(true)}
                  className="bg-black/50 hover:bg-black/70 text-white rounded-full p-2 backdrop-blur-md flex items-center gap-1 border border-white/20"
                >
                   <Gift size={16} className="text-pink-500 fill-pink-500" />
                   <span className="text-xs font-bold pr-1">Gift</span>
                </button>
             </div>
          )}
        </div>

        {/* Actions */}
        <div className="p-3">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-4">
              <button onClick={toggleLike} className={`transition-transform active:scale-90 ${liked ? 'text-red-500' : 'text-white'}`}>
                <Heart size={26} fill={liked ? "currentColor" : "none"} />
              </button>
              <button className="text-white hover:opacity-70 transform -rotate-90">
                <MessageCircle size={26} />
              </button>
              <button className="text-white hover:opacity-70">
                <Send size={26} />
              </button>
            </div>
            <div className="flex items-center gap-4">
              {/* Mobile Gift Button */}
              {canReceiveGifts && (
                 <button 
                  onClick={() => setIsGiftModalOpen(true)}
                  className="text-white hover:opacity-70 bg-gray-800 p-1.5 rounded-full"
                 >
                   <Gift size={20} className="text-pink-400" />
                 </button>
              )}
              <button className="text-white hover:opacity-70">
                <Bookmark size={26} />
              </button>
            </div>
          </div>

          {/* Likes */}
          <div className="mb-2">
            <span className="text-sm font-semibold text-white">{likesCount.toLocaleString()} likes</span>
          </div>

          {/* Caption */}
          <div className="text-sm text-gray-100 mb-1">
            <span className="font-semibold mr-2">{post.user.username}</span>
            {post.caption}
          </div>
          
          {/* Comments Count */}
          <button className="text-gray-500 text-sm mt-1">View all {10 + post.comments.length} comments</button>
          
          {/* Add Comment */}
          <div className="mt-2 flex items-center space-x-2">
            <input type="text" placeholder="Add a comment..." className="bg-transparent text-sm text-white placeholder-gray-500 flex-1 outline-none" />
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      {isGiftModalOpen && (
        <PaymentModal 
          recipient={post.user}
          onClose={() => setIsGiftModalOpen(false)}
          onSuccess={handleGiftSuccess}
        />
      )}
    </>
  );
};

export default PostCard;