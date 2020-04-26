import React, {Component} from "react";
import {connect} from "react-redux";


class Employee extends Component {
    state = {
    }
    componentDidMount(){
        
    }
    render() {
        return (
            <div>
                In Employee home page
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        taxChainContract: state.taxChainContract,
        userAddress: state.userAddress,
    }
}
export default connect(mapStateToProps)(Employee);