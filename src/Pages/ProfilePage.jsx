import React, { useEffect, useState } from 'react';
import { IoPerson } from "react-icons/io5";
import axios from 'axios';
import api from '../services/api';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const ProfilePage = () => {
    const [profile, setProfile] = useState({
        _id: "",
        email: '',
        username: "",
        sites: []
    });

    const navigate = useNavigate();
    const [isEditing, setIsEditing] = useState(false);
    const [updating, setUpdating] = useState(false);
    const [cancelling, setCancelling] = useState(false);
    const [deletionTrigger, setDeletionTrigger] = useState(false);
    const [confriming, setConfriming] = useState(false);

    useEffect(() => {
        const savedUser = localStorage.getItem('User');
        if (savedUser) {
            const parsedUser = JSON.parse(savedUser);
            setProfile(parsedUser);
        } else {
            alert("No user logged in");
        }
    }, []);

    const handleCancelScans = () => {
        setCancelling(true);
        api.post("/schedule/stop-cron", { userId: profile._id })
            .then(res => {
                setCancelling(false);
                toast.success(res.data.message);
            })
            .catch(err => {
                setCancelling(false);
                toast.error(err);
            });
    };

    const deleteProfileSwitch = () => {
        setDeletionTrigger(!deletionTrigger);
    };

    const handleEditProfile = () => {
        setIsEditing(!isEditing);
    };

    const handleSaveProfile = () => {
        setUpdating(true);
        api.post("/auth/updateUser", { userId: profile._id, email: profile.email, username: profile.username })
            .then(res => {
                if (res.data.message === "User updated successfully") {
                    setUpdating(false);
                    localStorage.setItem("User", JSON.stringify(res.data.user));
                    window.location.reload();
                } else {
                    setUpdating(false);
                    toast.error(`${res.data.message}`);
                }
            })
            .catch(err => {
                setUpdating(false);
                toast.error(`${err.response.data.error[0].msg}`);
                console.log(err.response.data.error[0].msg);
            });
    };

    const confirmDeletion = () => {
        setConfriming(true);
        api.post("/auth/deleteUser", { userId: profile._id })
            .then(res => {
                if (res.data.message === "User deleted successfully") {
                    setConfriming(false);
                    localStorage.removeItem("User");
                    navigate("/");
                } else {
                    setConfriming(false);
                    toast.error(`${res.data.message}`);
                    console.log(`${res.data.message}`);
                }
            })
            .catch(err => {
                setConfriming(false);
                console.log(`${err.response.data}`);
                toast.error(`${err.response.data}`);
            });
    };

    const handleChange = (e) => {
        setProfile({ ...profile, [e.target.name]: e.target.value });
    };

    return (
        <div className='w-full h-screen'>
            <div className='flex flex-col justify-center items-center pt-4'>
                <div className='flex p-4 rounded border w-3/4 bg-gray-800 gap-12'>
                    <IoPerson className="text-10xl" />
                    <div className='w-full'>
                        <label className="mb-2">Username:</label>
                        <input
                            type="text"
                            name="username"
                            value={profile.username}
                            onChange={handleChange}
                            className="w-full p-2 mb-3 bg-gray-700 text-white rounded"
                            readOnly={!isEditing}
                        />
                        <label className="mb-2">Email:</label>
                        <input
                            type="email"
                            name="email"
                            value={profile.email}
                            onChange={handleChange}
                            className="w-full p-2 mb-3 bg-gray-700 text-white rounded"
                            readOnly={!isEditing}
                        />
                        <h5>{`Number of sites: ${profile.sites.length}`}</h5>
                        <div className='flex justify-end'>
                            {isEditing ? (
                                <div className='flex gap-2'>
                                    <button onClick={handleEditProfile} className="bg-red-500 text-white px-4 py-2 rounded">Cancel</button>
                                    <button disabled={updating} onClick={handleSaveProfile} className="bg-green-500 text-white px-4 py-2 rounded">{updating ? <span className="animate-spin">Loading...</span> : `Save Profile`}</button>
                                </div>
                            ) : (
                                <button onClick={handleEditProfile} className="bg-blue-500 text-white px-4 py-2 rounded">Edit Profile</button>
                            )}
                        </div>
                    </div>
                </div>

                <div className='w-3/4 mt-5'>
                    <h4>Frequently Asked Questions</h4>
                    <div className="border rounded">
                        <div className="p-4">
                            <h5>How do I cancel any Schedule Scans I initiated?</h5>
                            <p>If you have set up any scheduled scans and want to cancel them, you can easily do so by clicking the "Check & Cancel" button below. This will remove all scheduled scans that are currently set up for your account.</p>
                            <div className='flex justify-end mt-2'>
                                <button disabled={cancelling} onClick={handleCancelScans} className="bg-red-500 text-white px-4 py-2 rounded">{cancelling ? <span className="animate-spin">Loading...</span> : `Check & Cancel`}</button>
                            </div>
                        </div>
                    </div>
                    <div className="border rounded mt-4">
                        <div className="p-4">
                            <h5>How do I delete my profile?</h5>
                            <p>Deleting your profile will remove all your data from our system, including any saved sites and scan results. This action is irreversible. If you are sure you want to proceed, click the "Delete Profile" button below.</p>
                            <div className='flex justify-end mt-2'>
                                <button onClick={deleteProfileSwitch} className="bg-red-500 text-white px-4 py-2 rounded">Delete Profile</button>
                            </div>
                        </div>
                    </div>
                </div>

                {deletionTrigger && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                        <div className="bg-gray-800 p-4 rounded">
                            <h2>Are You Sure?</h2>
                            <p>Please take note that the action you are about to do is <strong>IRREVERSIBLE</strong></p>
                            <div className="flex justify-end gap-2">
                                <button onClick={deleteProfileSwitch} className="bg-gray-500 text-white px-4 py-2 rounded">Close</button>
                                <button onClick={confirmDeletion} className="bg-red-500 text-white px-4 py-2 rounded">{confriming ? <span className="animate-spin">Loading...</span> : `Confirm`}</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProfilePage;