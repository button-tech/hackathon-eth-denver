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
bot.hears(Text.keyboard.start.button["3"], (ctx)=>Handlers.celerChange(ctx));
bot.hears(Text.keyboard.account.button["0"], (ctx) => Handlers.getAddresses(ctx));
bot.hears(Text.keyboard.account.button["1"], (ctx) => Handlers.getBalances(ctx));

bot.hears(Text.back, (ctx) => Handlers.back(ctx));

stage.register(scenes.mainnetETH);
stage.register(scenes.ExchangeScene);

bot.action("mainnet", ctx=>{ctx.scene.enter("mainnetETH")});
bot.action("celar", ctx=>{ctx.scene.enter("mainnetETH")});

bot.startPolling();

