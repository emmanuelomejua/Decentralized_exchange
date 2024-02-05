import { expect } from "chai";
import { ethers } from "hardhat"; 

describe("Token", () => {
    let tokenSupply = "100";
    let token: any;
    let owner: any;
    let addr1: any;
    let addr2: any;

    before(async () => {
        [owner, addr1, addr2] = await ethers.getSigners();
        const Token = await ethers.getContractFactory("Token");
        token = await Token.deploy(tokenSupply);
    })

    // describe("Deployment", () => {
    //     it("Should assign total supply of tokens to owner/supplyer", async () => {
    //         const ownerBalance = await token.balanceOf(owner.address);
    //         expect(await token.tokenSupply()).to.equal(ownerBalance)
    //     })
    // })

    describe("Transaction", () => {
        it("Should transfer token between accounts", async () => {
            await token.transfer(addr1.address, 50);
            const addr1Balance = await token.balanceOf(addr1.address);
            expect(addr1Balance).to.equal(50);
        })

        it("Should transfer token between accounts", async () => {
            await expect(token.connect(addr1).transfer(addr2.address, 51)).to.be.reverted;
        })
    })
        
})
