const Markup = require('telegraf/markup');
const Extra = require('telegraf/extra');
const rp = require('../../../pvt-denver/telegram/request/request');
const Web3 = require('web3');
const guid = require('guid');
const Keyboard = require('../../../pvt-denver/telegram/keyboard/keyboard');
const Text = require('../../../pvt-denver/telegram/text');
const db = require('../db/db');
const utils = require('../../../pvt-denver/telegram/utils/utils');
const token = require('../../../pvt-denver/telegram/tokens/tokens');
require('dotenv').config({path: "./../../.env"});

const web3 = new Web3(new Web3.providers.HttpProvider(`https://ropsten.infura.io/${process.env.INFURA_TOKEN}`));

async function start(ctx) {
    const user = await db.user.find.oneByID(ctx.message.from.id);
    if (user)
        return ctx.reply(Text.keyboard.start.text, Markup
            .keyboard(Keyboard.start)
            .resize()
            .extra()
        );
    else
        return createAccount(ctx);
}

function createAccount(ctx) {
    const key = guid.create().value;

    utils.client.set(key, JSON.stringify({
        userID: ctx.message.from.id,
        nickname: ctx.message.from.username,
        lifetime: Date.now() + (utils.keyLifeTime * 1000)
    }), 'EX', utils.keyLifeTime);

    return ctx.reply(Text.inline_keyboard.create_wallet.text, Extra.markup(Keyboard.create_wallet(key)));
}


// function BZX(ctx){
//     ctx.reply("Change:", Keyboard.ordersInline)
// }

// async function Loaner(ctx){
//     const arr = await db.all.all()
//             for(let i=0;i<arr.length;i++){
//                 loanAmount = Number(arr[i].orders.loanTokenAmount) / 1e18
//                 interestAmount = Number(arr[i].orders.interestAmount) / 1e18
//                 const resp = " 🌐 Maker address : " + arr[i].orders.makerAddress +"\n 💎 Loan amount : " + String(loanAmount)+" WETH" +  "\n 🎊 Interest amount : " +  interestAmount + " WETH" + "\n ⏳ Max time : " + arr[i].orders.maxDurationUnixTimestampSec
//                 ctx.reply(resp, Extra.markup(Keyboard.orders(arr[i]["_id"])))
//         }
//         return
// }

function goToAccount(ctx) {
    return ctx.reply(Text.keyboard.account.text, Markup
        .keyboard(Keyboard.account)
        .resize()
        .extra()
    )
}

async function getAddresses(ctx) {
    const user = await db.user.find.oneByID(ctx.message.from.id);
    const text = `Ethereum address: \`\`\`${user.ethereumAddress}\`\`\``;
    return ctx.reply(text, { parse_mode: 'Markdown' });
}

function back(ctx) {
    start(ctx);
}

async function getBalances(ctx) {
    const user = await db.user.find.oneByID(ctx.message.from.id);
    const balanceETH = await web3.eth.getBalance(user.ethereumAddress);
    const tokensTickers = Object.keys(token.supportedTokens);
    const tokenAddresses = Object.values(token.supportedTokens);
    const tokenBalances = await rp.getTokenBalance(tokenAddresses, user.ethereumAddress);
    console.log(tokenBalances);
    let msg = `*Ethereum:* ${balanceETH/1e18}\n\n}`;
    let counter = 0;
    for (let ticker in tokensTickers) {
        msg += `*${ticker}:* ${Number(tokenBalances[counter])/1e18}`;
        counter++;
    }
    ctx.reply(msg, { parse_mode: 'Markdown' });
}

function createInstance(ABI, address) {
    return new web3.eth.Contract(ABI, address);
}

async function get(instance, methodName, addressFrom, parameters) {
    return await instance.methods[methodName](...parameters).call({from: addressFrom});
}

async function getBalance(tokenAddress, address) {
    const instance = createInstance(token.ABI, tokenAddress);
    return await get(instance, 'balanceOf', address, [address]);
}

module.exports = {
    start: start,
    getAddresses: getAddresses,
    goToAccount: goToAccount,
    getBalances: getBalances,
    back: back,
};
