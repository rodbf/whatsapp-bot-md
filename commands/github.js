module.change_code = 1;
const url = "https://github.com/rodbf/whatsapp-bot";

module.exports = {
	description: "retorna o github do projeto",
	process: (msg, callback) => {
		msg.reply(url);
	}
}