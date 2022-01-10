module.change_code = 1;

const settings = require("./settings.json");
const {getCommand, getOptions} = require("./util");

let debuggingNextMessage = false;

let commands = {
    "!summon":      require(settings.commands+"/summon.js"),
    "!role":        require(settings.commands+"/role.js"),
    "!endereco":    require(settings.commands+"/endereco.js"),
    "!sticker":     require(settings.commands+"/sticker.js"),
    "!flavio":      require(settings.commands+"/flavio.js"),
    "!help":        require(settings.commands+"/help.js"),
    "!github":      require(settings.commands+"/github.js"),
    "!debug": {
        description: "registra a proxima mensagem",
        process: (msg) => {
            debuggingNextMessage = true;
        }
    },
    "!commands": {
        description: "lista comandos",
        options: [
            ["desc"]
        ],
        process: (msg) => {
            msg.reply(getCommandDescriptors(msg));
            return;
        }
    }
}

function getCommandDescriptors(msg){
    let options = getOptions(msg);
    let keys = Object.keys(commands);
    let output = "List of commands:\n";
    for(var i = 0; i < keys.length; i++){
        output = output + "\n" + keys[i];
        if("options" in commands[keys[i]]){
            for(var j = 0; j < commands[keys[i]].options.length; j++){
                output = output + " [";
                for(var k = 0; k < commands[keys[i]].options[j].length; k++){
                    if(k > 0){
                        output = output + "|";
                    }
                    output = output + commands[keys[i]].options[j][k];
                }
                output = output + "]";
            }
        }
        if(options[0] == "desc" && "description" in commands[keys[i]]){
            output = output + " - " + commands[keys[i]].description;
        }
    }
    return output;
}

module.exports = async (msg) => {
    if(debuggingNextMessage){
        debuggingNextMessage = false;
        console.log(msg);
        if(msg.hasMedia){
            const media = await msg.downloadMedia();
            console.log(media);
        }
        msg.reply("Logged.");
    }
    let command = getCommand(msg);
    if(command in commands){
        commands[command].process(msg);
    }
    
};