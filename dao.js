module.change_code = 1;
const settings = require('./settings.json');
const fs = require('fs');

module.exports = {
	fileExists: fileExists,
	readFile: readFile,
	writeFile: writeFile,
	getMessageMediaFromFile: getMessageMediaFromFile
};

async function fileExists(msg, file){
	let fs = require('fs');
	let fileLocation = await getFileLocation(msg, file);
	return fs.existsSync(fileLocation.fullAddress);
}

async function readFile(msg, file, getFreshFile){
	if(await fileExists(msg, file)){
		let fs = require('fs');
		let fileLocation = await getFileLocation(msg, file);
		return JSON.parse(fs.readFileSync(fileLocation.fullAddress));
	}
	else{
		return getFreshFile();
	}
}

async function writeFile(msg, file, content){
	let fs = require('fs');
	let fileLocation = await getFileLocation(msg, file);
	if(!fs.existsSync(fileLocation.folder)){
		fs.mkdirSync(fileLocation.folder, {recursive: true});
	}
	fs.writeFile(fileLocation.fullAddress, JSON.stringify(content), (err) => {
		if(err){
			console.log(err);
			handleError(null, msg);
		}
	});
}

function getMessageMediaFromFile(file){
	let {MessageMedia} = require('whatsapp-web.js');
	return MessageMedia.fromFilePath(settings.filesys.media+settings.media[file]);
}

//---------------

async function getChatID(msg){
	let chat = await msg.getChat();
	return chat.name + "-" + chat.id._serialized;
}

async function getFileLocation(msg, file){
	let chatID = await getChatID(msg);
	let folder = settings.filesys.db + "/" + chatID;
	let fileName = settings.table[file];
	return {fullAddress: folder+fileName, folder: folder, file: fileName};
}