import React, {Component} from "react";
import {Form, Radio, Button, Icon, Grid, Message, Tab, Statistic, Dropdown, Segment, Table, Image, Dimmer, Loader} from 'semantic-ui-react';
import {registerNewUser, getTaxRate, getAllEmployeeTotalIncomeList, getAllEmployee} from "../common/contractMethods";
import {connect} from "react-redux";

class Register extends Component {
    state = {
        selectedType : "employee",
        registerMessageVisible : true,
        errorMessage: "",
        doButtonLoading: false,
        allSalaries: [],
        allEmployeeIds: [],
        employeeTaxTableBody : "",
        allSalaryLoadingFinished: true,
        taxRate : 0,
        totalTax : 0,
        salaryYear : 2020
    }

    async componentDidMount() {
        // let salary = await getAllEmployeeTotalIncomeList(this.props.taxChainContract, 2020,  this.props.userAddress);
        // let taxRate = await getTaxRate(this.props.taxChainContract);
        // let allSalary = salary.map(Number);
        // let totalCollectedTax = (allSalary.reduce((a,b) => a+b, 0))  * (taxRate/100);
        // this.setState({
        //     salaries:salary,
        //     taxRate:taxRate
        // });
    }

    handleRadioChange = (e, { value }) => this.setState({ selectedType:value })
    handleRegisterMessageDismiss = () => {
        this.setState({ registerMessageVisible: false });
    }
    getSuccessfulRegistrationMessage = () => {
        return (
        <Message success
            icon='check'
            header="You have been successfully registered"
            content=''
            size="small"
        />);
    }

    getFailedRegistrationMessage = (err) => {
        return (
            <Message negative
                    icon='times'
                    header='Sorry. Some error happened'
                    content={err.message}
                    size="small"
            />
        );
    }

    handleSubmit = async () => {
        try {
            this.setState({doButtonLoading: true});
            await registerNewUser(this.props.taxChainContract, this.props.userAddress, this.state.selectedType, this.props.userAddress);
            this.setState({
                errorMessage: this.getSuccessfulRegistrationMessage(),
                doButtonLoading: false
            })
            setTimeout(() => {
                window.location.reload();
            }, 1500);
        } catch(err) {
            console.log(err);
            this.setState({
                errorMessage: this.getFailedRegistrationMessage(err),
                doButtonLoading: false
            });
        }
    }

