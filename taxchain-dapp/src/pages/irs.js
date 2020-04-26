import React, {Component} from "react";
import {connect} from "react-redux";
import {getAllEmployee, getEmployeeTotalIncome} from "../common/contractMethods";


class IRS extends Component {
    state = {
        selectedType : "irs",
        registerMessageVisible : true,
        errorMessage: "",
    }

    async getEmployeeSalary(employeeAddress) {
        try {
            var res = await getEmployeeTotalIncome(this.props.taxChainContract, employeeAddress)
        } catch (err) {
            console.log("Failed");
        }
        console.log("Employee Salary");
        console.log(employeeAddress);
        console.log(res);
    }

    async componentDidMount() {
        try {
            var result = await getAllEmployee(this.props.taxChainContract, this.props.userAddress);
            this.setState({
                errorMessage: "Successfully retrieved Employees",
            })
        } catch(err) {
            console.log(err);
            this.setState({
                errorMessage: "Failed to get employees"
            });
        }

        result.map((employeeAddress) =>  {
           this.getEmployeeSalary(employeeAddress)
        });

        // console.log("State Employee")
        // console.log(this.state.employee);
        //
        // this.state.employee.map((employeeAddress) => {
        //     this.getEmployeeSalary(employeeAddress)
        // })
    }



    render() {
        return (
            <div>
                In IRS home page
                this.state.employeeSalary;
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