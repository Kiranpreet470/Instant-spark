import React from 'react';
import { Home, Search, PlusSquare, Clapperboard, User, Zap, Shield, LogOut } from 'lucide-react';
import { View, User as UserType } from '../types';

interface SidebarProps {
  currentView: View;
  setView: (view: View) => void;
  currentUser: UserType;
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, setView, currentUser, onLogout }) => {
  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'search', label: 'Search', icon: Search },
    { id: 'create', label: 'Create', icon: PlusSquare },
    { id: 'reels', label: 'Reels', icon: Clapperboard },
    { id: 'profile', label: 'Profile', icon: User },
    // Only show Admin for admin users
    ...(currentUser.isAdmin ? [{ id: 'admin', label: 'Admin', icon: Shield }] : []),
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden md:flex flex-col fixed left-0 top-0 h-full w-64 bg-black border-r border-gray-800 px-4 py-8 z-50">
        <div className="mb-8 px-4 flex items-center gap-2">
           <Zap className="text-yellow-400" size={28} fill="currentColor"/>
           <h1 className="text-2xl font-logo text-white select-none">Instant Spark</h1>
        </div>
        
        <nav className="flex-1 space-y-2">
          {navItems.map((item) => {
             const Icon = item.icon;
             const isActive = currentView === item.id;
             return (
               <button
                key={item.id}
                onClick={() => setView(item.id as View)}
                className={`flex items-center space-x-4 w-full p-3 rounded-full transition-all duration-200 group ${isActive ? 'font-bold' : 'font-normal'}`}
               >
                 <Icon 
                    size={28} 
                    className={`transition-transform group-hover:scale-110 ${isActive ? 'text-white' : 'text-gray-300'}`} 
                    strokeWidth={isActive ? 3 : 2}
                 />
                 <span className={`text-base ${isActive ? 'text-white' : 'text-gray-300'}`}>{item.label}</span>
               </button>
             )
          })}
        </nav>

        <div className="px-4 mt-auto">
             <button 
               onClick={onLogout}
               className="flex items-center space-x-4 text-gray-500 hover:text-white transition-colors w-full p-3"
             >
                <LogOut size={28} />
                <span className="text-base">Switch Account</span>
             </button>
        </div>
      </div>

      {/* Mobile Bottom Nav */}
      <div className="md:hidden fixed bottom-0 left-0 w-full bg-black border-t border-gray-800 flex justify-around items-center h-14 z-50 px-2 pb-safe">
        {navItems.map((item) => {
           const Icon = item.icon;
           const isActive = currentView === item.id;
           return (
             <button
              key={item.id}
              onClick={() => setView(item.id as View)}
              className="p-2"
             >
               <Icon 
                  size={26} 
                  className={`${isActive ? 'text-white' : 'text-gray-400'}`} 
                  strokeWidth={isActive ? 2.5 : 2}
               />
             </button>
           )
        })}
        {/* Mobile Switch Account button */}
        <button onClick={onLogout} className="p-2">
           <LogOut size={26} className="text-gray-400" />
        </button>
      </div>
    </>
  );
};

export default Sidebar;