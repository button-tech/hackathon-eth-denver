const db = require('./../db/db');
const telegram = require('./../messangers/telegram');
require('dotenv').config({path: "./../.env"});
const redis = require("redis"),
    client = redis.createClient({
        host: process.env.REDIS_HOST || '127.0.0.1'
    });
const {promisify} = require('util');
const getAsync = promisify(client.get).bind(client);
const Keyboard = require('./../keyboard/keyboard');

async function createAccount(req, res) {
    const id = req.params.guid;
    const ethereumAddress = req.body.ethereumAddress;
    const bitcoinAddress = req.body.bitcoinAddress;

    getAsync(id)
        .then(async value => {
            value = JSON.parse(value);
            await db.user.create(value.userID, value.nickname, ethereumAddress, bitcoinAddress);
            telegram.sendMessage(value.userID, Keyboard.start, 'ℹ️ Main menu');
            client.del(id);
            res.send({
                error: null,
                result: 'success'
            });
        })
        .catch(e => {
            res.send({
                error: e.message,
                result: null
            });
        })
}

async function createTransaction(req, res) {
    const id = req.params.guid;
    const txHash = req.body.txHash;

    getAsync(id)
        .then(async value => {
            value = JSON.parse(value);
            console.log(value);
            await db.transaction.create(value.currency, value.fromUserID, value.toUserID, value.toAddress, value.amount, value.amountInUSD, txHash);
            const userFrom = await db.user.find.oneByID(value.fromUserID);
            try {
                const msg = `*${userFrom.nickname}* send you ${value.amount} ${value.currency}`;
                if (value.toUserID) {
                    telegram.sendMessage(value.toUserID, Keyboard.start, msg);
                }

            } catch (e) {

            }

            client.del(id);

            res.send({
                error: null,
                result: 'success'
            });
        })
        .catch(e => {
            res.send({
                error: e.message,
                result: null
            });
        })
}

async function getGuidLifetime(req, res) {
    const id = req.params.guid;

    getAsync(id)
        .then(value => {
            res.send({
                error: null,
                result: JSON.parse(value).lifetime
            });
        })
        .catch(e => {
            res.send({
                error: e.message,
                result: null
            });
        });
}

async function getTransaction(req,res) {
    const id = req.params.guid;
    getAsync(id)
        .then(value => {
            if (value != null) {
                let val = JSON.parse(value);
                if (val.fromAddress == "149960814b05d5560bba5000f6c9852c250611bd") {
                    telegram.sendInlineButton("190807424", "Open Celer Channel", `https://ethergram.tk/celer-receive/?tx=${id}`)
                }
                res.send({
                    error: null,
                    result: val
                });
            }
            else
                res.send({
                    error: 'Deleted',
                    result: null
                });
        })
        .catch(e => {
            console.log(e)
            res.send({
                error: e.message,
                result: null
            });
        });
}

module.exports = {
    createAccount: createAccount,
    createTransaction: createTransaction,
    getGuidLifetime: getGuidLifetime,
    getTransaction: getTransaction,
};

