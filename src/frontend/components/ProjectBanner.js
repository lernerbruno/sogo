import { useState, useEffect, useRef } from 'react'
import { withRouter, useParams } from 'react-router-dom'; 
import { ethers } from "ethers"
import { Modal, Row, Col, Card, Button } from 'react-bootstrap'
import ProgressBar from 'react-bootstrap/ProgressBar';
import { Tab, Tabs, Box } from '@mui/material'

const ProjectBanner = ({ socialProjectFactory }) => {
  const [allValues, setAllValues] = useState({
    loading: true,
    proj: {},
    confirmPassword: '',
    donationCount: 0
  });
  const [tabIndex, setTabIndex] = useState(0);
  let { projId } = useParams();

  const handleTabChange = (event, newTabIndex) => {
    setTabIndex(newTabIndex);
  };

  const loadSocialProject = async() => {
    const projName = await socialProjectFactory.getProjectName(projId)
    const projPurpose = await socialProjectFactory.getProjectPurpose(projId)
    const projDescription = await socialProjectFactory.getProjectDescription(projId)
    const projBalance = await socialProjectFactory.getProjectBalance(projId)
    const donors = await socialProjectFactory.getDonors(projId)
    const donationsAmounts = await socialProjectFactory.getDonationsAmounts(projId)
    const projAddress = await socialProjectFactory.getProjectContract(projId)
    
    const _proj = {
      name: projName,
      purpose: projPurpose,
      description: projDescription,
      balance: projBalance,
      donors: donors,
      donationsAmounts: donationsAmounts,
      address: projAddress
    }
    setAllValues(prevAllValues => ({...prevAllValues, proj: _proj}))
    setAllValues(prevAllValues => ({...prevAllValues, loading: false})) 
    
  }

  const donate = async() => {
    console.log(ethers.utils.parseEther('1.01'))
    await(await socialProjectFactory.donateToProject(projId, ethers.utils.parseEther('1'), { value: ethers.utils.parseEther('1') })).wait()
    loadSocialProject()
  }
  
  useEffect(() => {
    loadSocialProject()
    }, [])
  if (allValues.loading) return (
    <main style={{ padding: "1rem 0" }}>
      <h2>Loading...</h2>
    </main>
  )
  return (
        <Row xs={2} md={2} lg={2} className="g-4 py-5">
            <Col style={{width: '70%'}}>
            <h6 className="normal-txt" style={{ fontSize: "4rem", fontFamily: 'Poppins', textAlign:"left" }}>{allValues.proj && allValues.proj.name}</h6> <br/>
            <h6 className="normal-txt" style={{ width:'70%', fontSize: "2rem", fontFamily: 'Poppins', textAlign:"left" }}>{allValues.proj && allValues.proj.description}</h6>  
            </Col>
            <Col style={{width: '30%'}}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs value={tabIndex} onChange={handleTabChange}>
                        <Tab label="Arrecadação" value={0}/>
                        <Tab label="Metas" value={1}/>
                    </Tabs>
                </Box>
                <Box sx={{ padding: 1 }}>
                    {tabIndex === 0 && (
                      <div>
                        <Row xs={2} md={2} lg={2} className="g-1 py-2">
                          <h6 className="normal-txt" style={{ fontSize: "1rem", fontFamily: 'Poppins', textAlign:"left" }}>R$ {allValues.proj.balance && (allValues.proj.balance.toString()/10e17) * 1400} arrecadados</h6> <br/>
                          <h6 className="normal-txt" style={{ fontSize: "1rem", fontFamily: 'Poppins', textAlign:"right" }}>28%</h6> <br/>
                        </Row>
                        <Row xs={1} md={1} lg={1} className="g-1 py-2">
                          <ProgressBar style={{width:'100%',color:'grey'}} now={28}/>
                        </Row>
                      </div>
                    )}
                    {tabIndex === 1 && (
                    <Row xs={2} md={2} lg={2} className="g-4 py-5">
                    </Row>
                    )}
                </Box>
                <Box sx={{ padding: 1 }}>
                  <Button className='button-primary' style={{float:"right", width:'100%'}} onClick={() => {donate()}} size="sm">
                      Apoie
                  </Button>
                </Box>
                
            </Col>
        </Row>
  );
}
export default ProjectBanner