pragma solidity >=0.5.0 <0.6.0;
import "./Employee.sol";
import "./Employer.sol";
import "./Common.sol";

contract TaxChain is Common{
    address[] private employeeList;
    address[] private employerList;
    
    mapping(address=>Employee) private addressToEmployee;
    mapping(address=>Employer) private addressToEmployer;

    modifier employeeExists(address _employeeId) {
        require(addressToEmployee[_employeeId].doesEntityExists(), "Employee does not exist");
        _;
    }
    
    modifier employerExists(address _employerId) {
        require(addressToEmployer[_employerId].doesEntityExists(), "Employer does not exist");
        _;
    }

    constructor() public {
    }

    function _addEmployee(address _newEmployeeId) private {
        require(addressToEmployee[_newEmployeeId].doesEntityExists() == false, "Employee already exists");
        employeeList.push(_newEmployeeId);
        Employee newEmployee = Employee(_newEmployeeId);
        addressToEmployee[_newEmployeeId] = newEmployee;
    }

    function _addEmployer(address _newEmployerId) private {
        require(addressToEmployer[_newEmployerId].doesEntityExists() == false, "Employer already exists");
        employerList.push(_newEmployerId);
        Employer newEmployer = Employer(_newEmployerId);
        addressToEmployer[_newEmployerId] = newEmployer;
    }

    function registerEmployee() public {
        _addEmployee(msg.sender);
        emit EntityRegistered(msg.sender, "Employee");
    }

    function registerEmployer() public {
        _addEmployer(msg.sender);
        emit EntityRegistered(msg.sender, "Employer");
    }

    function employeeAcceptEmployer(address _employerId) public employeeExists(msg.sender) employerExists(_employerId) {
        Employee employee = addressToEmployee[msg.sender];
        employee.acceptCompany(_employerId);
    }

    function getEmployeeTotalIncome(address _employeeId) public view employerExists(_employeeId) returns (uint) {
        Employee employee = addressToEmployee[_employeeId];
        return employee.getTotalIncome();
    }

    function addEmployeeSalary(address _employeeId, uint8 _month, uint _salaryAmount) public 
            employerExists(msg.sender) employeeExists(_employeeId) {
        //Employer employer = addressToEmployer[msg.sender];
        Employee employee = addressToEmployee[_employeeId];
        employee.addSalary(_month, msg.sender, _salaryAmount);
    }
}