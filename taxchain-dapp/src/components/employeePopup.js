import React, {Component} from 'react'
import { Image } from 'semantic-ui-react'

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
              <b>  Salary received: </b>${this.props.employeeInfo.annualTax}<br/>
              <b>  Tax Amount: </b>${Math.round(this.props.employeeInfo.currentMonthlyTax*this.state.date.getMonth()*10)/10}<br/>
              <b>  Tax Rate: </b>{this.props.employeeInfo.employeeTaxRate}%<br/>
            </div>
          </row>
        );
    }
}

export default EmployeePopup;
