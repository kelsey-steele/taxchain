import React, {Component} from 'react'
import { Card, Icon, Image } from 'semantic-ui-react'
import Popup from "reactjs-popup";

class EmployeePopup extends Component {
    state = {
      date : new Date(),
    }

    render() {
        return (
          <row className='modal'>
            <div style={{display: 'flex',  justifyContent:'center', alignItems:'center'}}>
              <Image eight="250" width="250" src='https://react.semantic-ui.com/images/avatar/large/elliot.jpg' wrapped ui={false} />
            </div>
            <div>
              <br/>
              <b>  Address: </b>{this.props.employeeInfo.employeeAddr}<br/>
              <b>  Employer: </b>TODO<br/>
              <b>  Start Date: </b>TODO<br/>
              <b>  End Date: </b>-<br/>
              <b>  Salary: </b>${this.props.employeeInfo.employeeSalary}<br/>
              <b>  Annual Tax Amount: </b>${this.props.employeeInfo.annualTax}<br/>
              <b>  Current Tax Amount: </b>${Math.round(this.props.employeeInfo.currentMonthlyTax*this.state.date.getMonth()*10)/10}<br/>
              <b>  Tax Rate: </b>{this.props.employeeInfo.employeeTaxRate}%<br/>

            </div>
          </row>
        );
    }
}

export default EmployeePopup;
