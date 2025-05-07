import React, { useEffect } from "react";
import {
  Heart,
  MessageCircle,
  Share2,
  X,
  Bookmark,
  SendHorizontal,
  Clock,
} from "lucide-react";
import moment from "moment";

const PhotoModal = ({
  selectedPhoto,
  closeModal,
  likes,
  likesCounts,
  comments,
  saved,
  toggleLike,
  toggleSave,
  addComment,
  commentInputRef,
}) => {
  useEffect(() => {
    if (selectedPhoto && commentInputRef?.current) {
      commentInputRef.current.focus();
    }
  }, [selectedPhoto, commentInputRef]);

  const shareImage = (url) => {
    navigator.clipboard.writeText(url);
    const toast = document.createElement("div");
    toast.className =
      "fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-teal-500 text-white px-6 py-3 rounded-lg text-sm z-50 shadow-lg";
    toast.textContent = "🔗 Link copied to clipboard!";
    document.body.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = "0";
      toast.style.transition = "opacity 0.5s ease";
      setTimeout(() => document.body.removeChild(toast), 500);
    }, 2000);
  };

  if (!selectedPhoto) return null;

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center"
      onClick={closeModal}
    >
      <div
        className="max-w-5xl w-full bg-gray-900 rounded-xl overflow-hidden shadow-2xl flex flex-col md:flex-row animate-fadeIn"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Image Section */}
        <div className="md:w-7/12 bg-gray-800 flex items-center justify-center">
          <img
            src={selectedPhoto.src}
            alt={selectedPhoto.caption}
            className="w-full h-auto max-h-[80vh] object-contain"
          />
        </div>

        {/* Details Section */}
        <div className="md:w-5/12 flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-gray-700 flex items-center justify-between bg-gray-900">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-teal-400 to-emerald-500 flex items-center justify-center ring-2 ring-emerald-500">
                <span className="text-white text-sm font-bold">
                  {selectedPhoto.username?.charAt(0)?.toUpperCase() || "?"}
                </span>
              </div>
              <div>
                <p className="font-semibold text-white">
                  {selectedPhoto.username}
                </p>
                <p className="text-xs text-gray-400 flex items-center">
                  <Clock size={12} className="mr-1" />
                  {moment(selectedPhoto.createdAt).fromNow()}
                </p>
              </div>
            </div>
            <button
              onClick={closeModal}
              className="rounded-full p-2 hover:bg-gray-700 transition text-gray-400"
            >
              <X size={20} />
            </button>
          </div>

          {/* Caption & Comments */}
          <div className="flex-1 overflow-y-auto p-5 max-h-[350px] bg-gray-900">
            <div className="flex space-x-3 mb-6 pb-4 border-b border-gray-700">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-teal-400 to-emerald-500 flex items-center justify-center">
                <span className="text-white text-xs font-bold">
                  {selectedPhoto.username?.charAt(0)?.toUpperCase() || "?"}
                </span>
              </div>
              <p className="text-sm text-gray-200">{selectedPhoto.caption}</p>
            </div>

            {/* Comments List */}
            <div className="space-y-5">
              {(comments[selectedPhoto.id] || []).length > 0 ? (
                comments[selectedPhoto.id].map((comment, index) => (
                  <div key={index} className="flex space-x-3 group">
                    <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center">
                      <span className="text-white text-xs font-bold">
                        {comment?.user?.email?.charAt(0)?.toUpperCase() || "?"}
                      </span>
                    </div>
                    <div className="flex-1">
                      <div className="bg-gray-800 p-3 rounded-2xl rounded-tl-none">
                        <p className="text-sm text-gray-300">{comment.text}</p>
                      </div>
                      <p className="text-gray-500 text-xs mt-1 ml-2">
                        {comment.timestamp || moment(comment.createdAt).fromNow()}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500 text-sm">No comments yet</p>
                  <p className="text-gray-600 text-xs mt-1">Be the first to comment</p>
                </div>
              )}
            </div>
          </div>

          {/* Like, Share & Comment Section */}
          <div className="p-4 border-t border-gray-800 bg-gray-900">
            <div className="flex justify-between items-center mb-3">
              <div className="flex space-x-4">
                <button
                  onClick={() => toggleLike(selectedPhoto.id)}
                  className="focus:outline-none transform active:scale-90 transition"
                >
                  <Heart
                    size={24}
                    className={
                      likes[selectedPhoto.id]
                        ? "text-rose-500 fill-rose-500"
                        : "text-gray-400"
                    }
                  />
                </button>

                <button
                  className="focus:outline-none transform active:scale-90 transition"
                  onClick={() => commentInputRef?.current?.focus()}
                >
                  <MessageCircle size={24} className="text-gray-400" />
                </button>

                <button
                  onClick={() => shareImage(selectedPhoto.src)}
                  className="focus:outline-none transform active:scale-90 transition"
                >
                  <Share2 size={24} className="text-gray-400" />
                </button>
              </div>

              <button
                onClick={() => toggleSave(selectedPhoto.id)}
                className="focus:outline-none transform active:scale-90 transition"
              >
                <Bookmark
                  size={24}
                  className={
                    saved[selectedPhoto.id]
                      ? "text-emerald-400 fill-emerald-400"
                      : "text-gray-400"
                  }
                />
              </button>
            </div>

            <p className="text-sm font-medium mb-4 text-gray-300">
              {likesCounts[selectedPhoto.id] || 0}{" "}
              {likesCounts[selectedPhoto.id] === 1 ? "like" : "likes"}
            </p>

            {/* Comment Input */}
            <div className="relative">
              <input
                ref={commentInputRef}
                type="text"
                placeholder="Add a comment..."
                className="w-full bg-gray-800 text-white rounded-full py-3 pl-4 pr-12 focus:outline-none focus:ring-2 focus:ring-emerald-500 placeholder-gray-500 border border-gray-700"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && e.target.value.trim()) {
                    addComment(selectedPhoto.id, e.target.value.trim());
                    e.target.value = "";
                  }
                }}
              />
              <button
                className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1.5 bg-emerald-500 text-white rounded-full hover:bg-emerald-600 transition"
                onClick={() => {
                  const input = commentInputRef?.current;
                  if (input && input.value.trim()) {
                    addComment(selectedPhoto.id, input.value.trim());
                    input.value = "";
                    input.focus();
                  }
                }}
              >
                <SendHorizontal size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhotoModal;
