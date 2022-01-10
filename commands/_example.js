module.change_code = 1;
const util = require("../util.js"); //importando funções utilitarias genéricas
const dao = require("../dao.js"); //importando acesso a arquivos/banco de dados

module.exports = {
	description: "descrição do comando", //documentação para !commands - opcional
	options: [["op1","op2"],["arg1","arg2","arg3"],["arg1","arg2","arg3"]], //array de arrays de opções/argumentos - somente usado para documentação com !commands - opcional
	process: (msg, callback) => {
		//implementar o comando aqui
		console.log("msg", msg);
		console.log("callback", callback);
	}
}

function helperFunction(args){
	//exemplo
}