pragma solidity >=0.5.0 <0.6.0;

contract Common {
    event EntityRegistered(address _id, string entityType);
    
    modifier validMonth(uint _month) {
        require(_month >= 1 && _month <= 12, "Invalid month");
        _;
    }
}
