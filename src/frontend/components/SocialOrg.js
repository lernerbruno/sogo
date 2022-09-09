import { useState, useEffect } from 'react'
import { withRouter, useParams } from 'react-router-dom'; 
import { ethers } from "ethers"
import { Modal, Row, Col, Card, Button } from 'react-bootstrap'
import ProgressBar from 'react-bootstrap/ProgressBar';

const SocialOrg = ({ sogo, nft, organizationFactory }) => {

  const [loading, setLoading] = useState(true)
  const [org, setOrg] = useState({})
  const [sogoTokens, setSogoTokens] = useState([])
  const [orgCount, setOrgCount] = useState(0)
  let { orgId } = useParams();

  const loadOrg = async() => {
    const orgName = await organizationFactory.getOrganizationName(orgId)
    const orgPurpose = await organizationFactory.getOrganizationPurpose(orgId)
    const orgDescription = await organizationFactory.getOrganizationDescription(orgId)
    const orgBalance = await organizationFactory.getOrganizationBalance(orgId)
    const donors = await organizationFactory.getDonors(orgId)
    const donationsAmounts = await organizationFactory.getDonationsAmounts(orgId)
    const orgAddress = await organizationFactory.getOrganizationContract(orgId)
    
    setOrg({
        name: orgName,
        purpose: orgPurpose,
        description: orgDescription,
        balance: orgBalance,
        donors: donors,
        donationsAmounts: donationsAmounts,
        address: orgAddress
    })
  }

  const loadSogoArts = async () => {
    // Load all unsold items 
    console.log(org.address)
    const orgTokens = await sogo.getOrgTokens(org.address)
    let sogoTokens = []
    for (let i = 1; i <= orgTokens.length; i++) {
      const item = await sogo.sogoArts(i)
      if (!item.sold) {
        // get uri url from nft contract
        
        const uri = await nft.tokenURI(item.tokenId)
        
        // const imagePath = JSON.parse(uri.substring(6))["image"]
        // console.log(imagePath)
        // use uri to fetch the nft metadata stored on ipfs 
        // const response = await fetch(uri)
        // const metadata = await response.json()
        // get total price of item (item price + fee)
        console.log(item)
        const totalPrice = await sogo.getTotalPrice(item.SogoArtId)
        console.log(totalPrice)
        // Add item to items array 

        sogoTokens.push({
          price: totalPrice.toString(),
          itemId: item.itemId,
          seller: item.seller,
          // name: metadata.name,
          // description: metadata.description,
          image: 'assets/Untitled_Artwork.jpg'
        })
      }
    }
    setSogoTokens(sogoTokens)
  }

  const buySogoArt = async (item) => {
    await (await sogo.purchaseSogoArt(item.itemId, { value: item.totalPrice })).wait()
    loadSogoArts()
  }

  const donate = async() => {
    await(await organizationFactory.donateToOrganization(orgId, ethers.utils.parseEther('1'), { value: ethers.utils.parseEther('1') })).wait()
  }
  
  useEffect(() => {
    loadOrg()
    loadSogoArts()
    setLoading(false)
  }, [])
  if (loading) return (
    <main style={{ padding: "1rem 0" }}>
      <h2>Loading...</h2>
    </main>
  )
  return (
    <div className="flex justify-center">
      
        <div className="px-5 container">
          <Row xs={2} md={2} lg={2} className="g-4 py-5">
            <h7 style={{ fontSize: "4rem", fontFamily: 'Poppins', textAlign:"left" }}>{org && org.name}</h7>  
            <Col key={0} className="overflow-hidden">
              <h7 style={{ fontSize: "1rem", fontFamily: 'Poppins', textAlign:"left" }}>Total Arrecadado</h7><br/>
              <h7 style={{ fontSize: "2rem", fontFamily: 'Poppins', textAlign:"left" }}>R$ {org.balance && org.balance.toString()}</h7> <br/>
              <Button className='button-primary' onClick={() => {donate()}} size="sm">
                Doe e Apoie
              </Button>
            </Col>
          </Row>
          <h7 style={{ fontSize: "3rem", fontFamily: 'Poppins', textAlign:"left" }}>Doações</h7>  <br/>
          {org.donors && org.donors.length > 0 ?
            <div>
              {org.donors.map((donorAddress, idx) => (
                 <Row xs={2} md={2} lg={2} className="g-4 py-5">
                  <h7 style={{ fontSize: "1rem", fontFamily: 'Poppins', textAlign:"left" }}>{donorAddress}</h7>
                  <h7 style={{ fontSize: "1rem", fontFamily: 'Poppins', textAlign:"left" }}>{org.donationsAmounts[idx].toString()}</h7> 
                 </Row>
                
              ))}
            </div> 

                : (<h2>No donations</h2>)}
          <h7 style={{ fontSize: "3rem", fontFamily: 'Poppins', textAlign:"left" }}>Sogo Arts</h7>  <br/>
          {sogoTokens && sogoTokens.length > 0 ?
            <Row xs={1} md={2} lg={4} className="g-4 py-5">
              {sogoTokens.map((sogoToken, idx) => (
                <Col key={idx} className="overflow-hidden">
                  <Card style={{ cursor: "pointer" }}>
                    {/* <Card.Img variant="top" src={org.name} /> */}
                    <Card.Body color="primary">
                      <Card.Title>{sogoToken.SogoArtId}</Card.Title>
                      <Card.Img variant="top" src={sogoToken.image} />
                      <Card.Text>
                        {sogoToken.price}
                      </Card.Text>
                    </Card.Body>
                  </Card>
                </Col>
                
              ))}  
          </Row>
                : (<h2>No Sogo Arts</h2>)}
          
        </div>
        
    </div>
  );
}
export default SocialOrg