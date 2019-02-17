const rp = require('request-promise');

const tickers = {
    "USD": {
        "ETH": "usd-eth",
        "XDAI": "usd-xdai",
        "DAI": "usd-dai",
        "BTC": "usd-btc",
    },
    "ETH": {
        "USD": "eth-usd",
        "XDAI": "eth-xdai",
        "DAI": "eth-dai",
        "BTC": "eth-btc"
    },
    "XDAI": {
        "ETH": "xdai-eth",
        "USD": "xdai-usd",
        "DAI": "xdai-dai",
        "BTC": "xdai-btc"
    },
    "DAI": {
        "ETH": "dai-eth",
        "XDAI": "dai-xdai",
        "USD": "dai-usd",
        "BTC": "dai-btc"
    },
    "BTC": {
        "ETH": "btc-eth",
        "XDAI": "btc-xdai",
        "DAI": "btc-dai",
        "USD": "btc-usd"
    }

}

async function getTokenBalance(tokenAddress, userAddress) {
    let tokenBalances = [];
    for (let i in tokenAddress)
        tokenBalances.push(JSON.parse(await rp.get(`https://api.etherscan.io/api?module=account&action=tokenbalance&contractaddress=${tokenAddress[i]}&address=${userAddress}`)).result);
    return tokenBalances;
}

async function getRhombusExchangeRate(firstCurrency, secondCurrency) {
    console.log(`http://ethergram.tk:8080/rate/${tickers[firstCurrency][secondCurrency]}`)
    return JSON.parse(await rp.get(`http://ethergram.tk:8080/rate/${tickers[secondCurrency][firstCurrency]}`)).rate;
}

async function getBuffBalance(userAddress) {
    return JSON.parse(await rp.get(`http://ethergram.tk:9090/balance/${userAddress}`)).balance;
}

async function getBTCBalance(userAddress) {
    return JSON.parse(await rp.get(`https://insight.bitpay.com/api/addr/${userAddress}`)).balance;
}

module.exports = {
    getTokenBalance: getTokenBalance,
    getBTCBalance: getBTCBalance,
    getRhombusExchangeRate: getRhombusExchangeRate,
    getBuffBalance: getBuffBalance
};