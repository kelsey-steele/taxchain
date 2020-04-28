
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

async function getSalaryAmountsForEmployeeAndMonthFunc(taxChainContract, userAddress, month, msgSenderAddress) {
    const res = await taxChainContract.methods.getSalaryAmountsForEmployeeAndMonth(userAddress, month)
                .call({from: msgSenderAddress});
    return res;
}

async function getTaxRateFunc(taxChainContract) {
    const res = await taxChainContract.methods.getTaxRate().call();
    return res;
}

async function getEmployerIdsForEmployeeAndMonthFunc(taxChainContract, userAddress, month, msgSenderAddress) {
    const res = await taxChainContract.methods.getEmployerIdsForEmployeeAndMonth(userAddress, month)
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

async function getEmployeeTotalIncomeFunc(taxChainContract, employeeAddress, msgSenderAddress){
    const res = await taxChainContract.methods.getEmployeeTotalIncome(employeeAddress)
                .call({from:msgSenderAddress});
    return res
}

async function getAllEmployeeTotalIncomeListFunc(taxChainContract, msgSenderAddress){
    const res = await taxChainContract.methods.getAllEmployeeTotalIncomeList()
                .call({from:msgSenderAddress});
    return res;
}

async function changeIRSTaxRateFunc(taxChainContract, msgSenderAddress, newTaxRate){
    const res = await taxChainContract.methods.changeTaxRate(newTaxRate)
                .send({from:msgSenderAddress});
    return res;
}


export const getMessageSenderType=getMessageSenderTypeFunc;
export const registerNewUser=registerNewUserFunc;
export const getSalaryAmountsForEmployeeAndMonth=getSalaryAmountsForEmployeeAndMonthFunc;
export const getAllEmployee=getAllEmployeeFunc;
export const getEmployeeTotalIncome=getEmployeeTotalIncomeFunc;
export const getAllEmployeeTotalIncomeList=getAllEmployeeTotalIncomeListFunc;
export const getTaxRate=getTaxRateFunc;
export const getEmployerIdsForEmployeeAndMonth=getEmployerIdsForEmployeeAndMonthFunc;
export const employeeAcceptEmployer=employeeAcceptEmployerFunc;
export const changeIRSTaxRate=changeIRSTaxRateFunc;
