pragma solidity >=0.5.0 <0.6.0;
import "./Employee.sol";

contract TaxChain is Employee{
    address[] private employeeIdList;
    address[] private employerIdList;
    
    mapping(address=>bool) private addressToEmployeeExists;
    mapping(address=>bool) private addressToEmployerExists;
    
    modifier employeeExists(address _employeeId) {
        require(addressToEmployeeExists[_employeeId] == true, "Employee does not exist");
        _;
    }
    
    modifier employerExists(address _employerId) {
        require(addressToEmployerExists[_employerId] == true, "Employer does not exist");
        _;
    }

    event EmployeeRegistered(address employeeId);
    event EmployerRegistered(address employerId);
    
    constructor() public {
    }

    function registerEmployee(address _newEmployeeId) public {
        require(addressToEmployeeExists[_newEmployeeId] == false, "Employee already exists");
        require(_newEmployeeId == msg.sender, "Employee himself did not send the message");
        
        employeeIdList.push(_newEmployeeId);
        addressToEmployeeExists[_newEmployeeId] = true;
        
        emit EmployeeRegistered(_newEmployeeId);
    }

    function registerEmployer(address _newEmployerId) public {
        require(addressToEmployerExists[_newEmployerId] == false, "Employer already exists");
        require(_newEmployerId == msg.sender, "Employer himself did not send the message");
        
        employerIdList.push(_newEmployerId);
        addressToEmployerExists[_newEmployerId] = true;
        
        emit EmployerRegistered(_newEmployerId);
    }

    function employeeAcceptEmployer(address _employeeId, address _employerId) public employeeExists(_employeeId) employerExists(_employerId) {
        require(_employeeId == msg.sender, "Employee himself did not send the message");
        acceptCompany(_employeeId, _employerId);
    }

    function getEmployeeTotalIncome(address _employeeId) public view employeeExists(_employeeId) returns (uint) {
        return getTotalIncome(_employeeId);
    }

    function addEmployeeSalary(address _employeeId, address _employerId, uint8 _month, uint _salaryAmount) public 
            employerExists(msg.sender) employeeExists(_employeeId) {
        addSalary(_employeeId, _month, _employerId, _salaryAmount);
    }
}