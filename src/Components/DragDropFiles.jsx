import React, { useRef, useState } from 'react'
import { IoCloseOutline } from "react-icons/io5";
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import hoverIcon from "../assets/hovericon.png"
import { GrDocumentText } from "react-icons/gr";
import Papa from 'papaparse';
import * as XLSX from 'xlsx';

const DragDropFiles = ({toggle, setSites, siteList}) => {

    const [files, setFiles] = useState(null)
    // const [sites, setSites] = useState([]);

    const inputRef = useRef()


    const handleDragOver =(e) =>{
        e.preventDefault()
    }

    const handleDrop =(e) =>{
        e.preventDefault()
        const droppedFiles = Array.from(e.dataTransfer.files);
        const validFiles = droppedFiles.filter(file => file.type === 'text/csv' || file.type === 'application/vnd.ms-excel' || file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        setFiles(validFiles);
        // handleFiles(validFiles);
        // console.log(validFiles);
        // console.log(e.dataTransfer.files)
    }

    const  completeFileImportation = () =>{
        handleFiles(files)
        toggle()
    }

    const cancel = () =>{
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

    if(files) return(
        <div className='d-flex flex-column gap-4 p-4 rounded border align-items-center position-absolute top-0' id='inputfield'  style={{backgroundColor:"#242627",zIndex:2, width:"100%"}}>

            <GrDocumentText style={{fontSize:"3rem"}}/>
            {Array.from(files).map((file,index) =>(<p style={{fontSize:"1.2rem"}} key={index}>{file.name}</p>))}

            <div className='d-flex gap-3 justify-content-end w-100'>
                <Button variant='danger' onClick={cancel}>cancel</Button>
                <Button variant='success' onClick={completeFileImportation}>Import</Button>
            </div>
        </div>
        )
    

  return (
    <div onDragOver={handleDragOver} onDrop={handleDrop} className='d-flex flex-column gap-4 p-4 rounded border position-absolute top-0' id='inputfield'  style={{backgroundColor:"#242627",zIndex:2, width:"100%"}}>


           <div  className='d-flex justify-content-end'><IoCloseOutline onClick={toggle} style={{fontSize:"2.4rem",cursor:"pointer"}}/></div>
                 
                 <div style={{paddingLeft:"10rem",paddingRight:"23.5rem"}} className='d-flex justify-content-between align-items-center'>
                   
                            <img style={{width:"5rem",height:"5rem"}} className='mb-3' src={hoverIcon} alt="" />

                                <div className='d-flex flex-column align-items-center'>
                                        <p>Drag and drop files here</p>
                                        <p>or</p>
                                        <Form.Control 
                                        type="file" 
                                        accept=".csv, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                                        multiple onChange={(e)=>{setFiles(e.target.files)}} 
                                        hidden 
                                        ref={inputRef}/>
                                    <Button onClick={()=>inputRef.current.click()}style={{border:"none",backgroundColor:"transparent",color:"#3CA1FF", textDecoration:"underline"}}>Upload a file from your computer</Button>
                                </div>
              
                 </div>


    </div>
  )
}

export default DragDropFiles
