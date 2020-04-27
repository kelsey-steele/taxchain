import React, {Component} from 'react'
import { Card, Icon, Image } from 'semantic-ui-react'

//Card for employee that have address and salary display with image avatar

class EmployeeCard extends Component {
    state = {
      date : new Date(),
    }

    render() {
        return (
            <Card style={{fontSize: 11,}}>
                <Image src='https://react.semantic-ui.com/images/avatar/large/elliot.jpg' wrapped ui={false} />
                <Card.Content>
                    <Card.Header>Address</Card.Header>
                    <Card.Meta>
                        <span className='date'>{this.props.addr}</span>
                    </Card.Meta>
                    <Card.Description>
                        <div><b>Salary : </b>{this.props.salary}</div>
                        <div><b>Annual Tax Amount : </b>{Math.round(this.props.salary*this.props.taxRate*10)/10}</div>
                        <div><b>Current Tax Amount : </b>{Math.round(this.props.salary*this.props.taxRate/12*this.state.date.getMonth()*10)/10}</div>
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
