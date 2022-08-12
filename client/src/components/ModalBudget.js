import React, {Component} from 'react';
import { Modal, Button } from "react-bootstrap";
import FormBudget from './FormBudget'

class ModalBudget extends Component {    
     
    state = {
        show: false,
        setShow: false
    }
    componentDidMount(){
        this.handleClose();
    }
    
    handleClose = () => { this.setState({ show: false }) }
    handleShow = () => { this.setState({ show: true }) }
     
    render(){         
    return (
      <>
        <Button variant="success" onClick={this.handleShow}>
          Crear
        </Button>
  
        <Modal show={this.state.show} onHide={this.handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Crear Presupuesto</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <FormBudget/>
          </Modal.Body>
        </Modal>
      </>
    );
}
  }

  export default ModalBudget;