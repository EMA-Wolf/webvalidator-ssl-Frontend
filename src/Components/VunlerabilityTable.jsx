import React from 'react'

const VunlerabilityTable = ({ vList }) => {
  return (
    <div className="w-full mt-4 px-5">
      <div className="pl-5">
        <h1 className="text-2xl font-bold">Vulnerabilities Report</h1>
        <p className="text-gray-600">This report outlines potential vulnerabilities in your application.</p>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-gray-800 text-white">
          <thead>
            <tr>
              <th className="px-4 py-2">No.</th>
              <th className="px-4 py-2">Type</th>
              <th className="px-4 py-2">Description</th>
              <th className="px-4 py-2">Solution</th>
            </tr>
          </thead>
          <tbody>
            {vList.map((vulnerability, index) => (
              <tr key={index} className="border-t border-gray-700">
                <td className="px-4 py-2">{index + 1}</td>
                <td className="px-4 py-2">{vulnerability.name}</td>
                <td className="px-4 py-2">{vulnerability.description}</td>
                <td className="px-4 py-2">{vulnerability.solution}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default VunlerabilityTable
