const Markup = require('telegraf/markup');
const Extra = require('telegraf/extra');
const Text = require('../../../pvt-denver/telegram/text.json');

const start = [
    [Text.keyboard.start.button["0"]],
    [Text.keyboard.start.button["1"]],
    [Text.keyboard.start.button["2"]],
];

const account = [
    [Text.keyboard.account.button["0"]],
    [Text.keyboard.account.button["1"]],
    [Text.back]
];

const exchange = [
    [Text.exchange.currencys["1"]]
    [Text.exchange.currencys["0"]]
];

const ordersInline = Markup.inlineKeyboard([
       Markup.callbackButton("Borrower 💰","borrower"),
       Markup.callbackButton("Loaner 💰","loaner"),
]).extra();


const create_wallet = (guid) => Markup.inlineKeyboard([
    Markup.urlButton(Text.inline_keyboard.create_wallet["0"].button, `${Text.inline_keyboard.create_wallet["0"].callback}${guid}`),
    // Markup.callbackButton('Back', 'delete')
]);

const create_transaction = (guid) => Markup.inlineKeyboard([
    Markup.urlButton(Text.inline_keyboard.send_transaction["0"].button, `${Text.inline_keyboard.send_transaction["0"].callback}${guid}`),
    // Markup.callbackButton('Back', 'delete')
]);

// const borrow = (guid) => Markup.inlineKeyboard([
//     Markup.urlButton(Text.inline_keyboard.borrow["0"].button, `${Text.inline_keyboard.borrow["0"].callback}${guid}`),
//     // Markup.callbackButton('Back', 'delete')
// ]);
//
// const orders = (guid) => Markup.inlineKeyboard([
//     Markup.urlButton(Text.inline_keyboard.order["0"].button, `${Text.inline_keyboard.order["0"].callback}${guid}`),
//     // Markup.callbackButton('Back', 'delete')
// ]);

module.exports = {
    start: start,
    create_wallet: create_wallet,
    create_transaction: create_transaction,
    account: account,
    exchange:exchange,
    // borrow:borrow,
    // orders: orders,
    ordersInline:ordersInline
};

