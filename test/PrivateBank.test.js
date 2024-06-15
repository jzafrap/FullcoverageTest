// PrivateBank.test.js
const { ethers } = require("hardhat");
const { loadFixture} = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { expect } = require("chai");


describe("PrivateBank", () => {
  

	 async function deployFixture() {

		// Contracts are deployed using the first signer/account by default
		const [owner, otherAccount] = await ethers.getSigners();

		const PrivateBank = await ethers.getContractFactory("PrivateBank");
		const privateBank = await PrivateBank.deploy();

		return { privateBank, owner, otherAccount };
	  }
	  
	describe("Deployment", function () {
		it("Should deploy successfully, with no balance", async function () {
		  const { privateBank, owner } = await loadFixture(deployFixture);

		  expect(await privateBank.getUserBalance(owner)).to.equal(0);
		});
	});

	describe("Deposit",function (){
		it("should have 0 balance before any deposit", async () => {
			const { privateBank, owner } = await loadFixture(deployFixture);
			const initialBalance = await privateBank.getUserBalance(owner);
			expect(initialBalance).to.equals(0);
		});

		it("should update user balance after first deposit", async () => {
			const { privateBank, owner } = await loadFixture(deployFixture);
			await privateBank.deposit({ value: ethers.parseEther("100") });
			const updatedBalance = await privateBank.getUserBalance(owner);
			expect(updatedBalance).to.equal(ethers.parseEther("100"));
		});
		
		it("should update user balance after multiple deposit", async () => {
			const { privateBank, owner } = await loadFixture(deployFixture);
			await privateBank.deposit({ value: ethers.parseEther("100") });
			await privateBank.deposit({ value: ethers.parseEther("100") });
			const updatedBalance = await privateBank.getUserBalance(owner);
			expect(updatedBalance).to.equal(ethers.parseEther("200"));
		});
		
	})


	describe("Withdraw",function (){
		it("should revert with 'insufficient balance' when no balance", async () => {
			const { privateBank, owner } = await loadFixture(deployFixture);
			await expect(privateBank.withdraw()).to.be.revertedWith("Insufficient balance");
		});

		it("should withdraw balance and added to sender balance", async () => {
			const { privateBank, owner } = await loadFixture(deployFixture);
			
			//deposit 1 ether
			await privateBank.deposit({ value: ethers.parseEther("1") });
			const userBalanceBeforeWithdraw = await ethers.provider.getBalance(owner.address);
			//withdraw 
			const txn = await privateBank.withdraw();
			//calculate gas to substract to current balance
			const receipt = await txn.wait(1);
			const {gasUsed,gasPrice} = receipt;
			const withdrawGas = gasUsed * gasPrice;
			
			const userBalanceAfterWithdraw = await ethers.provider.getBalance(owner.address)
			const expectedBalance = userBalanceBeforeWithdraw - withdrawGas + ethers.parseEther("1");
			expect(userBalanceAfterWithdraw).to.be.equals(expectedBalance);
		});

		it("should set balance of caller to 0", async () => {
			const { privateBank, owner } = await loadFixture(deployFixture);
			//deposit 1 ether
			await privateBank.deposit({ value: ethers.parseEther("1") });
			//withdraw all
			await privateBank.withdraw();
			//balance must be 0 after withdraw
			expect(await privateBank.getUserBalance(owner)).to.equals(0);
		});		


		
	})
	
	describe("Balance",function (){
		it("should set to 0 after deployment", async () => {
			const { privateBank, owner } = await loadFixture(deployFixture);
			//balance must be initiated with 0
			expect(await privateBank.getBalance()).to.equals(0);
		});		
		it("should return balance of account", async () => {
			const { privateBank, owner } = await loadFixture(deployFixture);
			//deposit 1 ether
			await privateBank.deposit({ value: ethers.parseEther("1") });
			expect(await privateBank.getBalance()).to.equals(ethers.parseEther("1"));
		});		
		it("should return 0 after withdraw of account", async () => {
			const { privateBank, owner } = await loadFixture(deployFixture);
			//deposit 1 ether
			await privateBank.deposit({ value: ethers.parseEther("1") });
			//withdraw all
			await privateBank.withdraw();
			//balance must be initiated with 0
			expect(await privateBank.getBalance()).to.equals(0);
		});		

	})
	
	describe("User Balance",function (){
		it("should set to 0 after deployment", async () => {
			const { privateBank, owner } = await loadFixture(deployFixture);
			//balance must be initiated with 0
			expect(await privateBank.getUserBalance(owner)).to.equals(0);
		});		
		it("should return balance of account", async () => {
			const { privateBank, owner } = await loadFixture(deployFixture);
			//deposit 1 ether
			await privateBank.deposit({ value: ethers.parseEther("1") });
			//withdraw all
			//balance must be initiated with 0
			expect(await privateBank.getUserBalance(owner)).to.equals(ethers.parseEther("1"));
		});		
		it("should return 0 after withdraw of account", async () => {
			const { privateBank, owner } = await loadFixture(deployFixture);
			//deposit 1 ether
			await privateBank.deposit({ value: ethers.parseEther("1") });
			//withdraw all
			await privateBank.withdraw();
			//balance must be initiated with 0
			expect(await privateBank.getUserBalance(owner)).to.equals(0);
		});		


	})

});
