const tbn = (x) => new BigNumber(x);
const tw = (x) => BigNumber.isBigNumber(x) ? x.times(1e18).integerValue() : tbn(x).times(1e18).integerValue();
const twBtc = (x) => BigNumber.isBigNumber(x) ? x.times(1e8).integerValue() : tbn(x).times(1e8).integerValue();
const fw = (x) => BigNumber.isBigNumber(x) ? x.times(1e-18).toNumber() : tbn(x).times(1e-18).toNumber();
const ABI = [{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"guy","type":"address"},{"name":"wad","type":"uint256"}],"name":"approve","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"src","type":"address"},{"name":"dst","type":"address"},{"name":"wad","type":"uint256"}],"name":"transferFrom","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"wad","type":"uint256"}],"name":"withdraw","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"balanceOf","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"dst","type":"address"},{"name":"wad","type":"uint256"}],"name":"transfer","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"deposit","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"},{"name":"","type":"address"}],"name":"allowance","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"payable":true,"stateMutability":"payable","type":"fallback"},{"anonymous":false,"inputs":[{"indexed":true,"name":"src","type":"address"},{"indexed":true,"name":"guy","type":"address"},{"indexed":false,"name":"wad","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"src","type":"address"},{"indexed":true,"name":"dst","type":"address"},{"indexed":false,"name":"wad","type":"uint256"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"dst","type":"address"},{"indexed":false,"name":"wad","type":"uint256"}],"name":"Deposit","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"src","type":"address"},{"indexed":false,"name":"wad","type":"uint256"}],"name":"Withdrawal","type":"event"}];

window.web3 =  new Web3(
    new Web3.providers.HttpProvider('https://mainnet.infura.io/1u84gV2YFYHHTTnh8uVl')
);

async function get(instance, method, parameters) {
    return await instance.methods[method](...parameters).call();
}

async function sendToken(tokenAddress, privateKey, receiver, amount) {
    const instance = getInstance(ABI, tokenAddress);
    const response = await set(instance, "transfer", privateKey, 0, [receiver, amount]);
    return response.transactionHash;
}

async function sendSigned(rawTransations) {
    if (typeof rawTransations != 'object')
        rawTransations = [rawTransations];

    const results = [];

    for (let i = 0; i < rawTransations.length; i++) {
        const transactionHash = await webSocketSend(rawTransations[i]);
        results.push(transactionHash);
    }
    return results;
}

function webSocketSend(rawTransations) {
    return new Promise((resolve, reject) => {
        web3.eth.sendSignedTransaction(rawTransations)
            .on('transactionHash', (transactionHash) => {
                resolve(transactionHash);
            })
            .on('error', (err) => {
                reject(err);
            });
    })
}

function estimateGas(instance, method, from, value, gasPrice, parameters) {
    return instance.methods[method](...parameters).estimateGas({from: from, gas: 2000000, value: value, gasPrice: gasPrice});
}

async function signTransaction(privateKey, to, value, data, gas = []) {
    const converted = toArrays(to, value, privateKey, data);
    const maxLength = converted.maxLength;
    const arrays = converted.arrays;
    const _receivers = arrays[0];
    const _values = arrays[1];
    const _privateKeys = arrays[2];

    if (isLengthError(maxLength, ...arrays))
        return new Error(`You have ${_receivers.length} receivers, ${_values.length} values and ${data.length} datas and ${_privateKeys.length} privateKeys. It should be equal.`);

    const addresses = _privateKeys.map(key => getAddress(key));

    const nonces = {};
    for (let i = 0; i < addresses.length; i++) {
        if (!nonces[addresses[i]]) {
            nonces[addresses[i]] = await web3.eth.getTransactionCount(addresses[i]);
            console.log(nonces[addresses[i]])
        }

    }

    const signedTX = [];

    for (let i = 0; i < _receivers.length; i++) {
        data = data === undefined ? [] : data[i];
        const txParam = {
            nonce: nonces[addresses[i]],
            to: _receivers[i],
            value: _values[i],
            from: addresses[i],
            data: data,
            gasPrice: tbn(await web3.eth.getGasPrice()).times(1.3).toNumber(),
            gas: gas[i] ? gas[i] : 21000
        };
        const tx = new ethereumjs.Tx(txParam);
        const privateKeyBuffer = ethereumjs.Buffer.Buffer.from(_privateKeys[i].substring(2), 'hex');
        tx.sign(privateKeyBuffer);
        const serializedTx = tx.serialize();
        signedTX.push('0x' + serializedTx.toString('hex'));
        nonces[addresses[i]]++;
    }

    return signedTX;
}

