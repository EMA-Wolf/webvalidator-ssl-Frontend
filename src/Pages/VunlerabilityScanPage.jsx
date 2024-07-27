import React, { useEffect, useState } from 'react'
import {Form, Button, ProgressBar, Spinner} from "react-bootstrap"
import axios from "axios"
import VunlerabilityTable from '../Components/VunlerabilityTable'

const VunlerabilityScanPage = () => {

    const [User, setUser] = useState({
        id:"",
        email:'',
        username:"",
        sites:[]
      })

    const [vunlerabilityScanTrigger ,setVunlerabilityScanTrigger] = useState(false)
    const [vunlerabilityList,setVunlerabilityList] = useState([])
    const [showTable ,setShowTable] = useState(false)
    const [domain, setDomain] = useState("") 
    const [showProgressBar, setShowProgressBar] = useState(false) 
    const [progress, setProgress] = useState(0);

useEffect(()=>{
    const savedUser = localStorage.getItem('User');

    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      setUser(parsedUser);
    }

}, [])

 const vunlerabilityScanSwitch = () =>{
        setVunlerabilityScanTrigger(!vunlerabilityScanTrigger)
}

const confrimScan = () =>{
        setVunlerabilityScanTrigger(!vunlerabilityScanTrigger)
        setShowProgressBar(true)

        const extractDomain = domain.replace(/^(https?:\/\/)?(www\.)?|\/$/g, "")

        const pollProgress = () => {
            axios.get(`${import.meta.env.VITE_LOCAL_BACKEND_URL}/api/scan/vunlerabilityScanProgress/${User.username}`)
              .then(res => {

                setProgress(res.data.progress===100?0:res.data.progress);

                if (res.data.progress < 100) {
                  setTimeout(pollProgress, 100); // Poll every second
                } else {
                    setShowProgressBar(false);
                }
              })
              .catch(err => {
                alert(err);
                setShowProgressBar(false);
              });
          };

          pollProgress();

        axios.post(`${import.meta.env.VITE_LOCAL_BACKEND_URL}/api/scan/vunlerabilityScan`, {username:User.username, domain:extractDomain}).then(res=>{

            if(res.data.errors === 'Failed to scan domain'){
                alert('Error: ' + res.data.errors);
            }

            if(res.data.scanResults){
                setVunlerabilityList(res.data.scanResults.uniqueAlerts);
                setShowTable(true);

            }else{
                alert('Error: Failed to initiate scan')
            }
        }).catch(err=>alert(err));
}
      

  const handleSubmit = (e) => {
        e.preventDefault()
        const urlRegex = /^(https?:\/\/)?([a-zA-Z0-9.-]+\.[a-zA-Z]{2,})(\/\S*)?$/;
        // Validate URL format
        if (domain.trim() !== "" && urlRegex.test(domain.trim())) {
           vunlerabilityScanSwitch()
        }else{
            alert("Invalid URL")
        }
}

// console.log(User)
  return (
    <div className='w-100 vh-100' style={{position:"relative", overflowY:"scroll"}}>
        
        <div className='d-flex pe-4 ps-4 justify-content-center mt-4'>
            <div className='d-flex flex-column gap-4 p-4 rounded border w-100' id='inputfield' style={{ backgroundColor: "#242627" }}>
                <h1 className='text-white'>Vulnerability Scan</h1>

                <Form onSubmit={handleSubmit} className='d-flex flex-row gap-2'>
                    <Form.Control value={domain} onChange={e => setDomain(e.target.value)} type='text' className='form-control p-3' placeholder='https://example.com or example.com' />
                    <Button disabled={showProgressBar} type='submit' className='btn btn-primary'>{showProgressBar?<Spinner animation="border"/>:`Scan`}</Button>
                </Form>
            </div>
        </div>

{/* Show progress bar if scanning is in progress */}
{
    showProgressBar && 
    <div className='d-flex w-100 justify-content-center mt-1'>
        <ProgressBar variant='primary' 
          animated 
          now={progress} 
          min={0} 
          max={100} 
          label={`${progress}%`} 
         className='w-75'/>
    </div>
}


{/* Confirmation modal for scanning site */}
{vunlerabilityScanTrigger &&
<>
    <div onClick={vunlerabilityScanSwitch} style={{position:"absolute", top:"0rem",backgroundColor:"rgba(0, 0, 0, 0.4)", zIndex:1, color:"white"}} className='h-100 w-100 d-flex justify-content-center align-items-center'>

    <div style={{backgroundColor:"#151718", zIndex:2}} className='w-50 p-5 rounded' onClick={(e) => e.stopPropagation()}>
              <h1 className='text-danger'>Warning!!⚠️</h1>

          <p className='text-wrap' style={{fontSize:"1.2rem"}}>Scanning a site can cause it to malfunction. Ensure you have permission before proceeding.</p>

          <p className='text-wrap' style={{fontSize:"1.2rem"}}>Proceed to scan site?</p>

          <div className='d-flex justify-content-end gap-3'>
            <Button onClick={vunlerabilityScanSwitch} variant='danger'>No</Button>
            <Button onClick={confrimScan} variant='success'>Yes</Button>
          </div>
    </div>

    </div>
</>}



{/* Show vulnerability table if scan is completed */}
{
    showTable && vunlerabilityList.length>0 &&
    <VunlerabilityTable vList={vunlerabilityList}/>
}
    </div>
  )
}

export default VunlerabilityScanPage
