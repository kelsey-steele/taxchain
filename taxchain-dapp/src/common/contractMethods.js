
async function getMessageSenderTypeFunc(taxChainContract, msgSenderAddress) {
    const res = await taxChainContract.methods.getMessageSenderAddressType()
                .call({from: msgSenderAddress});
    return res;
}

async function registerNewUserFunc(taxChainContract, userAddress,  userType, msgSenderAddress) {
    if(userType == 'employee') {
        await taxChainContract.methods.registerEmployee(userAddress)
        .send({from: msgSenderAddress});
    }
    else if(userType == 'employer') {
        await taxChainContract.methods.registerEmployer(userAddress)
        .send({from: msgSenderAddress});
    }
}

async function getSalaryAmountsForEmployeeAndMonthAndYearFunc(taxChainContract, userAddress, month, year, msgSenderAddress) {
    const res = await taxChainContract.methods.getSalaryAmountsForEmployeeAndMonthAndYear(userAddress, month, year)
                .call({from: msgSenderAddress});
    return res;
}

async function getEmployeeTotalIncomeAYearFunc(taxChainContract, userAddress, year, msgSenderAddress) {
    const res = await taxChainContract.methods.getEmployeeTotalIncomeAYear(userAddress, year)
                .call({from: msgSenderAddress});
    return res;
}

async function getTaxRateFunc(taxChainContract) {
    const res = await taxChainContract.methods.getTaxRate().call();
    return res;
}

async function getEmployerIdsForEmployeeAndMonthAndYearFunc(taxChainContract, userAddress, month, year, msgSenderAddress) {
    const res = await taxChainContract.methods.getEmployerIdsForEmployeeAndMonthAndYear(userAddress, month, year)
                .call({from: msgSenderAddress});
    return res;
}

async function employeeAcceptEmployerFunc(taxChainContract, employeeAddress, employerAddress, msgSenderAddress) {
    const res = await taxChainContract.methods.employeeAcceptEmployer(employeeAddress, employerAddress)
                .send({from: msgSenderAddress});
    return res;
}

async function getAllEmployeeFunc(taxChainContract, msgSenderAddress){
    const res = await taxChainContract.methods.getAllEmployeeList()
                .call({from:msgSenderAddress});
    return res;
}

async function getEmployeeTotalIncomeFunc(taxChainContract, employeeAddress, year, msgSenderAddress){
    const res = await taxChainContract.methods.getEmployeeTotalIncomeAYear(employeeAddress, year)
                .call({from:msgSenderAddress});
    return res
}

async function getAllEmployeeTotalIncomeListFunc(taxChainContract, year, msgSenderAddress){
    const res = await taxChainContract.methods.getAllEmployeeTotalIncomeListAYear(year)
                .call({from:msgSenderAddress});
    return res;
}

async function changeIRSTaxRateFunc(taxChainContract, msgSenderAddress, newTaxRate){
    const res = await taxChainContract.methods.changeTaxRate(newTaxRate)
                .send({from:msgSenderAddress});
    return res;
}

async function addEmployeeSalaryFunc(taxChainContract, employeeAddress, employerAddress, year, month, amount, msgSenderAddress) {
    const res = await taxChainContract.methods.addEmployeeSalary(employeeAddress, employerAddress, year, month, amount)
                .send({from: msgSenderAddress});
    return res;
}


export const getMessageSenderType=getMessageSenderTypeFunc;
export const registerNewUser=registerNewUserFunc;
export const getSalaryAmountsForEmployeeAndMonthAndYear=getSalaryAmountsForEmployeeAndMonthAndYearFunc;
export const getAllEmployee=getAllEmployeeFunc;
export const getEmployeeTotalIncomeAYear=getEmployeeTotalIncomeAYearFunc;
export const getAllEmployeeTotalIncomeList=getAllEmployeeTotalIncomeListFunc;
export const getTaxRate=getTaxRateFunc;
export const getEmployerIdsForEmployeeAndMonthAndYear=getEmployerIdsForEmployeeAndMonthAndYearFunc;
export const employeeAcceptEmployer=employeeAcceptEmployerFunc;
export const changeIRSTaxRate=changeIRSTaxRateFunc;
export const addEmployeeSalary=addEmployeeSalaryFunc;




