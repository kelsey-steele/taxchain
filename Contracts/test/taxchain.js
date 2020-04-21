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
        
        await contractTaxChain.registerEmployee(employee1, {from: employee1});
        await contractTaxChain.registerEmployee(employee2, {from: employee2});
        await contractTaxChain.registerEmployer(employer1, {from: employer1});
        await contractTaxChain.registerEmployer(employer2, {from: employer2});

        await contractTaxChain.employeeAcceptEmployer(employee1, employer1, {from: employee1});
        await contractTaxChain.employeeAcceptEmployer(employee1, employer2, {from: employee1});
        
        await contractTaxChain.employeeAcceptEmployer(employee2, employer1, {from: employee2}); 
    });

    afterEach(async () => {
    });

    it("Employer1 should be able to add salary for Employee1", async() => {
        const result1 = await contractTaxChain.addEmployeeSalary(employee1, employer1, 1, januaryAmount1, {from: employer1});
        expect(result1.receipt.status).to.equal(true);
        expect(result1.logs[0].event).to.be.equal("SalaryAdded");
        expect(result1.logs[0].args.amount).to.be.bignumber.equal(new BN(januaryAmount1));

        const result2 = await contractTaxChain.getEmployeeTotalIncome(employee1);
        expect(result2).to.be.bignumber.equal(new BN(januaryAmount1));
    })

    it("Employer1 and Employer2 should add salary to same month", async() => {
        const result1 = await contractTaxChain.addEmployeeSalary(employee1, employer1, 1, januaryAmount1, {from: employer1});
        expect(result1.receipt.status).to.equal(true);
        expect(result1.logs[0].event).to.be.equal("SalaryAdded");
        expect(result1.logs[0].args.amount).to.be.bignumber.equal(new BN(januaryAmount1));

        const result2 = await contractTaxChain.addEmployeeSalary(employee1, employer2, 1, januaryAmount2, {from: employer2});
        expect(result2.receipt.status).to.equal(true);
        expect(result2.logs[0].event).to.be.equal("SalaryAdded");
        expect(result2.logs[0].args.amount).to.be.bignumber.equal(new BN(januaryAmount2));

        const result3 = await contractTaxChain.getEmployeeTotalIncome(employee1);
        expect(result3).to.be.bignumber.equal(new BN(januaryAmount1+januaryAmount2));
    })

    it("Employer1 and Employer2 should add salary to different month", async() => {
        const result1 = await contractTaxChain.addEmployeeSalary(employee1, employer1, 1, januaryAmount1, {from: employer1});
        expect(result1.receipt.status).to.equal(true);
        expect(result1.logs[0].event).to.be.equal("SalaryAdded");
        expect(result1.logs[0].args.amount).to.be.bignumber.equal(new BN(januaryAmount1));

        const result2 = await contractTaxChain.addEmployeeSalary(employee1, employer2, 2, februraryAmount1, {from: employer2});
        expect(result2.receipt.status).to.equal(true);
        expect(result2.logs[0].event).to.be.equal("SalaryAdded");
        expect(result2.logs[0].args.amount).to.be.bignumber.equal(new BN(februraryAmount1));

        const result3 = await contractTaxChain.getEmployeeTotalIncome(employee1);
        expect(result3).to.be.bignumber.equal(new BN(januaryAmount1+februraryAmount1));
    })

    it("Employer1 gives salary to different employees", async() => {
        const result1 = await contractTaxChain.addEmployeeSalary(employee1, employer1, 1, januaryAmount1, {from: employer1});
        expect(result1.receipt.status).to.equal(true);
        expect(result1.logs[0].event).to.be.equal("SalaryAdded");
        expect(result1.logs[0].args.amount).to.be.bignumber.equal(new BN(januaryAmount1));

        const result2 = await contractTaxChain.addEmployeeSalary(employee2, employer1, 2, februraryAmount1, {from: employer1});
        expect(result2.receipt.status).to.equal(true);
        expect(result2.logs[0].event).to.be.equal("SalaryAdded");
        expect(result2.logs[0].args.amount).to.be.bignumber.equal(new BN(februraryAmount1));

        const result3 = await contractTaxChain.getEmployeeTotalIncome(employee1);
        expect(result3).to.be.bignumber.equal(new BN(januaryAmount1))

        const result4 = await contractTaxChain.getEmployeeTotalIncome(employee2);
        expect(result4).to.be.bignumber.equal(new BN(februraryAmount1))
    })

    it("Employer1 and Employer2 should be able to add salary to same month", async() => {
        const result1 = await contractTaxChain.addEmployeeSalary(employee1, employer1, 1, januaryAmount1, {from: employer1});
        expect(result1.receipt.status).to.equal(true);
        expect(result1.logs[0].event).to.be.equal("SalaryAdded");
        expect(result1.logs[0].args.amount).to.be.bignumber.equal(new BN(januaryAmount1));

        const result2 = await contractTaxChain.addEmployeeSalary(employee1, employer2, 1, januaryAmount2, {from: employer2});
        expect(result2.receipt.status).to.equal(true);
        expect(result2.logs[0].event).to.be.equal("SalaryAdded");
        expect(result2.logs[0].args.amount).to.be.bignumber.equal(new BN(januaryAmount2));

        const result3 = await contractTaxChain.getEmployeeTotalIncome(employee1);
        expect(result3).to.be.bignumber.equal(new BN(januaryAmount1+januaryAmount2));

        const result4 = await contractTaxChain.getEmployerIdsForEmployeeAndMonth(employee1, 1);
        expect(result4).to.be.eql([employer1, employer2]);
        expect(result4.length).to.be.equal(2);

        const result5 = await contractTaxChain.getSalaryAmountsForEmployeeAndMonth(employee1, 1);
        expect(result5.length).to.be.equal(2);
        expect(result5[0]).to.be.bignumber.equal(new BN(januaryAmount1));
        expect(result5[1]).to.be.bignumber.equal(new BN(januaryAmount2));
    })
    
    it("List total income of all employees", async() => {
        const result1 = await contractTaxChain.addEmployeeSalary(employee2, employer1, 1, januaryAmount1, {from: employer1});
        expect(result1.receipt.status).to.equal(true);
        expect(result1.logs[0].event).to.be.equal("SalaryAdded");
        expect(result1.logs[0].args.amount).to.be.bignumber.equal(new BN(januaryAmount1));

        await contractTaxChain.addEmployeeSalary(employee1, employer2, 1, januaryAmount1, {from: employer2});
        await contractTaxChain.addEmployeeSalary(employee1, employer1, 2, februraryAmount1, {from: employer1});

        const result3 = await contractTaxChain.getAllEmployeeList();
        expect(result3).to.be.eql([employee1, employee2]);

        const result4 = await contractTaxChain.getAllEmployeeTotalIncomeList();
        expect(result4.length).to.be.equal(2);
        expect(result4[0]).to.be.bignumber.equal(new BN(januaryAmount1+februraryAmount1));
        expect(result4[1]).to.be.bignumber.equal(new BN(januaryAmount1));
    })

    it("Employee1 should be of Employee type", async() => {
        const result = await contractTaxChain.getMessageSenderAddressType({from: employee1});
        expect(result).to.be.equal("EMPLOYEE");
    })
    
    it("Employer1 should be of Employer type", async() => {
        const result = await contractTaxChain.getMessageSenderAddressType({from: employer1});
        expect(result).to.be.equal("EMPLOYER");
    })

    it("IRS user should be of IRS type", async() => {
        const result = await contractTaxChain.getMessageSenderAddressType({from: "0xA3dCb6c670a83Eb68C65Ecb8D6Dd6dfADBF429bE"});
        expect(result).to.be.equal("IRS");
    })
})