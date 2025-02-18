const minecraftServerHost = require('../utils/Fetch').getMinecraftServerInfo().host;

/* eslint-disable no-multi-str */

const startMessages = [
  (playerId) => {
    const message = `Olá, <@${playerId}>!\n\
Estou iniciando o servidor para ti. Espera só um minutinho que já te aviso aqui quando estiver tudo pronto para jogar
`;
    return { msg: message, gifUrl: 'https://tenor.com/view/minecraft-ghost-happy-rainbow-gif-14226488' };
  },
];

const alreadyOnMsgs = [
  () => {
    const message = `*Caso esteja se perguntando se o servidor está aberto, ele está :)*\nEntra lá no Minecraft com o IP **${minecraftServerHost}** e divirta-se!
`;
    return { msg: message, gifUrl: 'https://tenor.com/view/calculating-puzzled-math-confused-confused-look-gif-14677181' };
  },
];

const failMessages = [
  () => {
    const message = `:interrobang: Não sei o que aconteceu mas algo deu errado :(\n Quer tentar novamente daqui um pouco?\n\
`;
    return { msg: message, gifUrl: 'https://tenor.com/view/dont-stop-dont-give-up-kid-advice-motivation-gif-4496803' };
  },
];

module.exports = {

  getAFailureMessage: () => failMessages[Math.floor(Math.random() * failMessages.length)],

  getAStartMessage: () => startMessages[Math.floor(Math.random() * startMessages.length)],

  getAnAlreadyOnMessage: () => alreadyOnMsgs[Math.floor(Math.random() * alreadyOnMsgs.length)],

};
