import React, { useEffect, useState } from 'react';
import { Table, Checkbox, Button } from 'antd';

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

  const columns = [
    {
      title: <Checkbox checked={selectAll} onChange={handleSelectAllChange} />,
      dataIndex: 'checkbox',
      key: 'checkbox',
      render: (_, record) => (
        <Checkbox
          checked={selectedSites.includes(record.name)}
          onChange={() => handleCheckboxChange(record.name)}
        />
      ),
    },
    {
      title: '#',
      dataIndex: 'index',
      key: 'index',
      render: (_, __, index) => index + 1,
    },
    {
      title: 'Site',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Has SSL',
      dataIndex: 'ssl',
      key: 'ssl',
      render: (_, record) => details[record.name] ? (details[record.name].ssl ? '✔' : '✘') : '-',
    },
    {
      title: 'Has Malware',
      dataIndex: 'mal',
      key: 'mal',
      render: (_, record) => details[record.name] ? (details[record.name].mal ? '✔' : '✘') : '-',
    },
    {
      title: 'Is Live',
      dataIndex: 'live',
      key: 'live',
      render: (_, record) => details[record.name] ? (details[record.name].live ? '✔' : '✘') : '-',
    },
    {
      title: 'Redirects To',
      dataIndex: 'redirectTo',
      key: 'redirectTo',
      render: (_, record) => details[record.name] ? (details[record.name].redirectTo ? `Redirects to ${details[record.name].redirectTo}` : 'No Redirect') : '-',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Button
          disabled={trigger === record.name}
          onClick={() => singleSiteRun(record.name)}
          type="primary"
        >
          {trigger === record.name ? 'Running...' : 'Run'}
        </Button>
      ),
    },
  ];

  return (
       <Table
     dataSource={sites}
     columns={columns}
     rowKey="name"
     className="custom-ant-table"
   />
  );
};

export default SitesTable;
