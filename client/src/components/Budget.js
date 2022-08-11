import React, {Component} from 'react';
import axios from 'axios';

class Budget extends Component {
    state = {
        budgets: [],
        categories: []
    }

    componentDidMount(){
        this.getBudgets();
        this.getCategories();
    }

    getBudgets = () => {
        axios.get("http://localhost:5000/budgets",  {
            params: {
              limit: false
            } 
        })
        .then( res => {
            this.setState({
                budgets: res.data
            })
            console.log(res);
        })
    }

    getCategories = () => {
        axios.get("http://localhost:5000/categories")
        .then( res => {
            this.setState({
                categories: res.data
            })
            console.log(res);
        })
    }

    render(){
            return (
                <React.Fragment>
                    <div className='row float-start m-3'>
                        <button type="button" className="btn btn-success">Crear</button>
                    </div>
                    <div className='row float-end'>                    
                        <form className="row gy-2 gx-3 mx-5">
                        <div className="col-auto">
                            <div className="mb-3 row">
                                <label for="selectTipo" className="col-auto col-form-label">Tipo: </label>
                                <div className="col-auto">
                                    <select id="selectTipo" className='form-select form-select-sm'>
                                        <option value=''>Todos</option>
                                        <option value='1'>Ingresos</option>
                                        <option value='0'>Egresos</option>
                                    </select> 
                                </div>
                            </div>
                        </div>
                        <div className="col-auto">
                            <div className='mb-3 row'>
                                <label className='col-auto col-form-label'>Categoría: </label>
                                <div className="col-auto">
                                <select id="selectCategoria" className='form-select form-select-sm'>
                                        <option value=''>Todas</option>
                                        {this.state.categories.map((category, i)=> {
                                            return(
                                                <option key={i} value={category.id}>{category.descripcion}</option>
                                            )
                                        })}
                                    </select> 
                                </div>                            
                            </div>
                        </div>
                        <div className="col-auto">
                            <div className='mb-3 row'>
                            <button type="button" className="btn btn-primary">Buscar</button>
                            </div>
                        </div>
                    </form>   
                    </div>
                    <section>
                        <div className='clearfix'></div>
                        <div className='row mt-5 mx-3'>
                            <table className="table table-striped table-hover">
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Concepto</th>
                                        <th>Monto</th>
                                        <th>Fecha</th>
                                        <th>Tipo</th> 
                                        <th>Editar</th>
                                        <th>Eliminar</th>
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
                                                <td>{b.monto}</td>
                                                <td>{b.fecha}</td>
                                                <td>{b.tipo}</td>
                                                <td></td>
                                                <td></td>
                                            </tr>
                                        )
                                    })  
                                } 
                                {(this.state.budgets.length === 0) && 
                                <tr key={1}>
                                    <td colSpan="7">No hay registros</td>
                                </tr>               
                                }
                                </tbody>
                                
                            </table>
                        </div>   
                    </section>  
                </React.Fragment>
                
            )
        
    }
}
export default Budget;