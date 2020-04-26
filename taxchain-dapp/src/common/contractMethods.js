
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

async function getEmployeeTotalIncomeFunc(taxChainContract, userAddress, msgSenderAddress) {
    const res = await taxChainContract.methods.getEmployeeTotalIncome(userAddress)
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



export const getMessageSenderType=getMessageSenderTypeFunc;
export const registerNewUser=registerNewUserFunc;
export const getSalaryAmountsForEmployeeAndMonth=getSalaryAmountsForEmployeeAndMonthFunc;
export const getEmployeeTotalIncome=getEmployeeTotalIncomeFunc;
export const getTaxRate=getTaxRateFunc;
export const getEmployerIdsForEmployeeAndMonth=getEmployerIdsForEmployeeAndMonthFunc;