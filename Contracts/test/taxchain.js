const TaxChain = artifacts.require("TaxChain");
const utils = require("./helpers/utils");
const { BN, time } = require('@openzeppelin/test-helpers');
var expect = require('chai').expect;
var assert = require('chai').assert;

contract("TaxChain", (accounts) => {
    let [employee1, employee2, employer1, employer2] = accounts;
    let contractTaxChain;
    let januaryAmount1 = 300;
    let januaryAmount2 = 500;
    let februraryAmount1 = 250;
    let februraryAmount2 = 400;

    before(async () => {
    });
    beforeEach(async () => {
        contractTaxChain = await TaxChain.new();
        
        await contractTaxChain.registerEmployee({from: employee1});

        await contractTaxChain.registerEmployee({from: employee2});
        await contractTaxChain.registerEmployer({from: employer1});
        await contractTaxChain.registerEmployer({from: employer2});

        await contractTaxChain.employeeAcceptEmployer(employer1, {from: employee1});
        await contractTaxChain.employeeAcceptEmployer(employer2, {from: employee1});
        
        await contractTaxChain.employeeAcceptEmployer(employer1, {from: employee2});
    });

    afterEach(async () => {
    });

    it("Employer1 should be able to add salary for Employee1", async() => {
        await contractTaxChain.addEmployeeSalary(employee1, 1, januaryAmount1, {from: employer1});
        const result = contractTaxChain.getEmployeeTotalIncome();
        expect(result.receipt.status).to.equal(true);
        expect(result).to.be.bignumber.equal(new BN(januaryAmount1))
    })

    // it("Employer1 should be able to add salary", async () => {
    //     const result = await contractInstance.addSalary(1, employer1, januaryAmount1, {from: employer1});
    //     expect(result.receipt.status).to.equal(true);
    //     expect(result.logs[0].args.amount).to.be.bignumber.equal(new BN(januaryAmount1));

    // })
})