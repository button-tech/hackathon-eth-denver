const WizardScene = require("telegraf/scenes/wizard");
// const Markup = require('telegraf/markup');
const Extra = require('telegraf/extra');
const guid = require('guid');
const Keyboard = require('./../keyboard/keyboard');
const Text = require('./../text');
const db = require('./../db/db');
const utils = require('./../utils/utils');
const token = require('../tokens/tokens');
const { ShapeShift } = require('../shapeshift/shapeshift');
require('dotenv').config({path: "./../../.env"});


const ExchangeScene = new WizardScene(
    'ExchangeScene',
    ctx =>{
        ctx.reply(Text.dialog.exchange["0"], Extra
            .markdown()
            .markup((m) => m.keyboard([
                m.callbackButton(Text.exchange.currencies["0"]),
                m.callbackButton(Text.exchange.currencies["1"])
            ]).resize()));

        return ctx.wizard.next();
    },ctx=>{
        ctx.wizard.state.firstCurrency = ctx.message.text;
        ctx.reply(Text.dialog.exchange["1"]);
        return ctx.wizard.next();
    },async ctx=> {
        ctx.wizard.state.secondCurrency = ctx.message.text;
        const limits = await ShapeShift.getExchangeLimit(ShapeShift.pairs[ctx.wizard.state.firstCurrency.toLowerCase()][ctx.wizard.state.secondCurrency.toLowerCase()]);
        const ticker = utils.currency[ctx.wizard.state.firstCurrency].ticker;
        ctx.reply(
            Text.dialog.exchange["2"] +
            "\nMinimum: " + JSON.parse(limits).minimum + " " + ticker +
            "\nMaximum: " + JSON.parse(limits).maxLimit + " " + ticker
        );
        return ctx.wizard.next();
    },
    async ctx=> {
        const currencyFrom = ctx.wizard.state.firstCurrency;
        const currencyTo = ctx.wizard.state.secondCurrency;
        const amountFrom = ctx.message.text;


        const user = await db.user.find.oneByID(ctx.message.from.id);
        const fromAddress = user[`${currencyFrom.toLowerCase()}Address`];
        const secondCurrencyAddress = (Object.keys(token.supportedTokens)).indexOf(currencyTo) == -1 ? user[`${currencyTo.toLowerCase()}Address`] : user[`ethereumAddress`];
        console.log(secondCurrencyAddress)
        const toAddress = await ShapeShift.investment.getExchangeAddress(secondCurrencyAddress, ShapeShift.pairs[currencyFrom.toLowerCase()][currencyTo.toLowerCase()], amountFrom, fromAddress);
        const value = JSON.stringify({
            currencyFrom: currencyFrom,
            currencyTo: currencyTo,
            fromUserID: ctx.message.from.id,
            fromAddress: fromAddress,
            toAddress: toAddress.success.deposit,
            amount: amountFrom,
            receiveAmount: toAddress.success.withdrawalAmount,
            amountInUSD: await utils.course.convert(utils.currency[currencyFrom].ticker, "USD", amountFrom),
            lifetime: Date.now() + (utils.keyLifeTime * 1000),
        });

        const key = guid.create().value;

        utils.client.set(key, value, 'EX', utils.keyLifeTime);

        ctx.reply("Deposit Sum: "
            + amountFrom + " " + utils.currency[currencyFrom].ticker+"\nReceive Sum: "
            + toAddress.success.withdrawalAmount + " " + utils.currency[currencyTo].ticker, Extra.markup(Keyboard.create_exchange_transaction(key)));

        return ctx.scene.leave();
    }
);

