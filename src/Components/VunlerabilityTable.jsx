import React from 'react'
import { Table } from 'react-bootstrap'

const VunlerabilityTable = ({vList}) => {
  return (
    <div className='w-100 mt-4 pe-5 ps-5'>  
    
    <div className='ps-5'>
        <h1>Vulnerabilities Report</h1>
        <p>This report outlines potential vulnerabilities in your application.</p>
    </div>      

        {/* Add your table data here */}
        <Table striped bordered hover variant="dark">
          <thead>
            <tr>
              <th>No.</th>
              <th>Type</th>
              <th>Description</th>
              <th>Solution</th>
            </tr>
          </thead>
          <tbody>
            {vList.map((vunlerability,index) =>(
                <tr key={index}>
                  <td>{index+1}</td>
                  <td>{vunlerability.name}</td>
                  <td>{vunlerability.description}</td>
                  <td>{vunlerability.solution}</td>
                </tr>
  
            ))}
          </tbody>
      </Table>

    </div>
  )
}

export default VunlerabilityTable
