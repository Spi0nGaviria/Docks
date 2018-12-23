const Discord = require("discord.js");
const Client = new Discord.Client();

const fs = require("fs");

const config = require("./config.json")

const token = config.token;

Client.commands = new Discord.Collection();
Client.aliases = new Discord.Collection();

Client.commands = new Discord.Collection();
Client.aliases = new Discord.Collection();

fs.readdir("./commands/ticket/", (err, files) => {
    
    if(err) console.error((err));
    let jsfile = files.filter(f => f.split(".").pop() === "js");
    if(jsfile.length <= 0) return;
  
    jsfile.forEach((f, i) => {
        delete require.cache[require.resolve(`./commands/ticket/${f}`)]
        let props = require(`./commands/ticket/${f}`)
        console.log(`${f} loaded!`);
        Client.commands.set(props.help.name, props);
        props.aliases.forEach(alias => {
        Client.aliases.set(alias, props.help.name);   
    });
  });
});

fs.readdir("./commands/admin/", (err, files) => {
    
    if(err) console.error((err));
    let jsfile = files.filter(f => f.split(".").pop() === "js");
    if(jsfile.length <= 0) return;
  
    jsfile.forEach((f, i) => {
        delete require.cache[require.resolve(`./commands/admin/${f}`)]
        let props = require(`./commands/admin/${f}`)
        console.log(`${f} loaded!`);
        Client.commands.set(props.help.name, props);
        props.aliases.forEach(alias => {
        Client.aliases.set(alias, props.help.name);   
    });
  });
});

fs.readdir("./events/", (async function (err, files) {
  
  let jsfile = files.filter(f => f.split(".").pop() === "js");
  jsfile.forEach(file => {
    
    const eventName = file.split(".")[0];
    const event = new(require(`./events/${file}`))(Client);
  
    Client.on(eventName, (...args) => event.run(...args));
    const mod = require.cache[require.resolve(`./events/${file}`)];
    delete require.cache[require.resolve(`./events/${file}`)];
    const index = mod.parent.children.indexOf(mod);
    if (index !== -1) mod.parent.children.splice(index, 1);
    
  });
}));

Client.on("disconnect", () => console.log("Client is disconnecting."))
 .on("error", e => console.log(e));

Client.login(token);