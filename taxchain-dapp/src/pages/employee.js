import React, { Component } from "react";
import { connect } from "react-redux";
import { getSalaryAmountsForEmployeeAndMonthAndYear, getEmployeeTotalIncomeAYear, getTaxRate, getEmployerIdsForEmployeeAndMonthAndYear, employeeAcceptEmployer } from "../common/contractMethods";
import { Table, Dropdown, Segment, Dimmer, Loader, Image, Icon, Statistic, Tab, Form, Message, Button, Modal, Header } from "semantic-ui-react";
import { getFailedMessage } from "../common/commonMethods";


class Employee extends Component {
    state = {
        monthlySalaries: [],
        employersIds: [],
        totalSalary: 0,
        totalTax: 0,
        incomeTaxRate: 0,
        loadingFinished: false,
        errorMessage: "",

        panes: [],
        acceptEmployerMessage: "",
        showAcceptEmployerMessage: false,
        doAcceptButtonLoading: false,
        submittedEmployerAddressToAccept: "",
        errorHappendedToAcceptEmployer: false,

        newSalaryModalOpen: false,
        newSalaryAmount: 0,
        newSalaryMonth: 1,
        newSalaryYear: 1,
        newSalaryEmployerId: "",

        salaryYear: 2020,
        salaryYearSet: false
    }

    async componentDidMount() {
        this.setState({
            loadingFinished: true
        });
    }

    downloadData = async() => {
        this.setState({
            loadingFinished: false
        });
        await this.setEmployerIds();
        await this.setTotalSalary();
        await this.setMonthlySalaryAmounts();
        await this.setTotalTax();
        this.listenSalaryAddedEvent();
        setTimeout(() => {
            this.setState({ loadingFinished: true });
        }, 300);
    }

    setEmployerIds = async () => {
        if(this.state.salaryYearSet === false)
            return;
        let month = 1;
        let allResults = [];
        try {
            for (month = 1; month <= 12; month++) {
                let result = await getEmployerIdsForEmployeeAndMonthAndYear(this.props.taxChainContract, this.props.userAddress,
                    month, this.state.salaryYear, this.props.userAddress);
                allResults.push(result);
            }
            this.setState({ employersIds: allResults });
        } catch (err) {
            console.log(err);
            this.setState({ errorMessage: getFailedMessage(err) });
        }
    }

