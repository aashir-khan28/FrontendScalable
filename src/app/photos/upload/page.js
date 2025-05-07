"use client";

import React, { useState } from "react";
import { useFormik } from "formik";
import { useRouter } from "next/navigation";
import {
  ImagePlus, Upload, Type, MessageCircle, MapPin, Tag, X
} from "lucide-react";
import { useUploadFileMutation } from "@/lib/services/upload";

const UploadPhotoPage = () => {
  const [imagePreview, setImagePreview] = useState(null);
  const router = useRouter();
  const [uploadFile] = useUploadFileMutation();

  const formik = useFormik({
    initialValues: {
      title: "",
      caption: "",
      location: "",
      tags: "",
      photo: null,
    },
    validate: (values) => {
      const errors = {};
      if (!values.title) errors.title = "Title is required";
      if (!values.photo) errors.photo = "Photo is required";
      return errors;
    },
    onSubmit: async (values) => {
      const formData = new FormData();
      formData.append("photo", values.photo);
      formData.append("title", values.title || "");
      formData.append("caption", values.caption || "");
      formData.append("location", values.location || "");
      formData.append("tags", values.tags || "");

      try {
        const response = await uploadFile(formData).unwrap();
        console.log("Upload successful:", response);
        router.push("/");
      } catch (error) {
        console.error("Upload failed:", error);
        alert("Failed to upload photo. Please try again.");
      }
    },
  });

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
      const maxSize = 5 * 1024 * 1024;

      if (!validTypes.includes(file.type)) {
        alert("Only JPEG, PNG, and GIF files are allowed.");
        return;
      }
      if (file.size > maxSize) {
        alert("File is too large. Maximum size is 5MB.");
        return;
      }

      formik.setFieldValue("photo", file);

      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const clearImage = () => {
    setImagePreview(null);
    formik.setFieldValue("photo", null);
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-slate-950 text-white">
      {/* Left - Form */}
      <div className="md:w-1/2 w-full p-10 bg-slate-800 flex flex-col justify-center">
        <form onSubmit={formik.handleSubmit} className="space-y-6">
          <h1 className="text-3xl font-bold text-center flex justify-center items-center gap-2 mb-6">
            <Upload size={28} /> Upload a New Photo
          </h1>

          {/* Title */}
          <div>
            <label className="text-sm font-medium">Title</label>
            <div className="relative mt-1">
              <input
                id="title"
                name="title"
                type="text"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.title}
                className={`w-full pl-10 p-3 rounded bg-slate-700 border ${
                  formik.errors.title && formik.touched.title
                    ? "border-red-500"
                    : "border-slate-600"
                }`}
                placeholder="Photo title"
              />
              <Type className="absolute top-3 left-3 text-slate-400" size={18} />
            </div>
            {formik.errors.title && formik.touched.title && (
              <p className="text-red-400 text-sm mt-1">{formik.errors.title}</p>
            )}
          </div>

          {/* Caption */}
          <div>
            <label className="text-sm font-medium">Caption</label>
            <div className="relative mt-1">
              <textarea
                id="caption"
                name="caption"
                onChange={formik.handleChange}
                value={formik.values.caption}
                rows={3}
                className="w-full pl-10 p-3 rounded bg-slate-700 border border-slate-600 resize-none"
                placeholder="Say something about your photo..."
              />
              <MessageCircle className="absolute top-3 left-3 text-slate-400" size={18} />
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="text-sm font-medium">Location</label>
            <div className="relative mt-1">
              <input
                id="location"
                name="location"
                type="text"
                onChange={formik.handleChange}
                value={formik.values.location}
                className="w-full pl-10 p-3 rounded bg-slate-700 border border-slate-600"
                placeholder="Where was this photo taken?"
              />
              <MapPin className="absolute top-3 left-3 text-slate-400" size={18} />
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="text-sm font-medium">Tags</label>
            <div className="relative mt-1">
              <input
                id="tags"
                name="tags"
                type="text"
                onChange={formik.handleChange}
                value={formik.values.tags}
                className="w-full pl-10 p-3 rounded bg-slate-700 border border-slate-600"
                placeholder="Tags (comma-separated)"
              />
              <Tag className="absolute top-3 left-3 text-slate-400" size={18} />
            </div>
          </div>

          <button
            type="submit"
            disabled={!imagePreview}
            className="w-full py-3 bg-amber-600 hover:bg-amber-500 transition rounded disabled:opacity-50 flex justify-center items-center gap-2"
          >
            <Upload size={20} /> Upload Photo
          </button>
        </form>
      </div>

      {/* Right - Image Upload / Preview */}
      <div className="md:w-1/2 w-full p-10 bg-slate-900 flex flex-col items-center justify-center relative">
        <input
          type="file"
          id="photo-upload"
          accept="image/jpeg,image/png,image/gif"
          onChange={handleFileChange}
          className="hidden"
        />

        {imagePreview ? (
          <div className="relative w-full max-w-md">
            <img
              src={imagePreview}
              alt="Preview"
              className="w-full object-contain rounded-xl shadow-2xl"
            />
            <button
              onClick={clearImage}
              type="button"
              className="absolute top-3 right-3 bg-red-600 text-white p-2 rounded-full hover:bg-red-700"
            >
              <X size={20} />
            </button>
          </div>
        ) : (
          <label
            htmlFor="photo-upload"
            className="w-full max-w-md h-72 border-2 border-dashed border-slate-600 flex flex-col items-center justify-center rounded-xl text-center cursor-pointer hover:border-green-500 transition"
          >
            <ImagePlus size={48} className="mb-4 text-slate-400" />
            <p className="text-lg font-semibold">Drag & Drop or Click to Upload</p>
            <p className="text-sm text-slate-400 mt-1">JPEG, PNG, GIF (Max 5MB)</p>
          </label>
        )}

        {formik.errors.photo && (
          <p className="text-red-400 text-sm mt-3 text-center">
            {formik.errors.photo}
          </p>
        )}
      </div>
    </div>
  );
};

export default UploadPhotoPage;
