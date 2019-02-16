const Markup = require('telegraf/markup');
const Extra = require('telegraf/extra');
const Text = require('./../text.json');

const start = [
    [Text.keyboard.start.button["0"],  Text.keyboard.start.button["1"]],
    [Text.keyboard.start.button["2"]],
    [Text.keyboard.start.button["3"]]
];

const account = [
    [Text.keyboard.account.button["0"]],
    [Text.keyboard.account.button["1"]],
    [Text.back]
];

const exchange = [
    [Text.exchange.currencies["1"]]
    [Text.exchange.currencies["0"]]
];


const txVariants = Markup.inlineKeyboard([
    Markup.callbackButton("Mainnet Ethereum","mainnet"),
    Markup.callbackButton("Mainnet Bitcoin","btc"),
    Markup.callbackButton("Celer Ethereum","celer"),
]).extra();

const celerInline = ()=> Markup.inlineKeyboard([
    Markup.urlButton(Text.inline_keyboard.celer.deposit.button, `${Text.inline_keyboard.celer.deposit.callback}`),
    Markup.urlButton(Text.inline_keyboard.celer.withdraw.button, `${Text.inline_keyboard.celer.withdraw.callback}`)
]);

const create_wallet = (guid) => Markup.inlineKeyboard([
    Markup.urlButton(Text.inline_keyboard.create_wallet["0"].button, `${Text.inline_keyboard.create_wallet["0"].callback}${guid}`),
    // Markup.callbackButton('Back', 'delete')
]);

const create_transaction = (guid) => Markup.inlineKeyboard([
    Markup.urlButton(Text.inline_keyboard.send_transaction["0"].button, `${Text.inline_keyboard.send_transaction["0"].callback}${guid}`),
    // Markup.callbackButton('Back', 'delete')
]);

const create_exchange_transaction = (guid) => Markup.inlineKeyboard([
    Markup.urlButton(Text.inline_keyboard.exchange_transaction["0"].button, `${Text.inline_keyboard.exchange_transaction["0"].callback}${guid}`),
    // Markup.callbackButton('Back', 'delete')
]);

module.exports = {
    start: start,
    create_wallet: create_wallet,
    create_transaction: create_transaction,
    create_exchange_transaction: create_exchange_transaction,
    account: account,
    exchange:exchange,
    txVariants:txVariants,
    celerInline:celerInline,
};

