import React, {Component} from "react";
import {connect} from "react-redux";
import {getAllEmployee, getEmployeeTotalIncome, getAllEmployeeTotalIncomeList} from "../common/contractMethods";
import EmployeeCard from "../components/employeecard";
import {Grid, GridColumn, GridRow, Table, Segment, Dimmer, Loader, Image, Icon, Statistic, Tab, Form, Message, Button, Modal, Header } from "semantic-ui-react";


class IRS extends Component {
    state = {
        selectedType : "irs",
        registerMessageVisible : true,
        errorMessage: "",
        employee:[],
        salaries : [],
        taxRate : .1,
        errorMessage: "",
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

    getEmployeesPane = () => {
      let employeesPane = (
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
      );
      let paneName = 'Employees';

      return {
        menuItem: paneName,
        render: () => <Tab.Pane>{employeesPane}</Tab.Pane>
      }

    }

    getManagementPane = () => {
      let managementPane = (
        <div>
        <Segment hidden={this.state.errorMessage === ""}>
            {this.state.errorMessage}
        </Segment>
        <Segment>
            <Statistic.Group widths='three'>
                <Statistic>
                    <Statistic.Value>
                        <Icon name="dollar" />{this.state.totalSalary}
                    </Statistic.Value>
                    <Statistic.Label>Total Income</Statistic.Label>
                </Statistic>
                <Statistic>
                    <Statistic.Value>
                        <Icon name="percent" />{this.state.incomeTaxRate}
                    </Statistic.Value>
                    <Statistic.Label>Income Tax Rate</Statistic.Label>
                </Statistic>

                <Statistic>
                    <Statistic.Value>
                        <Icon name="dollar" />{this.state.totalTax}
                    </Statistic.Value>
                    <Statistic.Label>Total Income Tax</Statistic.Label>
                </Statistic>
            </Statistic.Group>
        </Segment>
        </div>
      );
      let paneName = 'Management';

      return {
        menuItem: paneName,
        render: () => <Tab.Pane>{managementPane}</Tab.Pane>
      }
    }

    render() {
        let allPanes = [
            this.getManagementPane(),
            this.getEmployeesPane()
        ];
        return (
            <div>
                meow
                <Tab panes={allPanes} renderActiveOnly={true} />
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
