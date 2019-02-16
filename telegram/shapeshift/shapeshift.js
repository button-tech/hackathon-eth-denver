const rp = require('request-promise');
const zipObject = require('zip-object');

const ShapeShift = {
    pairs: {
        bitcoin: {
            litecoin: 'btc_ltc',
            ethereum: 'btc_eth',
            bitcoinCash: 'btc_bch'
        },
        litecoin: {
            bitcoin: 'ltc_btc',
            ethereum: 'ltc_eth',
            bitcoinCash: 'ltc_bch'
        },
        ethereum: {
            bitcoin: 'eth_btc',
            litecoin: 'eth_ltc',
            bitcoinCash: 'eth_bch'
        },
        bitcoinCash: {
            ethereum: 'bch_eth',
            bitcoin: 'bch_btc',
            litecoin: 'bch_ltc'
        }
    },
    getExchangeLimit: async (pair) => {
        return await rp.get(`https://shapeshift.io/marketinfo/${pair}`);
    },
    investment: {
        getExchangeAddress: async (address, pair, depositAmount, returnAddress) => {
            let options = {
                method: 'POST',
                uri: 'https://cors.shapeshift.io/sendamount',
                body: {
                    "pair": pair,
                    "withdrawal": address,
                    "returnAddress": returnAddress,
                    "depositAmount": depositAmount
                },
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer 6JfWAYybTiFEccXPytuhHqgPQYHy8KgsSU5VjXxVCqDZ'
                },
                json: true
            };

            return await rp.post(options);
        },
        getOrderInfo: (orderId) => {
            let options = {
                method: 'POST',
                uri: `https://cors.shapeshift.io/orderInfo/${orderId}`,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer 6JfWAYybTiFEccXPytuhHqgPQYHy8KgsSU5VjXxVCqDZ'
                },
                json: true
            };

            return rp.get(options);
        },
        getAllExchangeLimits: (currency) => {
            const pairs = Object.keys(ShapeShift.pairs[currency]);

            const requests$ = pairs.map(currencyAfterChange => ShapeShift.getExchangeLimit(ShapeShift.pairs[currency][currencyAfterChange]).catch(() => {
                throw Error('Failed to get all exchange rates')
            }));

            return Promise.all(requests$).then(results => zipObject(pairs, results)).catch(() => {
                throw Error('Failed to get all exchange rates')
            });
        },
        getAllExchangeAddresses: async (addresses, currency, returnAddress) => {
            const pairs = Object.keys(ShapeShift.pairs[currency]);

            const requests$ = pairs.map(currencyAfterChange => ShapeShift.investment.getExchangeAddress(addresses[currencyAfterChange], ShapeShift.pairs[currency][currencyAfterChange], returnAddress).catch(() => {
                throw Error('Failed to get exchange address')
            }));

            return Promise.all(requests$).then(results => zipObject(pairs, results)).catch(() => {
                throw Error('Failed to get exchange address')
            });
        },
    }
};

module.exports = {
    ShapeShift:ShapeShift
};
