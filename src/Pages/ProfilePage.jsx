import React, { useEffect, useState } from 'react'
import { IoPerson } from "react-icons/io5";

const ProfilePage = () => {
    const [profile, setProfile] = useState({   
        id:"",
        email:'',
        username:"",
        sites:[]})

    useEffect(() =>{
        const savedUser = localStorage.getItem('User');

        if(savedUser){
            const parsedUser = JSON.parse(savedUser);
            setProfile(parsedUser);
        }else{
            alert("No user logged in")
        }
    },[])



  return (
    <div className='w-100 vh-100'>

        <div className='d-flex justify-content-center pt-4'>

                <div className='d-flex p-4 rounded border w-75' id='inputfield' style={{ backgroundColor: "#242627", gap:"12rem" }}>
                        <IoPerson style={{fontSize:"10rem"}} />
                            
                            {/* Details */}
                            <div className='w-100'>
                                <label style={{marginBottom:"0.5rem"}}>UserName:</label>
                                <h5 className="border-bottom pb-2" style={{marginBottom:"1rem"}}>{profile.username}</h5>

                                <label style={{marginBottom:"0.4rem"}}>Email:</label>
                                <h5 className="border-bottom pb-2" style={{marginBottom:"1rem"}}>{profile.email}</h5>
                                <h5>{`Number of sites: ${profile.sites.length}`}</h5>
                            </div>
                    </div>
        </div>

    </div>
  )
}

export default ProfilePage
