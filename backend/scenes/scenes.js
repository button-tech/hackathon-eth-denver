const WizardScene = require("telegraf/scenes/wizard");
// const Markup = require('telegraf/markup');
const Extra = require('telegraf/extra');
const guid = require('guid');
const Keyboard = require('../keyboard/keyboard');
const Text = require('../../../pvt-denver/telegram/text');
const db = require('../db/db');
const utils = require('../../../pvt-denver/telegram/utils/utils');
require('dotenv').config({path: "./../../.env"});


const ExchangeScene = new WizardScene(
    'ExchangeScene',
    ctx =>{
        ctx.reply(Text.dialog.exchange["0"], Extra
            .markdown()
            .markup((m) => m.keyboard([
                m.callbackButton(Text.exchange.currencys["0"]),
                m.callbackButton(Text.exchange.currencys["1"])
            ]).resize()));

        return ctx.wizard.next();
    },ctx=>{
        ctx.wizard.state.firstCurrency = ctx.message.text;
        ctx.reply(Text.dialog.exchange["1"]);
        return ctx.wizard.next();
    },ctx=>{
        ctx.wizard.state.secondCurrency = ctx.message.text;
        ctx.reply(Text.dialog.exchange["2"]);
        return ctx.wizard.next();
    },ctx=>{
        // TODO: sign tx
        ctx.wizard.state.amount = ctx.message.text;

        // For example
        // const key = guid.create().value;
        ctx.reply("First curr :" + ctx.wizard.state.firstCurrency +"\nSecond curr: " + ctx.wizard.state.secondCurrency+"\nSum:"
            + ctx.wizard.state.amount, Extra.markup(Keyboard.create_transaction("123123213")));

        return ctx.scene.leave();
    }
);

const sendTransactionScene = new WizardScene(
    "sendTransaction", ctx => {
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

        if (currency == 'Ethereum' && web3.utils.isAddress(userTo)) {
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

module.exports = {
    ExchangeScene:ExchangeScene,
    sendTransactionScene:sendTransactionScene
};
