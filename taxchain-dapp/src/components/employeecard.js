import React, {Component} from 'react'
import { Card, Icon, Image } from 'semantic-ui-react'
import Popup from "reactjs-popup";
import EmployeePopup from "../components/employeePopup";

//Card for employee that have address and salary display with image avatar

class EmployeeCard extends Component {
    state = {
      employeeAddr : this.props.addr,
      employeeSalary : this.props.salary,
      employeeTaxRate : this.props.taxRate,
      date : new Date(),
      annualTax : Math.round(this.props.salary*this.props.taxRate*10)/10,
      currentMonthlyTax : this.props.salary*this.props.taxRate/12,
    }

    render() {
        return (
            <Card style={{fontSize: 11,}}>
                <Image src='https://react.semantic-ui.com/images/avatar/large/elliot.jpg' wrapped ui={false} />
                <Card.Content>
                    <Card.Header>Address</Card.Header>
                    <Card.Meta>
                        <span className='date' class="limit">{this.state.employeeAddr}</span>
                    </Card.Meta>
                    <Card.Description>
                        <div><b>Salary : </b>{this.state.employeeSalary}</div>
                        <div><b>Annual Tax Amount : </b>{this.state.annualTax}</div>
                        <div><b>Current Tax Amount : </b>{Math.round(this.state.currentMonthlyTax*this.state.date.getMonth()*10)/10}</div>
                        <Popup trigger={<button> More Employee Info</button>} modal closeOnDocumentClick>
                          <EmployeePopup employeeInfo={this.state} />
                        </Popup>
                    </Card.Description>
                </Card.Content>
                {/*<Card.Content extra>*/}
                {/*    <a>*/}
                {/*        <Icon name='user' />*/}
                {/*        22 Friends*/}
                {/*    </a>*/}
                {/*</Card.Content>*/}
            </Card>
        );
    }
}

export default EmployeeCard
