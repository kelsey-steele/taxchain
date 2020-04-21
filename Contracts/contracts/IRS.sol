pragma solidity >=0.5.0 <0.6.0;

contract IRS {
    address[] private irsIds;
    mapping(address=>bool) private addressToIrsExists;
    uint private TAX_RATE = 10;

    modifier messageFromIRS(address _msgFrom) {
        require(isAddressFromIrs(_msgFrom) == true, "Msg is not from valid IRS user.");
        _;
    }

    event TaxRateChanged(uint newRate);

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

    function addNewIrsId(address _newIrsId) internal messageFromIRS(msg.sender) {
        _addNewIrsId(_newIrsId);
    }

    function getIRSTaxRate() internal view returns (uint) {
        return TAX_RATE;
    }

    function changeIRSTaxRate(uint _newRate) internal messageFromIRS(msg.sender) {
        require(_newRate >= 0 && _newRate <= 100, "Invalid tax rate submitted");
        TAX_RATE = _newRate;
        emit TaxRateChanged(_newRate);
    }
}