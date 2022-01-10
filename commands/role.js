module.change_code = 1;
const {getOptions, formatArgument} = require("../util.js");
const {fileExists, writeFile, readFile} = require("../dao.js");
const _file = "role";

module.exports = {
	description: "mostra info do proximo role",
	options: [["set local|data|descricao <valor>", "confirmar <nome>", "remover <nome>", "reset"]],
	process: async (msg, callback) => {
		let options = getOptions(msg);
		if(options[0] == "set"){
			if(options.length == 3 && (options[1] == "local" || options[1] == "data" || options[1] == "descricao")){
				setRoleProperty(msg, options[1], formatArgument(options[2]));
				msg.reply("Registrado.");
				return;
			}
			else{
				msg.reply("Argumentos inválidos. Exemplo de argumentos válidos:\n!role set local \"A ser definido\"");
				return;
			}
		}
		else if(options[0] == "confirmar"){
			if(options[1]){
				addGuest(msg, options[1]);
				msg.reply("Adicionado.");
				return;
			}
			else{
				msg.reply("Argumentos inválidos. Exemplo de argumentos válidos:\n!role confirmar \"Bonitão do Carandiru\"");
			}
		}
		else if(options[0] == "remover"){
			if(options[1]){
				removeGuest(msg, options[1]);
				msg.reply("Removido.");
				return;
			}
			else{
				msg.reply("Argumentos inválidos. Exemplo de argumentos válidos:\n!role remover \"Bonitão do Carandiru\"");
			}
		}
		else if(options[0] == "reset"){
			writeFile(msg, _file, getFreshJSON());
			msg.reply("Resetado.");
			return;
		}
		else{
			let json = await getRole(msg);
			let summary = "";
			summary += (json.descricao?json.descricao+"\n\n":"").replace("\\n","\n");
			summary += "*_LOCAL_*\n"+(json.local?json.local:"-").replace("\\n","\n");
			summary += "\n\n*_DATA_*\n"+(json.data?json.data:"-").replace("\\n","\n");
			if(json.guests.length > 0){
				summary += "\n\n*_CONFIRMADOS_*("+json.guests.length+")";
				for(let i = 0; i < json.guests.length; i++){
					summary += "\n"+json.guests[i];
				}
			}
			msg.reply(summary);
			return;
		}
	}
}

async function getRole(msg){
	return await readFile(msg, _file, getFreshJSON);
}

async function setRoleProperty(msg, key, value){
	let json = await getRole(msg);
	json[key] = value;
	writeFile(msg, _file, json);
}

async function addGuest(msg, alias){
	let json = await getRole(msg);
	if(json.guests.includes(alias)){
		return;
	}
	json.guests.push(alias);
	writeFile(msg, _file, json);
}

async function removeGuest(msg, alias){
	let json = await getRole(msg);
	if(!json.guests.includes(alias)){
		return;
	}
	let index = json.guests.indexOf(alias);
	json.guests.splice(index, 1);
	writeFile(msg, _file, json);
}

function getFreshJSON(){
	return {
		local: "",
		data: "",
		descricao: "",
		guests: []
	}
}