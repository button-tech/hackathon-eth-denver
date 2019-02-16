const Markup = require('telegraf/markup');
const Extra = require('telegraf/extra');
const rp = require('../request/request');
const guid = require('guid');
const Keyboard = require('./../keyboard/keyboard');
const Text = require('./../text');
const db = require('./../db/db');
const utils = require('./../utils/utils');
const token = require('./../tokens/tokens');
require('dotenv').config({path: "./../../.env"});

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

function sendTx(ctx) {
    return ctx.reply("Change", Keyboard.txVariants)
}

function celerChange(ctx) {
    return ctx.reply(Text.inline_keyboard.celer.text, Extra.markup(Keyboard.celerInline()))
}

function goToAccount(ctx) {
    return ctx.reply(Text.keyboard.account.text, Markup
        .keyboard(Keyboard.account)
        .resize()
        .extra()
    )
}

async function getAddresses(ctx) {
    const user = await db.user.find.oneByID(ctx.message.from.id);
    const text = `Ethereum address: \`\`\`${user.ethereumAddress}\`\`\`` + `\n\nBitcoin address: \`\`\`${user.bitcoinAddress}\`\`\``;
    return ctx.reply(text, { parse_mode: 'Markdown' });
}

function back(ctx) {
    start(ctx);
}

async function getBalances(ctx) {
    const user = await db.user.find.oneByID(ctx.message.from.id);
    const balanceETHRopsten = await utils.web3Ropsten.eth.getBalance(user.ethereumAddress);
    const balanceETHMain = await utils.web3Mainnet.eth.getBalance(user.ethereumAddress);
    const tokensTickers = Object.keys(token.supportedTokens);
    const tokenAddresses = Object.values(token.supportedTokens);
    const tokenBalances = await rp.getTokenBalance(tokenAddresses, user.ethereumAddress);
    console.log(tokenBalances);
    let msg = `*Mainnet Ethereum:* ${balanceETHMain/1e18} or ${(Number(await utils.course.convert("ETH", "USD", balanceETHMain/1e18)))}$ \n\n*Ropsten Ethereum:* ${balanceETHRopsten/1e18} or ${(Number(await utils.course.convert("ETH", "USD", balanceETHRopsten/1e18)))}$\n\n*BTC:* 0\n\n`;
    let counter = 0;
    for (let i in tokensTickers) {
        msg += `*${tokensTickers[i]}:* ${Number(tokenBalances[counter])/1e18}\n\n`;
        counter++;
    }
    ctx.reply(msg, { parse_mode: 'Markdown' });
}

function createInstance(ABI, address) {
    return new utils.web3Mainnet.eth.Contract(ABI, address);
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
    sendTx:sendTx,
    celerChange:celerChange
};
