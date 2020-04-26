import React, {Component} from 'react'
import { Card, Icon } from 'semantic-ui-react'

//Card for employee that have address and salary display with image avatar

class EmployeeCard extends Component {
    render() {
        return (
            <Card style={{fontSize: 11,}}
                image='https://react.semantic-ui.com/images/avatar/large/elliot.jpg'
                meta={this.props.addr}
                  description="salary will be displayed here"
            />
        );
    }
}

export default EmployeeCard


