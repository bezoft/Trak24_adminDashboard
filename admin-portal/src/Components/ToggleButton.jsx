import React from "react";

const ToggleButton = ({ isToggled, onToggle }) => {
  return (
    <button
      onClick={onToggle}
      className={`relative w-16 h-8 rounded-full transition-colors duration-300 ${
        isToggled ? "bg-green-500" : "bg-gray-400"
      }`}
    >
      <span
        className={`absolute left-1 top-1 w-6 h-6 bg-white rounded-full shadow-md transform transition-transform duration-300 ${
          isToggled ? "translate-x-8" : "translate-x-0"
        }`}
      />
    </button>
  );
};

export default ToggleButton;
