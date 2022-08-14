import React, {Component} from 'react';
import axios from 'axios';

class Home extends Component {
    state = {
        idUser: 1,
        budgets: []
    }

    componentWillMount(){
        this.getBudgets();
    }

    getBudgets = () => {
        axios.get("http://localhost:5000/budgets",  {
            params: {
              limit: true,
              idUser: this.state.idUser
            } 
        })
        .then( res => {
            this.setState({
                budgets: res.data
            })
            console.log(res);
        })
    }

    render(){
        return(
            <React.Fragment>
                <div className="row mt-5 mx-3 float-start">
                    <h2>Balance actual: {(this.state.budgets.length > 0)?' 0$':' Cargando ...'}</h2>
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
                        {
                        (this.state.budgets.length > 0) &&
                        
                            this.state.budgets.map((b, i)=> {
                                return(
                                    <tr key={i}>
                                        <td>{i+1}</td>
                                        <td>{b.concepto}</td>
                                        <td>{b.monto+'$'}</td>
                                        <td>{b.fecha}</td>
                                        <td>{(b.tipo === '1')? 'Ingresos':'Egresos'}</td>
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