import React, {Component} from "react";
import {connect} from "react-redux";
import {getAllEmployee, getEmployeeTotalIncome} from "../common/contractMethods";
import EmployeeCard from "../components/employeecard";
import {Grid, GridColumn, GridRow} from "semantic-ui-react";


class IRS extends Component {
    state = {
        selectedType : "irs",
        registerMessageVisible : true,
        errorMessage: "",
        employee:[],
        salaries : [],
    }

    async componentDidMount() {
        //Get address for all employees when component mount and set the result as state variable employee.
        try {
            var result = await getAllEmployee(this.props.taxChainContract, this.props.userAddress);
            this.setState({
                errorMessage: "Successfully retrieved Employees",
                employee: result,
            })
        } catch (err) {
            console.log(err);
            this.setState({
                errorMessage: "Failed to get employees"
            });
        }
    }

    //This function get salary from individual employee address. Might be removed in further work.
    // async getEmployeeSalary(employeeAddress) {
    //     try {
    //         var res = await getEmployeeTotalIncome(this.props.taxChainContract, employeeAddress)
    //     } catch (err) {
    //         console.log("Failed");
    //     }
    //     return res;
    // }


    render() {
        return (
            <div>
                In IRS home page
                <Grid>
                {
                    //mapping through all employee address from state variable and setting EmployeeCard Component for each of these addresses.
                    this.state.employee.map((employeeAddress, index) => {
                        return(<Grid.Column width={5}><EmployeeCard addr={employeeAddress} salary={this.state.salaries[index]} /></Grid.Column>)
                    })
                }
                </Grid>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        taxChainContract: state.taxChainContract,
        userAddress: state.userAddress,
    }
}
export default connect(mapStateToProps)(IRS);