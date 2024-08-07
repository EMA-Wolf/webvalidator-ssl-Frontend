import React from 'react'
import { Button } from 'react-bootstrap'

const SchedulePopUp = ({sites,selectedSites, setSelectedSites, trigger, submit, cancel}) => {
    
    const handleCheckboxChange = (siteName) => {
        if (selectedSites.includes(siteName)) {
          setSelectedSites(selectedSites.filter(name => name !== siteName));
        } else {
          setSelectedSites([...selectedSites, siteName]);
        }
      };

      

  return (
       <div onClick={trigger} style={{position:"absolute", top:"0rem",backgroundColor:"rgba(0, 0, 0, 0.4)", zIndex:1, color:"white", height:"100%", width:"78%"}} className='d-flex justify-content-center align-items-center'>

            <div style={{backgroundColor:"#151718", zIndex:2}} className='w-75 p-3 rounded' onClick={(e) => e.stopPropagation()}>
                    <h1 className='mb-3'>Set Schedule</h1>

                <ul style={{listStyle:"none", overflowY:"scroll"}}>
                    {sites.map((site, i) => (
                        <li key={i} className='mb-2 border-bottom p-1 d-flex align-items-center gap-2'>
                            <input className='mt-1' type='checkbox' checked={selectedSites.includes(site.name)}  onChange={() => handleCheckboxChange(site.name)}/> <span>{site.name}</span>
                        </li>
                    ))}
                </ul>

                <div className='d-flex gap-3'>
                    <Button variant='danger' onClick={() => cancel()}>Clear & Exit</Button>
                    <Button variant='success' onClick={() => submit()}>Save & Schedule</Button>
                </div>
            </div>

        </div>
  )
}

export default SchedulePopUp
