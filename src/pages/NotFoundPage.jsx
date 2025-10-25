import React from "react";
import { Link } from "react-router-dom";

const NotFoundPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center px-4">
      <h1 className="text-9xl font-extrabold text-amber-500 tracking-wider">
        404
      </h1>
      <h2 className="text-3xl font-bold text-gray-800 mt-4">Page Not Found</h2>
      <p className="text-gray-600 mt-2 max-w-md">
        Sorry, we couldn't find the page you're looking for. It might have been
        moved, deleted, or you might have mistyped the address.
      </p>
      <Link
        to="/"
        className="mt-8 px-6 py-3 bg-amber-500 text-white font-semibold rounded-lg shadow-md hover:bg-amber-600 transition-colors duration-300"
      >
        Go Back Home
      </Link>
    </div>
  );
};

export default NotFoundPage;
