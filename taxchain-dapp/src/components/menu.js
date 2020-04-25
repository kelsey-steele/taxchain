import React, {Component} from "react";
import {
    Container,
    Divider,
    Dropdown,
    Grid,
    Header,
    Image,
    List,
    Menu,
    Segment,
  } from 'semantic-ui-react';

class MenuBar extends Component {
    render() {
        return (
            <div>
                <Menu fixed='top' >
                    <Container cen>
                        <Menu.Item as='a' header>
                        <Image src='TaxChain-Logo-without-text.png' style={{ width:'40px', marginRight: '1.5em' }} />
                        TaxChain
                        </Menu.Item>
                        {/* <Menu.Item as='a'>Home</Menu.Item>

                        <Dropdown item simple text='Dropdown'>
                        <Dropdown.Menu>
                            <Dropdown.Item>List Item</Dropdown.Item>
                            <Dropdown.Item>List Item</Dropdown.Item>
                            <Dropdown.Divider />
                            <Dropdown.Header>Header Item</Dropdown.Header>
                            <Dropdown.Item>
                            <i className='dropdown icon' />
                            <span className='text'>Submenu</span>
                            <Dropdown.Menu>
                                <Dropdown.Item>List Item</Dropdown.Item>
                                <Dropdown.Item>List Item</Dropdown.Item>
                            </Dropdown.Menu>
                            </Dropdown.Item>
                            <Dropdown.Item>List Item</Dropdown.Item>
                        </Dropdown.Menu>
                        </Dropdown> */}
                    </Container>
                </Menu>

                
            </div>
        );
    }
}
export default MenuBar;