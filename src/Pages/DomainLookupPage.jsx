import {React,useState} from 'react'
import {Form, Button, Nav, Spinner, Alert} from 'react-bootstrap'
import axios from 'axios'

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
    const [Site, setSite] = useState({name: ''})
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

        axios.post("http://localhost:3002/api/scan/domain", { domain }).then(res=>{
            console.log(res.data.details)
            const whoisData = parseWhoisData(res.data.details);
            setDomainDetails(whoisData);
            setUrltrigger(false)
            setIsSingleProcessing(false)
        }).catch(err=>{
            console.log(err)
            setIsSingleProcessing(false);
        })
    }
    else {
        setUrltrigger(true)
        // Clear the error message after 2 seconds
        setTimeout(()=>{
            setUrltrigger(false)
        }, 2000)

        setIsSingleProcessing(false)
    }
}

  return (
    <div className='w-100 vh-100 pe-4 ps-4 pt-4' style={{overflowY:"scroll"}}>

                    <Nav className='d-flex flex-column gap-4 p-4 rounded border' id='inputfield' style={{ backgroundColor: "#242627" }}>

                    <h4>Look Up a Site</h4>

                    <div>
                    <Form.Control placeholder="Example.com" value={Site.name} onChange={e => setSite({...Site, name:e.target.value})} className='p-3' style={{ backgroundColor: "#605C5C", color: "white", border: "none" }} />

                        {urltrigger&&<Alert variant='danger' style={{background:"transparent", border:"none",  padding:"0rem", margin:"0rem"}}>Plesae enter a valid URL</Alert>}
                    </div>

                    <div className='d-flex justify-content-end'>

                    <Button onClick={handleSubmit} disabled={isSingleProcessing}>{isSingleProcessing ? <Spinner animation="border" />: "Look Up"}</Button>
                    </div>

                    </Nav>

                    {domainDetails && 
                    
                    <div className='d-flex flex-column gap-1' >
                        <h4 className='mt-2'>Domain Details</h4>
                        <Nav className='d-flex flex-column gap-4 p-4 rounded border' id='inputfield' style={{ backgroundColor: "#242627"}}>
                        {domainDetails.map((detail, index) => (
                            <div key={index} style={{ color: 'white' }}>
                                <strong>{detail.key}:</strong> {detail.value}
                            </div>
                        ))}
                        </Nav>
                        </div>
                        }
    </div>
  )
}

export default DomainLookupPage