    getRegistrationPane = () => {
        let registerMessage = "";
        if(this.state.registerMessageVisible)
        {
            registerMessage =
                <Message warning
                         icon='exclamation triangle'
                         header='You are not registered in our system'
                         content='Please register to continue'
                         color="teal"
                         size="small"
                         onDismiss={this.handleRegisterMessageDismiss}
                />
        }
        let registrationPaneContent = (
            <Grid centered columns={1}>
                <Grid.Row>
                    {registerMessage}
                </Grid.Row>
                <Grid.Row>
                    {this.state.errorMessage}
                </Grid.Row>
                <Grid.Row>
                    <Form onSubmit={this.handleSubmit}>
                        <Form.Field>
                            I am an:
                        </Form.Field>
                        <Form.Field>
                            <Radio
                                label='Employee'
                                name='employee'
                                value='employee'
                                checked={this.state.selectedType === 'employee'}
                                onChange={this.handleRadioChange}
                            />
                        </Form.Field>
                        <Form.Field>
                            <Radio
                                label='Employer'
                                name='employer'
                                value='employer'
                                checked={this.state.selectedType === 'employer'}
                                onChange={this.handleRadioChange}
                            />
                        </Form.Field>
                        <Form.Button animated loading={this.state.doButtonLoading}>
                            <Button.Content visible>Register</Button.Content>
                            <Button.Content hidden>
                                <Icon fitted size="large" name='user plus' />
                            </Button.Content>
                        </Form.Button>
                    </Form>
                </Grid.Row>
            </Grid>
        );
        let paneName = "Registration";
        return {
            menuItem: paneName,
            render: () => <Tab.Pane>{registrationPaneContent}</Tab.Pane>
        }
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

    getAllEmployeeTaxHeader = () => {
        return (
            <Table.Header>
                <Table.Row>
                    <Table.HeaderCell>Employee Id</Table.HeaderCell>
                    <Table.HeaderCell textAlign='right'>Salary Amount</Table.HeaderCell>
                    <Table.HeaderCell textAlign='right'>Income Tax Amount</Table.HeaderCell>
                </Table.Row>
            </Table.Header>
        );
    }
    getAllEmployeeTaxBody = () => {
        let rows = []
        for(let index = 0;index<this.state.allSalaries.length;index++)
            rows.push(this.getOneEmployeeTaxBody(index))
        return rows
    }
    getOneEmployeeTaxBody = (index) => {
        return (
            <Table.Row>
                <Table.Cell>{this.state.allEmployeeIds[index]}</Table.Cell>
                <Table.Cell textAlign='right'>${this.state.allSalaries[index]}</Table.Cell>
                <Table.Cell textAlign='right'>${this.calculateTax(this.state.allSalaries[index])}</Table.Cell>
            </Table.Row>
        );
    }

    calculateTax = (salary) => {
        return salary * this.state.taxRate/100.0;
    }

    changeYear = async (event, {value}) => {
        this.setState({allSalaryLoadingFinished: false});
        let salary = await getAllEmployeeTotalIncomeList(this.props.taxChainContract, value,  this.props.userAddress);
        let taxRate_ = await getTaxRate(this.props.taxChainContract);
        let allSalary = salary.map(Number);
        let totalCollectedTax = (allSalary.reduce((a,b) => a+b, 0))  * (taxRate_/100.0);
        let employeeIds = await getAllEmployee(this.props.taxChainContract, this.props.userAddress)
        await this.setState({
            totalTax:totalCollectedTax,
            allSalaries: allSalary,
            allEmployeeIds: employeeIds,
            taxRate: taxRate_
        });
        this.setState({
            employeeTaxTableBody: this.getAllEmployeeTaxBody(),
        })
        setTimeout(()=>{
            this.setState({allSalaryLoadingFinished: true});   
        }, 500);
    }



    getTotalTaxPane = () => {
        let yearOptions = this.getYearOptions();
        let header = this.getAllEmployeeTaxHeader()
        let body = this.state.employeeTaxTableBody;
        
       let totalTaxPaneContent = (
           <div>
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
                <Statistic.Group widths='two'>
                    <Statistic>
                        <Statistic.Value>
                            <Icon name="dollar" />{this.state.totalTax}
                        </Statistic.Value>
                        <Statistic.Label>Total Collection</Statistic.Label>
                    </Statistic>
                    <Statistic>
                        <Statistic.Value>
                            <Icon name="users" /> {this.state.allSalaries.length}
                        </Statistic.Value>
                        <Statistic.Label>Number of employees</Statistic.Label>
                    </Statistic>
                </Statistic.Group>
                <Table compact selectable>
                    {header}
                    <Table.Body>
                        {body}
                    </Table.Body>
                </Table>
                <Dimmer active={!this.state.allSalaryLoadingFinished} inverted>
                    <Loader inverted active={!this.state.allSalaryLoadingFinished}>Loading</Loader>
                </Dimmer>

                <Image hidden={this.state.allSalaryLoadingFinished} src='https://react.semantic-ui.com/images/wireframe/paragraph.png' />
           </Segment>
           </div>
       );
        let paneName = "Total tax collection";
        return {
            menuItem: paneName,
            render: () => <Tab.Pane>{totalTaxPaneContent}</Tab.Pane>
        }
    }

    render() {
        let allPanes = [
            this.getRegistrationPane(),
            this.getTotalTaxPane()
        ];
        return (
            <div>
                <Tab panes={allPanes} renderActiveOnly={true} />
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        taxChainContract: state.taxChainContract,
        userAddress: state.userAddress,
        userType: state.userType,
    }
}
export default connect(mapStateToProps)(Register);