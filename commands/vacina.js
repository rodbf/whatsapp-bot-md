module.change_code = 1;
const {getOptions} = require("../util.js");
const {readFile, writeFile} = require("../dao.js");
const _file = "vacinas";

module.exports = {
	description: "lista endereços",
	options: [["<nome>", "adicionar <nome>[ <quantidade>]", "remover <nome>"]],
	process: async (msg, callback) => {
		let options = getOptions(msg);
		let json = await getJSON(msg);
		if(options[0] == "adicionar"){
			if(isNaN(options[2])){
				options[2] = 1;
			}
			if(options.length != 3){
				msg.reply("Argumentos inválidos. Exemplos de argumentos válidos:\n!vacinas adicionar \"meu nome\"\n!vacinas adicionar \"meu nome\" 3");
				return;
			}
			json.list[options[1]] = parseInt(json.list[options[1]]?json.list[options[1]]:0) + parseInt(options[2]);
			commit(msg, json);
			msg.reply("Adicionado.");
			return;
		}
		else if(options[0] == "remover"){
			if(json.list[options[1]]){
				delete json.list[options[1]];
				commit(msg, json);
				msg.reply("Removido.");
				return;
			}
			msg.reply("Jacaré não existe na lista.");
			return;
		}
		else if(options.length > 0){
			if(json.list[options[0]]){
				msg.reply(getJacares(json.list[options[0]]));
				return;
			}
			else{
				msg.reply("Jacaré não existe na lista.");
				return;
			}
		}
		else{
			if(Object.keys(json.list).length > 0){
				let output = "*Jacarés*\n";
				for(let key in json.list){
					output += "\n" + key + ": " + getJacares(json.list[key]);
				}
				msg.reply(output);
			}
			else{
				msg.reply("Não há jacarés na lista.");
			}
		}
	}
}

async function getJSON(msg){
	return await readFile(msg, _file, getFreshJSON);
}

function getFreshJSON(){
	return {
		list: {}
	}
}

function commit(msg, file){
	writeFile(msg, _file, file);
}

function getJacares(number){
	let output = "";
	for(let i = 0; i < number; i++){
		output += "🐊";
	}
	return output;
}