pragma solidity >=0.5.0 <0.6.0;
import "./Employee.sol";
import "./IRS.sol";

contract TaxChain is Employee, IRS {
    using SafeMath for uint;

    address[] private employeeIdList;
    address[] private employerIdList;
    mapping(uint=>uint[]) private employeeTotalIncomeMap;

    uint private contractCreationTime;
    
    mapping(address=>uint) private employeeRegistrationTime;
    
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

    modifier accountAddressDoesNotExists(address _newAddress) {
        require(addressToEmployeeExists[_newAddress] == false, "Address already registered as Employee");
        require(addressToEmployerExists[_newAddress] == false, "Address already registered as Employer");
        require(isAddressFromIrs(_newAddress) == false, "Address already registered as IRS");
        _;
    }

    event EmployeeRegistered(address employeeId);
    event EmployerRegistered(address employerId);
    
    constructor() public {
        contractCreationTime = now;
    }

    function getEmployeeRegistrationTime(address _employeeId) public view employeeExists(_employeeId) canAccessEmployeeInfo(msg.sender, _employeeId) returns (uint){
        return employeeRegistrationTime[_employeeId];
    }

    function registerEmployee(address _newEmployeeId) public accountAddressDoesNotExists(_newEmployeeId) {
        require(_newEmployeeId == msg.sender, "Employee himself did not send the message");
        
        employeeIdList.push(_newEmployeeId);

        for(uint i=2020;i<=2120;i=i.add(1))
            employeeTotalIncomeMap[i].push(0);
        
        addressToEmployeeExists[_newEmployeeId] = true;
        employeeRegistrationTime[_newEmployeeId] = now;
        
        emit EmployeeRegistered(_newEmployeeId);
    }

    function registerEmployer(address _newEmployerId) public accountAddressDoesNotExists(_newEmployerId) {
        require(_newEmployerId == msg.sender, "Employer himself did not send the message");
        
        employerIdList.push(_newEmployerId);
        addressToEmployerExists[_newEmployerId] = true;
        
        emit EmployerRegistered(_newEmployerId);
    }

    function employeeAcceptEmployer(address _employeeId, address _employerId) public employeeExists(_employeeId) employerExists(_employerId) {
        require(_employeeId == msg.sender, "Employee himself did not send the message");
        acceptCompany(_employeeId, _employerId);
    }

    function employeeRemoveEmployerFromAcceptedList(address _employeeId, address _employerId) public employeeExists(_employeeId) employerExists(_employerId) {
        require(_employeeId == msg.sender, "Employee himself did not send the message");
        removeCompany(_employeeId, _employerId);
    }

    function getEmployeeTotalIncomeAYear(address _employeeId, uint _year) public view employeeExists(_employeeId) returns (uint) {
        return getTotalIncome(_employeeId, _year);
    }

    function addEmployeeSalary(address _employeeId, address _employerId, uint _year, uint8 _month, uint _salaryAmount) public 
            employerExists(msg.sender) employeeExists(_employeeId) {
        addSalary(_employeeId, _year, _month, _employerId, _salaryAmount);
    }

    function getAllEmployeeList() public view returns (address[] memory) {
        return employeeIdList;
    }

    function getAllEmployerList() public view returns (address[] memory) {
        return employerIdList;
    }

    function getAllEmployeeTotalIncomeListAYear(uint _year) public view validYear(_year) returns (uint[] memory) {
        uint[] memory incomeList = employeeTotalIncomeMap[_year];
        for(uint i=0;i<employeeIdList.length;i++){
            incomeList[i] = getEmployeeTotalIncomeAYear(employeeIdList[i], _year);
        }
        return incomeList;
    }

    function getEmployerIdsForEmployeeAndMonthAndYear(address _employeeId, uint _month, uint _year) public view 
                canAccessEmployeeInfo(msg.sender, _employeeId) returns (address[] memory) {
        return getEmployerIdsForEmployeeMonthAndYear(_employeeId, _month, _year);
    }

    function getSalaryAmountsForEmployeeAndMonthAndYear(address _employeeId, uint _month, uint _year) public view 
                canAccessEmployeeInfo(msg.sender, _employeeId) returns (uint[] memory) {
        return getSalaryAmountsForEmployeeMonthAndYear(_employeeId, _month, _year);
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

    // function getEmployeeTaxForYear(address _employeeId, uint _year) public view validYear(_year) returns(uint) {
    //     uint income = getTotalIncome(_employeeId, _year);
    //     uint taxRate = getIRSTaxRate();
    //     if(taxRate == 0)
    //         return 0;
    //     uint tax = income.div(taxRate);
    //     return tax;
    // }

}