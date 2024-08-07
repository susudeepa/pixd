export default {
  name: 'cmd',
  execute: async (interaction) => {
const sel = interaction.values;
const help = {
  content: '',
  embeds: [
    {
      type: 'rich',
      color: 0xe08e67,
      description: '',
      footer: {text:'Send me new commands’ suggestions using the /contact command',
        icon_url: 'https://cdn.discordapp.com/emojis/1142805565295308800.gif'
      },
      author: {
        name: "",
        icon_url: ""
      }
    },
  ],
};

if (sel[0] == 'xuv') {
  let com = interaction.message.components[0].components[0].options[0];
  help.embeds[0].author.icon_url = `https://cdn.discordapp.com/emojis/${com.emoji.id}.png`;
  help.embeds[0].author.name = com.label;
  help.embeds[0].description = [
    '* `p!gpt <query>` - <:slash:1220953479921799218> Danky dank GPT',
    '* `p!padhaku <query>` - <:slash:1220953479921799218> Ask study related questions.',
    '* `p!genesis <prompt>` - <:slash:1220953479921799218> Genesis AI images',
    '* `p!ytsum <youtube URL>` - <:slash:1220953479921799218> summarise a youtube video'
   ].join('\n');
}
if (sel[0] == 'uti') {
  let com = interaction.message.components[0].components[0].options[1];
  help.embeds[0].author.icon_url = `https://cdn.discordapp.com/emojis/${com.emoji.id}.png`;
  help.embeds[0].author.name = com.label;
  help.embeds[0].description = [
    '* `p!ud <word>` - get a word definition from urban dictionary',
    '* `p!img <query>` - search images from google',
    '* `p!lens [image]` - reverse search an image from google',
    '* `p!screenshot <website link>` - get screenshot from a webpage',
    '* `p!pin <create|list|delete|edit>` - Manage pins or tags in this server.'
   ].join('\n');
}
if (sel[0] == 'img') {
  let com = interaction.message.components[0].components[0].options[2];
  help.embeds[0].author.icon_url = `https://cdn.discordapp.com/emojis/${com.emoji.id}.png`;
  help.embeds[0].author.name = com.label;
  help.embeds[0].description = [
    '* `p!rvcj [image]+[text]` - <:slash:1220953479921799218> Caption an image in RVCJ style!',
   '* `p!lapata [image] or <mentions>` - <:slash:1220953479921799218> get Lapata.',
    '* `p!allustuff [image]+[text]` - <:slash:1220953479921799218> Allu Arjun funnies',
    '* `p!vosahihai [image] or <mentions>` - <:slash:1220953479921799218> Hes right you know',
    '* `p!nearyou [image] or <mention>` - <:slash:1220953479921799218> WHO ARE YOU',
    '* `p!goodness [image] or <mention>` - <:slash:1220953479921799218> oh my goodness gracious',
    '* `p!animan <4 mentions>` - <:slash:1220953479921799218> put that new forgis on the jeep',
    ].join('\n');
}
if (sel[0] == 'gam') {
  let com = interaction.message.components[0].components[0].options[3];
  help.embeds[0].author.icon_url = `https://cdn.discordapp.com/emojis/${com.emoji.id}.png`;
  help.embeds[0].author.name = com.label;
  help.embeds[0].description = [
    '* `p!wordle` - Play the game wordle',
    '* `p!c4` -  Play the game Connect 4',
    '* `p!2048` - Play 2048',
    '* `p!hangman` - Yet another word guessing game.',
  ].join('\n');
}
if (sel[0] == 'fap') {
  let com = interaction.message.components[0].components[0].options[4];
  help.embeds[0].author.icon_url = `https://cdn.discordapp.com/emojis/${com.emoji.id}.png`;
  help.embeds[0].author.name = com.label;
  help.embeds[0].description = [
    '* `p!addme` - Start your journey',
    '* `p!win` - Add a day in your streak everyday.',
    '* `p!lose` - Reset your streak.',
    '* `p!crstreak` - Check yours or someone else’s Streak.',
    '* `p!leaderboard` - See the leaderboard.',
  ].join('\n');
}
if (sel[0] == 'son') {
  let com = interaction.message.components[0].components[0].options[5];
  help.embeds[0].author.icon_url = `https://cdn.discordapp.com/emojis/${com.emoji.id}.png`;
  help.embeds[0].author.name = com.label;
  help.embeds[0].description = [
    '* `p!play <search or url>` - play any song or playlist from YouTube, Spotify and SoundCloud.',
    '* `p!pause` - pause the song.',
    '* `p!resume` - resume the song.',
    '* `p!stop` - stop playing and clear queue.',
    '* `p!skip <n or song name>` - skips the current song or remove a song from the queue.',
    '* `p!lyrics <song-name>` - get lyrics of a song',
    '* `p!skipto <n or song name>` - skip to a desired position in the queue.',
    '* `p!queue` - shows songs in the queue.',
    '* `p!clear` - removes all songs in the queue.',
    '* `p!shuffle` - shuffles the queue.',
    '* `p!loop` - repeats the current song.',
    '* `p!seek <mm:ss>` - seek to a desired time in the current playing song.',
  ].join('\n');
}
await interaction.deferUpdate();
return interaction.message.edit(help);
  }
};
