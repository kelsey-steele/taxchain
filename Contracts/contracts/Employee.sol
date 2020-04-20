pragma solidity >=0.5.0 <0.6.0;
// pragma experimental ABIEncoderV2;
import "./lib/safemath.sol";
// import "./Entity.sol";

contract Employee {
    using SafeMath for uint;

    struct EmployeeData {
        address employeeId;
        uint totalIncome;
    }
    
    // struct MonthlySalary {
    //     address[] employerId;
    //     // uint[] month;
    //     uint[] salaryAmount;
    // }

    event SalaryAdded(address employeeId, uint month, address employerId, uint amount);

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

    function acceptCompany(address _employerId) public {
        employerAdded[msg.sender][_employerId] = true;
    }

    function _addSalaryToIncome(address _employeeId, uint _month, address _employerId, uint _amount) private {
        EmployeeData storage employeeData = employeeDatas[_employeeId];
        employeeData.totalIncome = employeeData.totalIncome.add(_amount);

        // MonthlySalary[] storage monthlySalaryStruct = monthlySalaries[_employeeId][_month];
        // MonthlySalary storage (_employerId, _month, _amount) newMonthlySalary;
        // MonthlySalary memory newMonthlySalary;
        // newMonthlySalary.employerId = _employerId;
        // newMonthlySalary.month = _month;
        // newMonthlySalary.salaryAmount = _amount;
        
        // monthlySalaryStruct.push(newMonthlySalary);
        // MonthlySalary memory newMonthlySalary = MonthlySalary(_employerId, _month, _amount);
        // monthlySalaries[_employeeId][_month].push(MonthlySalary(_employerId, _month, _amount));
        // MonthlySalary storage monthlySalaryStruct = monthlySalaries[_employeeId][_month];
        // monthlySalaryStruct.employerId.push(_employerId);
        // monthlySalaryStruct.month.push(_month);
        // monthlySalaryStruct.salaryAmount.push(_amount);
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
        // MonthlySalary memory salaries = monthlySalaries[_employeeId][_month];
        // return salaries;
        return monthlySalaryEmployers[_employeeId][_month];
    }
    function getSalaryAmountsForEmployeeAndMonth(address _employeeId, uint _month) public view validMonth(_month) returns (uint[] memory) {
        // MonthlySalary memory salaries = monthlySalaries[_employeeId][_month];
        // return salaries;
        return monthlySalaryAmounts[_employeeId][_month];
    }

    function getTotalIncome(address _employeeId) public view returns (uint) {
        return employeeDatas[_employeeId].totalIncome;
    }
}