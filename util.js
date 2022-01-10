module.change_code = 1;
const settings = require("./settings.json");

module.exports = {
	getCommand: getCommand,
	getOptions: getOptions,
	getSender: getSender,
	formatArgument: formatArgument
};

function getCommand(msg){
	let command = msg.body.match(/^![^!\s]+/);
	return command?command[0]:false;
}

function getOptions(msg){
	let options = msg.body.match(/(?:[^\s"]+|"[^"]*")+/g);
	if(options){
		options.shift();
		for(let i = 0; i < options.length; i++){
			options[i] = options[i].replace(/"/g,'');
		}
	}
	return options;
}

async function getSender(msg){
	return await msg.getContact();
}

function formatArgument(str){
	return str.replace("\n\n","\n");
}