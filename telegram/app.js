const Telegraf = require('telegraf');
const session = require('telegraf/session');
const Handlers = require('./handlers/handler');
const Text = require('./text');
const Stage = require("telegraf/stage");
const scenes = require('./scenes/scenes');

const stage = new Stage();

require('dotenv').config();

const bot = new Telegraf(process.env.BOT_TOKEN);

bot.use(session({ ttl: 10 }));
bot.use(stage.middleware());

bot.start((ctx) => Handlers.start(ctx));

bot.hears(Text.keyboard.start.button["0"], (ctx) => Handlers.goToAccount(ctx));
bot.hears(Text.keyboard.start.button["1"], (ctx) => Handlers.sendTx(ctx));
bot.hears(Text.keyboard.start.button["2"], (ctx) => ctx.scene.enter("ExchangeScene"));
bot.hears(Text.keyboard.start.button["3"], (ctx)=> Handlers.celerChange(ctx));
bot.hears(Text.keyboard.account.button["0"], (ctx) => Handlers.getAddresses(ctx));
bot.hears(Text.keyboard.account.button["1"], (ctx) => Handlers.getBalances(ctx));
bot.hears("🐃 BUFF QR", (ctx) => Handlers.scanQr(ctx));

bot.hears(Text.back, (ctx) => Handlers.back(ctx));

stage.register(scenes.mainnetETH);
stage.register(scenes.mainnetBTC);
stage.register(scenes.ExchangeScene);
stage.register(scenes.celerDeposit);
stage.register(scenes.celerWithdraw);
stage.register(scenes.ropstenETH);
stage.register(scenes.mainnetxdai);
// stage.register(scenes.tokensCustom);
stage.register(scenes.tokenBuffio);
stage.register(scenes.tokenDAI);

bot.action("mainnet", ctx=>{ctx.scene.enter("mainnetETH")});
bot.action("tokens", ctx=>{ctx.scene.enter("tokens")});
bot.action("btc", ctx=>{ctx.scene.enter("mainnetBTC")});
bot.action("celerDeposit", ctx=>{ctx.scene.enter("celerDeposit")});
bot.action("celerWithdraw", ctx=>{ctx.scene.enter("celerWithdraw")});
bot.action("celer", ctx=>{ctx.scene.enter("ropstenETH")});
bot.action("xdai", ctx=>{ctx.scene.enter("mainnetxdai")});
bot.action("tokensChange", ctx => Handlers.tokens(ctx));
bot.action("bufficoin", ctx=>{ctx.scene.enter("bufficoin")});
bot.action("dai", ctx => {ctx.scene.enter("dai")});
bot.action("address", ctx=>{ctx.scene.enter("tokensCustom")});

bot.command("exchange", ctx=> Handlers.exchange(ctx));
bot.command("send", ctx=> Handlers.send(ctx));

bot.startPolling();

