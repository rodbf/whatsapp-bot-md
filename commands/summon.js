module.change_code = 1;
const {getOptions, getSender} = require("../util.js");
const {writeFile, readFile} = require("../dao.js");
const _file = "summoners";

module.exports = {
	description: "envia/adiciona/remove summons",
	options: [["addme", "removeme", "reset"]],
	process: async (msg, callback) => {
		let options = getOptions(msg);
		let summonersList = await getRegisteredSummoners(msg);
		if(options[0] == "addme"){
			let contact = await getNewSummoner(msg);
			for(let i = 0; i < summonersList.length; i++){
				if(contact.id._serialized == summonersList[i].id._serialized){
					msg.reply("Já estava adicionado.");
					return;
				}
			}
			summonersList.push(contact);
			writeSummonersList(msg, summonersList);
			msg.reply("Adicionado.");
			return;
		}
		else if(options[0] == "removeme"){
			let contact = await getNewSummoner(msg);
			for(let i = 0; i < summonersList.length; i++){
				if(contact.id._serialized == summonersList[i].id._serialized){
					summonersList.splice(i, 1);
					writeSummonersList(msg, summonersList);
					msg.reply("Removido.");
					return;
				}
			}
			msg.reply("Já não estava adicionado.");
			return;
		}
		else if(options[0] == "reset"){
			writeSummonersList(msg, []);
			msg.reply("Resetado.");
		}
		else{
			let message = "Summon!\n\n"+getMentionString(summonersList);
			msg.reply(message, msg.getChat().id, {mentions: summonersList});
			return;
		}
	}
}

async function getRegisteredSummoners(msg){
	let json = await readFile(msg, _file, getFreshSummonersList);
	return json.summoners;
}

async function getNewSummoner(msg){
	let sender = await getSender(msg);
	return {id: sender.id};
}

function writeSummonersList(msg, array){
	writeFile(msg, _file, {summoners: array});
}

function getMentionString(contactsList){
	let str = "";
	for(let i = 0; i < contactsList.length; i++){
		if(i > 0){
			str+=" ";
		}
		str+="@"+contactsList[i].id.user;
	}
	return str;
}

function getFreshSummonersList(){
	return {summoners: []}
}