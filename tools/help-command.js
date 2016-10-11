function cmdHelpManager (commandList){
  function cmdHelp() {
    var commands = Object.keys(commandList);
    var maxLength = Math.max.apply(Math, commands.map(function(i){return i.length; }));
    // Roll out command and helps.
    console.log(
      'Commands:\n' + 
      commands
        .map(function (c) { return padRight(c, maxLength + 2) + '- ' + commandList[c].helpString || ''; })
        .join('\n'));
  }
  function padRight(str, length, char){
    while (str.length < length){
      str += char || ' ';
    }
    return str;
  }
  return cmdHelp;
}
module.exports = cmdHelpManager;