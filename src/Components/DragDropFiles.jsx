import React, { useRef, useState } from 'react'
import { IoCloseOutline } from "react-icons/io5";
import { GrDocumentText } from "react-icons/gr";
import hoverIcon from "../assets/hovericon.png"
import Papa from 'papaparse';
import * as XLSX from 'xlsx';

const DragDropFiles = ({ toggle, setSites, siteList }) => {

  const [files, setFiles] = useState(null)
  // const [sites, setSites] = useState([]);

  const inputRef = useRef()


  const handleDragOver = (e) => {
    e.preventDefault()
  }

  const handleDrop = (e) => {
    e.preventDefault()
    const droppedFiles = Array.from(e.dataTransfer.files);
    const validFiles = droppedFiles.filter(file => file.type === 'text/csv' || file.type === 'application/vnd.ms-excel' || file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    setFiles(validFiles);
    // handleFiles(validFiles);
    // console.log(validFiles);
    // console.log(e.dataTransfer.files)
  }

  const completeFileImportation = () => {
    handleFiles(files)
    toggle()
  }

  const cancel = () => {
    setFiles(null)
    toggle()
  }

  const handleFiles = (files) => {
    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = e.target.result;
        if (file.type === 'text/csv') {
          parseCSV(data);
        } else {
          parseExcel(data);
        }
      };
      if (file.type === 'text/csv') {
        reader.readAsText(file);
      } else {
        reader.readAsBinaryString(file);
      }
    });
  };


  // const parseCSV = (data) => {
  //   Papa.parse(data, {
  //     complete: (result) => {
  //       const sites = result.data.filter(row => row[0] && row[0].trim() !== '').map(row => ({ name: row[0] }));
  //       setSites(prevSites =>[...prevSites,...sites]);
  //     }
  //   });
  // };

  // const parseExcel = (data) => {
  //   const workbook = XLSX.read(data, { type: 'binary' });
  //   const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
  //   const excelData = XLSX.utils.sheet_to_json(firstSheet, { header: 1 });
  //   const sites = excelData.filter(row => row[0] && row[0].trim() !== '').map(row => ({ name: row[0] }));
  //   setSites(prevSites=>[...prevSites,...sites]);
  // };

  const parseCSV = (data) => {
    Papa.parse(data, {
      complete: (result) => {
        const newSites = result.data.filter(row => row[0] && row[0].trim() !== '').map(row => ({ name: row[0] }));
        const uniqueSites = newSites.filter(site => !siteList.some(existingSite => existingSite.name === site.name));
        setSites(prevSites => [...prevSites, ...uniqueSites]);
      }
    });
  };

  const parseExcel = (data) => {
    const workbook = XLSX.read(data, { type: 'binary' });
    const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
    const excelData = XLSX.utils.sheet_to_json(firstSheet, { header: 1 });
    const newSites = excelData.filter(row => row[0] && row[0].trim() !== '').map(row => ({ name: row[0] }));
    const uniqueSites = newSites.filter(site => !siteList.some(existingSite => existingSite.name === site.name));
    setSites(prevSites => [...prevSites, ...uniqueSites]);
  };

  // console.log(files)

  if (files) return (
    <div className='flex flex-col gap-4 p-4 rounded border items-center absolute top-0 bg-gray-800 z-10 w-full'>
      <GrDocumentText className='text-5xl' />
      {Array.from(files).map((file, index) => (<p key={index} className='text-lg'>{file.name}</p>))}

      <div className='flex gap-3 justify-end w-full'>
        <button onClick={cancel} className='bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600'>cancel</button>
        <button onClick={completeFileImportation} className='bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600'>Import</button>
      </div>
    </div>
  )


  return (
    <div onDragOver={handleDragOver} onDrop={handleDrop} className='flex flex-col gap-4 p-4 rounded border absolute top-0 bg-gray-800 z-10 w-full'>


      <div className='flex justify-end'><IoCloseOutline onClick={toggle} className='text-2xl cursor-pointer' /></div>

      <div className='flex justify-center items-center py-3'>

        <img className='w-20 h-20' src={hoverIcon} alt="" />

        <div className='flex flex-col items-center'>
          <p>Drag and drop files here</p>
          <p>or</p>
          <input
            type="file"
            accept=".csv, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            multiple onChange={(e) => { setFiles(e.target.files) }}
            hidden
            ref={inputRef} />
          <button onClick={() => inputRef.current.click()} className='text-blue-500 underline cursor-pointer'>Upload a file from your computer</button>
        </div>

      </div>


    </div>
  )
}

export default DragDropFiles
