import React, {Component} from 'react';
import axios from 'axios';

class FormBudget extends Component {

    state = {
        categories: [],
        budget: {},
        resultFail: false
    }

    conceptRef = React.createRef();
    amountRef = React.createRef();
    typeRef = React.createRef();
    categoryRef = React.createRef();

    changeState = () => {
        this.setState({
            budget: {
                concept: this.conceptRef.current.value,
                amount: this.amountRef.current.value,
                type: this.typeRef.current.value,
                category: this.categoryRef.current.value
            }
        })
    }

    saveBudget = (e) => {
        e.preventDefault();
        this.changeState();
        this.setState({ resultFail: false })
        axios.post("http://localhost:5000/budget", {budget: this.state.budget})
        .then( res => {              
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

    componentDidMount(){
        this.getCategories();
    }

    getCategories = () => {
        axios.get("http://localhost:5000/categories")
        .then( res => {
            this.setState({
                categories: res.data
            })
        })
    } 

    render(){
        return(
            <form method="post" onSubmit={this.saveBudget}>
            <div className="mb-3">
                <label for="concept" className="form-label">Concepto</label>
                <input type="text" className="form-control" id="concept" ref={this.conceptRef} onChange={this.changeState}/>
            </div>
            <div className="mb-3">
                <label for="amount" className="form-label">Monto</label>
                <input type="text" className="form-control" id="amount" ref={this.amountRef}  onChange={this.changeState}/>
            </div>
            <div className="mb-3">
                <label for="type" className="form-label">Tipo</label>
                <select id="type" className='form-select form-select-sm' ref={this.typeRef}  onChange={this.changeState}>
                    <option value='1'>Ingresos</option>
                    <option value='0'>Egresos</option>
                </select> 
            </div>
            <div className="mb-3">
                <label for="category" className="form-label">Categoría</label>
                <select id="category" className='form-select form-select-sm' ref={this.categoryRef}  onChange={this.changeState}>
                    <option value='1'>Todas</option>
                    {this.state.categories.map((category, i)=> {
                        return(
                            <option key={i} value={category.id}>{category.descripcion}</option>
                        )
                    })}
                </select> 
            </div>
            {
                this.state.resultFail ?
                <div className="mb-3" >
                    <div class="alert alert-danger" role="alert">
                        Disculpe hubo un error.
                    </div>
                </div>
                : null
            }
            
            <div className="mb-3">
                <button type="submit" className="btn btn-primary">Guardar</button>
            </div>
            </form>
        )
    }
}
export default FormBudget;