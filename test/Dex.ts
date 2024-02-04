import { expect } from "chai";
import { ethers } from "hardhat"; 

describe("Dex", () => {
    let tokenSupply = "100";
    let token: any;
    let dex: any;


    let price = 100;
    let owner: any;
    let addr1: any;
    let addr2: any;

    before(async () => {
        [owner, addr1, addr2] = await ethers.getSigners();
        const Token = await ethers.getContractFactory("Token");
        token = await Token.deploy(tokenSupply);

        const Dex = await ethers.getContractFactory("Dex"); 

        dex = await Dex.deploy(token.address, price)
    })


    describe("Sell", () => {
        it("Should fail if contract is not approved", async ()=> {
            await expect(dex.sell()).to.be.reverted;
        })

        it("Should allow the  Dex to transfer tokens", async () => {
            await token.approve(dex.address, 100);
        })

        it("Should not allow non-owner to sell", async () => {
            await expect(dex.connect(addr1).sell()).to.be.reverted;
        })

        it("Sell should transfer tokens from owner to contract", async () => {
            await expect(dex.sell()).to.changeTokenBalances(token, [owner.address, dex.address], [-100, 100])
        })
    })

    describe("Getters", () => {
        it("Should return the correct token balance", async () => {
            expect(await dex.getTokenBalance()).to.equal(100)
        })

        it("Should return the correct token price", async () => {
            expect(await dex.getPrice(10)).to.equal(price * 10)
        })
    })

    describe("Buy", () => {
        it("Users can buy tokens", async () => {
            await expect(dex.connect(addr1).buy(10, {value: 1000})).changeTokenBalances(token, [dex.address, addr1.address], [-10, 10])
        })

        it("Users cannot buy invalid number of tokens", async () => {
            await expect(dex.connect(addr1).buy(91, {value: 9100})).to.be.reverted
        })

        it("Users cannot buy with invalid value", async () => {
            await expect(dex.connect(addr1).buy(5, {value: 510})).to.be.reverted
        })
    })


    describe("Withdraw Tokens", () => {
        it("Non-owners cannot withdraw tokens", async () => {
            await expect(dex.connect(addr1).withdrawTokens()).to.be.reverted
        })

        it("Owners can withdraw their tokens", async () => {
            await expect(dex.withdrawTokens()).to.changeTokenBalances(token, [dex.address, owner.address], [-90, 90])
        })
    }),


    describe("Withdraw Funds", () => {
        it("Owners can withdraw tokens proceeds", async () => {
            await expect(dex.withdrawFunds()).to.changeEtherBalances([owner.address, dex.address], [1000, -1000])
        })

        it("Non-owners cannot withdraw tokens proceeds", async () => {
            await expect(dex.connect(addr1).withdrawFunds()).to.be.reverted
        })
    })


})