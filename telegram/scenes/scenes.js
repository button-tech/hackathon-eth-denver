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
        const toAddress = await ShapeShift.investment.getExchangeAddress(secondCurrencyAddress, ShapeShift.pairs[currencyFrom.toLowerCase()][currencyTo.toLowerCase()], fromAddress);
        const value = JSON.stringify({
            currencyFrom: currencyFrom,
            currencyTo: currencyTo,
            fromUserID: ctx.message.from.id,
            fromAddress: fromAddress,
            toAddress: toAddress.deposit,
            amount: amountFrom,
            // amountInUSD: ctx.session.isToken ? '0.000002' : amountInUsd,
            lifetime: Date.now() + (utils.keyLifeTime * 1000),
        });

        const key = guid.create().value;
        console.log(value)

        utils.client.set(key, value, 'EX', utils.keyLifeTime);

        ctx.reply("**First** currency :" + ctx.wizard.state.firstCurrency +"\n**Second** currency: " + ctx.wizard.state.secondCurrency+"\nSum:"
            + amountFrom, Extra.markup(Keyboard.create_exchange_transaction(key)));

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

module.exports = {
    ExchangeScene:ExchangeScene,
    mainnetETH:mainnetETH,
    mainnetBTC: mainnetBTC
};
