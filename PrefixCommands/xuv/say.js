import {Client, Message } from "discord.js";

export default {
  name: "say",
  description: "Say something w Bot",
  aliases: [""],
  usage: "",
  guildOnly: true,
  args: false,
  permissions: {
    bot: [],
    user: [],
  },
  /**
    * @param {Message} message
    * @param {Client} client
    */
  execute: async (message, args, client) => {
   try{
    await message.channel.send(args.join(' '));
    console.log(args.join(' '));
    await message.delete();
   } catch(e) { console.log("Say Command Error handled");}
  }
};