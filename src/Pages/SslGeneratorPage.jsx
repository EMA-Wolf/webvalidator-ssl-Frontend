import React, { useState } from 'react'
import SslGeneratorForm from '../Components/SslGeneratorForm'
import DisplaySSLCert from '../Components/DisplaySSLCert'

const SslGeneratorPage = () => {
  const [certData, setCertData] = useState(null) 
  return (
    <div className='w-100 vh-100 d-flex ps-2 gap-2'>
          <SslGeneratorForm setCertificate={setCertData}/>
          {certData&&<DisplaySSLCert cert={certData}/>}
    </div>
  )
}

export default SslGeneratorPage
