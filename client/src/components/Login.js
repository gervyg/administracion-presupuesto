import React, {Component} from 'react';
import axios from 'axios';
import {NavLink} from 'react-router-dom';
import SimpleReactValidator from 'simple-react-validator';

class Login extends Component {

    state = {
        email: "",
        password: "",
        resultFail: false
    }
    //To validate Form (with custom messages)
    validator = new SimpleReactValidator({ messages: { required: "Este campo es requerido", email: "Debe escribir en formato email"}});
    
    //Fields for login
    emailRef = React.createRef();
    passwordRef = React.createRef();

    //Change value of form fields 
    changeState = () => {
        this.setState({
            email: this.emailRef.current.value,
            password: this.passwordRef.current.value            
        })
    }

    //login by email and password
    login = (e) => {
        e.preventDefault();
        this.changeState();
        this.setState({ resultFail: false })

        //To validate form (if all correct)
        if(this.validator.allValid()){
            axios.get("/login",  {
                params: {
                email: this.state.email,
                password: this.state.password
                } 
            })
            .then( res => {
                if(res.data.login){
                    //if correct login -> set variables in localStorage
                    localStorage.setItem('token', JSON.stringify( res.data.token ));
                    localStorage.setItem('validateLogin', true)
                    window.location.href = "/balance"; //to enter the balance view
                }else{
                    this.setState({ resultFail: true })
                }
            })
        }else{
            //To show message the form validator (if a field is not correct)
            this.validator.showMessages();
            this.forceUpdate();
        }
        
    }

    render(){
        return(
        <React.Fragment>         
        <div className="container">  
          <div className='row justify-content-center'>
            <div className='col-sm-4 col-xs-12 mt-5'>
                <form method="post" onSubmit={this.login}>
                    <div className="mb-3">
                        <label for="email" className="form-label">Email</label>
                        <input type="text" className="form-control" id="email" name="email" maxLength="100" defaultValue={this.state.email} ref={this.emailRef} onChange={this.changeState}/>
                        {this.validator.message('email', this.state.email, 'required|email')}
                    </div>
                    <div className="mb-3">
                        <label for="password" className="form-label">Password</label>
                        <input type="password" className="form-control" id="password" maxLength="10" defaultValue={this.state.password} ref={this.passwordRef}  onChange={this.changeState}/>
                        {this.validator.message('password', this.state.password, 'required')}
                    </div>
                    {
                        this.state.resultFail ?
                        <div className="mb-3" >
                            <div className="alert alert-danger" role="alert">
                                Email o contraseña inválidas.
                            </div>
                        </div>
                        : null
                    }                    
                    <div className="mb-3">
                        <button type="submit" className="btn btn-primary">Ingresar</button>
                    </div>
                </form>
            </div>
           </div>
           <NavLink to="/register" className="mt-3 text-primary">Registrarse</NavLink>
          </div>           
          </React.Fragment>     
        );
    }
}
export default Login;