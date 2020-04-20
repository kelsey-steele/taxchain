pragma solidity >=0.5.0 <0.6.0;
// pragma experimental ABIEncoderV2;
import "./lib/safemath.sol";

contract Employee {
    using SafeMath for uint;

    struct EmployeeData {
        address employeeId;
        uint totalIncome;
    }

    event SalaryAdded(address employeeId, uint month, address employerId, uint amount);
    event EmployeeAcceptedEmployer(address employeeId, address employerId);

    mapping(address=>mapping(uint=>address[])) monthlySalaryEmployers; //employeeAddress->month -> MonthlySalary
    mapping(address=>mapping(uint=>uint[])) monthlySalaryAmounts; //employeeAddress->month -> MonthlySalary
    
    mapping(address=>mapping(address=>bool)) employerAdded; //employeeAddress->list of employee->bool
    mapping(address=>EmployeeData) employeeDatas;

    modifier validMonth(uint _month) {
        require(_month >= 1 && _month <= 12, "Invalid month");
        _;
    }

    modifier employeerAccepted(address _employeeId, address _employerId) {
        require(employerAdded[_employeeId][_employerId] == true, "Employee has not accepted the company");
        _;
    }

    function acceptCompany(address _employeeId, address _employerId) public {
        require(_employeeId == msg.sender, "Employee hiimself did not send the message");
        employerAdded[_employeeId][_employerId] = true;
        emit EmployeeAcceptedEmployer(_employeeId, _employerId);
    }

    function _addSalaryToIncome(address _employeeId, uint _month, address _employerId, uint _amount) private {
        EmployeeData storage employeeData = employeeDatas[_employeeId];
        employeeData.totalIncome = employeeData.totalIncome.add(_amount);

        monthlySalaryEmployers[_employeeId][_month].push(_employerId);
        monthlySalaryAmounts[_employeeId][_month].push(_amount);

        emit SalaryAdded(_employeeId, _month, _employerId, _amount);
    }

    function addSalary(address _employeeId, uint _month, address _employerId, uint _amount) public validMonth(_month)  employeerAccepted(_employeeId, _employerId) {
        require(_amount > 0, "Salary can not be zero or negative");
        require(msg.sender == _employerId, "Employers himself did not add the salary");
        _addSalaryToIncome(_employeeId, _month, _employerId, _amount);
    }

    function getEmployerIdsForEmployeeAndMonth(address _employeeId, uint _month) public view validMonth(_month) returns (address[] memory) {
        return monthlySalaryEmployers[_employeeId][_month];
    }
    function getSalaryAmountsForEmployeeAndMonth(address _employeeId, uint _month) public view validMonth(_month) returns (uint[] memory) {
        return monthlySalaryAmounts[_employeeId][_month];
    }

    function getTotalIncome(address _employeeId) public view returns (uint) {
        return employeeDatas[_employeeId].totalIncome;
    }
}