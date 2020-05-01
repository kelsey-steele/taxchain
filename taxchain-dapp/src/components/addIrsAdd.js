import React, {Component} from 'react'
import {registerIrsAccount} from "../common/contractMethods";
import { Button, Icon, Form, Message } from "semantic-ui-react";


class changeTaxRate extends Component {

  state = {
    value: "",
    message: "",
    errorMessage: "",
    loading: false,
  };

  onSubmit = async event => {
    event.preventDefault();
    this.setState({
      loading: true,
      errorMessage: "",
      message: "waiting for blockchain transaction to complete..."
    });
    try {
      await registerIrsAccount(this.props.taxChainContract, this.props.userAddress, this.state.value);
      this.setState({
        loading: false,
        message: "New IRS account added."
      });
    } catch (err) {
      this.setState({
        loading: false,
        errorMessage: err.message,
        message: "Problem encountered. Unable to add IRS account."
      });
    }
  };

  render() {
    return (
      <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
          <Form.Field>
            <label>Add new IRS account</label>
            <input
              placeholder="0xc11111FB0Bc6F0AB969E3881A610430780C11a1"
              onChange={event =>
                this.setState({
                  value: event.target.value
                })
              }
            />
          </Form.Field>

          <Message error header="Oops!" content={this.state.errorMessage} />
          <Button primary type="submit" loading={this.state.loading}>
            <Icon name="check" />
            Add IRS account
          </Button>
          <h2>{this.state.message}</h2>
        </Form>
    );
  }
}
export default changeTaxRate
