import React, {Component} from 'react';
import axios from 'axios';
import SimpleReactValidator from 'simple-react-validator';

class FormBudget extends Component {

    state = {
        idUser: this.props.idUser,
        categories: this.props.categories,
        budget: {},
        resultFail: false
    }

    validator = new SimpleReactValidator({ messages: { required: "Este campo es requerido"}});

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
                category: this.categoryRef.current.value,
                idUser: this.state.idUser
            }
        })
    }

    saveBudget = (e) => {
        e.preventDefault();
        this.changeState();
        this.setState({ resultFail: false }); 
        
        if(this.validator.allValid()){
            if(this.props.idBudget === 0){ 
                //Add Budget
                axios.post("http://localhost:5000/budget", 
                {   budget: this.state.budget },
                {   params: { token: JSON.parse(localStorage.getItem('token')) }
                }).then( res => {              
                    if(res.data){
                        window.location.reload();
                    }else{
                        this.setState({
                            resultFail: true
                        })
                    }
                })
            }else{ 
                //Edit Budget
                axios.put("http://localhost:5000/budget/"+this.props.idBudget, 
                        {   budget: this.state.budget },
                        {   params: { token: JSON.parse(localStorage.getItem('token')) }
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
        }else{
            this.validator.showMessages();
            this.forceUpdate();
        }        
        
    }

    getDataBudget = () => {
        if(this.props.idBudget !== 0 && this.props.idBudget != null){
            this.setState({
                budget: {
                    concept: this.props.budgetEdit.concept,
                    amount: (this.props.budgetEdit.type === '0')? -this.props.budgetEdit.amount : this.props.budgetEdit.amount,
                    type: this.props.budgetEdit.type,
                    category: this.props.budgetEdit.id_category,
                    idUser: this.props.budgetEdit.id_user
                }
            })
        }
    }

    componentDidMount(){
        this.getDataBudget();
    }

    render(){
        return(            
            <form method="post" onSubmit={this.saveBudget}>
            <div className="mb-3">
                <label for="concept" className="form-label">Concepto</label>
                <input type="text" className="form-control" id="concept" maxLength="100" defaultValue={this.state.budget.concept} ref={this.conceptRef} onChange={this.changeState}/>
                {this.validator.message('concept', this.state.budget.concept, 'required')}
            </div>
            <div className="mb-3">
                <label for="amount" className="form-label">Monto</label>
                <input type="number" className="form-control" id="amount" defaultValue={this.state.budget.amount} ref={this.amountRef}  onChange={this.changeState}/>
                {this.validator.message('amount', this.state.budget.amount, 'required')}
            </div>
            <div className="mb-3">
                <label for="type" className="form-label">Tipo</label>
                <select id="type" className='form-select form-select-sm' value={this.state.budget.type} defaultValue={this.state.budget.type} 
                    disabled={((this.props.idBudget === 0)? false: true)} ref={this.typeRef}  onChange={this.changeState}>
                    <option value='1'>Ingresos</option>
                    <option value='0'>Egresos</option>
                </select> 
            </div>
            <div className="mb-3">
                <label for="category" className="form-label">Categoría</label>
                <select id="category" className='form-select form-select-sm' value={this.state.budget.category} defaultValue={this.state.budget.category} ref={this.categoryRef}  onChange={this.changeState}>
                    {this.state.categories.map((category, i)=> {
                        return(
                            <option key={i} value={category.id}>{category.description}</option>
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