
import React, { useEffect, useState } from 'react';
import { IoPerson } from "react-icons/io5";
import { Button, Accordion, Spinner, Modal } from 'react-bootstrap';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const ProfilePage = () => {
    const [profile, setProfile] = useState({
        _id: "",
        email: '',
        username: "",
        sites: []
    });

    const navigate = useNavigate()

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
        axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/schedule/stop-cron`, { userId: profile._id })
            .then(res => {
                setCancelling(false);
                toast.success(res.data.message)
            })
            .catch(err => {
                setCancelling(false);
                toast.error(err)
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
        axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/auth/updateUser`, { userId: profile._id, email: profile.email, username: profile.username })
            .then(res => {
                if (res.data.message === "User updated successfully") {
                    setUpdating(false)
                    localStorage.setItem("User", JSON.stringify(res.data.user))
                    window.location.reload();
                } else {
                    setUpdating(false)
                    toast.error(`${res.data.message}`)
                }
            })
            .catch(err => {
                setUpdating(false)
                toast.error(`${err.response.data.error[0].msg}`)
                console.log(err.response.data.error[0].msg)
            });
    };

    const confirmDeletion = () => {
        setConfriming(true);
        axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/auth/deleteUser`, { userId: profile._id })
            .then(res => {
                if (res.data.message === "User deleted successfully") {
                    setConfriming(false);
                    localStorage.removeItem("User");
                    navigate("/");
                } else {
                    setConfriming(false);
                    toast.error(`${res.data.message}`)
                    console.log(`${res.data.message}`)
                }
            })
            .catch(err => {
                setConfriming(false);
                console.log(`${err.response.data}`)
                toast.error(`${err.response.data}`)
            });
    }

    const handleChange = (e) => {
        setProfile({ ...profile, [e.target.name]: e.target.value });
    };

    return (
        <div className='w-100 vh-100'>
            <div className='d-flex flex-column justify-content-center align-items-center pt-4'>
                <div className='d-flex p-4 rounded border w-75' id='inputfield' style={{ backgroundColor: "#242627", gap: "12rem" }}>
                    <IoPerson style={{ fontSize: "10rem" }} />

                    <div className='w-100'>
                        <label style={{ marginBottom: "0.5rem" }}>Username:</label>
                        <input
                            type="text"
                            name="username"
                            value={profile.username}
                            onChange={handleChange}
                            className="form-control mb-3"
                            style={{ backgroundColor: "#242627", color: "white", }}
                            readOnly={!isEditing}
                        />

                        <label style={{ marginBottom: "0.4rem" }}>Email:</label>
                        <input
                            type="email"
                            name="email"
                            value={profile.email}
                            onChange={handleChange}
                            className="form-control mb-3"
                            style={{ backgroundColor: "#242627", color: "white", }}
                            readOnly={!isEditing}
                        />

                        <h5>{`Number of sites: ${profile.sites.length}`}</h5>

                        <div className='d-flex justify-content-end'>
                            {isEditing ? (
                                <div className='d-flex gap-2'>
                                    <Button onClick={handleEditProfile} variant='danger'>Cancel</Button>
                                    <Button disabled={updating} onClick={handleSaveProfile} variant='success'>{updating ? <Spinner animation="border" /> : `Save Profile`}</Button>
                                </div>
                            ) : (
                                <Button onClick={handleEditProfile} variant='primary'>Edit Profile</Button>
                            )}
                        </div>
                    </div>
                </div>

                <div className='w-75 mt-5'>
                    <h4>Freqently Asked Questions</h4>

                    <Accordion>
                        <Accordion.Item eventKey="0" >
                            <Accordion.Header><h5>How do I cancel any Schedule Scans I initiated ?</h5></Accordion.Header>
                            <Accordion.Body>
                                span If you have set up any scheduled scans and want to cancel them, you can easily do so by clicking the "Check & Cancel" button below. This will remove all scheduled scans that are currently set up for your account.

                                <div className='d-flex justify-content-end mt-2'>
                                    <Button disabled={cancelling} onClick={handleCancelScans} variant='danger'>{cancelling ? <Spinner animation="border" /> : `Check & Cancel`}</Button>
                                </div>
                            </Accordion.Body>

                        </Accordion.Item>

                        <Accordion.Item eventKey="1">
                            <Accordion.Header>
                                <h5>How do I delete my profile?</h5>
                            </Accordion.Header>
                            <Accordion.Body>
                                Deleting your profile will remove all your data from our system, including any saved sites and scan results. This action is irreversible. If you are sure you want to proceed, click the "Delete Profile" button below.
                                <div className='d-flex justify-content-end mt-2'>
                                    <Button onClick={deleteProfileSwitch} variant='danger'>Delete Profile</Button>
                                </div>
                            </Accordion.Body>
                        </Accordion.Item>

                    </Accordion>
                </div>

                <Modal show={deletionTrigger} onHide={deleteProfileSwitch} size="lg" aria-labelledby="contained-modal-title-vcenter" centered>
                    <Modal.Header>
                        <Modal.Title>Are You Sure?</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>Please take note that the action you are about to do is <strong>IRREVERSIBLE</strong></Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={deleteProfileSwitch}>Close</Button>
                        <Button variant="danger" onClick={confirmDeletion}>{confriming ? <Spinner animation="border" /> : `Confrim`}</Button>
                    </Modal.Footer>
                </Modal>

            </div>
        </div>
    );
}

export default ProfilePage;