import React, { useEffect, useState } from 'react';
import { Tree, TreeNode } from 'react-organizational-chart';
 
const StyledNode = ({ children, color = 'border-red-500' }) => (
  <div className={`px-3 py-2 rounded-lg border ${color} inline-block`}>
    {children}
  </div>
);
 
const renderInterns = (interns) =>
  interns?.map((intern, i) => (
    <TreeNode key={i} label={<StyledNode>{intern.name}</StyledNode>} />
  ));
 
const renderEmployees = (employees) =>
  employees?.map((employee, i) => (
    <TreeNode key={i} label={<StyledNode>{employee.name}</StyledNode>}>
      {renderInterns(employee.interns)}
    </TreeNode>
  ));
 
const renderManagers = (managers) =>
  managers?.map((manager, i) => (
    <TreeNode key={i} label={<StyledNode>{manager.name}</StyledNode>}>
      {renderEmployees(manager.employees)}
    </TreeNode>
  ));
 
const renderDirectors = (directors) =>
  directors?.map((director, i) => (
    <TreeNode key={i} label={<StyledNode>{director.name}</StyledNode>}>
      {renderManagers(director.managers)}
    </TreeNode>
  ));
 
const OrgChart = () => {
  const [orgData, setOrgData] = useState(null);
  const [error, setError] = useState(null);
 
  useEffect(() => {
    fetch('http://localhost:5000/users/org-chart')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch org chart');
        return res.json();
      })
      .then(setOrgData)
      .catch(err => setError(err.message));
  }, []);
 
  if (error) return <div>Error: {error}</div>;
  if (!orgData) return <div>Loading...</div>;
 
  return (
    <Tree
      lineWidth="2px"
      lineColor="green"
      lineBorderRadius="10px"
      label={<StyledNode>{orgData.organization}</StyledNode>}
    >
      {renderDirectors(orgData.directors)}
    </Tree>
  );
};
 
export default OrgChart;
 
 