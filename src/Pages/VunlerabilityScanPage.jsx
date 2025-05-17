import React, { useEffect, useState } from 'react'
import axios from "axios"
import api from '../services/api'
import VunlerabilityTable from '../Components/VunlerabilityTable'

const VunlerabilityScanPage = () => {

  const [User, setUser] = useState({
    id: "",
    email: '',
    username: "",
    sites: []
  })

  const [vunlerabilityScanTrigger, setVunlerabilityScanTrigger] = useState(false)
  const [vunlerabilityList, setVunlerabilityList] = useState([])
  const [showTable, setShowTable] = useState(false)
  const [domain, setDomain] = useState("")
  const [showProgressBar, setShowProgressBar] = useState(false)
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const savedUser = localStorage.getItem('User');

    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      setUser(parsedUser);
    }

  }, [])

  const vunlerabilityScanSwitch = () => {
    setVunlerabilityScanTrigger(!vunlerabilityScanTrigger)
  }

  const confrimScan = () => {
    setVunlerabilityScanTrigger(!vunlerabilityScanTrigger)
    setShowProgressBar(true)

    const extractDomain = domain.replace(/^(https?:\/\/)?(www\.)?|\/$/g, "")

    const pollProgress = () => {
      api.get(`/scan/vunlerabilityScanProgress/${User.username}`)
        .then(res => {
          setProgress(res.data.progress);

          if (res.data.progress <= 99) {
            setTimeout(pollProgress, 1000); // Poll every second
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

    api.post("/scan/vunlerabilityScan", { username: User.username, domain: extractDomain }).then(res => {

      if (res.data.errors === 'Failed to scan domain') {
        alert('Error: ' + res.data.errors);
      }

      if (res.data.scanResults) {
        console.log(res.data.scanResults)
        setShowProgressBar(false);
        setProgress(100)
        setVunlerabilityList(res.data.scanResults.uniqueAlerts);
        setShowTable(true);

      } else {
        alert('Error: Failed to initiate scan')
      }
    }).catch(err => alert(err));
  }


  const handleSubmit = (e) => {
    e.preventDefault()
    const urlRegex = /^(https?:\/\/)?([a-zA-Z0-9.-]+\.[a-zA-Z]{2,})(\/\S*)?$/;
    // Validate URL format
    if (domain.trim() !== "" && urlRegex.test(domain.trim())) {
      vunlerabilityScanSwitch()
    } else {
      alert("Invalid URL")
    }
  }

  // console.log(User)
  return (
    <div className='w-full h-screen relative overflow-y-scroll'>

      <div className='flex justify-center mt-4 px-4'>
        <div className='flex flex-col gap-4 p-4 rounded border w-full bg-gray-800'>
          <h1 className='text-white'>Vulnerability Scan</h1>

          <form onSubmit={handleSubmit} className='flex flex-row gap-2'>
            <input value={domain} onChange={e => setDomain(e.target.value)} type='text' className='p-3 bg-gray-700 text-white border-none rounded' placeholder='https://example.com or example.com' />
            <button disabled={showProgressBar} type='submit' className='bg-blue-500 text-white px-4 py-2 rounded'>{showProgressBar ? <span className="animate-spin">Loading...</span> : `Scan`}</button>
          </form>
        </div>
      </div>


      {
        showProgressBar &&
        <div className='flex w-full justify-center mt-1'>
          <div className="w-3/4 bg-gray-700 rounded-full h-2.5">
            <div className="bg-blue-500 h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
          </div>
        </div>
      }


      {/* Confirmation modal for scanning site */}
      {vunlerabilityScanTrigger &&
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-10">
          <div className="bg-gray-800 p-5 rounded w-1/2" onClick={(e) => e.stopPropagation()}>
            <h1 className='text-red-500'>Warning!!⚠️</h1>

            <p className='text-wrap text-lg'>Scanning a site can cause it to malfunction. Ensure you have permission before proceeding.</p>

            <p className='text-wrap text-lg'>Proceed to scan site?</p>

            <div className='flex justify-end gap-3'>
              <button onClick={vunlerabilityScanSwitch} className="bg-red-500 text-white px-4 py-2 rounded">No</button>
              <button onClick={confrimScan} className="bg-green-500 text-white px-4 py-2 rounded">Yes</button>
            </div>
          </div>
        </div>}



      {/* Show vulnerability table if scan is completed */}
      {
        showTable && vunlerabilityList.length > 0 &&
        <VunlerabilityTable vList={vunlerabilityList} />
      }
    </div>
  )
}

export default VunlerabilityScanPage
