import React from "react";

const LastUpdated = ({ updates }) => {
    if (!updates || updates.length === 0) {
        return  <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-300 text-center">None</td>
    }
console.log(updates,"uppp");

    // Get the most recent update (assuming updates are sorted by `datetime`)
    const lastUpdate = updates[updates.length - 1];
    
    return (
        <td className="py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
        <div className="flex flex-col">
            <span className="font-medium">{lastUpdate.updatedBy}</span>
            <span className="text-gray-500 dark:text-gray-400 text-xs">{lastUpdate.datetime}</span>
        </div>
    </td>
    );
};

export default LastUpdated;