async function set(instances, methodName, privateKey, value, parameters) {
    if (
        (!isArray(methodName) && isObject(methodName)) ||
        (!isArray(privateKey) && isObject(privateKey)) ||
        (!isArray(parameters) && isObject(parameters))
    ) {
        throw new Error('Parameters must have array or string type');
    }

    const converted = toArrays(instances, methodName, privateKey);
    const arrays = converted.arrays;
    const _instances = arrays[0];
    const _methodsNames = arrays[1];
    const _privateKeys = arrays[2];
    const gas = [];

    const data = [];
    for (let i = 0; i < _methodsNames.length; i++) {
        data.push(getCallData(_instances[i], _methodsNames[i], parameters));
        gas.push(await estimateGas(_instances[i], _methodsNames[i], getAddress(_privateKeys[i]), 0, await web3.eth.getGasPrice(), parameters));
    }

    const contracts = _instances.map(instance => instance._address);

    const signedTransactions = await signTransaction(_privateKeys, contracts, 0, data, gas);
    console.log(signedTransactions);

    return await sendSigned(signedTransactions);
}

function getCallData(instance, method, parameters) {
    return instance.methods[method](...parameters).encodeABI();
}

function getInstance(ABI, address) {
    return new web3.eth.Contract(ABI, address);
}

function getAddress(privateKey) {
    let _privateKey = privateKey.substring(2, privateKey.length);
    return keythereum.privateKeyToAddress(_privateKey);
}

function getPrivateKey() {
    let params = {
        keyBytes: 32,
        ivBytes: 16
    };
    let dk = keythereum.create(params);
    return "0x" + dk.privateKey.reduce((memo, i) => {
        return memo + ('0' + i.toString(16)).slice(-2);
    }, '');
}

