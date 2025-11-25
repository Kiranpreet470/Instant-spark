import React, { useState, useRef } from 'react';
import { Image as ImageIcon, Video, X, Sparkles, Loader2, Upload } from 'lucide-react';
import { generateImageCaption } from '../services/geminiService';
import { Post, User } from '../types';

interface CreatePostProps {
  currentUser: User;
  onClose: () => void;
  onPostCreated: (post: Post) => void;
}

const CreatePost: React.FC<CreatePostProps> = ({ currentUser, onClose, onPostCreated }) => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [caption, setCaption] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [mediaType, setMediaType] = useState<'image' | 'video'>('image');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
      
      if (selectedFile.type.startsWith('video')) {
        setMediaType('video');
      } else {
        setMediaType('image');
      }
    }
  };

  const handleGenerateCaption = async () => {
    if (!file || mediaType !== 'image') return;
    
    setIsGenerating(true);
    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64String = reader.result as string;
        const generatedText = await generateImageCaption(base64String, file.type);
        setCaption(generatedText);
        setIsGenerating(false);
      };
      reader.readAsDataURL(file);
    } catch (err) {
      console.error(err);
      setIsGenerating(false);
    }
  };

  const handlePost = () => {
    if (!preview) return;

    const newPost: Post = {
      id: Date.now().toString(),
      type: mediaType,
      url: preview,
      user: currentUser,
      caption: caption,
      likes: 0,
      views: 0,
      comments: [],
      timestamp: Date.now(),
      isLiked: false,
    };

    onPostCreated(newPost);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/80 z-[100] flex items-center justify-center p-4">
      <div className="bg-zinc-900 rounded-xl w-full max-w-3xl overflow-hidden flex flex-col md:flex-row h-[80vh] md:h-[600px] border border-gray-800 animate-fade-in">
        
        {/* Header (Mobile only) */}
        <div className="md:hidden flex justify-between items-center p-4 border-b border-gray-800">
           <span className="font-semibold text-white">Create new post</span>
           <button onClick={onClose} className="text-blue-500 font-semibold">Cancel</button>
        </div>

        {/* Media Preview Section */}
        <div className="w-full md:w-2/3 bg-black flex items-center justify-center relative border-r border-gray-800">
          {preview ? (
            mediaType === 'video' ? (
              <video src={preview} controls className="max-h-full max-w-full object-contain" />
            ) : (
              <img src={preview} alt="Preview" className="max-h-full max-w-full object-contain" />
            )
          ) : (
             <div className="text-center p-8">
                <Upload size={48} className="mx-auto text-gray-500 mb-4" />
                <h3 className="text-xl font-light text-white mb-4">Drag photos and videos here</h3>
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold text-sm transition-colors"
                >
                  Select from computer
                </button>
             </div>
          )}
          <input 
            type="file" 
            ref={fileInputRef}
            onChange={handleFileChange} 
            className="hidden" 
            accept="image/*,video/*"
          />
          {preview && (
            <button 
              onClick={() => { setFile(null); setPreview(null); setCaption(''); }}
              className="absolute top-4 right-4 bg-black/60 p-2 rounded-full text-white hover:bg-black/80"
            >
              <X size={20}/>
            </button>
          )}
        </div>

        {/* Details Section */}
        {preview && (
          <div className="w-full md:w-1/3 flex flex-col bg-zinc-900">
            <div className="hidden md:flex items-center justify-between p-4 border-b border-gray-800">
               <button onClick={onClose} className="text-gray-400 hover:text-white">Cancel</button>
               <span className="font-semibold text-white">Create new post</span>
               <button onClick={handlePost} className="text-blue-500 hover:text-blue-400 font-semibold">Share</button>
            </div>

            <div className="p-4 flex items-center space-x-3">
               <img src={currentUser.avatar} alt="Me" className="w-8 h-8 rounded-full" />
               <span className="text-sm font-semibold text-white">{currentUser.username}</span>
            </div>

            <div className="px-4 flex-1">
              <textarea
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="Write a caption..."
                className="w-full h-32 bg-transparent text-white resize-none outline-none text-sm placeholder-gray-500"
              />
              
              {/* Gemini Feature */}
              {mediaType === 'image' && (
                <div className="mt-2">
                   <button 
                      onClick={handleGenerateCaption}
                      disabled={isGenerating}
                      className="flex items-center space-x-2 text-xs font-medium bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1.5 rounded-full hover:opacity-90 transition-opacity disabled:opacity-50"
                   >
                      {isGenerating ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
                      <span>Spark Caption with AI</span>
                   </button>
                </div>
              )}
            </div>

            <div className="p-4 border-t border-gray-800 md:hidden">
               <button onClick={handlePost} className="w-full bg-blue-500 text-white py-3 rounded-xl font-semibold">
                 Share
               </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreatePost;