import React from "react";

const LastUpdated = ({ updates }) => {
    if (!updates || updates.length === 0) {
        return  <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-300 text-center">None</td>
    }
console.log(updates,"uppp");

    // Get the most recent update (assuming updates are sorted by `datetime`)
    const lastUpdate = updates[updates.length - 1];
    
    return (
        <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-300 text-center">{lastUpdate.updatedBy}<br/>{lastUpdate.datetime}</td>
    );
};

export default LastUpdated;
