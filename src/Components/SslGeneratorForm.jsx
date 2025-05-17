import axios from 'axios';
import api from '../services/api';
import React, { useState } from 'react';

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

       api.post("/api/ssl/generate-cert", details).then(res => {
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
        const file = new Blob([challengeData.keyAuthorization], { type: 'application/octet-stream' });
        element.href = URL.createObjectURL(file);
        element.download = challengeData.httpChallenge.token;
        element.click();
    };


    const handleVerifyChallenge = () => {
        setLoading2(true);

        api.post("/api/ssl/verify-domain", { challengeData, domain: details.domain }).then(res => {
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
        <div className="bg-gray-800 p-4 w-[30rem] h-screen rounded">
            <div className="flex flex-col items-center">
                <h3 className="text-white">Free SSL Certificate Generator</h3>
                <p className="text-gray-400">Create a Free Let's Encrypt SSL Certificate in a few minutes.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="mb-3">
                    <label className="block text-white">Enter Domain Name</label>
                    <input
                        type='text'
                        placeholder='Enter your domain name(s)'
                        value={details.domain}
                        onChange={(e) => setDetails({ ...details, domain: e.target.value })}
                        required
                        className="w-full p-3 bg-gray-700 border border-gray-700 text-white rounded"
                    />
                </div>

                <div className="mb-3">
                    <label className="block text-white">Enter your email</label>
                    <input
                        type='email'
                        placeholder='Enter your email address'
                        value={details.email}
                        onChange={(e) => setDetails({ ...details, email: e.target.value })}
                        required
                        className="w-full p-3 bg-gray-700 border border-gray-700 text-white rounded"
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                    {loading ? 'Generating...' : 'Create free SSL Certificate'}
                </button>

                {error && <div className="mt-3 text-red-500">{error}</div>}

                {challengeData && (
                    <div className="mt-3">
                        <h5 className="mb-4 mt-4 text-white">Download and Verify Challenge File</h5>
                        <h5 className="mb-4 mt-4 text-white">{message}</h5>
                        <button
                            onClick={handleDownloadChallenge}
                            className="mr-4 py-2 px-4 bg-gray-600 text-white rounded hover:bg-gray-700"
                        >
                            Download Challenge File
                        </button>
                        <button
                            onClick={handleVerifyChallenge}
                            className="py-2 px-4 bg-gray-600 text-white rounded hover:bg-gray-700"
                        >
                            {loading2 ? <span className="spinner-border" /> : 'Verify Challenge'}
                        </button>
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

            </form>
        </div>
    )
}

export default SslGeneratorForm
