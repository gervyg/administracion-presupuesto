import React, {Component} from 'react';
import {BrowserRouter, Route, Routes} from 'react-router-dom';
import Home from './components/Home'
import Budget from './components/Budget'
import Header from './components/Header'
import Login from './components/Login'

class Router extends Component {
    
    render(){
        return(                        
            <BrowserRouter>
                 <Header/>
                 {/*Configuracion de rutas */}
                 <Routes>
                    <Route path='/' element={<Login/>} />
                    <Route path='/register' element={<Login/>} />
                    <Route path='/balance' element={<Home />} />
                    <Route path='/budget' element={<Budget/>} />
                </Routes>     
                
                
            </BrowserRouter>
        );
    }
}
export default Router;