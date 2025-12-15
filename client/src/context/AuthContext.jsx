import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkLoggedIn = async () => {
            const token = localStorage.getItem('token');
            const storedUser = localStorage.getItem('user');

            if (token && storedUser) {
                setUser(JSON.parse(storedUser));
                // Optional: Verify token with backend
            }
            setLoading(false);
        };

        checkLoggedIn();
    }, []);

    const login = async (email, password) => {
        try {
            const res = await axios.post('http://localhost:5000/api/auth/login', { email, password });
            const { token, user } = res.data;

            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));
            setUser(user);
            return { success: true };
        } catch (error) {
            console.error("Login failed", error);
            return {
                success: false,
                message: error.response?.data?.message || 'Login failed'
            };
        }
    };

    const signup = async (name, email, password, phone) => {
        try {
            const res = await axios.post('http://localhost:5000/api/auth/register', { name, email, password, phone });
            const { token, user } = res.data;

            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));
            setUser(user);
            return { success: true };
        } catch (error) {
            console.error("Signup failed", error);
            let message = 'Signup failed';
            if (error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                message = error.response.data?.message || 'Server returned an error';
            } else if (error.request) {
                // The request was made but no response was received
                message = 'Network error. Please check your connection and server status.';
            } else {
                // Something happened in setting up the request that triggered an Error
                message = error.message;
            }
            return {
                success: false,
                message: message
            };
        }
    };

    const updateUser = (userData) => {
        // Merge with existing user data to keep other fields
        setUser(prevUser => {
            const newUser = { ...prevUser, ...userData };
            localStorage.setItem('user', JSON.stringify(newUser));
            return newUser;
        });
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, signup, logout, updateUser }}>
            {children}
        </AuthContext.Provider>
    );
};
