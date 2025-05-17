import React, { useEffect, useState } from 'react'
import SideBar from '../Components/SideBar'
import { Navigate, Outlet } from 'react-router-dom'
import axios from 'axios'
import api  from "../services/api"
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

    api.post("/sites/deleteSites", { _id: user._id, sites: deletedSiteList, username: user.username })
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

      api.post("/schedule/cron", scheduleData)
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
    <div className="flex">
      <SideBar />

      <Outlet context={{ delPopUp: delSwitch, schedulingPopUp: scheduleSwitch }} />

      {delTrigger &&
        <>
          <div
            onClick={delSwitch}
            className="fixed inset-0 bg-black bg-opacity-40 z-10 flex justify-center items-center text-white"
          >
            <div
              className="bg-gray-900 z-20 w-1/2 p-5 rounded"
              onClick={(e) => e.stopPropagation()}
            >
              <h1>Oops😶‍🌫️</h1>

              <p className="text-lg">
                {deletedSiteList.length === 1 ? `You sure you want to delete this site: ${deletedSiteList} ?` : `You sure you want to delete all  ${deletedSiteList.length} sites?`}
              </p>

              <div className="flex justify-end gap-3">
                <button onClick={cancelDeletion} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
                  No
                </button>
                <button
                  disabled={isProcessing}
                  onClick={confirmDeletion}
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                >
                  {isProcessing ? 'Processing...' : 'Yes'}
                </button>
              </div>
            </div>
          </div>
        </>}

      {schedulingTrigger &&
        <>
          <div
            onClick={scheduleSwitch}
            className="fixed inset-0 bg-black bg-opacity-40 z-10 flex justify-center items-center text-white"
          >
            <div
              className="bg-gray-900 z-20 w-1/2 p-5 rounded"
              onClick={(e) => e.stopPropagation()}
            >
              <h1>Set Schedule</h1>

              <p className="text-lg">
                {selectedScheduledSitesList.length === 1 ? `Would you like to set a schedule run for: ${selectedScheduledSitesList} ?` : `Would you like to set a schedule run for  ${selectedScheduledSitesList.length} sites?`}
              </p>

              <div className="flex gap-2 items-center">
                <label>Schedule Time</label>
                <input
                  type="text"
                  placeholder="Hrs"
                  value={scheduleHours}
                  onChange={handleScheduleHoursChange}
                  className="w-16"
                />
                <label>Hrs</label>
                <label>:</label>
                <input
                  type="text"
                  placeholder="Mins"
                  value={scheduleMinutes}
                  onChange={handleScheduleMinutesChange}
                  className="w-20"
                />
                <label>Mins</label>
              </div>

              <div className="flex justify-end gap-3">
                <button onClick={cancelScheduling} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
                  Cancel
                </button>
                <button
                  disabled={isProcessing}
                  onClick={confirmScheduling}
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                >
                  {isProcessing ? 'Processing...' : 'Confirm'}
                </button>
              </div>
            </div>
          </div>
        </>}
    </div>
  )
}

export default Base
