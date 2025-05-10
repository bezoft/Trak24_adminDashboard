import { useState } from 'react';

// TruncatedAddress component that shows truncated text with expand/collapse functionality
export const TruncatedGeoAdrs = ({ fullAddress, maxLength = 70 }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  
  // Check if the address needs truncation
  const needsTruncation = fullAddress.length > maxLength;
  
  // Create truncated version if needed
  const truncatedText = needsTruncation 
    ? fullAddress.substring(0, maxLength) + '...' 
    : fullAddress;
  
  // Toggle expanded state
  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };
  
  return (
    <span
        className={`text-sm text-gray-700 dark:text-gray-300 hover:text-orange-500 dark:hover:text-orange-200 ${needsTruncation ? 'cursor-pointer' : ''}`}
        onClick={needsTruncation ? toggleExpand : undefined}
      >
        {isExpanded ? fullAddress : truncatedText}
      </span>
  );
};