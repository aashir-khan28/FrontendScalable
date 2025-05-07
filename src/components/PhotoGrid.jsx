import React from "react";
import { Heart, Bookmark } from "lucide-react";

const PhotoGrid = ({ photos, likes, saved, openModal, toggleLike, toggleSave }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 p-6">
      {photos.map((photo) => (
        <div
          key={photo.id}
          className="relative rounded-3xl overflow-hidden shadow-xl group cursor-pointer backdrop-blur-xl bg-white/10 border border-white/20 hover:scale-[1.02] transition-all duration-300"
          onClick={() => openModal(photo)}
        >
          {/* Image */}
          <div className="aspect-square overflow-hidden">
            <img
              src={photo.src}
              alt={photo.caption}
              className="w-full h-full object-cover transition-all duration-500 group-hover:scale-110"
            />
          </div>

          {/* Content Overlay */}
          <div className="absolute inset-0 flex flex-col justify-end p-4 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            {/* Caption */}
            <p className="text-white text-sm md:text-base font-semibold truncate drop-shadow">
              {photo.caption}
            </p>

            {/* Actions & Info */}
            <div className="mt-2 flex items-center justify-between text-sm text-white">
              {/* Like */}
              <div
                className="flex items-center gap-1 hover:text-red-400 transition-colors"
                onClick={(e) => toggleLike(photo.id, e)}
              >
                <Heart
                  size={18}
                  className={`${
                    likes[photo.id] ? "text-red-500 fill-red-500" : "text-white"
                  }`}
                />
                <span>{photo.likes + (likes[photo.id] ? 1 : 0)}</span>
              </div>

              {/* Username */}
              <span className="text-white/80 font-medium">@{photo.username}</span>

              {/* Save */}
              <div
                className="hover:text-blue-400 transition-colors"
                onClick={(e) => toggleSave(photo.id, e)}
              >
                <Bookmark
                  size={18}
                  className={`${
                    saved[photo.id] ? "text-blue-500 fill-blue-500" : "text-white"
                  }`}
                />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PhotoGrid;
