"use client";

import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import { Eye, EyeOff, User, Mail } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useCreateUserMutation } from "@/lib/services/auth";

const RegisterPage = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [createUser, { isLoading, isError, isSuccess, error }] = useCreateUserMutation();

  useEffect(() => {
    if (isSuccess) {
      toast.success("Registration successful! Redirecting...");
      setTimeout(() => router.push("/"), 2000);
    }
    if (isError) {
      toast.error(error?.data?.message || "Registration failed!");
    }
  }, [isSuccess, isError, router, error]);

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: "creator",
    },
    validate: (values) => {
      const errors={};
      if (!values.name) errors.name = "Name is required";
      if (!values.email) {
        errors.email = "Email is required";
      } else if (!/\S+@\S+\.\S+/.test(values.email)) {
        errors.email = "Invalid email address";
      }
      if (!values.password) errors.password = "Password is required";
      if (values.password !== values.confirmPassword) {
        errors.confirmPassword = "Passwords must match";
      }
      return errors;
    },
    onSubmit: async (values) => {
      try {
        await createUser({
          name: values.name,
          email: values.email,
          password: values.password,
          role: values.role,
        }).unwrap();
      } catch (err) {
        console.error("Registration failed:", err);
      }
    },
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 animate-fade-in">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Create Your Account</h2>

        <form onSubmit={formik.handleSubmit} className="space-y-5">
          {/* Name */}
          <div className="relative">
            <label className="block text-gray-600 font-semibold mb-1">Name</label>
            <div className="relative">
              <input
                id="name"
                name="name"
                type="text"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.name}
                className={`w-full pl-10 pr-4 py-3 border ${
                  formik.errors.name && formik.touched.name ? "border-red-500" : "border-gray-300"
                } rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400`}
              />
              <User className="absolute left-3 top-3 text-gray-400" size={20} />
            </div>
            {formik.errors.name && formik.touched.name && (
              <p className="text-red-500 text-xs mt-1">{formik.errors.name}</p>
            )}
          </div>

          {/* Email */}
          <div className="relative">
            <label className="block text-gray-600 font-semibold mb-1">Email</label>
            <div className="relative">
              <input
                id="email"
                name="email"
                type="email"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.email}
                className={`w-full pl-10 pr-4 py-3 border ${
                  formik.errors.email && formik.touched.email ? "border-red-500" : "border-gray-300"
                } rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400`}
              />
              <Mail className="absolute left-3 top-3 text-gray-400" size={20} />
            </div>
            {formik.errors.email && formik.touched.email && (
              <p className="text-red-500 text-xs mt-1">{formik.errors.email}</p>
            )}
          </div>

          {/* Password */}
          <div className="relative">
            <label className="block text-gray-600 font-semibold mb-1">Password</label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.password}
                className={`w-full pl-10 pr-10 py-3 border ${
                  formik.errors.password && formik.touched.password ? "border-red-500" : "border-gray-300"
                } rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400`}
              />
              <div
                className="absolute left-3 top-3 text-gray-400 cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </div>
            </div>
            {formik.errors.password && formik.touched.password && (
              <p className="text-red-500 text-xs mt-1">{formik.errors.password}</p>
            )}
          </div>

          {/* Confirm Password */}
          <div className="relative">
            <label className="block text-gray-600 font-semibold mb-1">Confirm Password</label>
            <div className="relative">
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.confirmPassword}
                className={`w-full pl-10 pr-10 py-3 border ${
                  formik.errors.confirmPassword && formik.touched.confirmPassword
                    ? "border-red-500"
                    : "border-gray-300"
                } rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400`}
              />
              <div
                className="absolute left-3 top-3 text-gray-400 cursor-pointer"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </div>
            </div>
            {formik.errors.confirmPassword && formik.touched.confirmPassword && (
              <p className="text-red-500 text-xs mt-1">{formik.errors.confirmPassword}</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-md transition duration-300"
          >
            {isLoading ? "Registering..." : "Register"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