    setMonthlySalaryAmounts = async () => {
        if(this.state.salaryYearSet === false)
            return;
        let month = 1;
        let allResults = [];
        try {
            for (month = 1; month <= 12; month++) {
                let result = await getSalaryAmountsForEmployeeAndMonthAndYear(this.props.taxChainContract, this.props.userAddress,
                    month, this.state.salaryYear, this.props.userAddress);
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
                    <Table.HeaderCell textAlign='right'>Salary Amount</Table.HeaderCell>
                </Table.Row>
            </Table.Header>
        );
    }

    getMonthNameFromNumber = (monthNum) => {
        let monthNames = ["January", "February", "March", "April",
            "May", "June", "July", "August", "September",
            "October", "November", "December"];
        return monthNames[monthNum];
    }

    getTableRow = (month, employerId, salary) => {
        return (
            <Table.Row>
                <Table.Cell>{this.getMonthNameFromNumber(month)}</Table.Cell>
                <Table.Cell>{employerId}</Table.Cell>
                <Table.Cell textAlign='right'>{salary}</Table.Cell>
            </Table.Row>
        );
    }
    getTableBody = () => {
        if(this.state.salaryYearSet === false)
            return;

        let bodies = [];
        let monthlySalaries = this.state.monthlySalaries;
        let employerIds = this.state.employersIds;
        let employerId, salary;
        for (let month = 0; month < 12; month++) {
            if (monthlySalaries[month] === undefined || monthlySalaries[month].length === 0)
                continue;
            for (let emplr = 0; emplr < monthlySalaries[month].length; emplr++) {
                if (employerIds.length === 0 || employerIds[month] === undefined || employerIds[month].length === 0)
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
                    <Table.HeaderCell textAlign='right'><b>Total: ${this.state.totalSalary} </b></Table.HeaderCell>
                </Table.Row>
            </Table.Footer>
        );
    }

    setTotalSalary = async () => {
        if(this.state.salaryYearSet === false)
            return;
        let income = await getEmployeeTotalIncomeAYear(this.props.taxChainContract, this.props.userAddress, this.state.salaryYear, this.props.userAddress);
        this.setState({ totalSalary: income });
    }

    setTotalTax = async () => {
        if(this.state.salaryYearSet === false)
            return;
        let taxRate = await getTaxRate(this.props.taxChainContract);

        this.setState({
            totalTax: this.state.totalSalary * taxRate / 100.0,
            incomeTaxRate: taxRate,
        });
    }

    getYearOptions = () => {
        let yearOptions = [];
        for (let y = 2020; y <= 2120; y++) {
            yearOptions.push({
                key: y,
                text: y,
                value: y
            });
        }
        return yearOptions;
    }

    changeYear = async(event, {value}) => {
        await this.setState({
            salaryYear: value,
            salaryYearSet: true
        });
        await this.downloadData();
    }

    getSalaryPan = () => {
        let header = "", body = "", footer = "";
        try {
            header = this.getTableHeader();
            body = this.getTableBody();
            footer = this.getTableFooter();
        } catch (err) {
            console.log(err);
            this.setState({ errorMessage: getFailedMessage(err) });
        }
        let yearOptions = this.getYearOptions();
        let paneContent = (
            <div>
                <Segment hidden={this.state.errorMessage === ""}>
                    {this.state.errorMessage}
                </Segment>
                <Segment>
                    <span>Select Year</span>
                    <Dropdown
                        placeholder='Select Year'
                        fluid
                        selection
                        options={yearOptions}
                        onChange={this.changeYear}
                    />
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
        let paneName = 'Tax Information';

        return {
            menuItem: paneName,
            render: () => <Tab.Pane>{paneContent}</Tab.Pane>
        }
    }

    handleAcceptEmployerAddressValue = (e, { name, value }) => {
        this.setState({ submittedEmployerAddressToAccept: value });
    }

    handleAcceptEmployerSubmit = async () => {
        this.setState({ doAcceptButtonLoading: true });
        try {
            const result = await employeeAcceptEmployer(this.props.taxChainContract, this.props.userAddress,
                this.state.submittedEmployerAddressToAccept, this.props.userAddress);
            this.setState({
                acceptEmployerMessage: "Employer successfully accepted",
                errorHappendedToAcceptEmployer: false,
                doAcceptButtonLoading: false
            });
        } catch (err) {
            console.log(err);
            this.setState({
                acceptEmployerMessage: err.message,
                errorHappendedToAcceptEmployer: true,
                doAcceptButtonLoading: false
            });
        }
        this.setState({
            showAcceptEmployerMessage: true,
            submittedEmployerAddressToAccept: ""
        })

        setTimeout(() => {
            this.setState({ showAcceptEmployerMessage: false })
        }, 10000);
    }

    getEmployerAcceptPan = () => {
        let employerPaneContent = (
            <Segment>
                <Message
                    hidden={!this.state.showAcceptEmployerMessage}
                    negative={!this.state.errorHappendedToAcceptEmployer}
                    success={this.state.errorHappendedToAcceptEmployer}
                    icon={this.state.errorHappendedToAcceptEmployer ? 'times' : 'check'}
                    header={this.state.errorHappendedToAcceptEmployer ? 'Error!!' : 'Success!!'}
                    content={this.state.acceptEmployerMessage}
                    size="small"
                />
                <Form onSubmit={this.handleAcceptEmployerSubmit}>
                    <Form.Input required
                        label='Enter the Employer ID to accpet salary'
                        placeholder='0xFb3a0F9e5C1B684cc54d7EF2a052231E8e54Bf19'
                        value={this.state.submittedEmployerAddressToAccept}
                        onChange={this.handleAcceptEmployerAddressValue}
                    />
                    <Form.Button animated loading={this.state.doAcceptButtonLoading}>
                        <Button.Content visible>Accept</Button.Content>
                        <Button.Content hidden>
                            <Icon fitted size="large" name='user plus' />
                        </Button.Content>
                    </Form.Button>
                </Form>
            </Segment>
        );
        let paneName = "Accept Employer";
        return {
            menuItem: paneName,
            render: () => <Tab.Pane>{employerPaneContent}</Tab.Pane>
        }
    }

    listenSalaryAddedEvent = () => {
        let event = this.props.salaryAddedEvent({
            employeeId: this.props.userAddress,
            year: this.state.salaryYear
        }, (err, result) => {
            // console.log("found event", result)
            if (err) {
                console.log("Error happened while litening to event", err);
                return;
            }
            let amount = result.returnValues.amount;
            let employerId = result.returnValues.employerId;
            let employeeId = result.returnValues.employeeId;
            let month = result.returnValues.month;
            let year = result.returnValues.year;
            // console.log("got new salary", amount, employeeId, month, result);
            // console.log("user address", this.props.userAddress, "sal year", this.state.salaryYear)
            if (employeeId != this.props.userAddress || year != this.state.salaryYear)
                return;
            // console.log("got here")
            this.addNewSalaryAfterEvent(amount, employerId, month, year);
        });
    }

    addNewSalaryAfterEvent = (amount, employerId, month, year) => {
        let monthlySalariesVar = this.state.monthlySalaries;
        monthlySalariesVar[month - 1].push(amount);
        let employersIdsVar = this.state.employersIds;
        employersIdsVar[month - 1].push(employerId);
        this.setState({
            monthlySalaries: monthlySalariesVar,
            employersIds: employersIdsVar,
            newSalaryAmount: amount,
            newSalaryEmployerId: employerId,
            newSalaryMonth: month - 1,
            newSalaryYear: year,
            newSalaryModalOpen: true
        });
    }

    closeSalaryReceivedModal = () => {
        this.setState({ newSalaryModalOpen: false });
    }

    getSalaryRecievedPopUp = () => {
        return (
            <Modal
                open={this.state.newSalaryModalOpen}
                onClose={this.closeSalaryReceivedModal}
                basic size='small'>
                <Header icon='money bill alternate outline' content='Paycheck received' />
                <Modal.Content>
                    <p>
                        You received a paycheck of amount ${this.state.newSalaryAmount} from {' '}
                        {this.state.newSalaryEmployerId} for the month of {' '}
                        {this.getMonthNameFromNumber(this.state.newSalaryMonth)}, {' '}
                        {this.state.newSalaryYear}.
                    </p>
                </Modal.Content>
                <Modal.Actions>
                    <Button color='green' onClick={this.closeSalaryReceivedModal}>
                        <Icon name='checkmark' /> Yay!!
                    </Button>
                </Modal.Actions>
            </Modal>
        );
    }

    render() {
        let allPanes = [
            this.getSalaryPan(),
            this.getEmployerAcceptPan()
        ];
        return (
            <div>
                {this.getSalaryRecievedPopUp()}
                <Tab panes={allPanes} renderActiveOnly={true} />
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        taxChainContract: state.taxChainContract,
        userAddress: state.userAddress,
        salaryAddedEvent: state.taxChainContract.events.SalaryAdded,
    }
}
export default connect(mapStateToProps)(Employee);
