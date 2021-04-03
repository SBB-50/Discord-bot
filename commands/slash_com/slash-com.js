const Discord = require('discord.js');
const fs = require('fs')
const json = JSON.parse(fs.readFileSync('commands/slash_com/slash_com.json'))


const facts = ["Kirill", "pp", "Zolotuskiy", "James", "Mother", "Eiríkur", "Stefán", "Borgar", "Gummi", "Snær", "Guð", "Bíbí", "Sundmaður", "Sundkona", "Sundþjálfari", "Júlíus", "Botti", "Hermann", "Ingi", "Halldór"];


/**
 * 
 * @param {Discord.Client} client 
 * @param {String} guild_id
 */
function send_commands_guild(client, guild_id){
    json.forEach(command_ => {
        client.api.applications(client.user.id).guilds(guild_id).commands.post({data: command_})
    });
}
exports.send_commands_guild = send_commands_guild;

/**
 * 
 * @param {Discord.Client} client 
 */
function send_commands_all(client){
    json.forEach(command_ => {
        client.api.applications(client.user.id).commands.post({data: command_})
    });
}
exports.send_commands_all = send_commands_all;


/**
 * 
 * @param {Discord.Client} client 
 * @param {String} guild_id
 */
async function delete_commands_guild(client, guild_id){
    const commands_ = await client.api.applications(client.user.id).guilds(guild_id).commands.get()
    commands_.forEach(command_ => {
        client.api.applications(client.user.id).guilds(guild_id).commands(command_.id).delete()
    });
}
exports.delete_commands_guild = delete_commands_guild;

/**
 * 
 * @param {Discord.Client} client 
 */
async function delete_commands_all(client){
    const commands_ = await client.api.applications(client.user.id).commands.get()
    commands_.forEach(command_ => {
        client.api.applications(client.user.id).commands(command_.id).delete()
    });
}
exports.delete_commands_all = delete_commands_all;

/**
 * 
 * @param {Discord.Client} client 
 * @param {{gskuld:             (data: {}, user: Discord.User) => Promise<String>
 *          encrypt:            (data: {}) => String
 *          decrypt:            (data: {}) => String
 *          help:               (data: {}, channel: String) => void
 *          sundleikurinn_com:  (data: {}, channel_id: String, guild_id: String, user: Discord.User, member?: Discord.GuildMember) => Promise<String>
 *          image:              (callback: (image: string) => any)
 *          kick_com:           (data: {}, guild_id?: String) => Promise<String>
 *         }} commands
 */
