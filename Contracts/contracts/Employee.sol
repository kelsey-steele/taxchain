pragma solidity >=0.5.0 <0.6.0;
// pragma experimental ABIEncoderV2;
import "./lib/safemath.sol";

contract Employee {
    using SafeMath for uint;

    struct EmployeeData {
        address employeeId;
        uint totalIncome;
    }

    event SalaryAdded(address employeeId, uint year, uint month, address employerId, uint amount);
    event EmployeeAcceptedEmployer(address employeeId, address employerId);
    event EmployeeRemovedEmployer(address employeeId, address employerId);
    
    mapping(uint=>mapping(address=>mapping(uint=>address[]))) private monthlySalaryEmployers; //year->employeeAddress->month -> MonthlySalaryEmployers
    mapping(uint=>mapping(address=>mapping(uint=>uint[]))) private monthlySalaryAmounts; //year->employeeAddress->month -> MonthlySalary
    

    mapping(address=>mapping(address=>bool)) private employerAdded; //employeeAddress->list of employee->bool
    mapping(uint=>mapping(address=>EmployeeData)) private employeeDatas; // year->employee data

    mapping(uint=>mapping(address=>bool)) private employeeDataExistsForYear; // address->time

    modifier validMonth(uint _month) {
        require(_month >= 1 && _month <= 12, "Invalid month");
        _;
    }

    modifier validYear(uint _year) {
        require(_year >= 2020 && _year <= 2120, "Invalid year");
        _;
    }

    modifier employeerAccepted(address _employeeId, address _employerId) {
        require(employerAdded[_employeeId][_employerId] == true, "Employee has not accepted the company");
        _;
    }

    function doesEmployeeDataExistForYear(address _employeeId, uint _year) internal view returns (bool) {
        return employeeDataExistsForYear[_year][_employeeId] == true;
    }

    function acceptCompany(address _employeeId, address _employerId) internal {
        require(_employeeId == msg.sender, "Employee himself did not send the message");
        require(employerAdded[_employeeId][_employerId] == false, "Employee has already accepted employer");
        employerAdded[_employeeId][_employerId] = true;
        emit EmployeeAcceptedEmployer(_employeeId, _employerId);
    }

    function removeCompany(address _employeeId, address _employerId) internal {
        require(_employeeId == msg.sender, "Employee himself did not send the message");
        require(employerAdded[_employeeId][_employerId] == true, "Employee has not accepted employer yet");
        employerAdded[_employeeId][_employerId] = false;
        emit EmployeeRemovedEmployer(_employeeId, _employerId);
    }

    function _addSalaryToIncome(address _employeeId, uint _year, uint _month, address _employerId, uint _amount) private validYear(_year) {
        employeeDataExistsForYear[_year][_employeeId] = true;
        EmployeeData storage employeeData = employeeDatas[_year][_employeeId];
        employeeData.totalIncome = employeeData.totalIncome.add(_amount);

        monthlySalaryEmployers[_year][_employeeId][_month].push(_employerId);
        monthlySalaryAmounts[_year][_employeeId][_month].push(_amount);

        emit SalaryAdded(_employeeId, _year, _month, _employerId, _amount);
    }

    function addSalary(address _employeeId, uint _year, uint _month, address _employerId, uint _amount) internal validMonth(_month) employeerAccepted(_employeeId, _employerId) {
        require(_amount > 0, "Salary can not be zero or negative");
        require(msg.sender == _employerId, "Employers himself did not add the salary");
        _addSalaryToIncome(_employeeId, _year, _month, _employerId, _amount);
    }

    function getEmployerIdsForEmployeeMonthAndYear(address _employeeId, uint _month, uint _year) internal view validMonth(_month) validYear(_year) returns (address[] memory) {
        if(doesEmployeeDataExistForYear(_employeeId, _year) == false){
            address[] memory emptyAray;
            return emptyAray;
        }
        return monthlySalaryEmployers[_year][_employeeId][_month];
    }

    function getSalaryAmountsForEmployeeMonthAndYear(address _employeeId, uint _month, uint _year) internal view validMonth(_month) validYear(_year) returns (uint[] memory) {
        if(doesEmployeeDataExistForYear(_employeeId, _year) == false) {
            uint[] memory emptyAray;
            return emptyAray;
        }
        return monthlySalaryAmounts[_year][_employeeId][_month];
    }

    function getTotalIncome(address _employeeId, uint _year) internal validYear(_year) view returns (uint) {
        if(doesEmployeeDataExistForYear(_employeeId, _year) == false)
            return 0;
        return employeeDatas[_year][_employeeId].totalIncome;
    }

}