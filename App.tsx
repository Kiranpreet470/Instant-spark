import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import PostCard from './components/PostCard';
import CreatePost from './components/CreatePost';
import ReelViewer from './components/ReelViewer';
import Profile from './pages/Profile';
import AdminPanel from './pages/AdminPanel';
import LoginModal from './components/LoginModal';
import { View, Post, User } from './types';
import { MOCK_POSTS, MOCK_REELS, CURRENT_USER, MOCK_USERS, ADMIN_USER } from './constants';
import { Sparkles, Zap, Heart } from 'lucide-react';

const App: React.FC = () => {
  const [currentView, setView] = useState<View>('home');
  const [currentUser, setCurrentUser] = useState<User>(CURRENT_USER);
  const [users, setUsers] = useState<User[]>([CURRENT_USER, ADMIN_USER, ...MOCK_USERS]);
  const [posts, setPosts] = useState<Post[]>(MOCK_POSTS);
  const [reels, setReels] = useState<Post[]>(MOCK_REELS);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  // Handle navigation changes
  const handleSetView = (view: View) => {
    if (view === 'create') {
      setIsCreateModalOpen(true);
    } else if (view === 'admin' && !currentUser.isAdmin) {
       // Prevent unauthorized access via code manipulation (though UI hides it)
       alert("Unauthorized Access");
       setView('home');
    } else {
      setView(view);
    }
  };

  const handleLogin = (username: string, pass: string): boolean => {
    if (username === 'admin' && pass === 'password123') {
      // Find latest admin state in users array to ensure balance is correct
      const admin = users.find(u => u.id === 'u_admin') || ADMIN_USER;
      setCurrentUser(admin);
      setView('admin'); // Redirect to admin panel on login
      setIsLoginModalOpen(false);
      return true;
    } else if (username === CURRENT_USER.username) {
       // Find latest user state
      const me = users.find(u => u.id === 'u_me') || CURRENT_USER;
      setCurrentUser(me);
      setView('home');
      setIsLoginModalOpen(false);
      return true;
    } else {
      // Simulate generic login
      const found = users.find(u => u.username === username);
      if (found) {
        setCurrentUser(found);
        setView('home');
        setIsLoginModalOpen(false);
        return true;
      }
    }
    return false;
  };

  const handleNewPost = (newPost: Post) => {
    if (newPost.type === 'video') {
       // Ideally we add to reels, but for simplicity showing in feed too
       setReels([newPost, ...reels]);
       setPosts([newPost, ...posts]);
    } else {
       setPosts([newPost, ...posts]);
    }
    setView('home'); // Go to feed to see new post
  };

  const handleUpdateUser = (updatedUser: User) => {
    setCurrentUser(updatedUser);
    setUsers(users.map(u => u.id === updatedUser.id ? updatedUser : u));
  };

  const handleRequestVerification = (type: 'black' | 'blue' | 'golden') => {
    if (type === 'black') {
      // Immediate purchase logic (Simulated)
      if (confirm("Confirm purchase of Black Tick for $14.99/mo?")) {
        const updated = { ...currentUser, verificationType: 'black' as const, verificationStatus: 'approved' as const };
        handleUpdateUser(updated);
        alert("Black Tick Purchased Successfully!");
      }
    } else if (type === 'blue' || type === 'golden') {
      // Claim logic -> To Admin
      // If user requests Golden, we know they are celebrity, but we still set pending
      const updated = { ...currentUser, verificationStatus: 'pending' as const };
      handleUpdateUser(updated);
      alert(`Verification request submitted for ${type === 'golden' ? 'Golden' : 'Blue'} Spark! It is now under review.`);
    }
  };

  const handleSendGift = (amount: number, recipientId: string) => {
     // 75% to Creator, 25% to Admin
     const creatorShare = amount * 0.75;
     const platformShare = amount * 0.25;

     setUsers(prevUsers => prevUsers.map(u => {
        if (u.id === recipientId) {
           return {
             ...u,
             walletBalance: u.walletBalance + creatorShare,
             totalEarnings: u.totalEarnings + creatorShare
           };
        }
        if (u.id === 'u_admin') {
           return {
             ...u,
             walletBalance: u.walletBalance + platformShare,
             totalEarnings: u.totalEarnings + platformShare
           };
        }
        return u;
     }));

     // If current user is Admin or Recipient, update current user state too
     if (currentUser.id === recipientId) {
        setCurrentUser(prev => ({ ...prev, walletBalance: prev.walletBalance + creatorShare, totalEarnings: prev.totalEarnings + creatorShare }));
     } else if (currentUser.id === 'u_admin') {
        setCurrentUser(prev => ({ ...prev, walletBalance: prev.walletBalance + platformShare, totalEarnings: prev.totalEarnings + platformShare }));
     }
  };

  const handleAdminDeleteUser = (userId: string) => {
    setUsers(users.filter(u => u.id !== userId));
    setPosts(posts.filter(p => p.user.id !== userId));
    if (currentUser.id === userId) {
      alert("You have been banned!");
      window.location.reload();
    }
  };

  const handleAdminDeletePost = (postId: string) => {
    setPosts(posts.filter(p => p.id !== postId));
  };

  const handleAdminApproveVerification = (userId: string, type: 'black' | 'blue' | 'golden' = 'blue') => {
    setUsers(users.map(u => {
      if (u.id === userId) {
        return { ...u, verificationType: type, verificationStatus: 'approved' };
      }
      return u;
    }));
    // Sync currentUser if needed (mostly for dev environment sync)
    if (currentUser.id === userId) {
       setCurrentUser({ ...currentUser, verificationType: type, verificationStatus: 'approved' });
    }
  };

  const handleAdminRejectVerification = (userId: string) => {
    setUsers(users.map(u => {
      if (u.id === userId) {
        return { ...u, verificationStatus: 'rejected' };
      }
      return u;
    }));
     if (currentUser.id === userId) {
       setCurrentUser({ ...currentUser, verificationStatus: 'rejected' });
    }
  };

  const renderContent = () => {
    switch (currentView) {
      case 'home':
        return (
          <div className="max-w-[470px] mx-auto pt-4 md:pt-8 pb-20 md:pb-4 min-h-screen">
            {/* Stories Bar (Mock) */}
            <div className="flex space-x-4 overflow-x-auto pb-4 mb-4 hide-scrollbar px-2">
               <div className="flex flex-col items-center space-y-1 shrink-0 cursor-pointer">
                  <div className="w-16 h-16 rounded-full bg-transparent border-2 border-gray-600 p-[2px] relative">
                     <div className="w-full h-full rounded-full bg-gray-800 overflow-hidden">
                        <img src={currentUser.avatar} className="w-full h-full object-cover" />
                     </div>
                     <div className="absolute bottom-0 right-0 bg-blue-500 rounded-full p-0.5 border-2 border-black">
                        <Sparkles size={12} className="text-white" />
                     </div>
                  </div>
                  <span className="text-xs text-gray-400">Your story</span>
               </div>
               {/* Mock Stories */}
               {[1,2,3,4,5].map(i => (
                  <div key={i} className="flex flex-col items-center space-y-1 shrink-0 cursor-pointer">
                     <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-yellow-400 to-fuchsia-600 p-[2px]">
                        <div className="w-full h-full rounded-full border-2 border-black bg-gray-800"></div>
                     </div>
                     <span className="text-xs text-white">user_{i}</span>
                  </div>
               ))}
            </div>

            {/* Feed */}
            <div className="flex flex-col">
              {posts.map((post) => {
                // Ensure we pass the latest user data to the post for monetization checks
                const postUser = users.find(u => u.id === post.user.id) || post.user;
                return (
                  <PostCard 
                    key={post.id} 
                    post={{...post, user: postUser}} 
                    onSendGift={handleSendGift}
                  />
                );
              })}
            </div>
            
            {/* End of Feed */}
            <div className="py-8 text-center">
                <div className="inline-block p-4 rounded-full bg-gray-900 mb-4">
                  <Zap className="text-brand-mid animate-pulse" size={32} />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">You're all caught up!</h3>
                <p className="text-gray-500">You've seen all new posts from the past 3 days.</p>
            </div>
          </div>
        );
      case 'reels':
        return (
          <ReelViewer 
            reels={reels.map(r => ({...r, user: users.find(u => u.id === r.user.id) || r.user}))} 
            onSendGift={handleSendGift} 
          />
        );
      case 'profile':
        return (
          <Profile 
            user={currentUser} 
            posts={posts} 
            isCurrentUser={true} 
            onUpdateUser={handleUpdateUser}
            onRequestVerification={handleRequestVerification}
          />
        );
      case 'admin':
        // Double check protection
        if (!currentUser.isAdmin) return null;
        // Find admin user in users array to get latest balance
        const adminUser = users.find(u => u.id === 'u_admin') || currentUser;
        return (
          <AdminPanel 
            users={users} 
            posts={posts} 
            adminUser={adminUser}
            onDeleteUser={handleAdminDeleteUser} 
            onDeletePost={handleAdminDeletePost}
            onApproveVerification={handleAdminApproveVerification}
            onRejectVerification={handleAdminRejectVerification}
          />
        );
      case 'search':
        return (
            <div className="max-w-4xl mx-auto pt-4 px-4 pb-20">
                <div className="relative mb-6">
                    <input type="text" placeholder="Search" className="w-full bg-zinc-800 rounded-lg py-2 px-4 text-white outline-none focus:ring-1 focus:ring-gray-600" />
                </div>
                <div className="grid grid-cols-3 gap-1 auto-rows-[130px] md:auto-rows-[300px]">
                   {/* Mock Search Grid */}
                   {Array.from({length: 12}).map((_, i) => (
                       <div key={i} className={`bg-zinc-900 overflow-hidden relative group ${i === 1 ? 'row-span-2 col-span-2' : ''}`}>
                          <img src={`https://picsum.photos/500/500?random=${i + 10}`} className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-300" />
                       </div>
                   ))}
                </div>
            </div>
        )
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col md:flex-row">
      <Sidebar 
        currentView={currentView} 
        setView={handleSetView} 
        currentUser={currentUser}
        onLogout={() => setIsLoginModalOpen(true)}
      />
      
      {/* Main Content Area */}
      <main className="flex-1 md:ml-64 transition-all duration-300">
         {/* Mobile Header */}
         <div className="md:hidden flex justify-between items-center p-4 border-b border-gray-800 sticky top-0 bg-black z-40">
            <h1 className="text-2xl font-logo text-white">Instant Spark</h1>
            <div className="flex space-x-4">
               <Heart size={24} />
               <Zap size={24} />
            </div>
         </div>

         {renderContent()}
      </main>

      {/* Modals */}
      {isCreateModalOpen && (
        <CreatePost 
          currentUser={currentUser} 
          onClose={() => setIsCreateModalOpen(false)} 
          onPostCreated={handleNewPost}
        />
      )}

      {isLoginModalOpen && (
        <LoginModal 
          onClose={() => setIsLoginModalOpen(false)}
          onLogin={handleLogin}
        />
      )}
    </div>
  );
};

export default App;