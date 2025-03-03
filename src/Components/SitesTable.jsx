import { React, useEffect, useState } from 'react';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import { Spinner } from 'react-bootstrap';

const SitesTable = ({ sites, deleteFunction, trigger, singleSiteRun, selectedSites, setSelectedSites }) => {
  const [details, setDetails] = useState(null);
  const [selectAll, setSelectAll] = useState(false);

  useEffect(() => {
    const siteDetails = {};
    sites.forEach(site => {
      siteDetails[site.name] = {
        ssl: site.hasSSL,
        mal: site.hasMalware,
        live: site.isLive,
        redirectTo: site.redirectTo
      };
    });
    setDetails(siteDetails);
  }, [sites]);

  useEffect(() => {
    setSelectAll(selectedSites.length === sites.length);
  }, [selectedSites, sites.length]);

  const renderStatus = (status) => {
    if (status === undefined) {
      return (
        <td>
          -
        </td>
      );
    }
    return (
      <td style={{ color: status ? 'green' : 'red' }}>
        {status ? '✔' : '✘'}
      </td>
    );
  };

  const renderRedirect = (redirectTo) => {
    if (redirectTo === undefined) {
      return (
        <td>
          -
        </td>
      );
    }

    return (
      <td style={{ color: 'white' }}>
        {redirectTo ? `Redirects to ${redirectTo}` : 'No Redirect'}
      </td>
    );
  };

  const handleCheckboxChange = (siteName) => {
    if (selectedSites.includes(siteName)) {
      setSelectedSites(selectedSites.filter(name => name !== siteName));
    } else {
      setSelectedSites([...selectedSites, siteName]);
    }
  };

  const handleSelectAllChange = () => {
    if (selectAll) {
      setSelectedSites([]);
    } else {
      setSelectedSites(sites.map(site => site.name));
    }
    setSelectAll(!selectAll);
  };

  return (
    <div>
      <Table striped bordered hover variant="dark">
        <thead>
          <tr>
            <th>
              <input
                type="checkbox"
                checked={selectAll}
                onChange={handleSelectAllChange}
              />
            </th>
            <th>#</th>
            <th>Site</th>
            <th>Has SSL</th>
            <th>Has Malware</th>
            <th>Is Live</th>
            <th>Redirects To</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {sites.map((site, index) => (
            <tr key={index}>
              <td>
                <input
                  type="checkbox"
                  checked={selectedSites.includes(site.name)}
                  onChange={() => handleCheckboxChange(site.name)}
                />
              </td>
              <td>{index + 1}</td>
              <td>{site.name}</td>
              {details[site.name] ? (
                <>
                  {renderStatus(details[site.name].ssl)}
                  {renderStatus(details[site.name].mal)}
                  {renderStatus(details[site.name].live)}
                  {renderRedirect(details[site.name].redirectTo)}
                  <td className='d-flex gap-1'>
                    <Button disabled={trigger === site.name} onClick={() => singleSiteRun(site.name)}>
                      {trigger === site.name ? <Spinner animation="border" size="sm" /> : `Run`}
                    </Button>
                  </td>
                </>
              ) : (
                <>
                  <td>-</td>
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
    </div>
  );
}

export default SitesTable;
