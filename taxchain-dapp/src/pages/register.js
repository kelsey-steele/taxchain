import React, {Component} from "react";
import { Form, Radio, Button, Icon, Grid, Message } from 'semantic-ui-react';
import {registerNewUser} from "../common/contractMethods";
import {connect} from "react-redux";

class Register extends Component {
    state = {
        selectedType : "employee",
        registerMessageVisible : true,
        errorMessage: ""
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
            await registerNewUser(this.props.taxChainContract, this.props.userAddress, this.state.selectedType, this.props.userAddress);
            this.setState({
                errorMessage: this.getSuccessfulRegistrationMessage()
            })
            setTimeout(() => {
                window.location.reload();
            });
        } catch(err) {
            console.log(err);
            this.setState({
                errorMessage: this.getFailedRegistrationMessage(err)
            });
        }
    }

    render() {
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
        return (
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
                        <Form.Button animated>
                            <Button.Content visible>Register</Button.Content>
                            <Button.Content hidden>
                                <Icon fitted size="large" name='user plus' />
                            </Button.Content>
                        </Form.Button>
                    </Form>
                </Grid.Row>
            </Grid>
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