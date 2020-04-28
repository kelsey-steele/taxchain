import React, {Component} from "react";
import {connect} from "react-redux";
import {getAllEmployee, getEmployeeTotalIncome, getAllEmployeeTotalIncomeList} from "../common/contractMethods";
import EmployeeCard from "../components/employeecard";
import {Grid, GridColumn, GridRow} from "semantic-ui-react";


class IRS extends Component {
    state = {
        selectedType : "irs",
        registerMessageVisible : true,
        errorMessage: "",
        employee:[],
        salaries : [],
        taxRate : .1,
    }

    async componentDidMount() {
        //Get address and salary for all employees when component mount
        try {
            const result = await getAllEmployee(this.props.taxChainContract, this.props.userAddress);
            const salary = await getAllEmployeeTotalIncomeList(this.props.taxChainContract, this.props.userAddress);
            this.setState({
                errorMessage: "Successfully retrieved Employees",
                employee: result,
                salaries: salary,
            })
        } catch (err) {
            console.log(err);
            this.setState({
                errorMessage: "Failed to get employees"
            });
        }
    }



    render() {
        return (
            <div>
              <div>
                Current Tax Due: <br/>
                Estimated Annual Tax Due:
              </div>
              <div>
                <b>All Employees</b>
                <Grid>
                {
                    //mapping through all employee address from state variable and setting EmployeeCard Component for each of these addresses.
                    this.state.employee.map((employeeAddress, index) => {
                        return(<Grid.Column width={5} key={employeeAddress}><EmployeeCard addr={employeeAddress} salary={this.state.salaries[index]} taxRate={this.state.taxRate} /></Grid.Column>)
                    })
                }
                </Grid>
              </div>
            </div>
        );
    }q
}

function mapStateToProps(state) {
    return {
        taxChainContract: state.taxChainContract,
        userAddress: state.userAddress,
    }
}
export default connect(mapStateToProps)(IRS);
