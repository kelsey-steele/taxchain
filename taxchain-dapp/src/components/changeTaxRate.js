import React, {Component} from 'react'
import {changeIRSTaxRate} from "../common/contractMethods";
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
      await changeIRSTaxRate(this.props.taxChainContract, this.props.userAddress, this.state.value);
      this.setState({
        loading: false,
        message: "New Tax Rate has been set for all employees."
      });
    } catch (err) {
      this.setState({
        loading: false,
        errorMessage: err.message,
        message: "Problem encountered. Unable to change the Tax Rate."
      });
    }
  };

  render() {
    return (
      <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
          <Form.Field>
            <label>Set New Tax Rate</label>
            <input
              placeholder="Tax Percentage (0 - 100%)"
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
            Change Tax Rate
          </Button>
          <h2>{this.state.message}</h2>
        </Form>
    );
  }
}
export default changeTaxRate
