// components/Alert.js
import React from "react";
import { CheckCircle, XCircle, AlertTriangle, Info } from "lucide-react";

const Alert = ({ type, message, title, onClose }) => {
  const alertStyles = {
    success: {
      bgColor: "bg-emerald-50",
      borderColor: "border-emerald-500",
      textColor: "text-emerald-800",
      icon: <CheckCircle size={20} className="text-emerald-500" />,
      ringColor: "ring-emerald-100",
      iconBgColor: "bg-emerald-100",
    },
    error: {
      bgColor: "bg-rose-50",
      borderColor: "border-rose-500",
      textColor: "text-rose-800",
      icon: <XCircle size={20} className="text-rose-500" />,
      ringColor: "ring-rose-100",
      iconBgColor: "bg-rose-100",
    },
    warning: {
      bgColor: "bg-amber-50",
      borderColor: "border-amber-500",
      textColor: "text-amber-800",
      icon: <AlertTriangle size={20} className="text-amber-500" />,
      ringColor: "ring-amber-100",
      iconBgColor: "bg-amber-100",
    },
    info: {
      bgColor: "bg-sky-50",
      borderColor: "border-sky-500",
      textColor: "text-sky-800",
      icon: <Info size={20} className="text-sky-500" />,
      ringColor: "ring-sky-100", 
      iconBgColor: "bg-sky-100",
    }
  };

  const alertStyle = alertStyles[type] || alertStyles.info;
  
  const defaultTitles = {
    success: "Success",
    error: "Error",
    warning: "Warning",
    info: "Information"
  };

  return (
    <div
      className={`${alertStyle.bgColor} border-l-4 ${alertStyle.borderColor} rounded-lg p-4 shadow-sm`}
      role="alert"
      tabIndex="-1"
    >
      <div className="flex items-start">
        <div className="shrink-0">
          <div className={`rounded-full p-1 ${alertStyle.iconBgColor} ${alertStyle.ringColor} ring-4 flex items-center justify-center`}>
            {alertStyle.icon}
          </div>
        </div>
        
        <div className="ml-3 flex-1">
          <h3 className={`font-medium ${alertStyle.textColor}`}>
            {title || defaultTitles[type] || "Notification"}
          </h3>
          <div className="mt-1 text-sm text-gray-700">{message}</div>
        </div>
        
        {onClose && (
          <button 
            type="button" 
            className="ml-auto -mx-1.5 -my-1.5 rounded-lg p-1.5 inline-flex items-center justify-center h-8 w-8 text-gray-500 hover:bg-gray-200/50 focus:outline-none"
            onClick={onClose}
          >
            <span className="sr-only">Close</span>
            <svg className="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};

export default Alert;