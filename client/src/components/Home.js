import React, {Component} from 'react';
import axios from 'axios';

class Home extends Component {
    state = {
        idUser: 0,
        budgets: [],
        validateLogin: false,
        balance: { balance: 0,  revenue: 0, expenditure: 0 }
    }

    loginValidate = () =>{

        if(localStorage.getItem('validateLogin') && localStorage.getItem('token') !== ""){ 
            const token = JSON.parse(localStorage.getItem('token'));
            const base64Url = token.split(".")[1];
            const base64 = base64Url.replace("-", "+").replace("_", "/");
            const tk = JSON.parse(window.atob(base64));
            
            this.setState({ idUser: tk.data.id, validateLogin: true }, () => {
                this.getBudgets();
                this.getUserBalance();
            });         
        }       
    }

    componentDidMount(){
        this.loginValidate();  
    }

    getUserBalance = () => {
        axios.get("http://localhost:5000/userBalance",  {
            params: {
              idUser: this.state.idUser,
              token: JSON.parse(localStorage.getItem('token'))
            } 
        })
        .then( res => {
            if(typeof res.data.balance !== 'undefined'){
              this.setState({
                balance: {
                    balance: res.data.balance,
                    revenue: res.data.total_revenue,
                    expenditure: res.data.total_expenditure
                }
              })  
            }
            
        })
    }

    getBudgets = () => {
        
        axios.get("http://localhost:5000/budgets",  {
            params: {
              limit: true,
              idUser: this.state.idUser,
              token: JSON.parse(localStorage.getItem('token'))
            } 
        })
        .then( res => {
            this.setState({
                budgets: res.data
            })
        })
    }

    render(){
        return(
            <React.Fragment>
                <div className="row mt-5 mx-3 float-start">
                    <h2 className='col text-start'>Balance actual: {(this.state.budgets.length >= 0)? this.state.balance.balance+' $':' Cargando ...'}</h2>
                    <div className='row'>
                        <h5 className='col text-start'>Total Ingresos: {this.state.balance.revenue+' $'}</h5>
                        <h5 className='col text-start'>Total Egresos: {this.state.balance.expenditure+' $'}</h5>
                    </div>
                </div>
                <div className="clearfix"></div>
                <div className="row mt-3 mx-3">
                    <p className="text-start mb-0">Últimos 10 registros</p>
                    <table className="table table-striped table-hover">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Concepto</th>
                                <th>Monto</th>
                                <th>Fecha</th>
                                <th>Tipo</th> 
                            </tr>    
                        </thead> 
                        <tbody>            
                        {(this.state.budgets.length > 0) &&
                        
                            this.state.budgets.map((b, i)=> {
                                return(
                                    <tr key={i}>
                                        <td>{i+1}</td>
                                        <td>{b.concept}</td>
                                        <td>{b.amount+'$'}</td>
                                        <td>{new Date(b.date).toLocaleString()}</td>
                                        <td>{(b.type === '1')? 'Ingresos':'Egresos'}</td>
                                    </tr>
                                )
                            })  
                        } 
                        {(this.state.budgets.length === 0) && 
                        <tr key={1}>
                            <td colSpan="5">No hay registros</td>
                        </tr>               
                        }
                        </tbody>                    
                    </table>
                </div>  
            </React.Fragment>
        )
        
    }
}
export default Home;