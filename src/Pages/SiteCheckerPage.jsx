import { useState, useEffect, React } from 'react'
import { FaPlay } from "react-icons/fa";
import { IoPerson } from "react-icons/io5";
import { IoIosNotifications } from "react-icons/io";
import { MdOutlineScheduleSend } from "react-icons/md";
// import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import dayjs from 'dayjs';
import DragDropFiles from '../Components/DragDropFiles';
import SitesTable from '../Components/SitesTable';
import Alert from 'react-bootstrap/Alert';
import { toast } from 'react-toastify';
import axios from "axios"
import relativeTime from 'dayjs/plugin/relativeTime';
import updateLocale from 'dayjs/plugin/updateLocale';
import { useOutletContext, Link } from 'react-router-dom';
import { Spinner, Dropdown, ProgressBar } from 'react-bootstrap';
import SchedulePopUp from '../Components/SchedulePopUp';



dayjs.extend(relativeTime);
dayjs.extend(updateLocale);


const SiteCheckerPage = () => {
  const [User, setUser] = useState({
    id: "",
    email: '',
    username: "",
    sites: []
  })

  const { delPopUp, schedulingPopUp} = useOutletContext()
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

      axios.post(`https://webvalidator-ssl-backend.onrender.com/api/sites/getsiteinfo`, { _id: user._id, name: domain, username: user.username }).then(res => {
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

    axios.post("https://webvalidator-ssl-backend.onrender.com/api/sites/getsiteinfo", { _id: user._id, name }).then(res => {

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
        axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/sites/progress/${user.username}`)
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

      axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/sites/getallsitesinfo`, user)
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
    <div className='w-100 vh-100 ps-4 pe-4' style={{ overflowY: "scroll"}}>

      {/* NavBar area */}


      <Navbar className='d-flex justify-content-between pb-0 border-bottom' id='navbar'>
        {/*Greetings*/}
        <div>
          <h3>{getGreeting()}, <span style={{ color: "#3CA1FF" }}>{User.username}</span></h3>
          <p style={{ color: "grey" }}>Welcome to Site Checker</p>
        </div>

        {/* Controls */}
        <div className='d-flex gap-5 align-items-center'>
          <Button onClick={runAllChecks} style={{ padding: "1rem" }} className='d-flex align-items-center gap-2' disabled={isRunAllProcessing}>
            {isRunAllProcessing ? <Spinner animation="border" /> : <> <FaPlay /> <span>Run all</span></>}
          </Button>

          {/* <Button onClick={schedulingSwitch} style={{ padding: "1rem" }} className='d-flex align-items-center gap-2' disabled={isRunAllProcessing}>
            {isRunAllProcessing ? <Spinner animation="border" /> : <> <MdOutlineScheduleSend style={{fontSize:"1.4rem"}}/>
              <span>Schedule a Run</span></>}
          </Button> */}

          <Dropdown data-bs-theme="dark" >
            
            <Dropdown.Toggle variant='none' id="dropdown-button-dark-example1" className='d-flex align-items-center'>
              <div className='d-flex align-items-center'>
                <IoIosNotifications style={{ fontSize: "2rem", color: "white" }} />
                <span style={{ color: "red" }}>{errorMessages.length}</span>
              </div>
            </Dropdown.Toggle>

            {errorMessages.length>0 && 
            
            <Dropdown.Menu>
              {errorMessages.map((errorMessage,index) =>
                  <Dropdown.Item key={index} className='text-wrap p-0 ps-1 text-white' disabled={true}>
                    {`${index+1}.${errorMessage.status}`}
                  </Dropdown.Item>
               )
                }
            </Dropdown.Menu>
            }

          </Dropdown>

          {/* Account icon */}
          <Link to="/profile">
            <div className='pt-0 p-1 rounded border ' style={{ backgroundColor: "#242627", fontSize: "1.2rem" }}><IoPerson /></div>
          </Link>
        </div>
      </Navbar>


      {/* Input area */}

      <div className=' position-relative mt-3' style={{ zIndex: 1 }}>

        <div className='d-flex flex-column gap-4 p-4 rounded border' id='inputfield' style={{ backgroundColor: "#242627" }}>

          <h4>Check your website</h4>



          <div>
            <Form.Control placeholder="Example.com" value={singleSite.name} onChange={e => setSingleSite({ ...singleSite, name: e.target.value })} className='p-3' style={{ backgroundColor: "#605C5C", color: "white", border: "none" }} />

            {urltrigger && <Alert variant='danger' style={{ background: "transparent", border: "none", padding: "0rem", margin: "0rem" }}>Plesae enter a valid URL</Alert>}
          </div>

          <div className='d-flex justify-content-between'>
            <label onClick={toggleFileUpload} style={{ color: "#3CA1FF", textDecoration: "underline", cursor: "pointer" }}>or You can drag and drop here</label>

            <Button onClick={addSingleSite} disabled={isSingleProcessing}>{isSingleProcessing ? <Spinner animation="border" /> : "Run and List"}</Button>
          </div>


        </div>


        {toggle && <DragDropFiles toggle={toggleFileUpload} setSites={setSiteList} siteList={siteList} />}

        {/* <DragDropFiles toggle={toggleFileUpload}/> */}
      </div>


      <div className='d-flex justify-content-end pe-3 mt-3'>
        <p>{lastRun ? getLastRunTime(lastRun) : 'Last Run: Never'}</p>
      </div>


      <div className='d-flex justify-content-end pe-3 mb-3 gap-3'>

        <Button variant='primary' onClick={handleScheduling} disabled={selectedSitesList.length === 0}>
          <MdOutlineScheduleSend style={{fontSize:"1.4rem"}}/>
        <span>Schedule a Run</span>
        </Button>

        <Button variant='danger' onClick={handleDelete} disabled={selectedSitesList.length === 0}>Delete</Button>
      </div>

      {isRunAllProcessing && (
        <ProgressBar
          variant='primary'
          animated
          now={progress}
          min={0}
          max={100}
          label={`${progress}%`}
          className='mb-3'
        />)}

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