const _Bitcoin = (function () {
    let network = {};

    let minerFee = 2689;

    const txDataToTxHash = (txData) => Bitcore.crypto.Hash.sha256(Bitcore.crypto.Hash.sha256(HexToUint8Array(txData))).reverse().toString('hex');

    function getAddress(privateKey) { return new Bitcore.PrivateKey(privateKey).toAddress(network.get()).toString() }

    async function getBalance(address) {
        if (!Bitcore.Address.isValid(address))
            throw new Error('Entered address is invalid');
        const URL = {
            livenet: 'https://insight.bitpay.com/api/addr/' + address,
            testnet: 'https://testnet.blockexplorer.com/api/addr/' + address
        };
        try {
            const result = await query('GET', URL[network.get().name]);
            return result.balanceSat;
        } catch (e) {
            throw new Error('Can\'t get the balance. Please, check your internet connection');
        }
    }

    async function getUTXOs(address) {
        const URL = {
            livenet: 'https://insight.bitpay.com/api/addr/' + address + '/utxo',
            testnet: 'https://testnet.blockexplorer.com/api/addr/' + address + '/utxo'
        }
        try {
            const result = await query('GET', URL[network.get().name]);
            return result;
        } catch (e) {
            throw new Error('Can\'t get UTXO. Please, check your internet connection');
        }
    }

    return {

        init: function (settings, currentNetwork) {

            network = Network.init(settings, currentNetwork);

            return {

                network: network,
                account: {
                    /**
                     * Allows to create new private key
                     * @returns Private key
                     */
                    create: () => {
                        return new Bitcore.PrivateKey(network.get()).toString();
                    },
                    /**
                     * Allows to get address from private key
                     * @param privateKey
                     * @returns {*} Address
                     */
                    getAddress: getAddress
                },
                balance: {
                    /**
                     * Allows to get address balance
                     * @param address Address
                     * @returns {Promise<*>} Balance (don't forget about 1e18)
                     */
                    getBalance: getBalance,
                    /**
                     * Allows to get all unspent transaction outputs
                     * @param address User address
                     * @return {Promise<*|Array>} Array of UTXOs
                     */
                    getUTXOs: getUTXOs
                },
                transactions: {
                    /**
                     * Allows to sign transaction
                     * @param {Array|String} privateKey
                     * @param {Array|String} to
                     * @param {Number} amount
                     * @param orderType Count of future outputs 1 or any
                     * @return {Promise<Array>} Hex data of signed transaction
                     */
                    signTransaction: async (privateKey, to, amount, orderType = 'any') => {
                        if (isArray(privateKey) && hasDuplicates(privateKey))
                            throw new Error('Private Keys cannot be duplicated');

                        const convertedArray = toArrays(privateKey, to, amount);
                        const arrays = convertedArray.arrays;
                        const _privateKey = arrays[0];
                        const _to = arrays[1];
                        const _amount = arrays[2];

                        if (isLengthError(convertedArray.maxLength, ...arrays))
                            throw new Error(`Count of 'privateKey' is ${_privateKey.length}. Count of 'to' is ${_to.length}. Count of 'amount' is ${_amount.length}. But it should be equal.`);

                        const values = {};
                        const utxos = {};

                        for (let i = 0; i < _privateKey.length; i++) {
                            const tx_value = _amount[i];
                            const address = getAddress(_privateKey[i]);
                            if (utxos[address] === undefined)
                                utxos[address] = await getUTXOs(address);
                            values[address] = values[address] !== undefined ? tbn(values[address]).plus(tx_value).toNumber() : tx_value;
                        }

                        for (let address in values) {
                            const balance = await getBalance(address);
                            const spendValue = tbn(values[address]).plus(minerFee);
                            if (spendValue.gt(balance))
                                throw new Error(`Sending value is ${fw(spendValue)}. Balance of ${address} is ${fw(balance)}`);
                        }

                        const signedTransactions = [];

                        const __privateKey = new Bitcore.PrivateKey(_privateKey[0]);
                        const senderAddress = getAddress(__privateKey);
                        if (orderType != 1) {
                            const tx = new Bitcore.Transaction();
                            const totalValue = totalAmount(_amount);
                            let currentUTXOValue = 0;
                            let inputs = utxos[senderAddress];

                            inputs = inputs.sort(dynamicSort('-amount'));
                            for (let i in inputs) {
                                const utxoValue = twBtc(inputs[i].amount).toNumber();
                                const input = {
                                    "txId": inputs[i].txid,
                                    "vout": inputs[i].vout,
                                    "address": senderAddress.toString(),
                                    "scriptPubKey": inputs[i].scriptPubKey,
                                    "satoshis": utxoValue
                                };
                                tx.from(input);
                                currentUTXOValue = tbn(currentUTXOValue).plus(utxoValue);
                                if (isTxComplete(currentUTXOValue.toNumber(), totalValue))
                                    break;
                            }
                            _to.forEach((recieverAddress, index) => tx.to(recieverAddress, _amount[index]));
                            tx.fee(minerFee);
                            tx.change(senderAddress);
                            tx.sign(__privateKey);
                            signedTransactions.push(tx.toString());
                        } else {
                            let futureUTXOs = [];
                            for (let j in _to) {
                                const tx = new Bitcore.Transaction();
                                const totalValue = _amount[j];
                                let currentUTXOValue = 0;
                                let inputs = futureUTXOs.length === 0 ? utxos[senderAddress] : futureUTXOs;
                                inputs = inputs.sort(dynamicSort('-amount'));
                                for (let i = 0; i < inputs.length; i++) {
                                    const utxoValue = inputs[i].amount ? twBtc(inputs[i].amount).toNumber() : inputs[i].satoshis;
                                    const txId = futureUTXOs.length != 0 ? txDataToTxHash(signedTransactions[signedTransactions.length - 1]) : inputs[i].txid;
                                    const input = {
                                        "txId": txId,
                                        "vout": inputs[i].vout,
                                        "address": senderAddress.toString(),
                                        "scriptPubKey": inputs[i].scriptPubKey,
                                        "satoshis": utxoValue
                                    };
                                    tx.from(input);
                                    inputs = clean(inputs, inputs[i]);
                                    i--;
                                    currentUTXOValue = tbn(currentUTXOValue).plus(utxoValue);
                                    const remainValue = isTxComplete(currentUTXOValue.toNumber(), totalValue);
                                    if (remainValue - minerFee > 0) {
                                        futureUTXOs = [];
                                        const satoshis = tbn(input.satoshis).minus(minerFee).minus(_amount[j]).toNumber();
                                        if (satoshis < 0)
                                            break;
                                        futureUTXOs.push(...inputs);
                                        const output = {
                                            "address": senderAddress,
                                            "satoshis": satoshis,
                                            "scriptPubKey": input.scriptPubKey,
                                            "vout": input.vout,
                                        };
                                        futureUTXOs.push(output);
                                        break;
                                    }

                                }
                                tx.to(_to[j], _amount[j]);
                                tx.fee(minerFee);
                                tx.change(senderAddress);
                                tx.sign(__privateKey);
                                signedTransactions.push(tx.toString());
                            }
                        }

                        return signedTransactions;
                    },
                    /**
                     * Allows to send signed transaction to blockchain
                     * @param rawTransaction {String} Hex data of signed transaction
                     * @return {Promise<Object>} Object with tx hash
                     */
                    sendSigned: async (rawTransaction) => {
                        if (typeof rawTransaction != 'string')
                            rawTransaction = rawTransaction[0];
                        const URL = {
                            livenet: 'https://insight.bitpay.com/api/tx/send',
                            testnet: 'https://test-insight.bitpay.com/api/tx/send',
                        };
                        const data = `{\"rawtx\":\"${rawTransaction}\"}`;
                        const response = await query('POST', URL[network.get().name], data);
                        return response;
                    }
                },
                utils: {
                    minerFee: minerFee,
                    change: (newFee) => {
                        minerFee = newFee;
                    }
                }
            }

        }

    }

}());

