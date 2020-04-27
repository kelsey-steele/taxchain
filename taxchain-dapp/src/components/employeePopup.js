import React, {Component} from 'react'
import { Card, Icon, Image } from 'semantic-ui-react'
import Popup from "reactjs-popup";

class EmployeePopup extends Component {
    state = {
      date : new Date(),
    }

    render() {
        return (
          <Image src='https://react.semantic-ui.com/images/avatar/large/elliot.jpg' wrapped ui={false} />
        
        );
    }
}

export default EmployeePopup;
