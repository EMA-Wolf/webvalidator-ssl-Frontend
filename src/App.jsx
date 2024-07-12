// import { useState } from 'react';
// import './App.css';
// import axios from "axios";
// import ListGroup from 'react-bootstrap/ListGroup';
// import Button from 'react-bootstrap/Button';
// import Table from "react-bootstrap/Table"
// import 'bootstrap/dist/css/bootstrap.min.css';

// function App() {
//   const [sites, setSites] = useState([
//     { name: 'youtube.com' },
//     { name: 'drinkevermilk.com' },
//     { name: 'adroit360.com' },
//     // Add more sites as needed
//   ]);

//   const [details, setDetails] = useState({});
//   const [loadingStates, setLoadingStates] = useState({});

//   const show = (site) => {
//     setLoadingStates(prevLoadingStates => ({ ...prevLoadingStates, [site.name]: true }));

//     axios.post(`http://localhost:3001/getsslinfo`, { name: site.name })
//       .then(res => {
//         setDetails(prevDetails => ({ ...prevDetails, [site.name]: res.data }));
//         console.log(`Details for ${site.name}:`, res.data);
//       })
//       .catch(err => console.log(err))
//       .finally(() => {
//         setLoadingStates(prevLoadingStates => ({ ...prevLoadingStates, [site.name]: false }));
//       });
//   };

//   return (
//     <>
//       <h1>Site Checker</h1>

//       <div className='d-flex justify-content-end me-4 mb-4'><Button>Run</Button></div>
//       <Table striped bordered hover>
//       <thead>
//         <tr>
//           <th>#</th>
//           <th>Site</th>
//           <th>Has SSL </th>
//           <th>Has Malware</th>
//           <th>Is Live</th>
//         </tr>
//       </thead>

//       <tbody>
//      {sites.map((site, index) =>(
//       <tr>
//         <td>{index}</td>
//         <td>{site.name}</td>
//       </tr>
//      ))}
//       </tbody>
//     </Table>


//       {/* <ListGroup as="ul">
//         {sites.map((site, index) => (
//           <ListGroup.Item as="li" key={index} className='d-flex gap-5'>
//             {site.name}
//             <Button
//               variant="primary"
//               disabled={loadingStates[site.name] || false}
//               onClick={() => show(site)}
//             >
//               {loadingStates[site.name] ? 'Loading…' : 'Run'}
//             </Button>
//           </ListGroup.Item>
//         ))}
//       </ListGroup> */}
//     </>
//   );
// }

// export default App;

// import { useState, useEffect } from 'react';
// import './App.css';
// import axios from "axios";
// import ListGroup from 'react-bootstrap/ListGroup';
// import Button from 'react-bootstrap/Button';
// import Table from "react-bootstrap/Table";
// import 'bootstrap/dist/css/bootstrap.min.css';
// import dayjs from 'dayjs';
// import relativeTime from 'dayjs/plugin/relativeTime';

// dayjs.extend(relativeTime);

