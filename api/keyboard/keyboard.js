const Text = require('../text');

const start = [
    [Text.keyboard.start.button["0"],  Text.keyboard.start.button["1"]],
    [Markup.urlButton("🐃 BUFF QR", `https://dazzling-gates-70947e.netlify.com?tx=${guid.create().value}`)],
    [Text.keyboard.start.button["2"]],
    [Text.keyboard.start.button["3"]]
];

const openCelerChannel = {

};

module.exports = {
    start: start,
    openCelerChannel: openCelerChannel
};