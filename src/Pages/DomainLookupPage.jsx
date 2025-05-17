import React, { useState } from 'react';
import axios from 'axios';
import api from '../services/api';

const parseWhoisData = (data) => {
    if (!data) {
        return [];
    }
    const lines = data.split('\n');
    const whoisInfo = [];

    lines.forEach(line => {
        const trimmedLine = line.trim();
        if (trimmedLine) {
            const [key, ...value] = trimmedLine.split(':');
            if (key && value.length) {
                whoisInfo.push({ key: key.trim(), value: value.join(':').trim() });
            } else {
                whoisInfo.push({ key: '', value: trimmedLine });
            }
        }
    });

    return whoisInfo;
};

const DomainLookupPage = () => {
    const [Site, setSite] = useState({ name: '' })
    const [domainDetails, setDomainDetails] = useState(null)
    const [isSingleProcessing, setIsSingleProcessing] = useState(false)
    const [urltrigger, setUrltrigger] = useState(false)

    const handleSubmit = (e) => {
        e.preventDefault()

        const urlRegex = /^(https?:\/\/)?([a-zA-Z0-9.-]+\.[a-zA-Z]{2,})(\/\S*)?$/;
        let domain = Site.name.trim();

        // Sanitize the input to remove http://, https://, www., and trailing slashes
        domain = domain.replace(/^(https?:\/\/)?(www\.)?/, '').replace(/\/$/, '');

        if (domain !== '' && urlRegex.test(domain)) {
            setIsSingleProcessing(true)

            api.post("/scan/domain", { domain }).then(res => {
                console.log(res.data.details)
                const whoisData = parseWhoisData(res.data.details);
                setDomainDetails(whoisData);
                setUrltrigger(false)
                setIsSingleProcessing(false)
            }).catch(err => {
                console.log(err)
                setIsSingleProcessing(false);
            })
        }
        else {
            setUrltrigger(true)
            // Clear the error message after 2 seconds
            setTimeout(() => {
                setUrltrigger(false)
            }, 2000)

            setIsSingleProcessing(false)
        }
    }

    return (
        <div className="w-full h-screen px-4 pt-4 overflow-y-scroll">
            <nav className="flex flex-col gap-4 p-4 rounded border bg-gray-800" id="inputfield">
                <h4 className="text-white">Look Up a Site</h4>

                <div>
                    <input
                        placeholder="Example.com"
                        value={Site.name}
                        onChange={(e) => setSite({ ...Site, name: e.target.value })}
                        className="w-full p-3 bg-gray-700 text-white border-none rounded"
                    />

                    {urltrigger && (
                        <div className="text-red-500">Please enter a valid URL</div>
                    )}
                </div>

                <div className="flex justify-end">
                    <button
                        onClick={handleSubmit}
                        disabled={isSingleProcessing}
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    >
                        {isSingleProcessing ? <span className="spinner-border" /> : 'Look Up'}
                    </button>
                </div>
            </nav>

            {domainDetails &&

                <div className="flex flex-col gap-1">
                    <h4 className="mt-2 text-white">Domain Details</h4>
                    <nav className="flex flex-col gap-4 p-4 rounded border bg-gray-800" id="inputfield">
                        {domainDetails.map((detail, index) => (
                            <div key={index} className="text-white">
                                <strong>{detail.key}:</strong> {detail.value}
                            </div>
                        ))}
                    </nav>
                </div>
            }
        </div>
    )
}

export default DomainLookupPage
