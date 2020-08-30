const minecraftServerHost = require('../utils/Fetch').getMinecraftServerInfo().host;

/* eslint-disable no-multi-str */

const startMessages = [
  (playerId) => {
    const message = `Oopa! <@${playerId}> wants to play!\n\
Hang on there while I start the server up..
`;
    return { msg: message, gifUrl: 'https://tenor.com/view/hololive-fubuki-loading-gif-18008963' };
  },
  (playerId) => {
    const message = `Howdy, <@${playerId}>!\n\
I am starting up the server for you
`;
    return { msg: message, gifUrl: 'https://tenor.com/view/minecraft-ghost-happy-rainbow-gif-14226488' };
  },
  (playerId) => {
    const message = `As you wish, <@${playerId}> you asked and I do it!\n\
Hang on there while I start the server up for you to play..
`;
    return { msg: message, gifUrl: 'https://tenor.com/view/shipping-get-rewady-anticipation-stickergiant-on-its-way-gif-13025287' };
  },

  (playerId) => {
    const message = `<@${playerId}> used their powers invoke me!\n\
I will now go ahead and wake up the server already..
`;
    return { msg: message, gifUrl: 'https://tenor.com/view/family-guy-stewie-griffin-ihave-the-power-work-out-lift-gif-4651272' };
  },

  (playerId) => {
    const message = `Waky waky! <@${playerId}> wants to play!\n\
    The server will start in a glimpse..
`;
    return { msg: message, gifUrl: 'https://tenor.com/view/now-dammit-skeletor-gif-13398390' };
  },

  (playerId) => {
    const message = `What took you so damn long?? <@${playerId}>\n \
It's about time to start this server already!
`;
    return { msg: message, gifUrl: 'https://tenor.com/view/judge-judy-now-bitch-gif-13767950' };
  },

  (playerId) => {
    const message = `Yuuupi! Glad to hear that!! <@${playerId}> wants to play on the server\n\
I am starting everything...
`;
    return { msg: message, gifUrl: 'https://tenor.com/view/minecraft-ghost-happy-rainbow-gif-14226488' };
  },

  (playerId) => {
    const message = `Thumbs up to <@${playerId}> who wants to play some minecraft!\n\
I am up the server, hang on just a sec...
`;
    return { msg: message, gifUrl: 'https://tenor.com/view/sponge-bob-thumbs-up-ok-smile-gif-12038157' };
  },

  (playerId) => {
    const message = `Ok! <@${playerId}> wants to play!\n\
I will start the server up, I will tell you when it's ready to play in just a sec...
`;
    return { msg: message, gifUrl: 'https://tenor.com/view/ok-okay-gif-5307535' };
  },

  (playerId) => {
    const message = `Congratz!! <@${playerId}> wants to play!!!\n\
The server is starting up! I will tell you when it's ready to play in just a sec...
`;
    return { msg: message, gifUrl: 'https://tenor.com/view/grilla-yes-hell-thumbs-up-grills-gif-10889686' };
  },

  (playerId) => {
    const message = `Incredible!! **FABULOSO!!** <@${playerId}> wants to play some minecraft!!!\n\
The server is starting up! I will tell you when it's ready to play in just a sec...
`;
    return { msg: message, gifUrl: 'https://tenor.com/view/fabulous-throwing-glitter-awesome-fancy-gif-10927722' };
  },
];

const alreadyOnMsgs = [
  () => {
    const message = `*Just in case you're wondering if the server is online or not, it is :)*\nJust hop into **${minecraftServerHost}** and have fun!
`;
    return { msg: message, gifUrl: 'https://tenor.com/view/calculating-puzzled-math-confused-confused-look-gif-14677181' };
  },
];

const failMessages = [
  () => {
    const message = `I don't know what happened but something went wrong :(\n\
Maybe try again and I will see if I can get that fixed!
`;
    return { msg: message, gifUrl: 'https://tenor.com/view/dont-stop-dont-give-up-kid-advice-motivation-gif-4496803' };
  },
];

module.exports = {

  getAFailureMessage: () => failMessages[Math.floor(Math.random() * failMessages.length)],

  getAStartMessage: () => startMessages[Math.floor(Math.random() * startMessages.length)],

  getAnAlreadyOnMessage: () => alreadyOnMsgs[Math.floor(Math.random() * alreadyOnMsgs.length)],

};
