import React from 'react'
import { Alert } from 'react-bootstrap'

const DisplaySSLCert = ({cert}) => {
  return (
    <div style={{ backgroundColor: "#242627" }} className='p-4 w-50 rounded'>
          {cert && (
                    <Alert variant='success' className='mt-3' style={{overflowY:"scroll"}}>
                        <h5>Certificate Generated Successfully</h5>
                        <p>Private Key:</p>
                        <pre>{cert.privateKey}</pre>
                        <p>Certificate:</p>
                        <pre>{cert.certificate}</pre>
                    </Alert>
                )}
    </div>
  )
}

export default DisplaySSLCert
