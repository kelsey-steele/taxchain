import React, {Component} from 'react'
import { Card, Icon, Image } from 'semantic-ui-react'

//Card for employee that have address and salary display with image avatar

class EmployeeCard extends Component {
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
                        <b>Salary : </b>{this.props.salary}
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

