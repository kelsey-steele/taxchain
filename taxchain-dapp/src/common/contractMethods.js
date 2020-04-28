
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


export const getMessageSenderType=getMessageSenderTypeFunc;
export const registerNewUser=registerNewUserFunc;
export const getSalaryAmountsForEmployeeAndMonthAndYear=getSalaryAmountsForEmployeeAndMonthAndYearFunc;
export const getEmployeeTotalIncomeAYear=getEmployeeTotalIncomeAYearFunc;
export const getTaxRate=getTaxRateFunc;
export const getEmployerIdsForEmployeeAndMonthAndYear=getEmployerIdsForEmployeeAndMonthAndYearFunc;
export const employeeAcceptEmployer=employeeAcceptEmployerFunc;