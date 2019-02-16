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
        getExchangeAddress: async (address, pair, returnAddress) => {
            let options = {
                method: 'POST',
                uri: 'https://cors.shapeshift.io/shift',
                body: {
                    "pair": pair,
                    "withdrawal": address,
                    "returnAddress": returnAddress
                },
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer 6JfWAYybTiFEccXPytuhHqgPQYHy8KgsSU5VjXxVCqDZ'
                },
                json: true
            };

            return await rp.post(options);
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
        withdrawal: {
            getExchangeAddress: async (address, pair, amount, returnAddress) => {

                let options = {
                    method: 'POST',
                    uri: 'https://cors.shapeshift.io/sendamount',
                    body: {
                        "pair": pair,
                        "withdrawal": address,
                        "depositAmount": amount,
                        "returnAddress": returnAddress
                    },
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer 6JfWAYybTiFEccXPytuhHqgPQYHy8KgsSU5VjXxVCqDZ'
                    },
                    json: true
                };
                return await rp.post(options);

            },
            getWithdrawalAmount: async (pair, amount) => {
                let options = {
                    method: 'POST',
                    uri: 'https://cors.shapeshift.io/sendamount',
                    body: {
                        "pair": pair,
                        "depositAmount": amount,
                    },
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer 6JfWAYybTiFEccXPytuhHqgPQYHy8KgsSU5VjXxVCqDZ'
                    },
                    json: true
                };
                return await rp.post(options);
            },
            getAllExchangeLimits: async (currencyAfterChange) => {
                const _pairs = Object.keys(ShapeShift.pairs);
                const pairs = [];

                for (let i in _pairs) {
                    if (_pairs[i] != currencyAfterChange)
                        pairs.push(_pairs[i]);
                }

                const requests$ = pairs.map(currency => ShapeShift.getExchangeLimit(ShapeShift.pairs[currency][currencyAfterChange]).catch(() => {
                    throw Error('Failed to get all exchange rates')
                }));
                return Promise.all(requests$).then(results => zipObject(pairs, results)).catch(() => {
                    throw Error('Failed to get all exchange rates')
                });
            },
            getAllWithdrawalAmount: async (currencyAfterChange, amount) => {
                const _pairs = Object.keys(ShapeShift.pairs);
                const pairs = [];

                for (let i in _pairs) {
                    if (_pairs[i] != currencyAfterChange && amount[_pairs[i]] > 0)
                        pairs.push(_pairs[i]);
                }

                const requests$ = pairs.map(currency => ShapeShift.withdrawal.getWithdrawalAmount(ShapeShift.pairs[currency][currencyAfterChange], Number(amount[currency])).catch(() => {
                    throw Error('Failed to get all withdrawal amount')
                }));

                return Promise.all(requests$).then(results => zipObject(pairs, results)).catch(() => {
                    throw Error('Failed to get all withdrawal amount')
                });
            },
            getAllExchangeAddresses: async (address, currencyAfterChange, amount, returnAddress) => {
                const _pairs = Object.keys(ShapeShift.pairs);
                const pairs = [];

                for (let i in _pairs) {
                    if (_pairs[i] != currencyAfterChange)
                        pairs.push(_pairs[i]);
                }

                const requests$ = pairs.map(currency => ShapeShift.withdrawal.getExchangeAddress(address, ShapeShift.pairs[currency][currencyAfterChange], amount[currency], Currencies[currency].getAddress(returnAddress[currency])).catch(() => {
                    throw Error('Failed to get exchange address')
                }));

                return Promise.all(requests$).then(results => zipObject(pairs, results)).catch(() => {
                    throw Error('Failed to get exchange address')
                });
            }
        }
    }
};

module.exports = {
    ShapeShift:ShapeShift
};
