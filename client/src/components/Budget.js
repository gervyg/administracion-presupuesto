import React, {Component} from 'react';
import axios from 'axios';
import { Modal } from "react-bootstrap";
import FormBudget from './FormBudget'

class Budget extends Component {
    state = {
        idUser: 0,
        budgets: [],
        categories: [],
        showModal: false,
        showModalDelete: false,
        idBudget: 0,
        budgetEdit: {},
        type: "",
        category: ""
    }
    //Validate login (token)
    loginValidate = () =>{

        if(localStorage.getItem('validateLogin') && localStorage.getItem('token') !== ""){
            const token = JSON.parse(localStorage.getItem('token'));
            const base64Url = token.split(".")[1];
            const base64 = base64Url.replace("-", "+").replace("_", "/");
            const tk = JSON.parse(window.atob(base64));
            
            this.setState({ idUser: tk.data.id }, () => {
                this.getBudgets();
                this.getCategories();
            });         
        }else{
            window.location.href="/"
        }       
    }

    componentDidMount(){
        this.loginValidate();
    }

    //Validate close - open -> modal
    handleClose = () => { this.setState({ showModal: false }) }
    handleCloseDelete = () => { this.setState({ showModalDelete: false }) }
    
    //Search all budgets (by user) - limit false= to show all
    getBudgets = () => {
        axios.get("/budgets",  {
            params: {
              limit: false,
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

    //Fields for filters and search form
    typeFilterRef = React.createRef();
    categoryFilterRef = React.createRef();

    //Change value of filter fields 
    changeFilterState = () => {
        this.setState({
            type: this.typeFilterRef.current.value,
            category: this.categoryFilterRef.current.value
        })
    }

    //Search budgets for filters 
    getBudgetsFilters = () => {
        axios.get("/budgetsFilter",  {
            params: {
              type: this.state.type,
              category: this.state.category,
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
    //Search all categories
    getCategories = () => {
        axios.get("/categories")
        .then( res => {
            this.setState({
                categories: res.data
            })
        })
    } 
    //Delete budget by id (selected from modal)
    deleteBudget = (e) => {
        e.preventDefault();
        axios.delete("/budget/"+this.state.idBudget, 
                {params: {
                    idUser: this.state.idUser,
                    token: JSON.parse(localStorage.getItem('token'))
                }
                }
            ).then( res => {              
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
                        <form className="row gy-2 mx-2">
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
                                                <option key={i} value={category.id}>{category.description}</option>
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
                        <div className='row mt-5 mx-3 table-responsive'>
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
                                                <td>{b.concept}</td>
                                                <td>{b.amount+'$'}</td>
                                                <td>{new Date(b.date).toLocaleString()}</td>
                                                <td>{(b.type === '1')? 'Ingresos':'Egresos'}</td>
                                                <td>{this.state.categories.filter(category => b.id_category === category.id).map((category, i)=> {
                                                    return(
                                                        <span key={i}>{category.description}</span>
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
                    {/*Modal - Create or Edit budgets */}
                    <Modal show={this.state.showModal} onHide={this.handleClose}>
                        <Modal.Header closeButton>
                            <Modal.Title>{((this.state.idBudget === 0)? 'Crear': 'Editar')+ ' Presupuesto'}</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <FormBudget categories={this.state.categories} idBudget={this.state.idBudget} budgetEdit={this.state.budgetEdit} idUser={this.state.idUser}/>
                        </Modal.Body>
                    </Modal>
                    {/*Modal - Delete budgets */}
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
                            <button type="button" onClick={this.deleteBudget} className="btn btn-danger">Eliminar</button>
                            </div>                            
                        </Modal.Body>
                    </Modal>
                </React.Fragment>
                
            )
        
    }
}
export default Budget;