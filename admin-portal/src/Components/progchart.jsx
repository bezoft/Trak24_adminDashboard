import React, { useState, useEffect } from "react";

const ProgressBarChart = ({ label, total, active, isDarkMode }) => {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const progressValue = (active / total) * 100;
        setProgress(progressValue);
    }, [total, active]);

    return (
        <div className="w-full max-w-md mx-auto">
            {/* Label for "Users" */}
            <div className="flex justify-between">
                <h1 className={`mb-2 text-sm ${isDarkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                >
                    {label}
                </h1>

                <h1 className="text-sm">{active}</h1>
            </div>

            {/* Progress bar container */}
            <div
                className={`w-full h-2 rounded-full overflow-hidden ${isDarkMode ? "bg-[#2d2d2e]" : "bg-gray-200"
                    }`}
            >
                {/* Progress bar */}
                <div
                    className={`h-full rounded-full transition-all duration-1000 ease-in-out ${isDarkMode ? "bg-orange-400" : "bg-orange-500"
                        }`}
                    style={{ width: `${progress}%` }}
                ></div>
            </div>
            <div
                className={`flex justify-between mt-2 text-sm ${isDarkMode ? "text-gray-300" : "text-gray-700"
                    }`}
            >
                <span></span>

            </div>
        </div>
    );
};

export default ProgressBarChart;
