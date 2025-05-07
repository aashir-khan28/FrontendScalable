"use client";

import React, { useState } from "react";
import { useFormik } from "formik";
import { Eye, EyeOff, Mail } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { setCredentials } from "@/lib/redux/slices/authSlice";
import { useLoginUserMutation } from "@/lib/services/auth";

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();
  const [loginUser, { isLoading }] = useLoginUserMutation();

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    onSubmit: async (values) => {
      try {
        const response = await loginUser(values).unwrap();

        if (response?.token) {
          dispatch(setCredentials({ token: response.token, user: response.user }));
          toast.success("Login successful! Redirecting...");
          setTimeout(() => {
            router.push("/");
          }, 1000);
        } else {
          toast.error("Authentication failed. Please try again.");
        }
      } catch (err) {
        toast.error(err?.data?.message || "Login failed!");
      }
    },
    validate: (values) => {
      const errors = {};
      if (!values.email) {
        errors.email = "Email is required";
      } else if (!/\S+@\S+\.\S+/.test(values.email)) {
        errors.email = "Invalid email address";
      }
      if (!values.password) {
        errors.password = "Password is required";
      }
      return errors;
    },
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-950 to-blue-800 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md px-8 py-10 space-y-6">
        <h2 className="text-3xl font-bold text-center text-blue-800">Welcome Back</h2>
        <p className="text-center text-gray-500">Login to your account</p>

        <form onSubmit={formik.handleSubmit} className="space-y-5">
          {/* Email Field */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email Address
            </label>
            <div className="relative mt-1">
              <Mail className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                type="email"
                id="email"
                name="email"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.email}
                className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                  formik.errors.email && formik.touched.email
                    ? "border-red-500 focus:ring-red-300"
                    : "border-gray-300 focus:ring-blue-300"
                }`}
                placeholder="you@example.com"
              />
              {formik.errors.email && formik.touched.email && (
                <p className="text-red-500 text-sm mt-1">{formik.errors.email}</p>
              )}
            </div>
          </div>

          {/* Password Field */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <div className="relative mt-1">
              <div
                className="absolute left-3 top-3 cursor-pointer text-gray-400"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </div>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.password}
                className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                  formik.errors.password && formik.touched.password
                    ? "border-red-500 focus:ring-red-300"
                    : "border-gray-300 focus:ring-blue-300"
                }`}
                placeholder="••••••••"
              />
              {formik.errors.password && formik.touched.password && (
                <p className="text-red-500 text-sm mt-1">{formik.errors.password}</p>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>

          {/* Forgot password */}
          <div className="text-center">
            <button
              type="button"
              onClick={() => router.push("/account/forgot-password")}
              className="text-sm text-blue-600 hover:underline"
            >
              Forgot Password?
            </button>
          </div>

          {/* Register Link */}
          <div className="text-center text-sm text-gray-600">
            Don’t have an account?{" "}
            <a href="/account/register" className="text-blue-600 hover:underline font-medium">
              Sign up
            </a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
