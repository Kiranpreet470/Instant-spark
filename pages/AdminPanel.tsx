import React, { useState } from 'react';
import { User, Post } from '../types';
import { Users, FileText, Activity, Trash2, Search, TrendingUp, ShieldCheck, Zap, Check, X, IndianRupee } from 'lucide-react';

interface AdminPanelProps {
  users: User[];
  posts: Post[];
  adminUser: User;
  onDeleteUser: (userId: string) => void;
  onDeletePost: (postId: string) => void;
  onApproveVerification: (userId: string, type: 'black' | 'blue' | 'golden') => void;
  onRejectVerification: (userId: string) => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ 
  users, 
  posts, 
  adminUser,
  onDeleteUser, 
  onDeletePost,
  onApproveVerification,
  onRejectVerification
}) => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'users' | 'posts' | 'verifications'>('dashboard');
  const [searchTerm, setSearchTerm] = useState('');

  // Calculations for dashboard
  const totalLikes = posts.reduce((acc, post) => acc + post.likes, 0);
  const totalComments = posts.reduce((acc, post) => acc + post.comments.length, 0);
  const pendingVerifications = users.filter(u => u.verificationStatus === 'pending');

  const filteredUsers = users.filter(u =>
    u.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredPosts = posts.filter(p =>
    p.caption.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.user.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto min-h-screen pb-24">
      <div className="flex items-center space-x-3 mb-8">
        <div className="p-3 bg-blue-600 rounded-xl">
           <ShieldCheck size={32} className="text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
          <p className="text-gray-400">Manage your community, content, and revenue</p>
        </div>
      </div>

      {/* Stats Grid */}
      {activeTab === 'dashboard' && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
          <div className="bg-zinc-900 border border-gray-800 p-6 rounded-2xl">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-purple-500/20 rounded-lg">
                <Users className="text-purple-500" size={24} />
              </div>
              <span className="text-xs font-semibold text-green-400 bg-green-400/10 px-2 py-1 rounded">+12%</span>
            </div>
            <h3 className="text-4xl font-bold text-white mb-1">{users.length}</h3>
            <p className="text-gray-400 text-sm">Total Active Users</p>
          </div>

          <div className="bg-zinc-900 border border-gray-800 p-6 rounded-2xl">
             <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-green-500/20 rounded-lg">
                <IndianRupee className="text-green-500" size={24} />
              </div>
              <span className="text-xs font-semibold text-green-400 bg-green-400/10 px-2 py-1 rounded">25% Cut</span>
            </div>
            <h3 className="text-4xl font-bold text-white mb-1">₹{adminUser.walletBalance.toLocaleString()}</h3>
            <p className="text-gray-400 text-sm">Platform Revenue</p>
          </div>

          <div className="bg-zinc-900 border border-gray-800 p-6 rounded-2xl">
             <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-orange-500/20 rounded-lg">
                <Activity className="text-orange-500" size={24} />
              </div>
              <span className="text-xs font-semibold text-green-400 bg-green-400/10 px-2 py-1 rounded">+24%</span>
            </div>
            <h3 className="text-4xl font-bold text-white mb-1">{((totalLikes + totalComments) / 1000).toFixed(1)}k</h3>
            <p className="text-gray-400 text-sm">Total Interactions</p>
          </div>

          <div className="bg-zinc-900 border border-gray-800 p-6 rounded-2xl">
             <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-blue-500/20 rounded-lg">
                <Zap className="text-blue-500 fill-blue-500" size={24} />
              </div>
              {pendingVerifications.length > 0 && (
                <span className="text-xs font-semibold text-orange-400 bg-orange-400/10 px-2 py-1 rounded">Action Needed</span>
              )}
            </div>
            <h3 className="text-4xl font-bold text-white mb-1">{pendingVerifications.length}</h3>
            <p className="text-gray-400 text-sm">Pending Verifications</p>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex space-x-1 bg-zinc-900 p-1 rounded-xl w-fit mb-8 border border-gray-800 overflow-x-auto">
        {(['dashboard', 'users', 'posts', 'verifications'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => { setActiveTab(tab); setSearchTerm(''); }}
            className={`px-6 py-2 rounded-lg text-sm font-semibold capitalize transition-all whitespace-nowrap ${
              activeTab === tab ? 'bg-zinc-800 text-white shadow-sm' : 'text-gray-400 hover:text-white'
            }`}
          >
            {tab === 'verifications' && pendingVerifications.length > 0 ? (
               <div className="flex items-center gap-2">
                 <span>Verifications</span>
                 <span className="bg-red-500 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full">{pendingVerifications.length}</span>
               </div>
            ) : tab}
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div className="bg-zinc-900 border border-gray-800 rounded-2xl overflow-hidden min-h-[400px]">
        
        {/* Toolbar */}
        {activeTab !== 'dashboard' && activeTab !== 'verifications' && (
          <div className="p-4 border-b border-gray-800 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white capitalize">{activeTab} Management</h2>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
              <input 
                type="text" 
                placeholder={`Search ${activeTab}...`} 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-black border border-gray-800 rounded-lg pl-10 pr-4 py-2 text-sm text-white focus:border-blue-500 outline-none w-64"
              />
            </div>
          </div>
        )}

        {activeTab === 'dashboard' && (
           <div className="p-8 text-center text-gray-500">
              <TrendingUp size={48} className="mx-auto mb-4 opacity-50" />
              <h3 className="text-xl font-medium text-white mb-2">Platform Activity</h3>
              <p>Select tabs above to manage content.</p>
           </div>
        )}

        {activeTab === 'users' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-black/50 text-gray-400 text-xs uppercase tracking-wider">
                <tr>
                  <th className="p-4">User</th>
                  <th className="p-4">Followers</th>
                  <th className="p-4">Wallet</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {filteredUsers.map(user => (
                  <tr key={user.id} className="hover:bg-black/20 transition-colors">
                    <td className="p-4 flex items-center space-x-3">
                      <img src={user.avatar} alt={user.username} className="w-10 h-10 rounded-full object-cover" />
                      <div>
                        <span className="font-medium text-white block">{user.name}</span>
                        <span className="text-xs text-gray-500">@{user.username}</span>
                      </div>
                    </td>
                    <td className="p-4 text-gray-300">{formatNumber(user.followers)}</td>
                    <td className="p-4 text-gray-300">₹{user.walletBalance.toLocaleString()}</td>
                    <td className="p-4">
                      {user.verificationType !== 'none' ? (
                        <div className={`flex items-center gap-1.5 px-2 py-1 rounded text-xs font-semibold w-fit ${
                           user.verificationType === 'blue' ? 'bg-blue-500/10 text-blue-500' : 
                           user.verificationType === 'golden' ? 'bg-yellow-500/10 text-yellow-500' : 
                           'bg-gray-700 text-white'
                        }`}>
                           <Zap size={12} className={
                              user.verificationType === 'blue' ? 'fill-blue-500' : 
                              user.verificationType === 'golden' ? 'fill-yellow-500' : 
                              'fill-black'
                           } />
                           {user.verificationType === 'blue' ? 'Blue Spark' : 
                            user.verificationType === 'golden' ? 'Golden Spark' : 'Black Spark'}
                        </div>
                      ) : (
                         <span className="text-gray-500 text-xs">Regular</span>
                      )}
                    </td>
                    <td className="p-4 text-right">
                       <button 
                         onClick={() => onDeleteUser(user.id)}
                         className="text-red-500 hover:bg-red-500/10 p-2 rounded-lg transition-colors"
                         title="Ban User"
                       >
                         <Trash2 size={18} />
                       </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'posts' && (
           <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-black/50 text-gray-400 text-xs uppercase tracking-wider">
                <tr>
                  <th className="p-4">Content</th>
                  <th className="p-4">Author</th>
                  <th className="p-4">Stats</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {filteredPosts.map(post => (
                  <tr key={post.id} className="hover:bg-black/20 transition-colors">
                    <td className="p-4 flex items-center space-x-3">
                      <div className="w-12 h-12 rounded bg-gray-800 overflow-hidden shrink-0">
                         {post.type === 'video' ? (
                           <video src={post.url} className="w-full h-full object-cover" />
                         ) : (
                           <img src={post.url} alt="post" className="w-full h-full object-cover" />
                         )}
                      </div>
                      <p className="text-sm text-gray-300 truncate max-w-[200px]">{post.caption}</p>
                    </td>
                    <td className="p-4 text-gray-300">
                      <div className="flex items-center space-x-2">
                        <img src={post.user.avatar} className="w-6 h-6 rounded-full" />
                        <span>{post.user.username}</span>
                      </div>
                    </td>
                    <td className="p-4 text-gray-400 text-sm">
                      <div>{formatNumber(post.likes)} Likes</div>
                      <div>{formatNumber(post.views)} Views</div>
                    </td>
                    <td className="p-4 text-right">
                       <button 
                         onClick={() => onDeletePost(post.id)}
                         className="text-red-500 hover:bg-red-500/10 p-2 rounded-lg transition-colors"
                         title="Delete Post"
                       >
                         <Trash2 size={18} />
                       </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'verifications' && (
           <div className="overflow-x-auto">
              {pendingVerifications.length > 0 ? (
                <table className="w-full text-left">
                <thead className="bg-black/50 text-gray-400 text-xs uppercase tracking-wider">
                  <tr>
                    <th className="p-4">Request User</th>
                    <th className="p-4">Eligibility Check</th>
                    <th className="p-4 text-right">Decision</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {pendingVerifications.map(user => {
                     // Find max reel views for this user
                     const userPosts = posts.filter(p => p.user.id === user.id && p.type === 'video');
                     const maxReelViews = userPosts.length > 0 ? Math.max(...userPosts.map(p => p.views)) : 0;
                     
                     const celebrityKeywords = [
                        'Actor', 'Actress', 'Musician', 'Singer', 'Rapper', 'Band', 'Artist', 
                        'Athlete', 'Sports', 'Player', 'Footballer', 'Cricketer', 'Celebrity', 'Public Figure'
                     ];
                     const isCelebrity = user.category ? celebrityKeywords.some(k => user.category!.toLowerCase().includes(k.toLowerCase())) : false;
                     
                     // Determine recommended tier based on logic
                     let recommendedTier = 'blue';
                     if (isCelebrity) recommendedTier = 'golden';
                     else if (user.followers >= 10000000 && maxReelViews >= 1000000) recommendedTier = 'blue';

                     return (
                      <tr key={user.id} className="hover:bg-black/20 transition-colors">
                        <td className="p-4 flex items-center space-x-3">
                          <img src={user.avatar} alt={user.username} className="w-12 h-12 rounded-full object-cover" />
                          <div>
                            <span className="font-bold text-white block">{user.name}</span>
                            <span className="text-xs text-gray-500">@{user.username}</span>
                            <div className={`mt-1 text-xs font-bold ${isCelebrity ? 'text-yellow-400' : 'text-blue-400'}`}>
                              Requesting {isCelebrity ? 'Golden Spark' : 'Blue Spark'}
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="space-y-1 text-sm">
                             <div className={`flex items-center gap-2 ${user.followers >= 10000000 ? 'text-green-400' : 'text-red-400'}`}>
                                <span>Followers: {formatNumber(user.followers)} / 10M</span>
                             </div>
                             <div className={`flex items-center gap-2 ${maxReelViews >= 1000000 ? 'text-green-400' : 'text-red-400'}`}>
                                <span>Best Reel: {formatNumber(maxReelViews)} / 1M Views</span>
                             </div>
                             <div className={`flex items-center gap-2 ${isCelebrity ? 'text-green-400' : 'text-red-400'}`}>
                                <span>Category: {user.category || 'N/A'} {isCelebrity ? '(Celebrity Match)' : ''}</span>
                             </div>
                          </div>
                        </td>
                        <td className="p-4 text-right">
                           <div className="flex items-center justify-end gap-2">
                             <button 
                               onClick={() => onRejectVerification(user.id)}
                               className="bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white px-3 py-2 rounded-lg transition-colors flex items-center gap-1 text-xs font-bold"
                             >
                               <X size={14} /> Reject
                             </button>
                             <button 
                               onClick={() => onApproveVerification(user.id, recommendedTier as 'blue' | 'golden')}
                               className={`px-3 py-2 rounded-lg transition-colors flex items-center gap-1 text-xs font-bold text-black ${recommendedTier === 'golden' ? 'bg-yellow-500 hover:bg-yellow-400' : 'bg-blue-500 hover:bg-blue-400 text-white'}`}
                             >
                               <Check size={14} /> Approve as {recommendedTier === 'golden' ? 'Gold' : 'Blue'}
                             </button>
                           </div>
                        </td>
                      </tr>
                     )
                  })}
                </tbody>
              </table>
              ) : (
                <div className="p-12 text-center flex flex-col items-center">
                    <ShieldCheck size={48} className="text-gray-600 mb-4" />
                    <h3 className="text-white text-lg font-semibold">No Pending Requests</h3>
                    <p className="text-gray-500">All verification requests have been processed.</p>
                </div>
              )}
           </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;