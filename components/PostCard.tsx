import React from 'react';
import { Post } from '../types';
import { Heart, MessageCircle, Share2, MoreHorizontal } from 'lucide-react';

interface PostCardProps {
  post: Post;
  authorName: string;
  index: number;
}

export const PostCard: React.FC<PostCardProps> = ({ post, authorName, index }) => {
  // Generate a deterministic random image from picsum based on index to ensure visual variety but stability
  const imageUrl = `https://picsum.photos/seed/${index}${authorName}/600/600`;

  return (
    <div className="bg-luxury-800 border border-white/10 overflow-hidden mb-6 group hover:border-gold-600/30 transition-colors duration-300">
      {/* Header */}
      <div className="p-4 flex justify-between items-center border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-gold-700 to-amber-200" />
          <span className="text-sm font-medium text-gray-200">{authorName}</span>
        </div>
        <MoreHorizontal className="w-5 h-5 text-gray-500 cursor-pointer" />
      </div>

      {/* Image Area - Dark & Moody Filter */}
      <div className="relative aspect-square w-full overflow-hidden bg-black">
        <img 
          src={imageUrl} 
          alt={post.imageDescription}
          className="w-full h-full object-cover opacity-80 contrast-125 grayscale-[30%] group-hover:scale-105 transition-transform duration-700 ease-out"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60"></div>
      </div>

      {/* Action Bar */}
      <div className="p-4 flex gap-4 text-gray-300">
        <Heart className="w-6 h-6 hover:text-red-500 cursor-pointer transition-colors" />
        <MessageCircle className="w-6 h-6 hover:text-white cursor-pointer transition-colors" />
        <Share2 className="w-6 h-6 hover:text-white cursor-pointer transition-colors" />
      </div>

      {/* Content */}
      <div className="px-4 pb-6">
        <div className="text-sm font-bold text-gray-100 mb-2">{post.likes} 次赞</div>
        <div className="text-sm text-gray-300 leading-relaxed space-y-2 font-light">
          <p><span className="font-semibold text-white mr-2">{authorName}</span>{post.content}</p>
          <div className="flex flex-wrap gap-2 pt-2 text-gold-600">
            {post.hashtags.map((tag, i) => (
              <span key={i} className="text-xs">#{tag.replace('#', '')}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};