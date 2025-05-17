import React from 'react'

const SchedulePopUp = ({ sites, selectedSites, setSelectedSites, trigger, submit, cancel }) => {

    const handleCheckboxChange = (siteName) => {
        if (selectedSites.includes(siteName)) {
            setSelectedSites(selectedSites.filter(name => name !== siteName));
        } else {
            setSelectedSites([...selectedSites, siteName]);
        }
    };



    return (
        <div
            onClick={trigger}
            className="fixed inset-0 bg-black bg-opacity-40 z-10 flex justify-center items-center text-white"
        >
            <div
                className="bg-gray-900 z-20 w-3/4 p-3 rounded"
                onClick={(e) => e.stopPropagation()}
            >
                <h1 className="mb-3">Set Schedule</h1>

                <ul className="list-none overflow-y-scroll max-h-60">
                    {sites.map((site, i) => (
                        <li key={i} className="mb-2 border-b border-gray-700 p-1 flex items-center gap-2">
                            <input
                                className="mt-1"
                                type="checkbox"
                                checked={selectedSites.includes(site.name)}
                                onChange={() => handleCheckboxChange(site.name)}
                            />
                            <span>{site.name}</span>
                        </li>
                    ))}
                </ul>

                <div className="flex gap-3 mt-3">
                    <button
                        onClick={() => cancel()}
                        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                    >
                        Clear & Exit
                    </button>
                    <button
                        onClick={() => submit()}
                        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                    >
                        Save & Schedule
                    </button>
                </div>
            </div>
        </div>
    )
}

export default SchedulePopUp
