import axios from 'axios';
import React, { useState } from 'react'
import { Form, Button, Alert, Spinner } from 'react-bootstrap';

const SslGeneratorForm = ({ setCertificate }) => {
    const [details, setDetails] = useState({
        domain: "",
        email: ''
    })

    const [loading, setLoading] = useState(false);
    const [loading2, setLoading2] = useState(false);
    const [error, setError] = useState(null);
    // const [certificateData, setCertificateData] = useState(null);
    const [challengeData, setChallengeData] = useState(null);
    const [message, setMessage] = useState('')


    const handleSubmit = (e) => {
        e.preventDefault()
        setLoading(true);
        setError(null);
        setChallengeData(null);
        setCertificate(null);

        // axios.post("https://webvalidator-ssl-backend.onrender.com/api/ssl/generate-cert", details).then(res=>{
        //     setLoading(false)

        //     if(res.data.error){
        //         console.log(res.data.error)
        //     }

        //     setCertificateData(res.data.cert)
        // }).catch(err=>{
        //     console.log(err)
        //     setLoading(false);
        // })

        axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/ssl/generate-cert`, details).then(res => {
            setLoading(false);

            if (res.data.error) {
                setError(res.data.error);
                return;
            }

            setChallengeData(res.data.challengeData);
            setMessage(res.data.message)
        }).catch(err => {
            setError(err.message);
            setLoading(false);
        });

        // console.log(details)
    }


   
    const handleDownloadChallenge = () => {
        const element = document.createElement('a');
        const file = new Blob([challengeData.keyAuthorization],{ type: 'application/octet-stream' });
        element.href = URL.createObjectURL(file);
        element.download = challengeData.httpChallenge.token; 
        element.click();
    };


    const handleVerifyChallenge = () => {
        setLoading2(true);

        axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/ssl/verify-domain`, { challengeData, domain: details.domain }).then(res => {
            if (res.data.error) {
                setLoading(false);
                setError(res.data.error)
                return
            }

            // setCertificateData(res.data.sslCertificate)
            setLoading2(false);
            setCertificate(res.data.sslCertificate)
            alert('Domain verified and SSL Certificate generated successfully.');
        }).catch(err => {
            setLoading2(false);
            setError('Error verifying domain.');
        })
    };

    // console.log(challengeData)
    // console.log(certificateData)

    return (
        <div style={{ backgroundColor: "#242627" }} className='p-4 w-50 rounded'>

            <div className='d-flex flex-column align-items-center'>
                <h3>Free SSL Certificate Generator</h3>
                <p>Create a Free Let's Encrypt SSL Certificate in a few minutes.</p>
            </div>

            <Form onSubmit={handleSubmit}>
                <Form.Group className='mb-3'>
                    <Form.Label>Enter Domain Name</Form.Label>

                    <Form.Control
                        type='text'
                        placeholder='Enter your domain name(s)'
                        value={details.domain}
                        onChange={(e) => setDetails({ ...details, domain: e.target.value })}
                        required
                        style={{ padding: "0.8rem" }}
                    />

                </Form.Group>

                <Form.Group className='mb-3'>
                    <Form.Label>Enter your email</Form.Label>

                    <Form.Control
                        type='email'
                        placeholder='Enter your email address'
                        value={details.email}
                        onChange={(e) => setDetails({ ...details, email: e.target.value })}
                        required
                        style={{ padding: "0.8rem" }}
                    />

                </Form.Group>



                <Button variant='primary' type='submit' disabled={loading}>
                    {loading ? 'Generating...' : 'Create free SSL Certificate'}
                </Button>

                {error && <Alert variant='danger' className='mt-3'>{error}</Alert>}

                {challengeData && (
                    <div className='mt-3'>
                        <h5 style={{ marginBottom: "1rem", marginTop: "1rem" }}>Download and Verify Challenge File</h5>
                        <h5 style={{ marginBottom: "1rem", marginTop: "1rem" }}>{message}</h5>
                        <Button variant='secondary' onClick={handleDownloadChallenge} style={{ marginRight: "1rem" }}>Download Challenge File</Button>
                        <Button variant='secondary' onClick={handleVerifyChallenge} className='ml-2'>{loading2 ? <Spinner animation="border" /> : `Verify Challenge`}</Button>
                    </div>
                )}


                {/* {certificateData && (
                    <Alert variant='success' className='mt-3' style={{overflowY:"scroll"}}>
                        <h5>Certificate Generated Successfully</h5>
                        <p>Private Key:</p>
                        <pre>{certificateData.privateKey}</pre>
                        <p>Certificate:</p>
                        <pre>{certificateData.certificate}</pre>
                    </Alert>
                )} */}

            </Form>
        </div>
    )
}

export default SslGeneratorForm
