import { useState } from 'react'
import { Row, Form, Button } from 'react-bootstrap'
import {useNavigate} from 'react-router-dom';


const CreateSocialProject = ({ socialProjectFactory }) => {
    const [purpose, setPurpose] = useState('')
    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    const navigate = useNavigate();

    const DeploySocialProject = async () => {
        if (!purpose || !name  || !description) return
        try{
            await(await socialProjectFactory.createSocialProject(name, purpose, description)).wait()
            // TODO: Create a success modal or something
            navigate('/');
        } catch(error) {
            console.log("Error creating SocialProject: ", error)
        }
    }

    return (
    <div className="container-fluid mt-5">
        <div className="row">
        <main role="main" className="col-lg-12 mx-auto" style={{ maxWidth: '1000px' }}>
            <div className="content mx-auto">
            <Row className="g-4">
                <Form.Control onChange={(e) => setName(e.target.value)} size="lg" required type="text" placeholder="Name" />
                <Form.Control onChange={(e) => setPurpose(e.target.value)} size="lg" required as="textarea" placeholder="Purpose" />
                <Form.Control onChange={(e) => setDescription(e.target.value)} size="lg" required as="textarea" placeholder="Description" />
                
                <div className="d-grid px-0">
                <Button onClick={DeploySocialProject} variant="primary" size="lg">
                    Deploy Social Project
                </Button>
                </div>
            </Row>
            </div>
        </main>
        </div>
    </div>
    );
}

export default CreateSocialProject