const mainnetETH = new WizardScene(
    "mainnetETH", ctx => {
        ctx.session.currency = "Ethereum";
        ctx.reply(Text.dialog.sendTransaction["2"]);
        return ctx.wizard.next()
    },
    ctx => {
        ctx.session.to = ctx.message.text;
        ctx.reply(Text.dialog.sendTransaction["3"]);
        return ctx.wizard.next()
    },
    async ctx => {
        const tickerFrom = "ETH";
        const currency = ctx.session.currency;
        let amount;
        let amountInUsd;
        if (ctx.message.text.indexOf("$") >= 0) {
            amountInUsd = ctx.message.text.substring(0, ctx.message.text.length-1);
            amount = (Number(await utils.course.convert("USD", tickerFrom, amountInUsd)));
        } else {
            amount = ctx.message.text;
            amountInUsd = Number((await utils.course.convert(tickerFrom, "USD", amount)).toFixed(2));
        }
        console.log(amountInUsd);
        const key = guid.create().value;

        const userTo = ctx.session.to;

        let toUserID;
        let toAddress;
        let checker = false;
        let fromAddress;

        const user = await db.user.find.oneByID(ctx.message.from.id);
        fromAddress = user[`ethereumAddress`];

        if (currency == 'Ethereum' && utils.web3Mainnet.utils.isAddress(userTo)) {
            toAddress = userTo;
        } else {
            let to = ctx.session.to;
            if (to.match('@')) {
                to = to.substring(1);
            }
            const user = await db.user.find.oneByNickname(to);
            if (user) {
                toUserID = user.userID;
                toAddress = user.ethereumAddress;
                checker = true;
            } else {
                ctx.reply("User not defined");
                return ctx.scene.leave();
            }
        }

        const value = JSON.stringify({
            currency: currency,
            fromUserID: ctx.message.from.id,
            toUserID: toUserID ? toUserID : 'null',
            fromAddress: fromAddress,
            toNickname: checker ? ctx.session.to : '',
            toAddress: toAddress,
            amount: amount,
            amountInUSD: ctx.session.isToken ? '0.000002' : amountInUsd,
            lifetime: Date.now() + (utils.keyLifeTime * 1000),
        });

        utils.client.set(key, value, 'EX', utils.keyLifeTime);
        console.log(value);
        ctx.reply(Text.inline_keyboard.send_transaction.text, Extra.markup(Keyboard.create_transaction(key)));

        return ctx.scene.leave();
    }
);

const tokenDAI = new WizardScene(
   "dai", ctx=>{
        ctx.session.currency = 'DAI';
        ctx.reply(Text.dialog.sendTokens.dai["0"]);
        return ctx.wizard.next()
    },
        ctx => {
            ctx.session.to = ctx.message.text;
            ctx.reply(Text.dialog.sendTokens.dai["1"]);
            return ctx.wizard.next()
        },
        async ctx => {
            const tickerFrom = "DAI";
            const currency = ctx.session.currency;
            let amount;
            let amountInUsd;
            if (ctx.message.text.indexOf("$") >= 0) {
                amountInUsd = ctx.message.text.substring(0, ctx.message.text.length-1);
                amount = (Number(await utils.course.convert("USD", tickerFrom, amountInUsd)));
            } else {
                amount = ctx.message.text;
                amountInUsd = Number((await utils.course.convert(tickerFrom, "USD", amount)).toFixed(2));
            }
            console.log(amountInUsd);
            const key = guid.create().value;

            const userTo = ctx.session.to;

            let toUserID;
            let toAddress;
            let checker = false;
            let fromAddress;

            const user = await db.user.find.oneByID(ctx.message.from.id);
            fromAddress = user[`ethereumAddress`];

            if (currency == 'Ethereum' && utils.web3Mainnet.utils.isAddress(userTo)) {
                toAddress = userTo;
            } else {
                let to = ctx.session.to;
                if (to.match('@')) {
                    to = to.substring(1);
                }
                const user = await db.user.find.oneByNickname(to);
                if (user) {
                    toUserID = user.userID;
                    toAddress = user.ethereumAddress;
                    checker = true;
                } else {
                    ctx.reply("User not defined");
                    return ctx.scene.leave();
                }
            }

            const value = JSON.stringify({
                currency: currency,
                fromUserID: ctx.message.from.id,
                toUserID: toUserID ? toUserID : 'null',
                fromAddress: fromAddress,
                toNickname: checker ? ctx.session.to : '',
                toAddress: toAddress,
                amount: amount,
                amountInUSD: ctx.session.isToken ? '0.000002' : amountInUsd,
                lifetime: Date.now() + (utils.keyLifeTime * 1000),
            });

            utils.client.set(key, value, 'EX', utils.keyLifeTime);
            console.log(value);
            ctx.reply(Text.inline_keyboard.send_transaction.text, Extra.markup(Keyboard.create_transaction(key)));

            return ctx.scene.leave();
        }
    );