// function App() {
//   const [sites, setSites] = useState([
//     { name: 'youtube.com' },
//     { name: 'drinkevermilk.com' },
//     { name: 'adroit360gh.com' },
//     { name: 'angehillhotel.com' },
//     { name: 'flagshiplogtrg.com' },
//     { name: 'jacobgyan.com' },
//     { name: 'jurisghana.com' },
//     { name: 'lebenebeans.com' },
//     { name: 'legoncities.com' },
//     { name: 'myjtfoundation.org' },
//     { name: 'nanaskitchen.net' },
//     { name: 'ptcgh.com' },
//     { name: 'ralliancegh.com' },
//     { name: 'reachfortomorrowgh.org' },
//     { name: 'robertsmithlawgroup.com' },
//     { name: 'rodorroyal.com' },
//     { name: 'santeshairforkids.com' },
//     { name: 'tickethubgh.com' },
//     { name: 'trlgh.com' },
//     { name: 'vadsystems.net' },
//     { name: 'yocharley.com' },
//     { name: 'lemla.adroit360gh.com' },
//     { name: 'sms.adroit360gh.com' },
//     { name: 'Iamnzema.com' },
//     { name: 'Ntoboafund.com' },
//     { name: 'Wearescaleupafrica.com' },
//     { name: 'a-starofficial.com' },
//     { name: 'buildmategh.com' },
//     { name: 'lebenebeans.com' },
//     { name: 'nationaltheatregh.com' },
//     { name: 'thelittlecow.net' },
//     { name: 'reroro.org' },
//     { name: 'nfghana.com' },
//     { name: 'drinkevermilk.com' },
//     { name: 'minkahpremo.com' },
//     { name: 'lemlagroup.com' },
//     { name: 'asti.edu.gh' },
//     { name: 'okworld.com.gh' },
//     { name: 'gyanautoworks.com' },
//     { name: 'mpobb.com' },
//     { name: 'nufufoundation.org' },
//     { name: 'greendairygh.com' },
//     { name: 'minkahpremo.com' },
//     { name: 'voltican.com' },
//     { name: 'minkahpremooseibonsubrucecathline.info' },
//     { name: 'mpobb.org' },
//     { name: 'mpobb.info' },
//     { name: 'minkahpremooseibonsubrucecathline.net' },
//     { name: 'minkahpremooseibonsubrucecathline.com' },
//     { name: 'minkahpremooseibonsubrucecathlines.com' },
//     { name: 'mpobb.net' },
//     { name: 'minkahpremooseibonsubrucecathline.org' },
//     { name: 'minkahpremooseibonsubrucecathline.online' },
//     { name: 'mpobb.co' },
//     { name: 'minkahpremooseibonsubrucecathline.biz' },
//     { name: 'minkahpremo.com' },
//     { name: 'ghanabar.org' },
//     { name: 'kofasmedia.com' }
//     // Add more sites as needed
//   ]);

//   const [details, setDetails] = useState({});
//   const [loading, setLoading] = useState(false);
//   const [lastRun, setLastRun] = useState('');

//   useEffect(() => {
//     // Load details and last run time from local storage if available
//     const savedDetails = localStorage.getItem('siteDetails');
//     const savedLastRun = localStorage.getItem('lastRunTime');

//     if (savedDetails) {
//       setDetails(JSON.parse(savedDetails));
//     }

//     if (savedLastRun) {
//       setLastRun(savedLastRun);
//     }
//   }, []);

//   useEffect(() => {
//     // Update the relative time every minute
//     const interval = setInterval(() => {
//       if (lastRun) {
//         setLastRun(lastRun); // Force re-render
//       }
//     }, 60000);

//     return () => clearInterval(interval);
//   }, [lastRun]);

//   const show = () => {
//     setLoading(true);

//     const promises = sites.map((site) =>
//       axios.post(`http://localhost:3001/getsslinfo`, { name: site.name })
//         .then(res => ({ site: site.name, data: res.data }))
//         .catch(err => ({ site: site.name, error: err }))
//     );

//     Promise.all(promises)
//       .then(results => {
//         const newDetails = {};
//         results.forEach(result => {
//           if (result.error) {
//             console.log(`Error checking ${result.site}:`, result.error);
//           } else {
//             newDetails[result.site] = result.data;
//           }
//         });
//         setDetails(newDetails);

//         // Save details and last run time to local storage
//         localStorage.setItem('siteDetails', JSON.stringify(newDetails));
//         const currentTime = new Date().toISOString();
//         setLastRun(currentTime);
//         localStorage.setItem('lastRunTime', currentTime);
//       })
//       .finally(() => {
//         setLoading(false);
//       });
//   };

//   const renderStatus = (status) => {
//     return (
//       <td style={{ color: status ? 'green' : 'red' }}>
//         {status ? '✔' : '✘'}
//       </td>
//     );
//   };

//   return (
//     <>
//       <div className='d-flex justify-content-center'>
//           <h1>Site Checker</h1>
//         </div>


