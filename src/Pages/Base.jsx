import React, { useEffect, useState } from 'react'
import SideBar from '../Components/SideBar'
import { Navigate, Outlet} from 'react-router-dom'
import Button from 'react-bootstrap/Button'
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify';
const Base = () => {
  const [delTrigger ,setDelTrigger] = useState(false)
  const [deletedSiteList, setDeletedSiteList] = useState([])
  const [isProcessing, setIsProcessing] = useState(false)


const delSwicth = (names) =>{
  setDeletedSiteList(names)
  setDelTrigger(!delTrigger)
}

const confrimDeletion = () =>{
  setIsProcessing(true)

// console.log(deletedSiteList)

const user = JSON.parse(localStorage.getItem('User'));

axios.post("https://webvalidator-ssl-backend.onrender.com/api/sites/deleteSites",{_id:user._id, sites:deletedSiteList,username:user.username}).then(res=>{
  
  user.sites= [...res.data.resultsResponse]

  // Save the updated User object back to localStorage
   localStorage.setItem('User', JSON.stringify(user));
   setIsProcessing(false)
   setDelTrigger(!delTrigger)
   toast.success(res.data.message)
  }).catch(err=>{
    console.log(err)
    setIsProcessing(false)
  })
  
}


const cancelDeletion = () =>{
  setDeletedSiteList([])
  setDelTrigger(!delTrigger)
}



  return (
    <div className='d-flex'>

        <SideBar/>

        <Outlet context={{delPopUp:delSwicth}}/>


{delTrigger && 
<>
    <div onClick={delSwicth} style={{position:"absolute", top:"0rem",backgroundColor:"rgba(0, 0, 0, 0.4)", zIndex:1, color:"white"}} className='h-100 w-100 d-flex justify-content-center align-items-center'>

    <div style={{backgroundColor:"#151718", zIndex:2}} className='w-50 p-5 rounded' onClick={(e) => e.stopPropagation()}>
              <h1>Oops😶‍🌫️</h1>

          <p style={{fontSize:"1.2rem"}}>{deletedSiteList.length===1?`You sure you want to delete this site: ${deletedSiteList} ?`:`You sure you want to delete all  ${deletedSiteList.length} sites?`}</p>

          <div className='d-flex justify-content-end gap-3'>
            <Button onClick={cancelDeletion} variant='danger'>No</Button>
            <Button disabled={isProcessing} onClick={confrimDeletion} variant='success'>{isProcessing?`Processing...`:`Yes`}</Button>
          </div>
    </div>

    </div>
</>}

    {/* <ToastContainer position='top-center' theme='dark' className='w-50'/> */}
    </div>
  )
}

export default Base