class Blockchain {
    constructor() {
        this.getPrivateKey = getPrivateKey;
        this.getAddress = getAddress;
        this.set = set;
        this.signTransaction = signTransaction;
        this.sendSigned = sendSigned;
        this.Bitcoin = _Bitcoin;
    }
}

const Network = (function () {
    return {
        init: (setting, currentNetwork) => {
            let network =  setting[currentNetwork];

            return {
                get () { return network },
            }
        }
    }
}())

const isArray = (variable) => variable instanceof Array;
const toArray = (variable, length) => Array.from({length: length}, (v, k) => variable);
const toArrays = (...variables) => {
    const lengths = variables.map(elem => isArray(elem) ? elem.length : 1);
    const maxLength = lengths.reduce((acc, val) => val > acc ? val : acc, 0);
    const arrays = variables.map(elem => isArray(elem) ? elem : toArray(elem, maxLength));
    return {
        maxLength: maxLength,
        arrays: arrays
    };
};
const isObject = (variable) => typeof variable == 'object';
const isLengthError = (length, ...arrays) => arrays.reduce((acc, array) => acc === false && array.length === length ? false : true, false);
const totalAmount = (amountArray) => amountArray.reduce((acc, val) => acc + val);
const dynamicSort = (property) => {
    let sortOrder = 1;
    if(property[0] === "-") {
        sortOrder = -1;
        property = property.substr(1);
    }
    return function (a,b) {
        let result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
        return result * sortOrder;
    }
};
const isTxComplete = (utxoAmount, necessaryAmount) => utxoAmount >= necessaryAmount ? tbn(utxoAmount).minus(necessaryAmount).toNumber() : false;