const tokenBuffio = new WizardScene(
    "bufficoin", ctx=>{
        ctx.reply(Text.dialog.sendTokens.buffio["0"]);
        return ctx.wizard.next()
    },
    ctx => {
        ctx.session.to = ctx.message.text;
        ctx.reply(Text.dialog.sendTokens.buffio["1"]);
        return ctx.wizard.next()
    },
    async ctx => {
        const tickerFrom = "ETH";
        const currency = ctx.session.currency;
        let amount;
        let amountInUsd;
        if (ctx.message.text.indexOf("$") >= 0) {
            amountInUsd = ctx.message.text.substring(0, ctx.message.text.length-1);
            amount = (Number(await utils.course.convert("USD", tickerFrom, amountInUsd)));
        } else {
            amount = ctx.message.text;
            amountInUsd = Number((await utils.course.convert(tickerFrom, "USD", amount)).toFixed(2));
        }
        console.log(amountInUsd);
        const key = guid.create().value;

        const userTo = ctx.session.to;

        let toUserID;
        let toAddress;
        let checker = false;
        let fromAddress;

        const user = await db.user.find.oneByID(ctx.message.from.id);
        fromAddress = user[`ethereumAddress`];

        if (currency == 'Ethereum' && utils.web3Mainnet.utils.isAddress(userTo)) {
            toAddress = userTo;
        } else {
            let to = ctx.session.to;
            if (to.match('@')) {
                to = to.substring(1);
            }
            const user = await db.user.find.oneByNickname(to);
            if (user) {
                toUserID = user.userID;
                toAddress = user.ethereumAddress;
                checker = true;
            } else {
                ctx.reply("User not defined");
                return ctx.scene.leave();
            }
        }

        const value = JSON.stringify({
            currency: currency,
            fromUserID: ctx.message.from.id,
            toUserID: toUserID ? toUserID : 'null',
            fromAddress: fromAddress,
            toNickname: checker ? ctx.session.to : '',
            toAddress: toAddress,
            amount: amount,
            amountInUSD: ctx.session.isToken ? '0.000002' : amountInUsd,
            lifetime: Date.now() + (utils.keyLifeTime * 1000),
        });

        utils.client.set(key, value, 'EX', utils.keyLifeTime);
        console.log(value);
        ctx.reply(Text.inline_keyboard.send_transaction.text, Extra.markup(Keyboard.create_transaction(key)));

        return ctx.scene.leave();
    }
);


const mainnetBTC = new WizardScene(
    "mainnetBTC", ctx => {
        ctx.session.currency = "Bitcoin";
        ctx.reply(Text.dialog.sendTransaction["2"]);
        return ctx.wizard.next()
    },
    ctx => {
        ctx.session.to = ctx.message.text;
        ctx.reply(Text.dialog.sendTransaction["3"]);
        return ctx.wizard.next()
    },
    async ctx => {
        const tickerFrom = "BTC";
        const currency = ctx.session.currency;
        let amount;
        let amountInUsd;
        if (ctx.message.text.indexOf("$") >= 0) {
            amountInUsd = ctx.message.text.substring(0, ctx.message.text.length-1);
            amount = (Number(await utils.course.convert("USD", tickerFrom, amountInUsd)));
        } else {
            amount = ctx.message.text;
            amountInUsd = Number((await utils.course.convert(tickerFrom, "USD", amount)).toFixed(2));
        }
        console.log(amountInUsd);
        const key = guid.create().value;

        const userTo = ctx.session.to;

        let toUserID;
        let toAddress;
        let checker = false;
        let fromAddress;

        const user = await db.user.find.oneByID(ctx.message.from.id);
        fromAddress = user[`bitcoinAddress`];

        if (currency == 'Bitcoin' && (currency.indexOf("1") == 0 || currency.indexOf("3") == 0)) {
            toAddress = userTo;
        } else {
            let to = ctx.session.to;
            if (to.match('@')) {
                to = to.substring(1);
            }
            const user = await db.user.find.oneByNickname(to);
            if (user) {
                toUserID = user.userID;
                toAddress = user.bitcoinAddress;
                checker = true;
            } else {
                ctx.reply("User not defined");
                return ctx.scene.leave();
            }
        }

        const value = JSON.stringify({
            currency: currency,
            fromUserID: ctx.message.from.id,
            toUserID: toUserID ? toUserID : 'null',
            fromAddress: fromAddress,
            toNickname: checker ? ctx.session.to : '',
            toAddress: toAddress,
            amount: amount,
            amountInUSD: amountInUsd,
            lifetime: Date.now() + (utils.keyLifeTime * 1000),
        });

        utils.client.set(key, value, 'EX', utils.keyLifeTime);
        console.log(value);
        ctx.reply(Text.inline_keyboard.send_transaction.text, Extra.markup(Keyboard.create_transaction(key)));

        return ctx.scene.leave();
    }
);

