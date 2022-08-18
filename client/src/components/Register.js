import React, {Component} from 'react';
import axios from 'axios';
import SimpleReactValidator from 'simple-react-validator';

class Register extends Component {

    state = {
        email: "",
        password: "",
        resultMsg: null,
    }
    //To validate Form (with custom messages)
    validator = new SimpleReactValidator({ messages: { required: "Este campo es requerido", email: "Debe escribir en formato email"}});
    
    //To validate Form (with custom messages)
    nameRef = React.createRef();
    emailRef = React.createRef();
    passwordRef = React.createRef();

    //Change value of form fields 
    changeState = () => {
        this.setState({
            name: this.nameRef.current.value,
            email: this.emailRef.current.value,
            password: this.passwordRef.current.value            
        })
    }

    //Function to register users
    register = (e) => {
        e.preventDefault();
        this.changeState();
        this.setState({ resultMsg: null })

        //To validate form (if all correct)
        if(this.validator.allValid()){
            axios.post("/register",  {                
                name: this.state.name,
                email: this.state.email,
                password: this.state.password               
            })
            .then( res => {
                if(res.data){
                    this.setState({ resultMsg: true })
                    alert("Inicie Sesión con su nuevo usuario creado");
                    window.location.href="/";
                }else{
                    this.setState({ resultMsg: false })
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
                <form method="post" onSubmit={this.register}>
                    <div className="mb-3">
                        <label for="name" className="form-label">Nombre completo</label>
                        <input type="text" className="form-control" id="name" name="name" maxLength="100" defaultValue={this.state.name} ref={this.nameRef} onChange={this.changeState}/>
                        {this.validator.message('email', this.state.email, 'required')}
                    </div>
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
                        (this.state.resultMsg !== null) ?
                        <div className="mb-3" >
                            <div className={(this.state.resultMsg)?"alert alert-success":"alert alert-danger"} role="alert">
                                {(this.state.resultMsg)? "Registro exitoso." : "Disculpe hubo un error."}
                            </div>
                        </div>
                        : null
                    }                    
                    <div className="mb-3">
                        <button type="submit" className="btn btn-primary">Registrar</button>
                    </div>
                </form>
            </div>
           </div>
          </div>           
          </React.Fragment> 
        );
    }
}
export default Register;