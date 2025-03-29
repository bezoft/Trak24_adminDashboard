import React, { createContext, useEffect, useState, useContext } from 'react';

// Create Context
const AuthContext = createContext();

// Theme Provider Component
export const AuthProvider = ({ children }) => {
    const secretKey = "#TRAK24,#TRAK";

    // Simple encryption function
    const encryptData = (data) => {
        const stringifiedData = JSON.stringify(data);
        const encodedData = btoa(stringifiedData + secretKey);
        localStorage.setItem('#89ADDET21', encodedData)
    }

    // Simple decryption function
    const decryptData = () => {
        const encryptedData = localStorage.getItem('#89ADDET21')
        const decodedData = atob(encryptedData); // Decode Base64
        const originalData = decodedData.replace(secretKey, '');
        return JSON.parse(originalData);  // Remove the secret key to get the original data
    }

    return (
        <AuthContext.Provider value={{ encryptData, decryptData }}>
            {children}
        </AuthContext.Provider>
    );
};

// Custom Hook to use AuthContext
export const useAuth = () => useContext(AuthContext);
