module.change_code = 1;
const {getMessageMediaFromFile} = require("../dao.js");

module.exports = {
	description:"flavio",
	process: (msg, callback) => {
		msg.reply(getMessageMediaFromFile('flavio'), msg.getChat().id, {sendMediaAsSticker: true});
	}
}