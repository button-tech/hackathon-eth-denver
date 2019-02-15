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
        const settings = {
            "async": true,
            "crossDomain": true,
            "url": `https://shapeshift.io/marketinfo/${pair}`,
            "method": "GET",
            "headers": {

            }
        };

        try {
            let limit = await $.ajax(settings);
            let limitObject = {
                minimal: limit.minimum,
                maximum: limit.limit,
                exchangeRate: limit.rate,
                fee: limit.minerFee
            };
            return limitObject;
        } catch (e) {
            throw e;
        }
    },
    investment: {
        getExchangeAddress: async (address, pair, returnAddress) => {

            var settings = {
                "async": true,
                "crossDomain": true,
                "url": "https://cors.shapeshift.io/shift",
                "method": "POST",
                "headers": {
                    "Content-Type": "application/json"
                },
                "processData": false,
                "data": JSON.stringify({
                    pair: pair,
                    withdrawal: address,
                    returnAddress: returnAddress
                })
            };

            try {
                let response = await $.ajax(settings);
                if (response.error)
                    return Error(response.error);
                return response.deposit;
            } catch (e) {
                throw e;
            }
        },
        getAllExchangeLimits: async (currency) => {
            const pairs = Object.keys(ShapeShift.pairs[currency]);

            const requests$ = pairs.map(currencyAfterChange => ShapeShift.getExchangeLimit(ShapeShift.pairs[currency][currencyAfterChange]).catch(e => {
                throw Error('Failed to get all exchange rates')
            }));

            return Promise.all(requests$).then(results => Utils.zip2obj(pairs, results)).catch(err => {
                throw Error('Failed to get all exchange rates')
            });
        },
        getAllExchangeAddresses: async (addresses, currency, returnAddress) => {
            const pairs = Object.keys(ShapeShift.pairs[currency]);

            const requests$ = pairs.map(currencyAfterChange => ShapeShift.investment.getExchangeAddress(addresses[currencyAfterChange], ShapeShift.pairs[currency][currencyAfterChange], returnAddress).catch(e => {
                throw Error('Failed to get exchange address')
            }));

            return Promise.all(requests$).then(results => Utils.zip2obj(pairs, results)).catch(err => {
                throw Error('Failed to get exchange address')
            });
        },
    },
    withdrawal: {
        getExchangeAddress: async (address, pair, amount, returnAddress) => {
            var settings = {
                "async": true,
                "crossDomain": true,
                "url": "https://cors.shapeshift.io/sendamount",
                "method": "POST",
                "headers": {
                    "Content-Type": "application/json"
                },
                "processData": false,
                "data": JSON.stringify({
                    withdrawal: address,
                    pair: pair,
                    depositAmount: amount,
                    returnAddress: returnAddress
                })
            }

            try {
                let response = await $.ajax(settings);
                if (response.error)
                    return Error(response.error);
                return {
                    address: response.success.deposit,
                    finalAmount: response.success.withdrawalAmount
                };
            } catch (e) {
                throw e;;
            }
        },
        getWithdrawalAmount: async (pair, amount) => {
            var settings = {
                "async": true,
                "crossDomain": true,
                "url": "https://cors.shapeshift.io/sendamount",
                "method": "POST",
                "headers": {
                    "Content-Type": "application/json"
                },
                "processData": false,
                "data": JSON.stringify({
                    pair: pair,
                    depositAmount: amount
                })
            }

            try {
                let response = await $.ajax(settings);
                if (response.error)
                    return Error(response.error);
                return response.success.withdrawalAmount;
            } catch (e) {
                throw e;;
            }
        },
        getAllExchangeLimits: async (currencyAfterChange) => {
            const _pairs = Object.keys(ShapeShift.pairs);
            const pairs = [];

            for (let i in _pairs) {
                if (_pairs[i] != currencyAfterChange)
                    pairs.push(_pairs[i]);
            }

            const requests$ = pairs.map(currency => ShapeShift.getExchangeLimit(ShapeShift.pairs[currency][currencyAfterChange]).catch(e => {
                throw Error('Failed to get all exchange rates')
            }));
            return Promise.all(requests$).then(results => Utils.zip2obj(pairs, results)).catch(err => {
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

            const requests$ = pairs.map(currency => ShapeShift.withdrawal.getWithdrawalAmount(ShapeShift.pairs[currency][currencyAfterChange], Number(amount[currency])).catch(e => {
                throw Error('Failed to get all withdrawal amount')
            }));

            return Promise.all(requests$).then(results => Utils.zip2obj(pairs, results)).catch(err => {
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

            const requests$ = pairs.map(currency => ShapeShift.withdrawal.getExchangeAddress(address, ShapeShift.pairs[currency][currencyAfterChange], amount[currency], Currencies[currency].getAddress(returnAddress[currency])).catch(e => {
                throw Error('Failed to get exchange address')
            }));

            return Promise.all(requests$).then(results => Utils.zip2obj(pairs, results)).catch(err => {
                throw Error('Failed to get exchange address')
            });
        },

    },
};
