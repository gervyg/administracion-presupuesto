import React, {Component} from 'react';
import {NavLink} from 'react-router-dom';
import Dropdown from 'react-bootstrap/Dropdown';

class Header extends Component {
   
    state = {
        validateLogin: false,
        userName: ""
     }
 
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
            const token = JSON.parse(localStorage.getItem('token'));
            const base64Url = token.split(".")[1];
            const base64 = base64Url.replace("-", "+").replace("_", "/");
            const tk = JSON.parse(window.atob(base64));
            if (Date.now() >= (tk.exp) * 1000) {
                alert("Sesión Expirada");
                this.close();
            }            
          }, 5000);
    }    

    close = () => {
        localStorage.setItem('token', "");
        localStorage.setItem('validateLogin', false);
        window.location.href ="/";
    }
  
    render(){
        return(
            <React.Fragment>
            <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
                <div className="container-fluid">
                <NavLink className="navbar-brand" to="/balance">Administración Presupuesto Personal</NavLink>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                {!this.state.validateLogin && 
                    <ul className="navbar-nav ms-auto">
                        <li className="nav-item">
                            <NavLink className="nav-link active" to="/">Login</NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink className="nav-link" to="/register">Register</NavLink>
                        </li>  
                    </ul>
                }
                {this.state.validateLogin &&
                    <ul className="navbar-nav ms-auto">
                        <li className="nav-item">
                            <NavLink className="nav-link active" to="/balance">Balance</NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink className="nav-link" to="/budget">Presupuesto</NavLink>
                        </li> 
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
                    </ul>
                }
                </div>
            </div>
          </nav>
          </React.Fragment>
        );
    }
}
export default Header;