//       <div className='d-flex justify-content-end'>

//           <div className='d-flex flex-column gap-2'>
//               <Button style={{width:"7rem"}} onClick={show} disabled={loading}>
//                 {loading ? 'Loading…' : 'Run'}
//               </Button>  

//               <Button>click</Button>
//           </div>
   
//               <p>
//                   Last Run: {lastRun ? dayjs(lastRun).fromNow() : 'Never'}
//                 </p>
    
//       </div>

//       <Table striped bordered>
//         <thead>
//           <tr>
//             <th>#</th>
//             <th>Site</th>
//             <th>Has SSL</th>
//             <th>Has Malware</th>
//             <th>Is Live</th>
//           </tr>
//         </thead>
//         <tbody>
//           {sites.map((site, index) => (
//             <tr key={index}>
//               <td>{index + 1}</td>
//               <td>{site.name}</td>
//               {details[site.name] ? (
//                 <>
//                   {renderStatus(details[site.name].ssl)}
//                   {renderStatus(details[site.name].mal)}
//                   {renderStatus(details[site.name].live)}
//                 </>
//               ) : (
//                 <>
//                   <td>-</td>
//                   <td>-</td>
//                   <td>-</td>
//                 </>
//               )}
//             </tr>
//           ))}
//         </tbody>
//       </Table>
//     </>
//   );
// }

// export default App;

import { useState, useEffect } from 'react';
import './App.css';
import axios from "axios";
import ListGroup from 'react-bootstrap/ListGroup';
import Button from 'react-bootstrap/Button';
import Table from "react-bootstrap/Table";
import 'bootstrap/dist/css/bootstrap.min.css';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

