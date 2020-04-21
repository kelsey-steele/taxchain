pragma solidity >=0.5.0 <0.6.0;

contract IRS {
    address[] irsIds;
    mapping(address=>bool) addressToIrsExists;

    modifier messageFromIRS(address _msgFrom) {
        require(isAddressFromIrs(_msgFrom) == true, "Msg is not from valid IRS user.");
        _;
    }

    constructor() public {
        _addNewIrsId(0xA3dCb6c670a83Eb68C65Ecb8D6Dd6dfADBF429bE); //Joy address
    }
    
    function _addNewIrsId(address _newIrsId) private {
        require(addressToIrsExists[_newIrsId] == false, "IRS id already exists");
        irsIds.push(_newIrsId);
        addressToIrsExists[_newIrsId] = true;
    }

    function isAddressFromIrs(address _address) public view returns (bool) {
        return addressToIrsExists[_address] == true;
    }

    function addNewIrsId(address _newIrsId) public messageFromIRS(msg.sender) {
        _addNewIrsId(_newIrsId);
    }
}