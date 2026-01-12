import React from "react";

const RestrictedMessage = () => {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="bg-white shadow-lg rounded-xl p-8 text-center max-w-md">
        <h2 className="text-xl font-semibold text-red-600 mb-3">
          Access Restricted
        </h2>
        <p className="text-gray-600">
          This page is restricted, and access is not permitted at this time.
        </p>
      </div>
    </div>
  );
};

export default RestrictedMessage;
