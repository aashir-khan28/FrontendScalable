"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Heart, MessageCircle, Share2, X, Camera, Bookmark, MoreHorizontal, Search,
  Grid, List, Clock, User, Plus
} from "lucide-react";
import Navbar from "@/components/Navbar";
import PhotoModal from "@/components/PhotoModal";
import { useSelector } from "react-redux";
import moment from "moment";
import {
  useLazyGetPhotosQuery,
  useLikePhotoMutation,
  useCommentPhotoMutation,
} from "@/lib/services/upload";

const Home = () => {
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [userLikedPhotos, setUserLikedPhotos] = useState({});
  const [likesCounts, setLikesCounts] = useState({});
  const [comments, setComments] = useState({});
  const [saved, setSaved] = useState({});
  const [searchActive, setSearchActive] = useState(false);
  const [viewMode, setViewMode] = useState("grid");
  const [photos, setPhotos] = useState([]);
  const commentInputRef = useRef(null);

  const token = useSelector((state) => state?.auth?.token);
  const user = useSelector((state) => state?.auth?.user);

  const [triggerGetPhotos, { data, isLoading }] = useLazyGetPhotosQuery();
  const [likePhoto] = useLikePhotoMutation();
  const [commentPhoto] = useCommentPhotoMutation();

  useEffect(() => {
    triggerGetPhotos({ page: 1, limit: 20, search: "", sortBy: "createdAt" });
  }, [triggerGetPhotos]);

  useEffect(() => {
    if (data?.photos?.length) {
      const transformed = data.photos.map((photo) => ({
        id: photo._id,
        src: photo.imageUrl,
        caption: photo.caption,
        username: photo.creator?.email || "unknown",
        likes: photo.likes?.length || 0,
        timestamp: moment(photo.createdAt).fromNow(),
        raw: photo,
      }));
      setPhotos(transformed);

      const initialUserLikes = {};
      const initialLikesCounts = {};
      const initialComments = {};

      transformed.forEach((photo) => {
        const hasUserLiked = photo.raw.likes?.some(
          (like) => like.userId === user?.id || like.user === user?.id
        );
        initialUserLikes[photo.id] = hasUserLiked || false;
        initialLikesCounts[photo.id] = photo.raw.likes?.length || 0;
        initialComments[photo.id] = photo.raw.comments || [];
      });

      setUserLikedPhotos(initialUserLikes);
      setLikesCounts(initialLikesCounts);
      setComments(initialComments);
    }
  }, [data, user?.id]);

  const openModal = (photo) => {
    document.body.style.overflow = "hidden";
    setSelectedPhoto(photo);
    setTimeout(() => commentInputRef.current?.focus(), 300);
  };

  const closeModal = () => {
    document.body.style.overflow = "auto";
    setSelectedPhoto(null);
  };

  const toggleLike = async (id, e) => {
    e?.stopPropagation();
    const currentlyLiked = userLikedPhotos[id];
    const currentCount = likesCounts[id];
    const newCount = currentlyLiked ? Math.max(0, currentCount - 1) : currentCount + 1;

    setUserLikedPhotos((prev) => ({ ...prev, [id]: !currentlyLiked }));
    setLikesCounts((prev) => ({ ...prev, [id]: newCount }));

    try {
      const response = await likePhoto(id).unwrap();
      if (response && typeof response.likesCount === "number") {
        setLikesCounts((prev) => ({ ...prev, [id]: response.likesCount }));
      }
    } catch (err) {
      console.error("Like failed:", err);
      setUserLikedPhotos((prev) => ({ ...prev, [id]: currentlyLiked }));
      setLikesCounts((prev) => ({ ...prev, [id]: currentCount }));
    }
  };

  const toggleSave = (id, e) => {
    e?.stopPropagation();
    setSaved((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const addComment = async (id, text) => {
    if (!text.trim()) return;
    try {
      const response = await commentPhoto({ photoId: id, text }).unwrap();
      const latestComments = response?.comments || [];
      setComments((prev) => ({
        ...prev,
        [id]: latestComments,
      }));
    } catch (err) {
      console.error("Comment failed:", err);
    }
  };

  const shareImage = (url, e) => {
    e?.stopPropagation();
    navigator.clipboard.writeText(url);
    const toast = document.createElement("div");
    toast.className =
      "fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-6 py-3 rounded-lg text-sm z-50 shadow-lg";
    toast.textContent = "🔗 Link copied to clipboard!";
    document.body.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = "0";
      toast.style.transition = "opacity 0.5s ease";
      setTimeout(() => document.body.removeChild(toast), 500);
    }, 2000);
  };

  const toggleSearchBar = () => setSearchActive(!searchActive);
  const toggleView = () => setViewMode(viewMode === "grid" ? "feed" : "grid");

  return (
    <div className="bg-gray-50 min-h-screen text-gray-800">
      <Navbar userRole={user?.role} isLoggedIn={!!token} />

      <div className={`fixed inset-0 bg-white z-40 transform transition-transform duration-300 ${searchActive ? 'translate-y-0' : '-translate-y-full'}`}>
        <div className="container mx-auto p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search photos, users, or tags..."
                className="w-full pl-10 pr-4 py-3 bg-gray-100 text-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-400"
                autoFocus={searchActive}
              />
              <Search className="absolute left-3 top-3 text-gray-400" size={20} />
            </div>
            <button className="ml-4 p-2" onClick={toggleSearchBar}>
              <X size={24} className="text-gray-500" />
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 pt-6 pb-20">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-gray-800">Explore</h1>
          <div className="flex items-center space-x-3">
            <button onClick={toggleSearchBar} className="p-2 rounded-full hover:bg-gray-100 text-gray-500">
              <Search size={20} />
            </button>
            <button onClick={toggleView} className="p-2 rounded-full hover:bg-gray-100 text-gray-500">
              {viewMode === "grid" ? <Grid size={20} /> : <List size={20} />}
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="w-16 h-16 border-4 border-gray-200 border-t-emerald-500 rounded-full animate-spin"></div>
            <p className="mt-4 text-gray-500">Loading photos...</p>
          </div>
        ) : viewMode === "grid" ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {photos.map((photo) => (
              <div
                key={photo.id}
                className="group relative rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 bg-white"
                onClick={() => openModal(photo)}
              >
                <div className="aspect-square overflow-hidden">
                  <img src={photo.src} alt={photo.caption} className="w-full h-full object-cover transition duration-500 group-hover:scale-105" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3">
                  <p className="text-white text-sm font-medium truncate">{photo.caption}</p>
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center">
                      <Heart size={16} className={`${userLikedPhotos[photo.id] ? "text-rose-500 fill-rose-500" : "text-white"} mr-1`} onClick={(e) => toggleLike(photo.id, e)} />
                      <span className="text-white text-xs">{likesCounts[photo.id] || 0}</span>
                    </div>
                    <span className="text-white text-xs opacity-90">@{photo.username}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-6">
            {photos.map((photo) => (
              <div key={photo.id} className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
                <div className="flex items-center justify-between p-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-emerald-400 to-teal-500 flex items-center justify-center">
                      <span className="text-white text-sm font-bold">{photo.username.charAt(0).toUpperCase()}</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">{photo.username}</p>
                      <div className="flex items-center text-gray-500 text-xs">
                        <Clock size={12} className="mr-1" /> 
                        <span>{photo.timestamp}</span>
                      </div>
                    </div>
                  </div>
                  <button className="text-gray-500 hover:bg-gray-100 p-2 rounded-full">
                    <MoreHorizontal size={20} />
                  </button>
                </div>
                <div className="relative cursor-pointer" onClick={() => openModal(photo)}>
                  <img src={photo.src} alt={photo.caption} className="w-full h-auto" />
                  <div className="absolute inset-0" onDoubleClick={() => toggleLike(photo.id)}></div>
                </div>
                <div className="p-4">
                  <div className="flex justify-between mb-3">
                    <div className="flex space-x-4">
                      <button onClick={(e) => toggleLike(photo.id, e)} className="focus:outline-none transform active:scale-90 transition">
                        <Heart size={24} className={userLikedPhotos[photo.id] ? "text-rose-500 fill-rose-500" : "text-gray-500"} />
                      </button>
                      <button onClick={() => openModal(photo)} className="focus:outline-none transform active:scale-90 transition">
                        <MessageCircle size={24} className="text-gray-500" />
                      </button>
                      <button onClick={(e) => shareImage(photo.src, e)} className="focus:outline-none transform active:scale-90 transition">
                        <Share2 size={24} className="text-gray-500" />
                      </button>
                    </div>
                    <button onClick={(e) => toggleSave(photo.id, e)} className="focus:outline-none transform active:scale-90 transition">
                      <Bookmark size={24} className={saved[photo.id] ? "text-emerald-500 fill-emerald-500" : "text-gray-500"} />
                    </button>
                  </div>
                  <p className="text-sm font-medium mb-2 text-gray-700">{likesCounts[photo.id] || 0} {likesCounts[photo.id] === 1 ? 'like' : 'likes'}</p>
                  <p className="text-sm text-gray-800 mb-2"><span className="font-medium">{photo.username}</span> {photo.caption}</p>
                  {comments[photo.id]?.length > 0 && (
                    <button className="text-gray-500 text-sm hover:text-gray-700 transition-colors" onClick={() => openModal(photo)}>
                      View all {comments[photo.id].length} comments
                    </button>
                  )}
                  <div className="flex items-center mt-3 border-t border-gray-100 pt-3">
                    <input
                      type="text"
                      placeholder="Add a comment..."
                      className="flex-1 text-sm bg-transparent outline-none text-gray-700 placeholder-gray-400"
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && e.target.value.trim()) {
                          addComment(photo.id, e.target.value);
                          e.target.value = "";
                        }
                      }}
                    />
                    <button className="text-emerald-500 font-medium text-sm" onClick={(e) => {
                      const input = e.target.previousSibling;
                      if (input.value.trim()) {
                        addComment(photo.id, input.value);
                        input.value = "";
                      }
                    }}>Post</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <button className="fixed right-6 bottom-6 w-14 h-14 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg flex items-center justify-center transform transition-transform hover:scale-105 active:scale-95">
          <Plus size={24} />
        </button>
      </div>

      {selectedPhoto && (
        <PhotoModal
          selectedPhoto={selectedPhoto}
          closeModal={closeModal}
          likes={userLikedPhotos}
          comments={comments}
          saved={saved}
          toggleLike={toggleLike}
          toggleSave={toggleSave}
          addComment={addComment}
          commentInputRef={commentInputRef}
          likesCounts={likesCounts}
        />
      )}
    </div>
  );
};

export default Home;