pragma solidity >=0.5.0 <0.6.0;
import "./lib/safemath.sol";

contract Employee {
    using SafeMath for uint;

    address employeeId;
    uint public totalIncome;
    mapping(address=>bool) companyAdded;

    struct MonthlySalary {
        address[] companyId;
        uint[] salaryAmount;
    }

    event SalaryAdded(address employeeId, uint month, address companyId, uint amount);

    mapping (uint=>MonthlySalary) monthlySalaries; //month -> MonthlySalary

    constructor() public {
        employeeId = msg.sender;
    }

    modifier companyAccepted(address _companyId) {
        require(companyAdded[_companyId] == true, "User has not accepted the company");
        _;
    }
    modifier validMonth(uint _month) {
        require(_month >= 1 && _month <= 12, "Invalid month");
        _;
    }

    function acceptCompany(address _companyId) public {
        require(msg.sender == employeeId, "Msg Sender is not user");
        companyAdded[_companyId] = true;
    }

    function _addSalaryToIncome(uint _month, address _companyId, uint _amount) private {
        totalIncome = totalIncome.add(_amount);
        MonthlySalary storage monthlySalary = monthlySalaries[_month];
        monthlySalary.companyId.push(_companyId);
        monthlySalary.salaryAmount.push(_amount);
        emit SalaryAdded(employeeId, _month, _companyId, _amount);
    }

    function addSalary(uint _month, address _companyId, uint _amount) public companyAccepted(_companyId) validMonth(_month) {
        _addSalaryToIncome(_month, _companyId, _amount);
    }

    function getCompanyIdsForMonth(uint _month) public view validMonth(_month) returns (address[] memory) {
        return monthlySalaries[_month].companyId;
    }
    
    function getSalaryAmountsForMonth(uint _month) public view validMonth(_month) returns (uint[] memory){
        return monthlySalaries[_month].salaryAmount;
    }
}