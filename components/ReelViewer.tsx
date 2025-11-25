import React, { useRef, useEffect, useState } from 'react';
import { Heart, MessageCircle, Send, MoreHorizontal, Music2, Zap, Gift } from 'lucide-react';
import { Post } from '../types';
import PaymentModal from './PaymentModal';

interface ReelViewerProps {
  reels: Post[];
  onSendGift?: (amount: number, recipientId: string) => void;
}

const ReelViewer: React.FC<ReelViewerProps> = ({ reels, onSendGift }) => {
  return (
    <div className="h-[calc(100vh-56px)] md:h-screen w-full md:w-[400px] mx-auto overflow-y-scroll snap-y snap-mandatory hide-scrollbar">
      {reels.map((reel) => (
        <ReelItem key={reel.id} reel={reel} onSendGift={onSendGift} />
      ))}
    </div>
  );
};

const ReelItem: React.FC<{ reel: Post; onSendGift?: (amount: number, id: string) => void }> = ({ reel, onSendGift }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isLiked, setIsLiked] = useState(false);
  const [isGiftModalOpen, setIsGiftModalOpen] = useState(false);
  
  // Monetization check
  const canReceiveGifts = reel.user.verificationType === 'blue' || reel.user.verificationType === 'golden';

  // Auto play/pause based on intersection
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            videoRef.current?.play();
          } else {
            videoRef.current?.pause();
            if (videoRef.current) videoRef.current.currentTime = 0;
          }
        });
      },
      { threshold: 0.6 }
    );

    if (videoRef.current) observer.observe(videoRef.current);
    return () => observer.disconnect();
  }, []);

  const togglePlay = () => {
    if (videoRef.current?.paused) {
      videoRef.current.play();
    } else {
      videoRef.current?.pause();
    }
  };

  const handleGiftSuccess = (amount: number) => {
    if (onSendGift) {
      onSendGift(amount, reel.user.id);
    }
  };

  return (
    <div className="relative w-full h-full snap-start bg-zinc-900 border-b border-gray-800 md:border-none">
      {/* Video */}
      <video
        ref={videoRef}
        src={reel.url}
        className="w-full h-full object-cover cursor-pointer"
        loop
        playsInline
        onClick={togglePlay}
      />

      {/* Overlay Info */}
      <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-black/80 to-transparent pt-20">
        <div className="flex items-center space-x-3 mb-3">
          <img src={reel.user.avatar} alt={reel.user.username} className="w-8 h-8 rounded-full border border-white" />
          <div className="flex items-center gap-1">
            <span className="text-white font-semibold drop-shadow-md">{reel.user.username}</span>
            {reel.user.verificationType === 'blue' && (
              <Zap size={14} className="text-blue-500 fill-blue-500 ml-0.5" />
            )}
            {reel.user.verificationType === 'golden' && (
              <Zap size={14} className="text-yellow-400 fill-yellow-400 ml-0.5" />
            )}
            {reel.user.verificationType === 'black' && (
              <Zap size={14} className="text-white fill-black ml-0.5" />
            )}
          </div>
          <button className="border border-white/40 text-white text-xs px-2 py-1 rounded bg-transparent backdrop-blur-sm">Follow</button>
        </div>
        <p className="text-white text-sm mb-3 drop-shadow-md">{reel.caption}</p>
        
        <div className="flex items-center space-x-2 text-white/90 text-xs mb-4">
           <Music2 size={14} />
           <div className="overflow-hidden w-32">
             <p className="animate-pulse">Original Audio - {reel.user.username}</p>
           </div>
        </div>
      </div>

      {/* Right Actions */}
      <div className="absolute bottom-4 right-4 flex flex-col items-center space-y-6">
        <div className="flex flex-col items-center space-y-1">
           <button onClick={() => setIsLiked(!isLiked)} className="transition-transform active:scale-90">
             <Heart size={28} className={isLiked ? "text-red-500 fill-red-500" : "text-white"} />
           </button>
           <span className="text-white text-xs font-medium">{isLiked ? reel.likes + 1 : reel.likes}</span>
        </div>
        
        <div className="flex flex-col items-center space-y-1">
          <button>
            <MessageCircle size={28} className="text-white" />
          </button>
          <span className="text-white text-xs font-medium">1.2k</span>
        </div>

        <button>
           <Send size={28} className="text-white transform -rotate-12" />
        </button>

        {canReceiveGifts && (
          <div className="flex flex-col items-center space-y-1">
            <button onClick={() => setIsGiftModalOpen(true)}>
               <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-yellow-500 to-pink-500 flex items-center justify-center animate-bounce">
                  <Gift size={20} className="text-white fill-white" />
               </div>
            </button>
            <span className="text-white text-[10px] font-bold">Gift</span>
          </div>
        )}

        <button>
           <MoreHorizontal size={28} className="text-white" />
        </button>
        
        <div className="w-8 h-8 rounded border-2 border-white overflow-hidden">
           <img src={reel.user.avatar} className="w-full h-full object-cover" />
        </div>
      </div>

      {isGiftModalOpen && (
        <PaymentModal 
          recipient={reel.user}
          onClose={() => setIsGiftModalOpen(false)}
          onSuccess={handleGiftSuccess}
        />
      )}
    </div>
  );
};

export default ReelViewer;