import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-gray-800 text-white py-4 flex justify-between items-center">
      <div className="text-left">
        <h1 className="text-2xl font-bold">ECOMMERCE</h1>
      </div>
      <div className="text-center flex">
        <ul className="flex">
          <li className="ml-4">Categories</li>
          <li className="ml-4">Sales</li>
          <li className="ml-4">Clearnance</li>
          <li className="ml-4">NewStock</li>
          <li className="ml-4">Trending</li>
        </ul>
      </div>
    </header>
  );
};

export default Header;