function command_reply(client, commands){
    const sugestion_channel = client.channels.cache.find(ch => ch.id === '827213162213408802');

    client.ws.on('INTERACTION_CREATE', async interaction => { 
        if(interaction.data.name == 'gskuld'){
            if(interaction.member){
                client.api.interactions(interaction.id, interaction.token).callback.post({data: {
                    type: 4,
                    data: {
                        content: await commands.gskuld(interaction.data, interaction.member.user)
                    }
                }})
            }else {
                client.api.interactions(interaction.id, interaction.token).callback.post({data: {
                    type: 4,
                    data: {
                        content: await commands.gskuld(interaction.data, interaction.user)
                    }
                }})
            }
        }else if(interaction.data.name == 'encrypt'){
            client.api.interactions(interaction.id, interaction.token).callback.post({data: {
                type: 4,
                data: {
                    content: commands.encrypt(interaction.data)
                }
            }})
        }else if(interaction.data.name == 'decrypt'){
            client.api.interactions(interaction.id, interaction.token).callback.post({data: {
                type: 4,
                data: {
                    content: commands.decrypt(interaction.data)
                }
            }})
        }else if(interaction.data.name == 'help') {
            await client.api.interactions(interaction.id, interaction.token).callback.post({data: {
                type: 4,
                data: {
                    content: `-help-`
                }
            }})
            commands.help(interaction.data, interaction.channel_id)
        }else if(interaction.data.name == 'sundleikurinn') {
            if(interaction.member){
                client.api.interactions(interaction.id, interaction.token).callback.post({data: {
                    type: 4,
                    data: {
                        content: await commands.sundleikurinn_com(interaction.data, interaction.channel_id, interaction.guild_id, interaction.member.user, interaction.member)
                    }
                }})
            }else {
                client.api.interactions(interaction.id, interaction.token).callback.post({data: {
                    type: 4,
                    data: {
                        content: await commands.sundleikurinn_com(interaction.data, interaction.channel_id, interaction.guild_id, interaction.user)
                    }
                }})
            }
        }else if(interaction.data.name === "profile_picture"){
            if(interaction.member){
                client.api.interactions(interaction.id, interaction.token).callback.post({data: {
                    type: 4,
                    data: {
                        content: (await client.users.fetch(interaction.member.user.id)).displayAvatarURL({ format: "png", dynamic: true })
                    }
                }})
            }else {
                client.api.interactions(interaction.id, interaction.token).callback.post({data: {
                    type: 4,
                    data: {
                        content: (await client.users.fetch(interaction.user.id)).displayAvatarURL({ format: "png", dynamic: true })
                    }
                }})
            }
        }else if(interaction.data.name === "events"){
            client.api.interactions(interaction.id, interaction.token).callback.post({data: {
                type: 4,
                data: {
                    content:  '\n1: James made a kahoot about the discord server a while ago that STILL hasn´t been played. \n2: Lögreglan ætlar að handtaka kaktus sem sást í gærkvöldi um klukkan 11:35 niðri í bæ. Sagt er að kaktusinn býr í matarkjallara sem er neðst niðri í ráðhúsinu. Kaktusinn er sagður heita Pétur. (This is genuienly to long to translate)'
                }
            }})
        }else if(interaction.data.name === "names"){
                    
            const fact1 = Math.floor(Math.random() * facts.length);
            const fact2 = Math.floor(Math.random() * facts.length);
            client.api.interactions(interaction.id, interaction.token).callback.post({data: {
                type: 4,
                data: {
                    content: facts[fact1] + " " + facts[fact2]
                }
            }})
        }else if(interaction.data.name === "image"){
            commands.image(image => {
                client.api.interactions(interaction.id, interaction.token).callback.post({data: {
                    type: 4,
                    data: {
                        content: image
                    }
                }})
            })
        }else if(interaction.data.name === "kick"){
                    
            client.api.interactions(interaction.id, interaction.token).callback.post({data: {
                type: 4,
                data: {
                    content: await commands.kick_com(interaction.data, interaction.guild_id, interaction.member)
                }
            }})

        }else if (interaction.data.name === `member_count`) {
            client.api.interactions(interaction.id, interaction.token).callback.post({data: {
                type: 4,
                data: {
                    content: `Total members: ${(await client.guilds.fetch(interaction.guild_id)).memberCount}`
                }
            }})

        }else if (interaction.data.name === "joke"){
            const Joke = JSON.parse(fs.readFileSync("jokes.json"));
            const randomJoke = Joke[Math.floor(Math.random() * (Joke.length - 0.1))];
            client.api.interactions(interaction.id, interaction.token).callback.post({data: {
                type: 4,
                data: {
                    content: (randomJoke)
                }
            }})
           
        }else if (interaction.data.name === 'suggest'){
            sugestion_channel.send('Suggestion:\n' + interaction.data.options[0].value)
            if(interaction.member){
                client.api.interactions(interaction.id, interaction.token).callback.post({data: {
                    type: 4,
                    data: {
                        content: `${(await client.users.fetch(interaction.member.user.id)).toString()} suggested ${interaction.data.options[0].value}`
                    }
                }})
            }else{
                client.api.interactions(interaction.id, interaction.token).callback.post({data: {
                    type: 4,
                    data: {
                        content: `${(await client.users.fetch(interaction.user.id)).toString()} suggested ${interaction.data.options[0].value}`
                    }
                }})
            }
        }else if (interaction.data.name === `bot_stats`) {
            let days = Math.floor(client.uptime / 86400000);
            let hours = Math.floor(client.uptime / 3600000) % 24;
            let minutes = Math.floor(client.uptime / 60000) % 60;
            let seconds = Math.floor(client.uptime / 1000) % 60;
            const exampleEmbed = new Discord.MessageEmbed()
            .setColor('RANDOM')
            .setTitle("Bot's Stats")
            .addField(" \u200B ", "**Servers** : ` " + `${client.guilds.cache.size}` + " `")
            .addField(" \u200B ", "**Total channels** : ` " + `${client.channels.cache.size}` + " `")
            .addField( "\u200B ", `**__Uptime:__** :`  + `\n${days}d ${hours}h ${minutes}m ${seconds}s` + " ")

            await client.api.interactions(interaction.id, interaction.token).callback.post({data: {
                type: 4,
                data: {
                    content: "-stats-"
                }
            }})

            const channel = await client.channels.fetch(interaction.channel_id)
            channel.send(exampleEmbed)
        
        }

        // console.log(interaction);
        // new Discord.WebhookClient(client.user.id, interaction.token).send('hello world')
    })
}
exports.command_reply = command_reply;