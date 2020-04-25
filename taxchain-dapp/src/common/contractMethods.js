
async function getMessageSenderTypeFunc(taxChainContract, msgSenderAddress) {
    const res = await taxChainContract.methods.getMessageSenderAddressType()
                .call({from: msgSenderAddress});
    return res;
}

async function registerNewUserFunc(taxChainContract, userAddress,  userType, msgSenderAddress) {
    console.log(taxChainContract, userAddress, userType);
    if(userType == 'employee') {
        await taxChainContract.methods.registerEmployee(userAddress)
        .send({from: msgSenderAddress});
    }
    else if(userType == 'employer') {
        await taxChainContract.methods.registerEmployer(userAddress)
        .send({from: msgSenderAddress});
    }
}

export const getMessageSenderType=getMessageSenderTypeFunc;
export const registerNewUser=registerNewUserFunc;