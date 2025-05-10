import { useState } from 'react';

// TruncatedAddress component that shows truncated text with expand/collapse functionality
export const TruncatedAddress = ({ address, maxLength = 50 }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Create the full address string
  const fullAddress = `${address.street}, ${address.district}-${address.pinCode}, Ph: ${address.landline}`;
  
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