const celerDeposit = new WizardScene(
    "celerDeposit", ctx => {
        ctx.reply("Enter sum in ETH");
        return ctx.wizard.next()
    },
    async ctx => {
        const amount = Number(ctx.message.text);
        const user = await db.user.find.oneByID(ctx.message.from.id);
        const fromAddress = user[`ropstenAddress`];

        const key = guid.create().value;

        const value = JSON.stringify({
            sumInETH: amount,
            sumInWei: (amount*10**18).toFixed(),
            fromAddress: fromAddress
        });

        utils.client.set(key, value, 'EX', utils.keyLifeTime);
        console.log(value);
        ctx.reply(Text.inline_keyboard.celer.deposit.button, Extra.markup(Keyboard.celer_deposit(key)));

        return ctx.scene.leave();
    }
);

const celerWithdraw = new WizardScene(
    "celerWithdraw", ctx => {
        ctx.reply("Enter sum in ETH");
        return ctx.wizard.next()
    },
    async ctx => {
        const amount = Number(ctx.message.text);
        const user = await db.user.find.oneByID(ctx.message.from.id);
        const fromAddress = user[`ethereumAddress`];

        const key = guid.create().value;

        const value = JSON.stringify({
            sumInETH: amount,
            sumInWei: (amount*10**18).toFixed(),
            fromAddress: fromAddress
        });

        utils.client.set(key, value, 'EX', utils.keyLifeTime);
        console.log(value);
        ctx.reply(Text.inline_keyboard.celer.withdraw.button, Extra.markup(Keyboard.celer_withdraw(key)));

        return ctx.scene.leave();
    }
);

const ropstenETH = new WizardScene(
    "ropstenETH", ctx => {
        ctx.reply(Text.dialog.sendTransaction["2"]);
        return ctx.wizard.next()
    },
    ctx => {
        ctx.session.to = ctx.message.text;
        ctx.reply(Text.dialog.sendTransaction["3"]);
        return ctx.wizard.next()
    },
    async ctx => {
        const tickerFrom = "ETH";
        const currency = ctx.session.currency;
        let amount;
        let amountInUsd;
        if (ctx.message.text.indexOf("$") >= 0) {
            amountInUsd = ctx.message.text.substring(0, ctx.message.text.length-1);
            amount = (Number(await utils.course.convert("USD", tickerFrom, amountInUsd)));
        } else {
            amount = ctx.message.text;
            amountInUsd = Number((await utils.course.convert(tickerFrom, "USD", amount)).toFixed(2));
        }
        console.log(amountInUsd);
        const key = guid.create().value;

        const userTo = ctx.session.to;

        let toUserID;
        let toAddress;
        let checker = false;
        let fromAddress;

        const user = await db.user.find.oneByID(ctx.message.from.id);
        fromAddress = "149960814b05d5560bba5000f6c9852c250611bd";

        if (currency == 'Ethereum' && utils.web3Mainnet.utils.isAddress(userTo)) {
            toAddress = userTo;
        } else {
            let to = ctx.session.to;
            if (to.match('@')) {
                to = to.substring(1);
            }
            const user = await db.user.find.oneByNickname(to);
            if (user) {
                toUserID = user.userID;
                toAddress = user.ethereumAddress;
                checker = true;
            } else {
                ctx.reply("User not defined");
                return ctx.scene.leave();
            }
        }

        const value = JSON.stringify({
            currency: currency,
            fromUserID: ctx.message.from.id,
            toUserID: toUserID ? toUserID : 'null',
            fromAddress: fromAddress,
            toNickname: checker ? ctx.session.to : '',
            toAddress: "f6cdf7cdc1d804765c481d03ce0e545d073219d9",
            amount: amount,
            amountInUSD: ctx.session.isToken ? '0.000002' : amountInUsd,
            lifetime: Date.now() + (utils.keyLifeTime * 1000),
        });

        utils.client.set(key, value, 'EX', utils.keyLifeTime);
        console.log(value);
        ctx.reply(Text.inline_keyboard.send_transaction.text, Extra.markup(Keyboard.celer_send(key)));

        return ctx.scene.leave();
    }
);

