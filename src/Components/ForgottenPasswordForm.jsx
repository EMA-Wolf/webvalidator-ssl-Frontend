import React, { useState } from 'react';
import axios from 'axios';
import api from '../services/api';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const ForgottenPasswordForm = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);

        if (!email) {
            setLoading(false);
            toast.error('Please enter your email address.');
            return;
        }

        // Send email to backend to reset password
        api.post("/auth/request-password-reset", { email }).then(res => {
            if (res.data.message === 'Password reset link has been sent to your email') {
                setLoading(false);
                setSent(true);
                toast.success(`${res.data.message}`);
            } else {
                setLoading(false);
                toast.error(`${res.data.message}`);
            }
        }).catch(err => {
            setLoading(false);
            toast.error(err)
        });

    };

    return (
        <div className="bg-gray-800 p-4 rounded">
            <form onSubmit={handleSubmit} className="space-y-4">
                {sent ? (
                    <>
                        <p className="text-white mb-4">An email has been sent to {email}. Please check your inbox.</p>
                        <button
                            type="button"
                            onClick={() => navigate('/')}
                            className="w-full py-3 bg-blue-500 text-white rounded hover:bg-blue-600"
                        >
                            Return to Login
                        </button>
                    </>
                ) : (
                    <>
                        <h2 className="text-white mb-4">Forgot Password</h2>
                        <p className="text-center text-white">Enter your email address to reset your password.</p>
                        <div className="flex flex-col gap-2">
                            <label className="text-white">Email:</label>
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="w-full p-3 bg-gray-700 border border-gray-700 text-white rounded"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            <button
                                type="submit"
                                className="w-full py-3 bg-blue-500 text-white rounded hover:bg-blue-600"
                            >
                                {loading ? <span className="spinner-border" /> : 'Send Reset Link'}
                            </button>
                        </div>
                    </>
                )}
            </form>
        </div>
    );
};

export default ForgottenPasswordForm;
