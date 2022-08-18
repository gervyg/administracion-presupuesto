import React, {Component} from 'react';
import {NavLink} from 'react-router-dom';
import Dropdown from 'react-bootstrap/Dropdown';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';

class Header extends Component {
   /* Component to show header (all views) */
    state = {
        validateLogin: false,
        userName: ""
     }
    //Validate login (token)
     loginValidate = () =>{
         if(localStorage.getItem('validateLogin') && localStorage.getItem('token') !== ""){
            
            const token = JSON.parse(localStorage.getItem('token'));
            const base64Url = token.split(".")[1];
            const base64 = base64Url.replace("-", "+").replace("_", "/");
            const tk = JSON.parse(window.atob(base64));

            if(window.location.pathname !== "/" && window.location.pathname !== "/register"){
                this.setState({
                    validateLogin: true,
                    userName: tk.data.name
                }) 
            }                         
         }       
    }

    componentDidMount(){
        this.loginValidate();
        setInterval(() => { 
            if(localStorage.getItem('token') !== ""){
                const token = JSON.parse(localStorage.getItem('token'));
                const base64Url = token.split(".")[1];
                const base64 = base64Url.replace("-", "+").replace("_", "/");
                const tk = JSON.parse(window.atob(base64));
                if (Date.now() >= (tk.exp) * 1000) {
                    alert("Sesión Expirada");
                    this.close();
                } 
            }else{
                if(window.location.pathname !== "/" && window.location.pathname !== "/register"){
                    alert("Sesión Expirada");
                    this.close();
                }                
            }           
          }, 5000);
    }    

    //close session (set variables localStorage)
    close = () => {
        localStorage.setItem('token', "");
        localStorage.setItem('validateLogin', false);
        window.location.href ="/";
    }
  
    render(){
        return(
            <Navbar bg="dark" variant="dark" expand="lg">
            <Container>
                <Navbar.Brand href="#">Administración Presupuesto Personal</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="ms-auto">
                    {!this.state.validateLogin && 
                        <React.Fragment>
                            <NavLink className="nav-link active" to="/">Login</NavLink>
                            <NavLink className="nav-link" to="/register">Register</NavLink>
                        </React.Fragment>
                    }
                    {this.state.validateLogin &&
                        <React.Fragment>
                            <NavLink className="nav-link active" to="/balance">Balance</NavLink>
                            <NavLink className="nav-link" to="/budget">Presupuesto</NavLink>                            
                            <Dropdown>
                                <Dropdown.Toggle variant="dark">
                                    Hola, {this.state.userName}
                                </Dropdown.Toggle>
                                <Dropdown.Menu>
                                    <Dropdown.Item href="#" onClick={this.close}>
                                        <span>Salir</span>
                                    </Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                        </React.Fragment>                        
                    }
                </Nav>
                </Navbar.Collapse>
            </Container>
            </Navbar>    
        );
    }
}
export default Header;