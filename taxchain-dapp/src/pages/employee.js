import React, { Component } from "react";
import { connect } from "react-redux";
import { getSalaryAmountsForEmployeeAndMonth, getEmployeeTotalIncome, getTaxRate, getEmployerIdsForEmployeeAndMonth } from "../common/contractMethods";
import { Table, Segment, Dimmer, Loader, Image, Icon, Statistic } from "semantic-ui-react";
import { getFailedMessage } from "../common/commonMethods";


class Employee extends Component {
    state = {
        monthlySalaries: [],
        employersIds: [],
        totalSalary: 0,
        totalTax: 0,
        incomeTaxRate: 1,
        loadingFinished: false,
        errorMessage: ""
    }
    async componentDidMount() {
        this.setEmployerIds();
        this.setMonthlySalaryAmounts();
        this.setTotalSalary();
        this.setTotalTax();
        setTimeout(() => {
            this.setState({ loadingFinished: true });
        }, 1000);
    }

    setEmployerIds = async () => {
        let month = 1;
        let allResults = [];
        try {
            for (month = 1; month <= 12; month++) {
                let result = await getEmployerIdsForEmployeeAndMonth(this.props.taxChainContract, this.props.userAddress,
                    month, this.props.userAddress);
                allResults.push(result);
            }
            this.setState({ employersIds: allResults });
        } catch (err) {
            console.log(err);
            this.setState({ errorMessage: getFailedMessage(err) });
        }
    }

    setMonthlySalaryAmounts = async () => {
        let month = 1;
        let allResults = [];
        try {
            for (month = 1; month <= 12; month++) {
                let result = await getSalaryAmountsForEmployeeAndMonth(this.props.taxChainContract, this.props.userAddress,
                    month, this.props.userAddress);
                allResults.push(result);
            }
            this.setState({ monthlySalaries: allResults });
        } catch (err) {
            console.log(err);
            this.setState({ errorMessage: getFailedMessage(err) });
        }
    }

    getTableHeader = () => {
        return (
            <Table.Header>
                <Table.Row>
                    <Table.HeaderCell>Month</Table.HeaderCell>
                    <Table.HeaderCell>Employer</Table.HeaderCell>
                    <Table.HeaderCell>Salary Amount</Table.HeaderCell>
                </Table.Row>
            </Table.Header>
        );
    }

    getTableRow = (month, employerId, salary) => {
        let monthNames = ["January", "February", "March", "April",
            "May", "June", "July", "August", "September",
            "October", "November", "December"];
        return (
            <Table.Row>
                <Table.Cell>{monthNames[month]}</Table.Cell>
                <Table.Cell>{employerId}</Table.Cell>
                <Table.Cell>{salary}</Table.Cell>
            </Table.Row>
        );
    }
    getTableBody = () => {
        let bodies = [];
        let monthlySalaries = this.state.monthlySalaries;
        let employerIds = this.state.employersIds;
        let employerId, salary;
        for (let month = 0; month < 12; month++) {
            if (monthlySalaries[month] === undefined || monthlySalaries[month].length == 0)
                continue;
            for (let emplr = 0; emplr < monthlySalaries[month].length; emplr++) {
                if(employerIds.length == 0 || employerIds[month] === undefined || employerIds[month].length == 0)
                    employerId = "Not loaded yet";
                else
                    employerId = this.state.employersIds[month][emplr];
                salary = monthlySalaries[month][emplr];
                bodies.push(this.getTableRow(month, employerId, salary));
            }
        }
        return bodies;
    }

    getTableFooter = () => {
        return (
            <Table.Footer>
                <Table.Row>
                    <Table.HeaderCell />
                    <Table.HeaderCell />
                    <Table.HeaderCell><b>Total: {this.state.totalSalary}$ </b></Table.HeaderCell>
                </Table.Row>
            </Table.Footer>
        );
    }

    setTotalSalary = async () => {
        let income = await getEmployeeTotalIncome(this.props.taxChainContract, this.props.userAddress, this.props.userAddress);
        this.setState({ totalSalary: income });
    }

    setTotalTax = async () => {
        let taxRate = await getTaxRate(this.props.taxChainContract);

        this.setState({
            totalTax: this.state.totalSalary / taxRate,
            incomeTaxRate: taxRate,
        });
    }

    render() {
        let header = "", body = "", footer = "";
        try {
            header = this.getTableHeader();
            body = this.getTableBody();
            footer = this.getTableFooter();
        } catch (err) {
            console.log(err);
            this.setState({ errorMessage: getFailedMessage(err) });
        }
        return (
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
                <Dimmer active={!this.state.loadingFinished} inverted>
                    <Loader inverted active={!this.state.loadingFinished}>Loading</Loader>
                </Dimmer>

                <Image hidden={this.state.loadingFinished} src='https://react.semantic-ui.com/images/wireframe/paragraph.png' />

                <Table compact selectable>
                    {header}
                    <Table.Body>
                        {body}
                    </Table.Body>
                    {footer}
                </Table>

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
export default connect(mapStateToProps)(Employee);