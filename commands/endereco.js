module.change_code = 1;
const {getOptions} = require("../util.js");
const {readFile, writeFile} = require("../dao.js");
const _file = "enderecos";

module.exports = {
	description: "lista endereços",
	options: [["<id>", "adicionar <id> <endereço>", "remover <id>"]],
	process: async (msg, callback) => {
		let options = getOptions(msg);
		let book = await getAddressBook(msg);
		if(options[0] == "adicionar"){
			if(options.length != 3){
				msg.reply("Argumentos inválidos. Exemplo de argumentos válidos:\n!endereco adicionar casa \"Rua Falsa 123\"");
				return;
			}
			book.addresses[options[1]] = options[2];
			writeAddressBook(msg, book);
			msg.reply("Adicionado.");
			return;
		}
		else if(options[0] == "remover"){
			if(book.addresses[options[1]]){
				delete book.addresses[options[1]];
				msg.reply("Removido.");
				return;
			}
			msg.reply("Endereço não existe.");
			return;
		}
		else if(options.length > 0){
			if(book.addresses[options[0]]){
				msg.reply(book.addresses[options[0]]);
				return;
			}
			else{
				msg.reply("Endereço não existe.");
				return;
			}
		}
		else{
			if(Object.keys(book.addresses).length > 0){
				let output = "*Endereços*\n";
				console.log(Object.keys(book.addresses));
				for(let key in book.addresses){
					output += "\n" + key + ": " + book.addresses[key];
				}
				msg.reply(output);
			}
			else{
				msg.reply("Não há endereços.");
			}
		}
	}
}

async function getAddressBook(msg){
	return await readFile(msg, _file, getFreshAddressBook);
}

function getFreshAddressBook(){
	return {
		addresses: {}
	}
}

function writeAddressBook(msg, file){
	writeFile(msg, _file, file);
}