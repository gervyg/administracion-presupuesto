import React, {Component} from 'react';
import axios from 'axios';
import { Modal } from "react-bootstrap";
import FormBudget from './FormBudget'

class Budget extends Component {
    state = {
        idUser: 1,
        budgets: [],
        categories: [],
        showModal: false,
        showModalDelete: false,
        idBudget: 0,
        budgetEdit: {},
        type: "",
        category: ""
    }

    componentDidMount(){
        this.getBudgets();
        this.getCategories();
    }

    handleClose = () => { this.setState({ showModal: false }) }
    handleCloseDelete = () => { this.setState({ showModalDelete: false }) }

    getBudgets = () => {
        axios.get("http://localhost:5000/budgets",  {
            params: {
              limit: false,
              idUser: this.state.idUser
            } 
        })
        .then( res => {
            this.setState({
                budgets: res.data
            })
        })
    }

    typeFilterRef = React.createRef();
    categoryFilterRef = React.createRef();

    changeFilterState = () => {
        this.setState({
            type: this.typeFilterRef.current.value,
            category: this.categoryFilterRef.current.value
        })
    }

    getBudgetsFilters = () => {
        axios.get("http://localhost:5000/budgetsFilter",  {
            params: {
              type: this.state.type,
              category: this.state.category,
              idUser: this.state.idUser
            } 
        })
        .then( res => {
            this.setState({
                budgets: res.data
            })
        })
    }

    getCategories = () => {
        axios.get("http://localhost:5000/categories")
        .then( res => {
            this.setState({
                categories: res.data
            })
        })
    } 

    deleteBudget = (e) => {
        e.preventDefault();
        axios.delete("http://localhost:5000/budget/"+this.state.idBudget, 
                {params: {
                    idUser: this.state.idUser
                    }
                }
            ).then( res => {              
                console.log(res);
                if(res.data){
                    window.location.reload();
                }else{
                    this.setState({
                        resultFail: true
                    })
                }
            })
    }

    render(){
            
            return (
                <React.Fragment>
                    <div className='row float-start m-3'>
                        <button type="button" onClick={() => this.setState({showModal: true, idBudget:0, budgetEdit:{}})} className="btn btn-success">Crear</button>
                    </div>
                    <div className='row float-end'>                    
                        <form className="row gy-2 gx-3 mx-5">
                        <div className="col-auto">
                            <div className="mb-3 row">
                                <label for="selectTipo" className="col-auto col-form-label">Tipo: </label>
                                <div className="col-auto">
                                    <select id="selectTipo" className='form-select form-select-sm' ref={this.typeFilterRef}  onChange={this.changeFilterState}>
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
                                <select id="selectCategoria" className='form-select form-select-sm' ref={this.categoryFilterRef}  onChange={this.changeFilterState}>
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
                            <button type="button" onClick={this.getBudgetsFilters} className="btn btn-primary">Buscar</button>
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
                                        <th>Categoría</th>
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
                                                <td>{b.monto+'$'}</td>
                                                <td>{b.fecha}</td>
                                                <td>{(b.tipo === '1')? 'Ingresos':'Egresos'}</td>
                                                <td>{this.state.categories.filter(category => b.id_categoria === category.id).map((category, i)=> {
                                                    return(
                                                        <span key={i}>{category.descripcion}</span>
                                                    )
                                                })}</td>
                                                <td>
                                                    <i onClick={() => this.setState({showModal: true, idBudget:b.id, budgetEdit:b})} className="bi bi-pencil-fill" type="button"></i>
                                                </td>
                                                <td>
                                                    <i onClick={() => this.setState({showModalDelete: true, idBudget:b.id})} className="bi bi-trash" type="button"></i>
                                                </td>
                                            </tr>
                                        )
                                    })  
                                } 
                                {(this.state.budgets.length === 0) && 
                                <tr key={1}>
                                    <td colSpan="8">No hay registros</td>
                                </tr>               
                                }
                                </tbody>
                                
                            </table>
                        </div>   
                    </section>  
                    <Modal show={this.state.showModal} onHide={this.handleClose}>
                        <Modal.Header closeButton>
                            <Modal.Title>{((this.state.idBudget === 0)? 'Crear': 'Editar')+ ' Presupuesto'}</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <FormBudget categories={this.state.categories} idBudget={this.state.idBudget} budgetEdit={this.state.budgetEdit}/>
                        </Modal.Body>
                    </Modal>
                    <Modal show={this.state.showModalDelete} onHide={this.handleCloseDelete}>
                        <Modal.Header closeButton>
                            <Modal.Title>Eliminar Presupuesto</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <div className='row'>
                            <p>¿Seguro desea eliminar este presupuesto?</p>
                            {
                                this.state.resultFail ?
                                <div className="mb-3" >
                                    <div class="alert alert-danger" role="alert">
                                        Disculpe hubo un error.
                                    </div>
                                </div>
                                : null
                            }
                            <button type="button" onClick={this.deleteBudget} className="btn btn-primary">Guardar</button>
                            </div>                            
                        </Modal.Body>
                    </Modal>
                </React.Fragment>
                
            )
        
    }
}
export default Budget;