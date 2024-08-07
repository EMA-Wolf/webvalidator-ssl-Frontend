import React, { useState } from 'react';
import { Form, Button, Spinner } from "react-bootstrap";
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const ForgottenPasswordForm = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [sent , setSent] = useState(false);
    const navigate = useNavigate()

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);

        if (!email) {
            setLoading(false);
            toast.error('Please enter your email address.');
            return;
        }

        // Send email to backend to reset password
        axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/auth/request-password-reset`, { email }).then(res => {
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
        <div>
            <Form style={{ backgroundColor: "#242627" }} className='p-4 rounded' onSubmit={handleSubmit}>
                {sent?<>
                <p className="text-white mb-4">An email has been sent to {email}. Please check your inbox.</p>
                <Button variant="primary" type="button" onClick={() => navigate("/")}>
                    Return to Login
                </Button>
                </>
                :<>
                <h2 className="text-white mb-4">Forgot Password</h2>
                <p className="text-center text-white">Enter your email address to reset your password.</p>
                <Form.Group className="d-flex flex-column gap-2" controlId="formBasicEmail">
                    <Form.Label>Email:</Form.Label>
                    <Form.Control
                        type="email"
                        placeholder="Enter your email"
                        style={{ padding: '1rem', backgroundColor: "#605C5C", border: "#605C5C", color: "white" }}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <Form.Text className="text-muted"></Form.Text>
                    <Button variant="primary" type="submit" style={{ padding: "0.9rem" }}>{loading ? <Spinner animation="border" /> : `Send Reset Link`}</Button>
                </Form.Group>
                </>
                }
            </Form>
        </div>
    );
};

export default ForgottenPasswordForm;
