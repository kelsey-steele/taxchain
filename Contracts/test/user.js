const User = artifacts.require("User");
const utils = require("./helpers/utils");
const { BN, time } = require('@openzeppelin/test-helpers');
var expect = require('chai').expect;
var assert = require('chai').assert;


contract("User", (accounts) => {
    let [employee1, employer1, employer2, employer3] = accounts;
    let contractInstance;
    let januaryAmount1 = 300;
    let januaryAmount2 = 500;

    before(async () => {
    });
    beforeEach(async () => {
        contractInstance = await User.new({from: employee1});
        await contractInstance.acceptCompany(employer1, {from: employee1});
        await contractInstance.acceptCompany(employer2, {from: employee1});
    });
    afterEach(async () => {
    });

    it("Employer1 should be able to add salary", async () => {
        const result = await contractInstance.addSalary(1, employer1, januaryAmount1, {from: employer1});
        expect(result.receipt.status).to.equal(true);
        expect(result.logs[0].args.amount).to.be.bignumber.equal(new BN(januaryAmount1));

    })
    it("Employer1 & Employer2 should be able to add salary", async () => {
        const result1 = await contractInstance.addSalary(1, employer1, januaryAmount1, {from: employer1});
        expect(result1.receipt.status).to.equal(true);
        expect(result1.logs[0].args.amount).to.be.bignumber.equal(new BN(januaryAmount1));

        const result2 = await contractInstance.addSalary(1, employer2, januaryAmount2, {from: employer2});
        expect(result2.receipt.status).to.equal(true);
        expect(result2.logs[0].args.amount).to.be.bignumber.equal(new BN(januaryAmount2));

        const totalSalaryResult = await contractInstance.totalIncome();
        expect(totalSalaryResult).to.be.bignumber.equal(new BN(januaryAmount1+januaryAmount2))

        const januarySalaryEmployersResult = await contractInstance.getCompanyIdsForMonth(1);
        expect(januarySalaryEmployersResult).to.be.eql([employer1, employer2])

        const januarySalarySalariesResult = await contractInstance.getSalaryAmountsForMonth(1);
        expect(januarySalarySalariesResult[0]).to.be.bignumber.equal(new BN(januaryAmount1));
        expect(januarySalarySalariesResult[1]).to.be.bignumber.equal(new BN(januaryAmount2));
    })
    it("No salary should have been added", async() => {
        const totalSalaryResult = await contractInstance.totalIncome();
        expect(totalSalaryResult).to.be.bignumber.equal(new BN(0))

        const januarySalaryEmployersResult = await contractInstance.getCompanyIdsForMonth(1);
        expect(januarySalaryEmployersResult).to.be.eql([])

        const januarySalarySalariesResult = await contractInstance.getSalaryAmountsForMonth(1);
        expect(januarySalarySalariesResult).to.be.eql([]);
    })
})