const mainnetxdai = new WizardScene(
    "mainnetxdai", ctx => {
        ctx.session.currency = "Ethereum";
        ctx.reply(Text.dialog.sendTransaction["2"]);
        return ctx.wizard.next()
    },
    ctx => {
        ctx.session.to = ctx.message.text;
        ctx.reply(Text.dialog.sendTransaction["3"]);
        return ctx.wizard.next()
    },
    async ctx => {
        const tickerFrom = "XDAI";
        const currency = ctx.session.currency;
        let amount;
        let amountInUsd;
        if (ctx.message.text.indexOf("$") >= 0) {
            amountInUsd = ctx.message.text.substring(0, ctx.message.text.length-1);
            amount = (Number(await utils.course.convert("USD", tickerFrom, amountInUsd)));
        } else {
            amount = ctx.message.text;
            amountInUsd = Number((await utils.course.convert(tickerFrom, "USD", amount)).toFixed(2));
        }
        console.log(amountInUsd);
        const key = guid.create().value;

        const userTo = ctx.session.to;

        let toUserID;
        let toAddress;
        let checker = false;
        let fromAddress;

        const user = await db.user.find.oneByID(ctx.message.from.id);
        fromAddress = user[`ethereumAddress`];

        if (currency == 'Ethereum' && utils.web3Mainnet.utils.isAddress(userTo)) {
            toAddress = userTo;
        } else {
            let to = ctx.session.to;
            if (to.match('@')) {
                to = to.substring(1);
            }
            const user = await db.user.find.oneByNickname(to);
            if (user) {
                toUserID = user.userID;
                toAddress = user.ethereumAddress;
                checker = true;
            } else {
                ctx.reply("User not defined");
                return ctx.scene.leave();
            }
        }

        const value = JSON.stringify({
            currency: "xDAI",
            fromUserID: ctx.message.from.id,
            toUserID: toUserID ? toUserID : 'null',
            fromAddress: fromAddress,
            toNickname: checker ? ctx.session.to : '',
            toAddress: toAddress,
            amount: amount,
            amountInUSD: ctx.session.isToken ? '0.000002' : amountInUsd,
            lifetime: Date.now() + (utils.keyLifeTime * 1000),
        });

        utils.client.set(key, value, 'EX', utils.keyLifeTime);
        console.log(value);
        ctx.reply(Text.inline_keyboard.send_transaction.text, Extra.markup(Keyboard.create_transaction(key)));

        return ctx.scene.leave();
    }
);

module.exports = {
    ExchangeScene:ExchangeScene,
    mainnetETH:mainnetETH,
    mainnetBTC: mainnetBTC,
    celerDeposit: celerDeposit,
    celerWithdraw: celerWithdraw,
    ropstenETH: ropstenETH,
    mainnetxdai: mainnetxdai,
    tokenBuffio:tokenBuffio,
    tokenDAI:tokenDAI
};
