import React, { createContext, useState, useEffect } from 'react';
import axiosInstance from '../api/axios';

// Context to manage user authentication and role
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const response = await axiosInstance.get('api/users/profile/', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                setUser(response.data);
            } catch (error) {
                setError("Failed to fetch user profile.");
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        if (token) {
            fetchUserProfile();
        } else {
            setLoading(false);
        }
    }, [token]);

    return (
        <AuthContext.Provider value={{ user, loading, error }}>
            {children}
        </AuthContext.Provider>
    );
};
