import { useState, useEffect } from 'react'
import React from 'react'
import { FaPlay } from "react-icons/fa";
import { IoPerson } from "react-icons/io5";
import { IoIosNotifications } from "react-icons/io";
import { MdOutlineScheduleSend } from "react-icons/md";
// import Container from 'react-bootstrap/Container';
// import Navbar from 'react-bootstrap/Navbar';
// import Button from 'react-bootstrap/Button';
// import Form from 'react-bootstrap/Form';
import dayjs from 'dayjs';
import DragDropFiles from '../Components/DragDropFiles';
import SitesTable from '../Components/SitesTable';
// import Alert from 'react-bootstrap/Alert';
import { toast } from 'react-toastify';
import { Spin,Progress } from 'antd';
import api from '../services/api'
import relativeTime from 'dayjs/plugin/relativeTime';
import updateLocale from 'dayjs/plugin/updateLocale';
import { useOutletContext, Link } from 'react-router-dom';
// import { Spinner, Dropdown, ProgressBar } from 'react-bootstrap';
// import SchedulePopUp from '../Components/SchedulePopUp';



dayjs.extend(relativeTime);
dayjs.extend(updateLocale);


const SiteCheckerPage = () => {
  const [User, setUser] = useState({
    id: "",
    email: '',
    username: "",
    sites: []
  })

  const { delPopUp, schedulingPopUp } = useOutletContext()
  const [lastRun, setLastRun] = useState('');
  const [toggle, setToggle] = useState(false)
  const [urltrigger, setUrltigger] = useState(false)
  const [siteList, setSiteList] = useState([])
  const [singleSite, setSingleSite] = useState({ name: "" })
  const [isSingleProcessing, setIsSingleProcessing] = useState(false)
  const [isRunAllProcessing, setIsRunAllProcessing] = useState(false)
  const [errorMessages, setErrorMessages] = useState([])
  const [tableTrigger, setTableTrigger] = useState(null)

  const [schedulingTrigger, setSchedulingTrigger] = useState(false)
  const [selectedSitesList, setSelectedSitesList] = useState([])

  const [selectedScheduledSitesList, setScheduledSelectedSitesList] = useState([])

  const [progress, setProgress] = useState(0);

  const toggleFileUpload = () => {
    setToggle(!toggle)
  }

  const addSingleSite = () => {
    const urlRegex = /^(https?:\/\/)?([a-zA-Z0-9.-]+\.[a-zA-Z]{2,})(\/\S*)?$/;

    let domain = singleSite.name.trim();

    // Sanitize the input to remove http://, https://, www., and trailing slashes
    domain = domain.replace(/^(https?:\/\/)?(www\.)?/, '').replace(/\/$/, '');

    if (singleSite.name.trim() !== "" && urlRegex.test(singleSite.name.trim())) {
      setIsSingleProcessing(true)

      // Retrieve the User object from localStorage
      const user = JSON.parse(localStorage.getItem('User'));

      api.post("/sites/getsiteinfo", { _id: user._id, name: domain, username: user.username }).then(res => {
        if (res.data.resultsResponse === null) {
          setErrorMessages(res.data.error)
          toast.error(res.data.error[0].status)
          setIsSingleProcessing(false)



          toast.error(res.data.error[singleSite.name].status !== "" ? res.data.error[singleSite.name].status : "Unable to find site")
          setSingleSite({ name: "" });
          // setToastTrigger(!toastTrigger)

          // setTimeout(()=>{
          //   setToastTrigger(!toastTrigger)
          // },3000)

        } else {

          user.sites = [...res.data.resultsResponse]

          // Save the updated User object back to localStorage
          localStorage.setItem('User', JSON.stringify(user));
          console.log('Updated User:', user);
          setIsSingleProcessing(false)
          setSingleSite({ name: "" });
          window.location.reload();
        }

        // user.sites= [...res.data.resultsResponse]

      }).catch(err => {
        console.log(err)
        setIsSingleProcessing(false);
      })

      // setSiteList([...siteList, singleSite]);
      // Clear the input field
    } else {
      // alert("Please enter a valid URL.");
      setUrltigger(!urltrigger)
      setTimeout(() => {
        setUrltigger(false)
      }, 2000);
    }
  };

  useEffect(() => {
    // Load details and last run time from local storage if available
    const savedLastRun = localStorage.getItem('lastRunTime');

    const savedUser = localStorage.getItem('User');

    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      setUser(parsedUser);

      if (parsedUser.sites && parsedUser.sites.length > 0) {
        setSiteList(parsedUser.sites);
      }
    }


    if (savedLastRun) {
      setLastRun(savedLastRun);
    }
  }, []);


  useEffect(() => {
    // Update the relative time every minute
    const interval = setInterval(() => {
      if (lastRun) {
        setLastRun(lastRun); // Force re-render
      }
    }, 60000);

    return () => clearInterval(interval);
  }, [lastRun]);


  const getGreeting = () => {
    const currentHour = new Date().getHours();
    if (currentHour < 12) {
      return "Good Morning";
    } else if (currentHour < 18) {
      return "Good Afternoon";
    } else {
      return "Good Evening";
    }
  };

  const getLastRunTime = (timestamp) => {
    const now = dayjs();
    const lastRunTime = dayjs(timestamp);

    if (now.isSame(lastRunTime, 'day')) {
      return `Last run: ${lastRunTime.format('h:mm A')}, Today`;
    } else if (now.subtract(1, 'day').isSame(lastRunTime, 'day')) {
      return `Last run: ${lastRunTime.format('h:mm A')}, Yesterday`;
    } else {
      return `Last run: ${lastRunTime.format('h:mm A, MMM D YYYY')}`;
    }
  };


  const runASite = (name) => {
    setTableTrigger(name)

    const user = JSON.parse(localStorage.getItem('User'));

    api.post("/sites/getsiteinfo", { _id: user._id, name }).then(res => {

      if (res.data.resultsResponse === null) {
        toast.error(`${res.data.error[0].status}`)
      }

      user.sites = [...res.data.resultsResponse]

      // Save the updated User object back to localStorage
      localStorage.setItem('User', JSON.stringify(user));
      setTableTrigger(null)
      toast.success(`Done checking site: ${name}`)
    }).catch(err => {
      console.log(err)
      setTableTrigger(null)
    })

  }

  const runAllChecks = () => {
    setIsRunAllProcessing(true)
    setProgress(0);
    // Retrieve the User object from localStorage
    const user = JSON.parse(localStorage.getItem('User'));

    if (user) {
      // Update the User.sites with siteList
      user.sites = siteList;

      const pollProgress = () => {
        api.get(`/sites/progress/${user.username}`)
          .then(res => {
            setProgress(res.data.progress === 100 ? 0 : res.data.progress);
            if (res.data.progress <= 100) {
              setTimeout(pollProgress, 1000); // Poll every second
            } else {
              setIsRunAllProcessing(false);
            }
          })
          .catch(err => {
            console.log(err);
            setIsRunAllProcessing(false);
          });
      };

      pollProgress();

      api.post("/sites/getallsitesinfo", user)
        .then(res => {
          // On success, update the User.sites array with the new data from the response
          user.sites = res.data.success;

          // Save the updated User object back to localStorage
          localStorage.setItem('User', JSON.stringify(user));
          setErrorMessages(res.data.errors)

          setIsRunAllProcessing(false); // Reset loading state

          const currentTime = new Date().toISOString();
          setLastRun(currentTime);
          localStorage.setItem('lastRunTime', currentTime);

          window.location.reload();


        })
        .catch(err => {
          console.log(err)
          setIsRunAllProcessing(false)
        });
    } else {
      console.error('User not found in localStorage');
      setIsRunAllProcessing(false)
    }
  };


  const schedulingSwitch = () => {
    setSchedulingTrigger(!schedulingTrigger)
  }

  const submitScheduling = () => {
    // TODO: Implement scheduling logic
    // Prompt the user to input the desired schedule time and frequency
    // Schedule the runAllChecks function at the specified time and frequency
    // You can use a library like 'node-schedule' or a cron job scheduler to achieve this
    console.log("Scheduling a run at the desired time and frequency");
    // setSchedulingTrigger(false); // Reset the scheduling form

  }

  const cancelScheduling = () => {
    // Cancel the scheduled runAllChecks function
    setScheduledSelectedSitesList([])
    // setSchedulingTrigger(false); // Reset the scheduling form
  }



  const handleDelete = () => {
    // console.log("Selected sites for deletion:", selectedSitesList);
    delPopUp(selectedSitesList)
    // Perform the delete operation or any other actions with the selected sites
  };

  const handleScheduling = () => {
    schedulingPopUp(selectedSitesList)
  }

  return (
    <div className='w-full h-screen overflow-y-scroll p-4'>
      
      {/* Header */}
      <div className='flex justify-between pb-4 border-b' id='navbar'>
        <div>
          <h3 className='text-2xl font-semibold'>{getGreeting()}, <span className="text-blue-500">{User.username}</span></h3>
          <p className="text-gray-500">Welcome to Site Guard Pro</p>
        </div>
        <div className='flex gap-5 items-center'>
          <button onClick={runAllChecks} className='flex items-center gap-2 p-4 bg-blue-500 text-white rounded' disabled={isRunAllProcessing}>
            {isRunAllProcessing ? <Spin /> : <> <FaPlay /> <span>Run all</span></>}
          </button>

          {/* <Button onClick={schedulingSwitch} style={{ padding: "1rem" }} className='d-flex align-items-center gap-2' disabled={isRunAllProcessing}>
            {isRunAllProcessing ? <Spinner animation="border" /> : <> <MdOutlineScheduleSend style={{fontSize:"1.4rem"}}/>
              <span>Schedule a Run</span></>}
          </Button> */}

          <div className='flex items-center'>
            <IoIosNotifications className="text-2xl text-white" />
            <span className="text-red-500">{errorMessages.length}</span>
          </div>

          {/* Account icon */}
          <Link to="/profile">
            <div className='p-2 rounded border bg-gray-800 text-xl'><IoPerson /></div>
          </Link>
        </div>
      </div>

{/* Drag and Drop Area */}
      <div className='relative mt-3 z-10'>
        <div className='flex flex-col gap-4 p-4 rounded border bg-gray-800'>
          <h4>Check your website</h4>

          <div className='w-full'>
            <input placeholder="Example.com" value={singleSite.name} onChange={e => setSingleSite({ ...singleSite, name: e.target.value })} className='p-3 bg-gray-700 text-white border-none rounded w-full' />

            {urltrigger && <p className="text-red-500">Please enter a valid URL</p>}
          </div>

          <div className='flex justify-between items-center'>
            <label onClick={toggleFileUpload} className="text-blue-500 underline cursor-pointer">or You can drag and drop here</label>

            <button onClick={addSingleSite} disabled={isSingleProcessing} className="bg-green-500 text-white px-4 py-2 rounded">{isSingleProcessing ? <Spin />  : "Run and List"}</button>
          </div>


        </div>


        {toggle && <DragDropFiles toggle={toggleFileUpload} setSites={setSiteList} siteList={siteList} />}

        {/* <DragDropFiles toggle={toggleFileUpload}/> */}
      </div>

      {/* Last Run Time */}
      <div className='flex justify-end pe-3 mt-3 pb-4'>
        <p>{lastRun ? getLastRunTime(lastRun) : 'Last Run: Never'}</p>
      </div>


      <div className='flex justify-end pe-3 mb-3 gap-3'>

        <button onClick={handleScheduling} disabled={selectedSitesList.length === 0} className="bg-blue-500 text-white px-4 py-2 rounded flex justify-center items-center gap-2">
          <MdOutlineScheduleSend className="text-xl" />
          <span>Schedule a Run</span>
        </button>

        <button onClick={handleDelete} disabled={selectedSitesList.length === 0} className="bg-red-500 text-white px-4 py-2 rounded">Delete</button>
      </div>

      {/* Progress Bar */}
      {isRunAllProcessing && (
        <div className="flex justify-between items-center mb-3">
          <p className="text-gray-500">Running all checks...</p>
          <Progress percent={progress} status="active" />
        </div>
      )}

      {/* Progress Bar
      {isRunAllProcessing && (
        <div className="w-full bg-gray-700 rounded-full h-2.5">
          <div className="bg-blue-500 h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
        </div>
      )} */}

      <SitesTable sites={siteList} trigger={tableTrigger} singleSiteRun={runASite} setSelectedSites={setSelectedSitesList} selectedSites={selectedSitesList} />

      {/* {schedulingTrigger&&

      <SchedulePopUp 
      trigger={schedulingSwitch} 
      sites={User.sites} 
      selectedSites={selectedScheduledSitesList} 
      setSelectedSites={setScheduledSelectedSitesList}
      submit={submitScheduling}
      cancel={cancelScheduling}
      />} */}
    </div>
  )
}

export default SiteCheckerPage
