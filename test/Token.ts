import { expect } from "chai";
import { ethers } from "hardhat"; 

describe("Token", () => {
    let tokenSupply = "100";
    let token: any;
    let owner: any;
    let addr1: any;
    let addr2: any;

    beforeEach(async () => {
        [owner, addr1, addr2] = await ethers.getSigners();
        const Token = await ethers.getContractFactory("Token");
        token = await Token.deploy(tokenSupply);
    })

    describe("Deployment", () => {
        it("Should assign total supply of tokens to owner/supplyer", async () => {
            const ownerBalance = await token.balanceOf(owner.address);
            expect(await token.tokenSupply()).to.equal(ownerBalance)
        })
    })

    describe("Deployment", () => {})

})
