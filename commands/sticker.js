module.change_code = 1;


module.exports = {
	description:"envie uma imagem com esse comando para transormar em um sticker",
	process: async (msg, callback) => {
		if(msg.type == 'image'){
			const media = await msg.downloadMedia();
			console.log(media);
			msg.reply(media, msg.getChat().id, {sendMediaAsSticker: true});
			return;
		}/* --doesn't work. gotta revisit
		else if(msg.type == 'video'){
			const webp = require('webp-converter');
			webp.grant_permission();
			const media = await msg.downloadMedia();
			let b64 = webp.str2webpstr(media.data, "mp4", "-q 80");
			b64.then(function(result){
				console.log(result);
			})

		}*/
		msg.reply("Envie uma imagem com esse comando.");
	}
}