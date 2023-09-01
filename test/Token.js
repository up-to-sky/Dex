const { expect } = require('chai');
const { ethers } = require('hardhat');

const tokens = (n) => {
	return ethers.utils.parseUnits(n.toString(), 'ether')
}

describe('Token', () => {
	let token, accounts, deployer, receiver, exchange 

	beforeEach(async () => {
	  const Token = await ethers.getContractFactory('Token')
	  token = await Token.deploy('Canada DigitalAssets Exchange', 'CADEX', '1000000')

	  accounts = await ethers.getSigners()
	  deployer = accounts[0]
	  receiver = accounts[1]
	  exchange = accounts[2] 
	})

describe('Deployment', () => {
		const name = 'Canada DigitalAssets Exchange'
		const symbol = 'CADEX'
		const decimals = '18'
		const totalSupply = tokens('1000000')

	it('has correct name', async () => {
	  expect(await token.name()).to.equal(name)	 
	})

	it('has correct symbol', async () => {
	  expect(await token.symbol()).to.equal(symbol) 
	})

	it('has correct decimals', async () => {
	  expect(await token.decimals()).to.equal(decimals) 
	})

	it('has correct total supply', async () => {
	  expect(await token.totalSupply()).to.equal(totalSupply)
	})

	it('assigns total supply to deployer', async () => {
	  expect(await token.balanceOf(deployer.address)).to.equal(totalSupply) 
	})

})

describe('Sending Tokens', () => {
	let amount, transaction, result

	describe('Success', () => {

	  beforeEach(async () => {
	    amount = tokens(100)
	    transaction = await token.connect(deployer).transfer(receiver.address, amount)
	    result = await transaction.wait()
	  })

	  it('transfers token balances', async () => {
	    expect(await token.balanceOf(deployer.address)).to.equal(tokens(999900))
	    expect(await token.balanceOf(receiver.address)).to.equal(amount)
	  })

	  it('emits a transfer event', async () => {
	    const event = result.events[0]
	    expect(event.event).to.equal('Transfer')

	    const args = event.args
	    expect(args.from).to.equal(deployer.address)
	    expect(args.to).to.equal(receiver.address)
	    expect(args.value).to.equal(amount)
	  })

	})

	describe('Failure', () => {
		it('rejects insufficient balances', async () => {
			const invalidAmount = tokens(100000000)
			await expect(token.connect(deployer).transfer(receiver.address, invalidAmount)).to.be.reverted
		})

		it('rejects invalid recipent', async () => {
			const amount = tokens(100)
			await expect(token.connect(deployer).transfer('0x0000000000000000000000000000000000000000', amount)).to.be.reverted
		})

	  })

	})

describe('Approving Tokens', () => {
	let amount, transaction, result

	beforeEach(async () => {
	  amount = tokens(100)
	  transaction = await token.connect(deployer).approve(exchange.address, amount)
	  result = await transaction.wait()
	})

	describe('Success', () => {
	  it('allocates an allowance for delegated token spending', async () => {
	    expect(await token.allowance(deployer.address, exchange.address)).to.equal(amount)
	  })

	  it('emits a approval event', async () => {
	    const event = result.events[0]
	    expect(event.event).to.equal('Approval')

	    const args = event.args
	    expect(args.owner).to.equal(deployer.address)
	    expect(args.spender).to.equal(exchange.address)
	    expect(args.value).to.equal(amount)
	  })

	})

	describe('Failure', () => {
		it('reject invalid spenders', async () => {
		  await expect(token.connect(deployer).approve('0x0000000000000000000000000000000000000000', amount)).to.be.reverted 
		})

	  })

describe('Delegated Token Transfers', () => {
	let amount, transaction, result 

	beforeEach(async () => {
	  amount = tokens(100)
	  transaction = await token.connect(deployer).approve(exchange.address, amount)
	  result = await transaction.wait()
	})

	 describe('Success', () => {

	 beforeEach(async () => {
	   transaction = await token.connect(exchange).transferFrom(deployer.address, receiver.address, amount)
	   result = await transaction.wait()
	})

	  it('transfer token balances', async () => {
		expect(await token.balanceOf(deployer.address)).to.be.equal(ethers.utils.parseUnits('999900', 'ether'))
		expect(await token.balanceOf(receiver.address)).to.be.equal(amount)
	  })

	  it('resets the allowance', async () => {
		expect(await token.allowance(deployer.address, exchange.address)).to.be.equal(0)
	  })

	  it('emits a transfer event', async () => {
		 const event = result.events[0]
	     expect(event.event).to.equal('Transfer')

	     const args = event.args
	     expect(args.from).to.equal(deployer.address)
	     expect(args.to).to.equal(receiver.address)
	     expect(args.value).to.equal(amount)
	   })	

     })

	describe("Failure", () => {
	  it('rejects insufficient amounts', async () => {
		const invalidAmount = tokens(100000000)
	    await expect(token.connect(exchange).transferFrom(deployer.address, receiver.address, invalidAmount)).to.be.reverted
	   })

	 })
		 
   })

 })

})
