const rp = require('request-promise');
const redis = require("redis");
const reqs = require("./../request/request");
const Web3 = require('web3');
require('dotenv').config();

const keyLifeTime = 600; // in seconds
const client = redis.createClient({
    host: process.env.REDIS_HOST || '127.0.0.1'
});

const currency = {
    "Bitcoin": {
        "ticker": "BTC"
    },
    "Ethereum": {
        "ticker": "ETH"
    },
    "US_Dollar": {
        "ticker": "USD"
    }
};

const course = {
    getCourse: async (currency) => {
        var options = {
            method: 'GET',
            uri: `https://min-api.cryptocompare.com/data/price?fsym=${currency}&tsyms=BTC,ETH,USD`,
            json: true
        };
        const response = await rp(options);
        return response;
    },
    /**
     * Allows to convert currencies
     * @param from Currency that will be changed
     * @param to Destination currency
     * @param value Amount of currency that will be changed
     * @returns {Promise<number>}
     */
    convert: async (from, to, value) => {
        const rate = await reqs.getRhombusExchangeRate(from, to);
        console.log(rate)
        const result = Number(value) * Number(rate);
        return result
    }
}

module.exports = {
    course: course,
    keyLifeTime: keyLifeTime,
    client: client,
    web3Mainnet: new Web3(new Web3.providers.HttpProvider(`https://mainnet.infura.io/${process.env.INFURA_TOKEN}`)),
    web3Ropsten: new Web3(new Web3.providers.HttpProvider(`https://ropsten.infura.io/${process.env.INFURA_TOKEN}`)),
    currency: currency
};