function App() {
  const [sites, setSites] = useState([
    { name: 'youtube.com' },
    { name: 'drinkevermilk.com' },
    { name: 'adroit360gh.com' },
    { name: 'angehillhotel.com' },
    { name: 'flagshiplogtrg.com' },
    { name: 'jacobgyan.com' },
    { name: 'jurisghana.com' },
    { name: 'lebenebeans.com' },
    // { name: 'legoncities.com' },
    { name: 'myjtfoundation.org' },
    { name: 'nanaskitchen.net' },
    { name: 'ptcgh.com' },
    { name: 'ralliancegh.com' },
    { name: 'reachfortomorrowgh.org' },
    { name: 'robertsmithlawgroup.com' },
    { name: 'rodorroyal.com' },
    { name: 'santeshairforkids.com' },
    { name: 'tickethubgh.com' },
    { name: 'trlgh.com' },
    { name: 'vadsystems.net' },
    { name: 'yocharley.com' },
    { name: 'lemla.adroit360gh.com' },
    { name: 'sms.adroit360gh.com' },
    { name: 'Iamnzema.com' },
    { name: 'Ntoboafund.com' },
    { name: 'Wearescaleupafrica.com' },
    { name: 'a-starofficial.com' },
    { name: 'buildmategh.com' },
    { name: 'lebenebeans.com' },
    { name: 'nationaltheatregh.com' },
    { name: 'thelittlecow.net' },
    { name: 'reroro.org' },
    { name: 'nfghana.com' },
    { name: 'minkahpremo.com' },
    { name: 'lemlagroup.com' },
    { name: 'asti.edu.gh' },
    { name: 'okworld.com.gh' },
    { name: 'gyanautoworks.com' },
    { name: 'mpobb.com' },
    { name: 'nufufoundation.org' },
    { name: 'greendairygh.com' },
    // { name: 'minkahpremo.com' },
    { name: 'voltican.com' },
    { name: 'minkahpremooseibonsubrucecathline.info' },
    // { name: 'mpobb.org' },
    // { name: 'mpobb.info' },
    { name: 'minkahpremooseibonsubrucecathline.net' },
    { name: 'minkahpremooseibonsubrucecathline.com' },
    { name: 'minkahpremooseibonsubrucecathlines.com' },
    // { name: 'mpobb.net' },
    { name: 'minkahpremooseibonsubrucecathline.org' },
    { name: 'minkahpremooseibonsubrucecathline.online' },
    // { name: 'mpobb.co' },
    { name: 'minkahpremooseibonsubrucecathline.biz' },
    // { name: 'minkahpremo.com' },
    { name: 'ghanabar.org' },
    { name: 'kofasmedia.com' }
  ]);

  const [details, setDetails] = useState({});
  const [loading, setLoading] = useState(false);
  const [lastRun, setLastRun] = useState('');

  const PORT = 3002

  useEffect(() => {
    // Load details and last run time from local storage if available
    const savedDetails = localStorage.getItem('siteDetails');
    const savedLastRun = localStorage.getItem('lastRunTime');

    if (savedDetails) {
      setDetails(JSON.parse(savedDetails));
    }

    if (savedLastRun) {
      setLastRun(savedLastRun);
    }
  }, []);

  useEffect(() => {
    // Update the relative time every minute
    const interval = setInterval(() => {
      if (lastRun) {
        setLastRun(lastRun); // Force re-render
      }
    }, 60000);

    return () => clearInterval(interval);
  }, [lastRun]);

  const show = () => {
    setLoading(true);

    const promises = sites.map((site) =>
      axios.post(`https://webvalidator-ssl-backend.onrender.com/getsslinfo`, { name: site.name })
        .then(res => ({ site: site.name, data: res.data }))
        .catch(err => ({ site: site.name, error: err }))
    );

    Promise.all(promises)
      .then(results => {
        const newDetails = {};
        results.forEach(result => {
          if (result.error) {
            console.log(`Error checking ${result.site}:`, result.error);
          } else {
            newDetails[result.site] = result.data;
          }
        });
        setDetails(newDetails);

        // Save details and last run time to local storage
        localStorage.setItem('siteDetails', JSON.stringify(newDetails));
        const currentTime = new Date().toISOString();
        setLastRun(currentTime);
        localStorage.setItem('lastRunTime', currentTime);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const renderStatus = (status) => {
    return (
      <td style={{ color: status ? 'green' : 'red' }}>
        {status ? '✔' : '✘'}
      </td>
    );
  };

  const renderRedirect = (redirectTo) => {
    return (
      <td style={{ color: 'blue' }}>
        {redirectTo ? `Redirects to ${redirectTo}` : 'No Redirect'}
      </td>
    );
  };

  const test = () =>{
    axios.post(`https://webvalidator-ssl-backend.onrender.com/getsslinfo`, {name:"youtube.com"})
        .then(res => console.log(res.data))
        .catch(err => console.log(err))
  }

  return (
    <>
      <div className='d-flex justify-content-center'>
        <h1>Site Checker</h1>
      </div>

      <div className='d-flex justify-content-end'>
        <div className='d-flex flex-column gap-2'>
          <Button style={{ width: "7rem" }} onClick={show} disabled={loading}>
            {loading ? 'Loading…' : 'Run'}
          </Button>
          <Button onClick={test}>click</Button>
        </div>
        <p>
          Last Run: {lastRun ? dayjs(lastRun).fromNow() : 'Never'}
        </p>
      </div>

      <Table striped bordered>
        <thead>
          <tr>
            <th>#</th>
            <th>Site</th>
            <th>Has SSL</th>
            <th>Has Malware</th>
            <th>Is Live</th>
            <th>Redirects To</th>
          </tr>
        </thead>
        <tbody>
          {sites.map((site, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{site.name}</td>
              {details[site.name] ? (
                <>
                  {renderStatus(details[site.name].ssl)}
                  {renderStatus(details[site.name].mal)}
                  {renderStatus(details[site.name].live)}
                  {renderRedirect(details[site.name].redirectTo)}
                </>
              ) : (
                <>
                  <td>-</td>
                  <td>-</td>
                  <td>-</td>
                  <td>-</td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );
}

export default App;


