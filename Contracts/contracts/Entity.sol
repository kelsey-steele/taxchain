pragma solidity >=0.5.0 <0.6.0;
import "./Common.sol";

contract Entity is Common{
    address id;
    bool entityExists = false;

    modifier fromEntity() {
        require(id == msg.sender, "Msg is not from entity");
        _;
    }
    
    constructor(address _id) public {
        id = _id;
        entityExists = true;
    }

    function doesEntityExists() public view returns (bool) {
        return entityExists;
    }
}