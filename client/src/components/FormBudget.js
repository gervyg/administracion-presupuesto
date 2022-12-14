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
    //To validate Form (with custom messages)
    validator = new SimpleReactValidator({ messages: { required: "Este campo es requerido"}});

    //Fields for create or edit form
    conceptRef = React.createRef();
    amountRef = React.createRef();
    typeRef = React.createRef();
    categoryRef = React.createRef();

    //Change value of form fields 
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
    //To save budgets (if id=0 -> new budget, else -> edit budget)
    saveBudget = (e) => {
        e.preventDefault();
        this.changeState();
        this.setState({ resultFail: false }); 
        
        //To validate form (if all correct)
        if(this.validator.allValid()){
            if(this.props.idBudget === 0){ 
                //Add Budget
                axios.post("/budget", 
                {   budget: this.state.budget },
                {   params: { token: JSON.parse(localStorage.getItem('token')) }
                }).then( res => {              
                    if(res.data){
                        window.location.reload();
                    }else{
                        //Show error message
                        this.setState({
                            resultFail: true
                        })
                    }
                })
            }else{ 
                //Edit Budget
                axios.put("/budget/"+this.props.idBudget, 
                        {   budget: this.state.budget },
                        {   params: { token: JSON.parse(localStorage.getItem('token')) }
                    }
                ).then( res => {              
                    if(res.data){
                        window.location.reload();
                    }else{
                        //Show error message
                        this.setState({
                            resultFail: true
                        })
                    }
                })
            }
        }else{
            //To show message the form validator (if a field is not correct)
            this.validator.showMessages();
            this.forceUpdate();
        }        
        
    }

    //To obtain data for a budget to be edited
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
                <input type="number" className="form-control" id="amount" maxLength="10" defaultValue={this.state.budget.amount} ref={this.amountRef}  onChange={this.changeState}/>
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
                <label for="category" className="form-label">Categor??a</label>
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