import React, {Component} from 'react';
import {BrowserRouter, Route, Routes} from 'react-router-dom';
import Home from './components/Home'
import Budget from './components/Budget'
import Header from './components/Header'
import Login from './components/Login'
import Register from './components/Register'

class Router extends Component {
    
    render(){
        return(                        
            <BrowserRouter>
                 <Header/>
                 {/*Router configuration */}
                 <Routes>
                    <Route path='/' element={<Login/>} />
                    <Route path='/register' element={<Register/>} />
                    <Route path='/balance' element={<Home />} />
                    <Route path='/budget' element={<Budget/>} />
                </Routes>     
                
                
            </BrowserRouter>
        );
    }
}
export default Router;