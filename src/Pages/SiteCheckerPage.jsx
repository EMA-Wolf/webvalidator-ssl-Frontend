import { useState, useEffect, React } from 'react'
import { FaPlay } from "react-icons/fa";
import { IoPerson } from "react-icons/io5";
// import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button';
import sun from "../assets/sun.png"
import moon from "../assets/moon.png"
import Form from 'react-bootstrap/Form';
import dayjs from 'dayjs';
import DragDropFiles from '../Components/DragDropFiles';
import SitesTable from '../Components/SitesTable';
import  Alert  from 'react-bootstrap/Alert';
import { ToastContainer, toast } from 'react-toastify';
import axios from "axios"
import relativeTime from 'dayjs/plugin/relativeTime';
import updateLocale from 'dayjs/plugin/updateLocale';
import { useOutletContext } from 'react-router-dom';
import { Spinner } from 'react-bootstrap';

dayjs.extend(relativeTime);
dayjs.extend(updateLocale);


const SiteCheckerPage = () => {
  const [User, setUser] = useState({
    id:"",
    email:'',
    username:"",
    sites:[]
  })
  
  const {delPopUp} = useOutletContext()
  const [lastRun, setLastRun] = useState('');
  const [toggle, setToggle] = useState(false)
  const [urltrigger, setUrltigger] = useState(false)
  const [siteList, setSiteList] = useState([])
  const [singleSite, setSingleSite] = useState({name:""})
  const [isSingleProcessing, setIsSingleProcessing] = useState(false)
  const [isRunAllProcessing, setIsRunAllProcessing] = useState(false)
  const [errorMessages, setErrorMessages] = useState([])

  const [tableTrigger, setTableTrigger] = useState(null)
  const [selectedSitesList, setSelectedSitesList] = useState([])

  const toggleFileUpload = () => {
    setToggle(!toggle)
  }

  const addSingleSite = () => {
    const urlRegex = /^(https?:\/\/)?([a-zA-Z0-9.-]+\.[a-zA-Z]{2,})(\/\S*)?$/;
  
    if (singleSite.name.trim() !== "" && urlRegex.test(singleSite.name.trim())) {
      setIsSingleProcessing(true)

    // Retrieve the User object from localStorage
    const user = JSON.parse(localStorage.getItem('User'));

    axios.post("https://webvalidator-ssl-backend.onrender.com/api/sites/getsiteinfo", {_id:user._id, name:singleSite.name}).then(res=>{
      if(res.data.resultsResponse === null){
        // setErrorMessages(res.data.error)
        setIsSingleProcessing(false)
        console.log(res.data.error)

        
        toast.error(res.data.error[singleSite.name].status!==""?res.data.error[singleSite.name].status:"Unable to find site")
        setSingleSite({ name: "" });
        // setToastTrigger(!toastTrigger)

        // setTimeout(()=>{
        //   setToastTrigger(!toastTrigger)
        // },3000)

      }else{

        user.sites= [...res.data.resultsResponse]

        // Save the updated User object back to localStorage
         localStorage.setItem('User', JSON.stringify(user));
         console.log('Updated User:', user);
         setIsSingleProcessing(false)
         setSingleSite({ name: "" });
         window.location.reload();
      }

      // user.sites= [...res.data.resultsResponse]
  
    }).catch(err=>{
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

  // const runAllChecks = () =>{
  //   User.sites = siteList
  //   axios.post("http://localhost:3002/api/sites/getallsitesinfo",User).then(res=>{
  //     console.log(res.data)
  //   }).catch(err=>console.log(err))
  // }

  // const DeleteASite = (name) =>{
  //   delPopUp(name)
  //   // console.log(name)
  // }

  const runASite = (name) =>{
    setTableTrigger(name)

    const user = JSON.parse(localStorage.getItem('User'));

    axios.post("https://webvalidator-ssl-backend.onrender.com/api/sites/getsiteinfo",{_id:user._id,name}).then(res=>{
      user.sites= [...res.data.resultsResponse]

      // Save the updated User object back to localStorage
       localStorage.setItem('User', JSON.stringify(user));
       setTableTrigger(null)
       toast.success(`Done checking site: ${name}`)
    }).catch(err=>{
      console.log(err)
      setTableTrigger(null)
    })

    // console.log(name)

    // setTimeout(()=>{
    //   setTableTrigger(null)
    // },tableTrigger)
  }

  const runAllChecks = () => {
    setIsRunAllProcessing(true)
    // Retrieve the User object from localStorage
    const user = JSON.parse(localStorage.getItem('User'));
  
    if (user) {
      // Update the User.sites with siteList
      user.sites = siteList;
  
      axios.post("https://webvalidator-ssl-backend.onrender.com/api/sites/getallsitesinfo", user)
        .then(res => {
          // On success, update the User.sites array with the new data from the response
          user.sites = res.data.success;
  
          // Save the updated User object back to localStorage
          localStorage.setItem('User', JSON.stringify(user));
          setErrorMessages(res.data.errors)
  
          // console.log('Updated User:', user);
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


  const handleDelete = () => {
    // console.log("Selected sites for deletion:", selectedSitesList);
    delPopUp(selectedSitesList)
    // Perform the delete operation or any other actions with the selected sites
  };

  

  // const runAllChecks = () =>{
  //  User.sites = siteList
  //  console.log(User)
  // }

  // console.log(siteList)
  // console.log(singleSite)
  // console.log(User)
    // console.log(errorMessages)
  return (
    <div className='w-100 vh-100 ps-4 pe-4' style={{overflowY:"scroll"}}>

      {/* NavBar area */}

    
      <Navbar className='d-flex justify-content-between pb-0 border-bottom' id='navbar'>
        {/*Greetings*/}
        <div>
          <h3>{getGreeting()}, <span style={{color:"#3CA1FF"}}>{User.username}</span></h3>
          <p style={{ color: "grey" }}>Welcome to Site Checker</p>
        </div>

        {/* Controls */}
        <div className='d-flex gap-5 align-items-center'>
          <Button onClick={runAllChecks} style={{ padding: "1rem" }} className='d-flex align-items-center gap-2' disabled={isRunAllProcessing}> 
          {isRunAllProcessing ? <Spinner animation="border" /> : <> <FaPlay /> <span>Run all</span></>}
          </Button>

          <div className='d-flex align-items-center'>
            <img style={{ width: "auto", height: "1.5rem" }} src={sun} alt="" />

            <img style={{ width: "auto", height: "1.5rem" }} src={moon} alt="" />
          </div>

          {/* Account icon */}
          <div className='pt-0 p-1 rounded border ' style={{ backgroundColor: "#242627", fontSize: "1.2rem" }}><IoPerson /></div>
        </div>
      </Navbar>


      {/* Input area */}

      <div className=' position-relative mt-3' style={{ zIndex: 1 }}>

        <div className='d-flex flex-column gap-4 p-4 rounded border' id='inputfield' style={{ backgroundColor: "#242627" }}>

          <h4>Check your website</h4>



          <div>
            <Form.Control placeholder="Example.com" value={singleSite.name} onChange={e => setSingleSite({...singleSite, name:e.target.value})} className='p-3' style={{ backgroundColor: "#605C5C", color: "white", border: "none" }} />

               {urltrigger&&<Alert variant='danger' style={{background:"transparent", border:"none",  padding:"0rem", margin:"0rem"}}>Plesae enter a valid URL</Alert>}
          </div>

          <div className='d-flex justify-content-between'>
            <label onClick={toggleFileUpload} style={{ color: "#3CA1FF", textDecoration: "underline", cursor: "pointer" }}>or You can drag and drop here</label>

            <Button onClick={addSingleSite} disabled={isSingleProcessing}>{isSingleProcessing ? <Spinner animation="border" />: "Run and List"}</Button>
          </div>

   
        </div>


        {toggle && <DragDropFiles toggle={toggleFileUpload} setSites={setSiteList} siteList={siteList} />}

        {/* <DragDropFiles toggle={toggleFileUpload}/> */}
      </div>


      <div className='d-flex justify-content-end pe-3 mt-3'>
        <p>{lastRun ? getLastRunTime(lastRun) : 'Last Run: Never'}</p>
      </div>


      <div className='d-flex justify-content-end pe-3 mb-3'>
      <Button variant='danger' onClick={handleDelete} disabled={selectedSitesList.length === 0}>Delete</Button>
      </div>

    <SitesTable sites={siteList} trigger={tableTrigger}  singleSiteRun={runASite}  setSelectedSites={setSelectedSitesList} selectedSites={selectedSitesList}/>


    </div>
  )
}

export default SiteCheckerPage
