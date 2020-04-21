pragma solidity >=0.5.0 <0.6.0;
import "./Employee.sol";
import "./IRS.sol";

contract TaxChain is Employee, IRS {
    address[] private employeeIdList;
    address[] private employerIdList;
    uint[] private employeeTotalIncomeList;
    
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
        employeeTotalIncomeList.push(0);
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

    function getAllEmployeeList() public view returns (address[] memory) {
        return employeeIdList;
    }

    function getAllEmployeeTotalIncomeList() public view returns (uint[] memory) {
        uint[] memory incomeList = employeeTotalIncomeList;
        for(uint i=0;i<employeeIdList.length;i++){
            incomeList[i] = getEmployeeTotalIncome(employeeIdList[i]);
        }
        return incomeList;
    }

    function getEmployerIdsForEmployeeAndMonth(address _employeeId, uint _month) public view 
                validMonth(_month) canAccessEmployeeInfo(msg.sender, _employeeId) returns (address[] memory) {
        return getEmployerIdsForEmployeeMonth(_employeeId, _month);
    }

    function getSalaryAmountsForEmployeeAndMonth(address _employeeId, uint _month) public view 
                validMonth(_month) canAccessEmployeeInfo(msg.sender, _employeeId) returns (uint[] memory) {
        return getSalaryAmountsForEmployeeMonth(_employeeId, _month);
    }



    modifier canAccessEmployeeInfo(address _fromAddress, address _targetInfoAddress) {
        require(isMessageFromEmployeeOrIrs(_fromAddress, _targetInfoAddress) == true,
                "Employee information is not accessible to Message sender.");
                _;
    }

    function registerIRS(address _newIrsId) public {
        addNewIrsId(_newIrsId);
    }

    function isMessageFromEmployeeOrIrs(address _fromAddress, address _targetInfoAddress) private view returns (bool) {
        if(isAddressFromIrs(_fromAddress) == true)
            return true;
        if(_fromAddress != _targetInfoAddress)
            return false;
        if(addressToEmployeeExists[_fromAddress] == false)
            return false;
        return true;
    }

    function getMessageSenderAddressType() public view returns (string memory) {
        address _address = msg.sender;
        if(isAddressFromIrs(_address) == true)
            return "IRS";
        if(addressToEmployeeExists[_address] == true)
            return "EMPLOYEE";
        if(addressToEmployerExists[_address] == true)
            return "EMPLOYER";
        return "NONE";
    }

    function getTaxRate() public view returns (uint) {
        return getIRSTaxRate();
    }

    function changeTaxRate(uint _newRate) public {
        changeIRSTaxRate(_newRate);
    }

}