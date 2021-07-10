const chatBot = function(inputmessages){
    console.log("Geschafft");
    var spawn = require("child_process").spawn;
    var process = spawn('python', 
        [
            "./chatbot.py",
            inputmessages
        ]
    );
}

process.stdout.on('data', function(data) {

    console.log(data.toString());

});

module.export = {chatBot}