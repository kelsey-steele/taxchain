import React, { Component } from "react";
import { connect } from "react-redux";
import { Button, Header, Icon, Form, Message, Segment } from "semantic-ui-react";
import { addEmployeeSalary } from "../common/contractMethods";


const monthSelection = [
    { key: 'January', text: 'January', value: 1 },
    { key: 'February', text: 'February', value: 2 },
    { key: 'March', text: 'March', value: 3 },
    { key: 'April', text: 'April', value: 4 },
    { key: 'May', text: 'May', value: 5 },
    { key: 'June', text: 'June', value: 6 },
    { key: 'July', text: 'July', value: 7 },
    { key: 'August', text: 'August', value: 8 },
    { key: 'September', text: 'September', value: 9 },
    { key: 'October', text: 'October', value: 10 },
    { key: 'November', text: 'November', value: 11 },
    { key: 'December', text: 'December', value: 12 },
]


function mapStateToProps(state) {
    return {
        taxChainContract: state.taxChainContract,
        userAddress: state.userAddress,
    }
}

class Employer extends Component {
    state = {
        employeeAddress: "",
        salaryAmount: "",
        salaryMonth: "",
        salaryYear: "",
        message: "",
        errorMessage: "",
        loading: false,
        bottomMsgHidden: true
    };

    reInintForm = () => {
        setTimeout(() => {
            this.setState({
                employeeAddress: "",
                salaryAmount: "",
                salaryMonth: "",
                salaryYear: "",
                message: "",
                errorMessage: "",
                loading: false,
                bottomMsgHidden: true
            });
        }, 8000);
    }

    getYearOptions = () => {
        let options = [];
        for (let y = 2020; y <= 2120; y++) {
            options.push({
                key: y,
                text: y,
                value: y
            });
        }
        return options;
    }


    onSubmit = async event => {
        // event.preventDefault();
        this.setState({ loading: true, errorMessage: "" });

        try {
            await addEmployeeSalary(this.props.taxChainContract, this.state.employeeAddress, this.props.userAddress, this.state.salaryYear, this.state.salaryMonth, this.state.salaryAmount, this.props.userAddress);
            this.setState({ loading: false, bottomMsgHidden: false, message: "Employee received the salary" });
        }
        catch (err) {
            this.setState({ loading: false, errorMessage: err.message});
        }
        this.reInintForm();
    };


    handleMonthDropDown = (event, { value }) => {
        this.setState({ salaryMonth: value });
    };

    handleYearDropDown = (event, { value }) => {
        this.setState({ salaryYear: value });
    }

    render() {
        let yearOptions = this.getYearOptions();
        return (
            <div>
                <Segment>
                    <Header icon="dollar" content=" Pay salary to employee" />
                    <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
                        <Form.Field>
                            <label>Employee Address</label>
                            <input placeholder="0xDa9F682EBB68C8aB847131D773CAA3D48B94Cc96" value={this.state.employeeAddress} required onChange={event => this.setState({ employeeAddress: event.target.value })} />
                            <Form.Group inline>
                                <label>Select month and year</label>
                                <Form.Select fluid required options={monthSelection} value={this.state.salaryMonth} placeholder='Month' onChange={this.handleMonthDropDown} />
                                <label>/</label>
                                <Form.Select fluid required options={yearOptions} value={this.state.salaryYear} placeholder='Year' onChange={this.handleYearDropDown} />
                            </Form.Group>

                            <label>Salary Amount</label>
                            <input placeholder="Salary Amount" type='number' value={this.state.salaryAmount} onChange={event => this.setState({ salaryAmount: event.target.value })} />

                        </Form.Field>

                        <Message error header="Oops!" content={this.state.errorMessage} />
                        

                        <Form.Button icon labelPosition='right' loading={this.state.loading}>
                            Make Payment
                            <Icon fitted size="large" name='dollar' />
                        </Form.Button>
                    </Form>
                </Segment>
                
                <Message success hidden={this.state.bottomMsgHidden}
                    icon='check'
                    header={this.state.message}
                    content=''
                    size="small"
                />
            </div>
        );
    }
}
export default connect(mapStateToProps)(Employer);
