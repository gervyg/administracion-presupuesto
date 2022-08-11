import React, {Component} from 'react';
import {NavLink} from 'react-router-dom'

class Header extends Component {
    render(){
        return(
            <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
                <div className="container-fluid">
                <NavLink className="navbar-brand" to="/">Administración Presupuesto Personal</NavLink>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav ms-auto">
                        <li className="nav-item">
                            <NavLink className="nav-link active" to="/">Inicio</NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink className="nav-link" to="/budget">Presupuesto</NavLink>
                        </li>                    
                        </ul>
                </div>
            </div>
          </nav>
        );
    }
}
export default Header;