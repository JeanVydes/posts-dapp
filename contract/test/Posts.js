const Posts = artifacts.require("Posts")

contract("Posts", (accounts) => {
    before(async() => {
        this.contract = await Posts.deployed()
    })

    it("deploy migration completed succesfully", async() => {
        const address = await this.contract.address;

        assert.notEqual(address, null)
        assert.notEqual(address, undefined)
        assert.notEqual(address, 0x0)
        assert.notEqual(address, "")
    })
})