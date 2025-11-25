import React, { useState, useEffect } from 'react';
import { User, Post } from '../types';
import { Grid, Clapperboard, UserSquare, Heart, MessageCircle, BarChart3, Briefcase, Zap, ShieldAlert, Lock, CheckCircle2, Edit2, Trophy, X, Share2, Copy, Check, Wallet, ArrowUpRight, Banknote } from 'lucide-react';

interface ProfileProps {
  user: User;
  posts: Post[];
  isCurrentUser?: boolean;
  onUpdateUser?: (user: User) => void;
  onRequestVerification?: (type: 'black' | 'blue' | 'golden') => void;
}

const Profile: React.FC<ProfileProps> = ({ user, posts, isCurrentUser, onUpdateUser, onRequestVerification }) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'posts' | 'reels' | 'tagged' | 'money'>('posts');
  
  // Form State
  const [editName, setEditName] = useState(user.name);
  const [editUsername, setEditUsername] = useState(user.username);
  const [editBio, setEditBio] = useState(user.bio || '');

  // Sync local state if user prop changes
  useEffect(() => {
    setEditName(user.name);
    setEditUsername(user.username);
    setEditBio(user.bio || '');
  }, [user]);

  const userPosts = posts.filter(p => p.user.id === user.id || (isCurrentUser && user.id === 'u_me'));

  // Logic for Verification Eligibility
  const videoPosts = userPosts.filter(p => p.type === 'video');
  const maxReelViews = videoPosts.length > 0 ? Math.max(...videoPosts.map(p => p.views || 0)) : 0;
  
  const hasTenMillionFollowers = user.followers >= 10000000;
  const hasOneMillionReelViews = maxReelViews >= 1000000;
  
  const canClaimBlue = hasTenMillionFollowers && hasOneMillionReelViews;

  const celebrityKeywords = [
    'Actor', 'Actress', 
    'Musician', 'Singer', 'Rapper', 'Band', 'Artist', 
    'Athlete', 'Sports', 'Player', 'Footballer', 'Cricketer', 'Basketball', 'Tennis', 'Olympian',
    'Celebrity', 'Public Figure'
  ];
  
  const isCelebrity = user.category ? celebrityKeywords.some(k => user.category!.toLowerCase().includes(k.toLowerCase())) : false;
  const canClaimGolden = isCelebrity;

  const isMonetized = user.verificationType === 'blue' || user.verificationType === 'golden';

  const toggleAccountType = () => {
    if (onUpdateUser && isCurrentUser) {
      onUpdateUser({
        ...user,
        accountType: user.accountType === 'personal' ? 'professional' : 'personal',
        category: user.accountType === 'personal' ? 'Digital Creator' : undefined
      });
    }
  };

  const handleEditCategory = () => {
    if (onUpdateUser && isCurrentUser) {
      const newCategory = prompt("Enter your professional category (e.g., Musician, Athlete, Actor):", user.category || "");
      if (newCategory) {
        onUpdateUser({ ...user, category: newCategory });
      }
    }
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (onUpdateUser) {
      onUpdateUser({
        ...user,
        name: editName,
        username: editUsername,
        bio: editBio
      });
      setIsEditModalOpen(false);
    }
  };

  const handleShareProfile = async () => {
    const profileUrl = `https://instantspark.app/u/${user.username}`; // Mock URL
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${user.name} on Instant Spark`,
          text: `Check out ${user.name}'s profile!`,
          url: profileUrl,
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      // Fallback for desktop
      navigator.clipboard.writeText(profileUrl);
      alert(`Profile link copied to clipboard: ${profileUrl}`);
    }
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  return (
    <div className="max-w-4xl mx-auto pt-4 md:pt-8 px-4 pb-20 md:pb-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-center md:items-start md:space-x-12 mb-8">
        <div className="w-24 h-24 md:w-40 md:h-40 rounded-full bg-gradient-to-tr from-yellow-400 to-fuchsia-600 p-[2px] mb-4 md:mb-0 shrink-0">
           <div className="w-full h-full rounded-full border-4 border-black overflow-hidden">
             <img src={user.avatar} alt={user.username} className="w-full h-full object-cover" />
           </div>
        </div>

        <div className="flex-1 text-center md:text-left">
          <div className="flex flex-col md:flex-row items-center md:space-x-6 mb-4">
            <h2 className="text-xl md:text-2xl font-light text-white mb-3 md:mb-0 flex items-center gap-2">
              {user.username}
              {/* Verification Badges */}
              {user.verificationType === 'golden' && (
                <Zap size={20} className="text-yellow-400 fill-yellow-400" />
              )}
              {user.verificationType === 'blue' && (
                <Zap size={20} className="text-blue-500 fill-blue-500" />
              )}
              {user.verificationType === 'black' && (
                <Zap size={20} className="text-white fill-black" />
              )}
              
              {/* Account Type Badge */}
              {user.accountType === 'professional' && (
                 <span className="bg-gray-800 text-gray-300 text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider font-semibold border border-gray-700">
                   Professional
                 </span>
              )}
            </h2>
            <div className="flex flex-wrap justify-center gap-2">
              {isCurrentUser && (
                <button 
                  onClick={() => setIsEditModalOpen(true)}
                  className="bg-gray-800 text-white px-4 py-1.5 rounded-lg text-sm font-semibold hover:bg-gray-700 transition-colors"
                >
                  Edit Profile
                </button>
              )}
              <button 
                onClick={handleShareProfile}
                className="bg-gray-800 text-white px-4 py-1.5 rounded-lg text-sm font-semibold hover:bg-gray-700 transition-colors"
              >
                Share Profile
              </button>
              
              {isCurrentUser && (
                <button 
                  onClick={toggleAccountType}
                  className="bg-blue-600/20 text-blue-400 px-4 py-1.5 rounded-lg text-sm font-semibold hover:bg-blue-600/30 transition-colors"
                >
                  Switch to {user.accountType === 'personal' ? 'Pro' : 'Personal'}
                </button>
              )}
            </div>
          </div>

          <div className="flex justify-center md:justify-start space-x-8 md:space-x-10 mb-4 text-white">
             <div className="text-center md:text-left"><span className="font-bold">{userPosts.length}</span> posts</div>
             <div className="text-center md:text-left"><span className="font-bold">{formatNumber(user.followers)}</span> followers</div>
             <div className="text-center md:text-left"><span className="font-bold">182</span> following</div>
          </div>

          <div className="text-white text-sm">
            <div className="font-bold flex items-center justify-center md:justify-start gap-2">
              {user.name}
              {user.accountType === 'professional' && user.category && (
                <>
                  <span className="text-gray-400 font-normal text-xs">• {user.category}</span>
                  {isCurrentUser && (
                    <button onClick={handleEditCategory} className="text-gray-500 hover:text-white">
                      <Edit2 size={12} />
                    </button>
                  )}
                </>
              )}
            </div>
            <div className="whitespace-pre-line">{user.bio}</div>
            <a href="#" className="text-blue-200 hover:underline">www.spark.app/{user.username}</a>
          </div>

          {/* Verification Section */}
          {isCurrentUser && user.verificationType === 'none' && user.verificationStatus !== 'pending' && (
             <div className="mt-6 space-y-4">
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">Get Verified</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  
                  {/* Black Spark Option (Paid) */}
                  <div className="bg-zinc-900 border border-gray-800 p-4 rounded-xl flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="bg-white rounded-full p-1.5">
                          <Zap size={24} className="text-black fill-black" />
                        </div>
                        <div>
                          <div className="font-bold text-white text-sm">Black Spark</div>
                          <div className="text-xs text-gray-400">Paid Subscription</div>
                          <div className="text-xs text-green-400 font-bold">$14.99 / mo</div>
                        </div>
                    </div>
                    <button 
                      onClick={() => onRequestVerification && onRequestVerification('black')}
                      className="bg-white text-black text-xs font-bold px-3 py-2 rounded-lg hover:bg-gray-200"
                    >
                      Buy Now
                    </button>
                  </div>

                  {/* Golden Spark Option (Celebrity) */}
                  <div className="bg-gradient-to-br from-yellow-900/20 to-black border border-yellow-500/30 p-4 rounded-xl relative overflow-hidden">
                     <div className="flex items-center justify-between mb-2 relative z-10">
                        <div className="flex items-center gap-3">
                            <div className="bg-black rounded-full p-1">
                               <Zap size={32} className="text-yellow-400 fill-yellow-400 drop-shadow-[0_0_10px_rgba(250,204,21,0.5)]" />
                            </div>
                            <div>
                              <div className="font-bold text-yellow-400 text-sm">Golden Spark</div>
                              <div className="text-xs text-gray-400">Celebrity Exclusive</div>
                            </div>
                        </div>
                        <button 
                          disabled={!canClaimGolden}
                          onClick={() => onRequestVerification && onRequestVerification('golden')}
                          className={`text-xs font-bold px-3 py-2 rounded-lg transition-colors ${
                            canClaimGolden 
                              ? 'bg-yellow-500 text-black hover:bg-yellow-400' 
                              : 'bg-gray-800 text-gray-500 cursor-not-allowed'
                          }`}
                        >
                          {canClaimGolden ? 'Claim Gold' : 'Locked'}
                        </button>
                     </div>
                     {/* Golden Requirements */}
                     <div className="space-y-1 mt-2 relative z-10">
                        <div className={`text-[10px] flex items-center gap-2 ${isCelebrity ? 'text-yellow-400' : 'text-gray-500'}`}>
                           {isCelebrity ? <CheckCircle2 size={12}/> : <Trophy size={12}/>}
                           <span>Category: {user.category || 'N/A'} {isCelebrity ? '(Eligible)' : ''}</span>
                        </div>
                        <div className="text-[10px] text-gray-500 italic">For Actors, Athletes, Musicians, etc.</div>
                     </div>
                  </div>

                  {/* Blue Spark Option (Stats) */}
                  <div className="bg-zinc-900 border border-gray-800 p-4 rounded-xl md:col-span-2">
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                            <Zap size={32} className="text-blue-500 fill-blue-500" />
                            <div>
                              <div className="font-bold text-white text-sm">Blue Spark</div>
                              <div className="text-xs text-gray-400">Creators & Influencers</div>
                            </div>
                        </div>
                        <button 
                          disabled={!canClaimBlue}
                          onClick={() => onRequestVerification && onRequestVerification('blue')}
                          className={`text-xs font-bold px-3 py-2 rounded-lg transition-colors ${
                            canClaimBlue 
                              ? 'bg-blue-500 text-white hover:bg-blue-600' 
                              : 'bg-gray-800 text-gray-500 cursor-not-allowed'
                          }`}
                        >
                          {canClaimBlue ? 'Claim Blue' : 'Locked'}
                        </button>
                    </div>
                    {/* Blue Requirements */}
                    <div className="space-y-1 mt-2">
                        <div className={`text-[10px] flex items-center gap-2 ${hasTenMillionFollowers ? 'text-green-400' : 'text-gray-500'}`}>
                          {hasTenMillionFollowers ? <CheckCircle2 size={12}/> : <Lock size={12}/>}
                          <span>10M Followers ({formatNumber(user.followers)}/10M)</span>
                        </div>
                        <div className={`text-[10px] flex items-center gap-2 ${hasOneMillionReelViews ? 'text-green-400' : 'text-gray-500'}`}>
                          {hasOneMillionReelViews ? <CheckCircle2 size={12}/> : <Lock size={12}/>}
                          <span>1M Views on Reels ({formatNumber(maxReelViews)}/1M)</span>
                        </div>
                    </div>
                  </div>

                </div>
             </div>
          )}

          {isCurrentUser && user.verificationStatus === 'pending' && (
             <div className="mt-6 bg-yellow-500/10 border border-yellow-500/30 p-4 rounded-xl flex items-center gap-3 text-yellow-500">
                <ShieldAlert size={24} />
                <div className="text-sm">
                   <span className="font-bold">Verification Pending.</span> Your request for a Spark is currently under review by the Admin.
                </div>
             </div>
          )}

          {/* Professional Dashboard Teaser */}
          {user.accountType === 'professional' && !isMonetized && (
            <div className="mt-4 p-3 bg-zinc-900 rounded-lg border border-gray-800 flex items-center justify-between cursor-pointer hover:bg-zinc-800 transition-colors">
              <div className="flex flex-col text-left">
                <span className="text-sm font-semibold text-white">Professional Dashboard</span>
                <span className="text-xs text-gray-400">2.4k accounts reached in the last 30 days.</span>
              </div>
              <div className="text-blue-500 text-xs font-semibold">View tools</div>
            </div>
          )}
        </div>
      </div>

      {/* Highlights (Mock) */}
      <div className="flex space-x-4 overflow-x-auto pb-4 mb-8 hide-scrollbar">
        {[1,2,3,4].map(i => (
           <div key={i} className="flex flex-col items-center space-y-1 shrink-0">
              <div className="w-16 h-16 rounded-full bg-gray-800 border border-gray-700 p-1">
                 <div className="w-full h-full rounded-full bg-gray-900 flex items-center justify-center">
                    {user.accountType === 'professional' && i === 1 ? (
                      <Briefcase size={20} className="text-gray-600" />
                    ) : (
                      <Heart size={20} className="text-gray-600" />
                    )}
                 </div>
              </div>
              <span className="text-xs text-white">Highlight</span>
           </div>
        ))}
      </div>

      {/* Tab Nav */}
      <div className="border-t border-gray-800 flex justify-center">
         <button 
            onClick={() => setActiveTab('posts')}
            className={`flex items-center space-x-2 p-3 text-xs font-semibold tracking-widest uppercase -mt-[1px] ${activeTab === 'posts' ? 'border-t border-white text-white' : 'text-gray-500 hover:text-white'}`}
         >
            <Grid size={12} />
            <span>Posts</span>
         </button>
         <button 
            onClick={() => setActiveTab('reels')}
            className={`flex items-center space-x-2 p-3 text-xs font-semibold tracking-widest uppercase -mt-[1px] ${activeTab === 'reels' ? 'border-t border-white text-white' : 'text-gray-500 hover:text-white'}`}
         >
            <Clapperboard size={12} />
            <span>Reels</span>
         </button>
         {isCurrentUser && isMonetized && (
           <button 
              onClick={() => setActiveTab('money')}
              className={`flex items-center space-x-2 p-3 text-xs font-semibold tracking-widest uppercase -mt-[1px] ${activeTab === 'money' ? 'border-t border-white text-white' : 'text-gray-500 hover:text-white'}`}
           >
              <Wallet size={12} />
              <span>Earnings</span>
           </button>
         )}
      </div>

      {/* Content Grid */}
      {activeTab === 'posts' && (
        <div className="grid grid-cols-3 gap-1">
          {userPosts.map(post => (
            <div key={post.id} className="relative aspect-square group cursor-pointer bg-gray-900">
              {post.type === 'video' ? (
                  <video src={post.url} className="w-full h-full object-cover" />
              ) : (
                  <img src={post.url} alt="Post" className="w-full h-full object-cover" />
              )}
              {post.type === 'video' && (
                <div className="absolute top-2 right-2">
                  <Clapperboard size={16} className="text-white drop-shadow-md" />
                </div>
              )}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center space-y-2 text-white font-bold">
                  <div className="flex items-center space-x-6">
                    <div className="flex items-center space-x-1">
                      <Heart size={20} fill="white" />
                      <span>{post.likes}</span>
                    </div>
                  </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {activeTab === 'reels' && (
        <div className="grid grid-cols-3 gap-1">
          {videoPosts.map(post => (
            <div key={post.id} className="relative aspect-[9/16] group cursor-pointer bg-gray-900">
               <video src={post.url} className="w-full h-full object-cover" />
               <div className="absolute bottom-2 left-2 flex items-center gap-1 text-white text-xs font-bold drop-shadow-md">
                  <Heart size={12} fill="white" />
                  <span>{post.likes}</span>
               </div>
            </div>
          ))}
          {videoPosts.length === 0 && (
             <div className="col-span-3 py-12 text-center text-gray-500">
                <Clapperboard size={32} className="mx-auto mb-2" />
                <p>No reels yet.</p>
             </div>
          )}
        </div>
      )}

      {/* Earnings Dashboard Tab */}
      {activeTab === 'money' && isCurrentUser && isMonetized && (
         <div className="bg-zinc-900 rounded-xl p-6 border border-gray-800 animate-fade-in">
             <div className="flex items-center justify-between mb-8">
               <div>
                  <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                    <Zap className="text-yellow-400 fill-yellow-400" />
                    Creator Earnings
                  </h3>
                  <p className="text-gray-400 text-sm">Monetization via Spark Gifts</p>
               </div>
               <div className="bg-green-500/10 text-green-400 px-3 py-1 rounded-full text-xs font-bold border border-green-500/20">
                  Active
               </div>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {/* Wallet Card */}
                <div className="bg-black border border-gray-800 rounded-xl p-6 relative overflow-hidden">
                   <div className="absolute top-0 right-0 p-4 opacity-10">
                      <Wallet size={100} className="text-white" />
                   </div>
                   <div className="relative z-10">
                      <span className="text-gray-400 text-sm font-medium uppercase tracking-wider">Available Balance</span>
                      <div className="text-4xl font-bold text-white mt-1 mb-1">₹{user.walletBalance.toLocaleString()}</div>
                      <div className="text-xs text-gray-500 mb-6">Ready to withdraw</div>
                      
                      <button 
                        onClick={() => alert("Withdrawal processed! Money will reach your bank in 2-3 business days.")}
                        className="bg-white text-black font-bold px-6 py-2 rounded-lg hover:bg-gray-200 flex items-center gap-2"
                      >
                         <Banknote size={16} />
                         Withdraw Funds
                      </button>
                   </div>
                </div>

                {/* Stats Card */}
                <div className="bg-black border border-gray-800 rounded-xl p-6">
                   <div className="space-y-4">
                      <div className="flex justify-between items-center border-b border-gray-800 pb-4">
                         <span className="text-gray-400 text-sm">Lifetime Earnings</span>
                         <span className="text-white font-bold">₹{user.totalEarnings.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center border-b border-gray-800 pb-4">
                         <span className="text-gray-400 text-sm">Revenue Share</span>
                         <div className="text-right">
                            <span className="text-green-400 font-bold block">75% You</span>
                            <span className="text-gray-600 text-xs block">25% Platform Fee</span>
                         </div>
                      </div>
                      <div className="flex justify-between items-center">
                         <span className="text-gray-400 text-sm">Next Payout</span>
                         <span className="text-white font-bold">Aug 15, 2025</span>
                      </div>
                   </div>
                </div>
             </div>
             
             <div className="bg-blue-900/20 border border-blue-500/30 p-4 rounded-lg flex items-start gap-3">
                <div className="bg-blue-500/20 p-2 rounded-lg text-blue-400">
                   <ArrowUpRight size={20} />
                </div>
                <div>
                   <h4 className="font-bold text-white text-sm">Boost your earnings</h4>
                   <p className="text-gray-400 text-xs mt-1">Post more Reels to increase visibility. Verified creators get 3x more gifts on trending content.</p>
                </div>
             </div>
         </div>
      )}

      {/* Edit Profile Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black/80 z-[100] flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-zinc-900 border border-gray-800 w-full max-w-md rounded-xl overflow-hidden">
             <div className="p-4 border-b border-gray-800 flex items-center justify-between">
                <h3 className="font-semibold text-white">Edit Profile</h3>
                <button onClick={() => setIsEditModalOpen(false)} className="text-gray-400 hover:text-white">
                   <X size={24} />
                </button>
             </div>
             <form onSubmit={handleSaveProfile} className="p-6 space-y-4">
                <div>
                   <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Name</label>
                   <input 
                     type="text" 
                     value={editName} 
                     onChange={(e) => setEditName(e.target.value)}
                     className="w-full bg-black border border-gray-800 rounded-lg p-3 text-white outline-none focus:border-gray-600"
                   />
                </div>
                <div>
                   <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Username</label>
                   <input 
                     type="text" 
                     value={editUsername} 
                     onChange={(e) => setEditUsername(e.target.value)}
                     className="w-full bg-black border border-gray-800 rounded-lg p-3 text-white outline-none focus:border-gray-600"
                   />
                </div>
                <div>
                   <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Bio</label>
                   <textarea 
                     value={editBio} 
                     onChange={(e) => setEditBio(e.target.value)}
                     rows={3}
                     className="w-full bg-black border border-gray-800 rounded-lg p-3 text-white outline-none focus:border-gray-600 resize-none"
                   />
                </div>
                <div className="pt-4">
                   <button type="submit" className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 rounded-lg transition-colors">
                      Done
                   </button>
                </div>
             </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default Profile;