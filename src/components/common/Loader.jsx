import React from 'react';
import '../css/common/Loader.css';

const Loader = ({ text = 'Loading...' }) => {
  return (
    <div className="loader-container">
      <div className="loader-spinner"></div>
      <div className="loader-text">{text}</div>
    </div>
  );
};

export default Loader;