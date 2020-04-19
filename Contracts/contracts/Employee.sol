pragma solidity >=0.5.0 <0.6.0;
import "./lib/safemath.sol";
import "./Entity.sol";

contract Employee is Entity{
    using SafeMath for uint;

    uint private totalIncome;
    mapping(address=>bool) companyAdded;

    struct MonthlySalary {
        address[] companyId;
        uint[] salaryAmount;
    }

    event SalaryAdded(address id, uint month, address companyId, uint amount);

    mapping (uint=>MonthlySalary) monthlySalaries; //month -> MonthlySalary

    constructor(address _id) Entity(_id) public {
    }

    modifier companyAccepted(address _companyId) {
        require(companyAdded[_companyId] == true, "User has not accepted the company");
        _;
    }

    function acceptCompany(address _companyId) public {
        require(msg.sender == id, "Msg Sender is not Employee");
        companyAdded[_companyId] = true;
    }

    function _addSalaryToIncome(uint _month, address _companyId, uint _amount) private {
        totalIncome = totalIncome.add(_amount);
        MonthlySalary storage monthlySalary = monthlySalaries[_month];
        monthlySalary.companyId.push(_companyId);
        monthlySalary.salaryAmount.push(_amount);
        emit SalaryAdded(id, _month, _companyId, _amount);
    }

    function addSalary(uint _month, address _companyId, uint _amount) public companyAccepted(_companyId) validMonth(_month) {
        require(_amount > 0, "Salary can not be zero or negative");
        _addSalaryToIncome(_month, _companyId, _amount);
    }

    function getCompanyIdsForMonth(uint _month) public view validMonth(_month) returns (address[] memory) {
        return monthlySalaries[_month].companyId;
    }
    
    function getSalaryAmountsForMonth(uint _month) public view validMonth(_month) returns (uint[] memory){
        return monthlySalaries[_month].salaryAmount;
    }

    function getTotalIncome() public view returns (uint) {
        return totalIncome;
    }

}