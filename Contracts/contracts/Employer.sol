pragma solidity >=0.5.0 <0.6.0;
import "./Entity.sol";

contract Employer is Entity{

    struct EmployeeSalary {
        address employeeId;
        uint8 month;
        uint salaryAmount;
    }

    constructor(address _employerId) Entity(_employerId) public {
    }

    // function addEmployeeSalary(address _employeeId, uint8 _month, uint _salaryAmount) public validMonth(_month){
    //     require(msg.sender == id, "Msg sender is not Employer");
         //TODO future complete
    // }
}