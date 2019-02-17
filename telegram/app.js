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
bot.hears("Open Celer Channel", (ctx) => ctx.reply("Open", Extra.markup(Keyboard.celer_send(key))));

bot.hears(Text.back, (ctx) => Handlers.back(ctx));

stage.register(scenes.mainnetETH);
stage.register(scenes.mainnetBTC);
stage.register(scenes.ExchangeScene);
stage.register(scenes.celerDeposit);
stage.register(scenes.celerWithdraw);
stage.register(scenes.tokens);
stage.register(scenes.ropstenETH);

bot.action("mainnet", ctx=>{ctx.scene.enter("mainnetETH")});
bot.action("tokens", ctx=>{ctx.scene.enter("tokens")});
bot.action("btc", ctx=>{ctx.scene.enter("mainnetBTC")});
bot.action("celerDeposit", ctx=>{ctx.scene.enter("celerDeposit")});
bot.action("celerWithdraw", ctx=>{ctx.scene.enter("celerWithdraw")});
bot.action("celer", ctx=>{ctx.scene.enter("ropstenETH")});

bot.command("exchange", ctx=> Handlers.exchange(ctx));

bot.startPolling();

