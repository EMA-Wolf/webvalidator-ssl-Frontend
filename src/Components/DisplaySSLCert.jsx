import React from 'react'

const DisplaySSLCert = ({ cert }) => {
  return (
    <div className="bg-gray-800 p-4 w-1/2 rounded overflow-y-scroll">
      {cert && (
        <div className="mt-3 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
          <h5 className="font-bold">Certificate Generated Successfully</h5>
          <p>Private Key:</p>
          <pre className="bg-gray-100 p-2 rounded">{cert.privateKey}</pre>
          <p>Certificate:</p>
          <pre className="bg-gray-100 p-2 rounded">{cert.certificate}</pre>
        </div>
      )}
    </div>
  )
}

export default DisplaySSLCert
