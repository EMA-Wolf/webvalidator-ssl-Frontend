import React, { useEffect, useState } from 'react'
import SideBar from '../Components/SideBar'
import { Navigate, Outlet } from 'react-router-dom'
import Button from 'react-bootstrap/Button'
import axios from 'axios'
import { toast } from 'react-toastify';

const Base = () => {
  const [delTrigger, setDelTrigger] = useState(false)
  const [deletedSiteList, setDeletedSiteList] = useState([])

  const [schedulingTrigger, setSchedulingTrigger] = useState(false)
  const [selectedScheduledSitesList, setSelectedScheduledSitesList] = useState([])
  const [scheduleHours, setScheduleHours] = useState('0')
  const [scheduleMinutes, setScheduleMinutes] = useState('0')
  const [isProcessing, setIsProcessing] = useState(false)

  const delSwitch = (names) => {
    setDeletedSiteList(names)
    setDelTrigger(!delTrigger)
  }

  const scheduleSwitch = (sites) => {
    setSelectedScheduledSitesList(sites)
    setSchedulingTrigger(!schedulingTrigger)
    setScheduleHours('0')
    setScheduleMinutes('0')
  }

  const confirmDeletion = () => {
    setIsProcessing(true)

    const user = JSON.parse(localStorage.getItem('User'));

    axios.post("https://webvalidator-ssl-backend.onrender.com/api/sites/deleteSites", { _id: user._id, sites: deletedSiteList, username: user.username })
      .then(res => {
        user.sites = [...res.data.resultsResponse]

        // Save the updated User object back to localStorage
        localStorage.setItem('User', JSON.stringify(user));
        setIsProcessing(false)
        setDelTrigger(!delTrigger)
        toast.success(res.data.message)
      }).catch(err => {
        console.log(err)
        setIsProcessing(false)
      })
  }

  // const confirmScheduling = () => {
  //   const totalMinutes = parseInt(scheduleHours) * 60 + parseInt(scheduleMinutes);
  //   if (totalMinutes >= 1) {
  //     console.log(selectedScheduledSitesList, totalMinutes)
  //     // Here, you can proceed with scheduling logic
  //   } else {
  //     toast.error('Schedule time should be at least 1 minute')
  //   }
  // }

  const confirmScheduling = () => {
    const totalMinutes = parseInt(scheduleHours) * 60 + parseInt(scheduleMinutes);
    if (totalMinutes >= 1) {
      const user = JSON.parse(localStorage.getItem('User'));
      const scheduleData = {
        userId: user._id,
        sites: selectedScheduledSitesList,
        hours: scheduleHours,
        minutes: scheduleMinutes
      };
      setIsProcessing(true);

      axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/schedule/cron`, scheduleData)
        .then(res => {
          setIsProcessing(false);
          setSchedulingTrigger(!schedulingTrigger);
          toast.success(res.data.message);
        })
        .catch(err => {
          console.log(err);
          setIsProcessing(false);
        });
    } else {
      toast.error('Schedule time should be at least 1 minute');
    }
  }


  const cancelScheduling = () => {
    setSelectedScheduledSitesList([])
    setScheduleHours('0')
    setScheduleMinutes('0')
    setSchedulingTrigger(!schedulingTrigger)
  }

  const cancelDeletion = () => {
    setDeletedSiteList([])
    setDelTrigger(!delTrigger)
  }

  const handleScheduleHoursChange = (e) => {
    const value = e.target.value
    if (/^\d*$/.test(value)) {
      setScheduleHours(value)
    }
  }

  const handleScheduleMinutesChange = (e) => {
    const value = e.target.value
    if (/^\d*$/.test(value) && value <= 59) {
      setScheduleMinutes(value)
    }
  }


  return (
    <div className='d-flex'>

      <SideBar />

      <Outlet context={{ delPopUp: delSwitch, schedulingPopUp: scheduleSwitch }} />

      {delTrigger &&
        <>
          <div onClick={delSwitch} style={{ position: "absolute", top: "0rem", backgroundColor: "rgba(0, 0, 0, 0.4)", zIndex: 1, color: "white" }} className='h-100 w-100 d-flex justify-content-center align-items-center'>

            <div style={{ backgroundColor: "#151718", zIndex: 2 }} className='w-50 p-5 rounded' onClick={(e) => e.stopPropagation()}>
              <h1>Oops😶‍🌫️</h1>

              <p style={{ fontSize: "1.2rem" }}>{deletedSiteList.length === 1 ? `You sure you want to delete this site: ${deletedSiteList} ?` : `You sure you want to delete all  ${deletedSiteList.length} sites?`}</p>

              <div className='d-flex justify-content-end gap-3'>
                <Button onClick={cancelDeletion} variant='danger'>No</Button>
                <Button disabled={isProcessing} onClick={confirmDeletion} variant='success'>{isProcessing ? `Processing...` : `Yes`}</Button>
              </div>
            </div>

          </div>
        </>}

      {schedulingTrigger &&
        <>
          <div onClick={scheduleSwitch} style={{ position: "absolute", top: "0rem", backgroundColor: "rgba(0, 0, 0, 0.4)", zIndex: 1, color: "white" }} className='h-100 w-100 d-flex justify-content-center align-items-center'>

            <div style={{ backgroundColor: "#151718", zIndex: 2 }} className='w-50 p-5 rounded' onClick={(e) => e.stopPropagation()}>
              <h1>Set Schedule</h1>

              <p style={{ fontSize: "1.2rem" }}>{selectedScheduledSitesList.length === 1 ? `Would you like to set a schedule run for: ${selectedScheduledSitesList} ?` : `Would you like to set a schedule run for  ${selectedScheduledSitesList.length} sites?`}</p>

              <div className='d-flex gap-2 align-items-center'>
                <label>Schedule Time</label>
                <input
                  type="text"
                  placeholder="Hrs"
                  value={scheduleHours}
                  onChange={handleScheduleHoursChange}
                  style={{ width: "4rem" }}
                />
                <label>Hrs</label>
                <label>:</label>
                <input
                  type="text"
                  placeholder="Mins"
                  value={scheduleMinutes}
                  onChange={handleScheduleMinutesChange}
                  style={{ width: "5rem" }}
                />
                <label>Mins</label>
              </div>

              <div className='d-flex justify-content-end gap-3'>
                <Button onClick={cancelScheduling} variant='danger'>Cancel</Button>
                <Button disabled={isProcessing} onClick={confirmScheduling} variant='success'>{isProcessing ? `Processing...` : `Confirm`}</Button>
              </div>
            </div>

          </div>
        </>}

    </div>
  )
}

export default Base
