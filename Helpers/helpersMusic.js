import {
  getVoiceConnection,
  createAudioResource,
  AudioPlayerStatus,
} from "@discordjs/voice";
import playDL from "play-dl";
import { Client, Message } from "discord.js";

/**
 * @param {Client} client
 * @param {Message} message
 */
export async function play(guild, song, client, message) {
  const serverQueue = client.queue.get(guild.id);

  if (!song) {
    serverQueue.timeoutID = setTimeout(
      () => {
        if (getVoiceConnection(guild.id) !== undefined) {
          destroy(guild, client);
          serverQueue.timeoutID = undefined; //after timeout goes off, reset timeout value.
        } else {
          console.log("Bot was disconnected during the timeout.");
        }
      },
      2 * 60 * 1000,
    ); //2 min idle

    serverQueue.loop = false;
    return;
  }

  clearTimeout(serverQueue.timeoutID);
  serverQueue.timeoutID = undefined;

  try {
    let stream;
    if (song.source === "yt") {
      try {
        stream = await playDL.stream(song.url, {
          seek: song?.seek > 0 ? song.seek : 0,
        });
      } catch (e) {
        console.log("Caught an error while getting stream:", e.message);
        return message.react("<:error:1090721649621479506>");
      }
    } else if (song.source === "sp") {
      try {
        let search = await playDL.search(song.title, {
          limit: 1,
        });
        stream = await playDL.stream(search[0].url);
      } catch (e) {
        console.log("Caught an error while getting stream:", e.message);
        return message.react("<:error:1090721649621479506>");
      }
    } else if (song.source === "sc") {
      try {
        stream = await playDL.stream(song.url);
      } catch (e) {
        console.log("Caught an error while getting stream:", e.message);
        return message.react("<:error:1090721649621479506>");
      }
    }

    //discord part
    let resource = createAudioResource(stream.stream, {
      inputType: stream.type,
    });
    serverQueue.connection.subscribe(serverQueue.player);
    serverQueue.player.play(resource);

    var errorListener = (error) => {
      console.error(
        `Error: ${error.message} with resource ${error.resource.title}`,
      );
    };
    serverQueue.player.on("error", errorListener);
    serverQueue.player.once(AudioPlayerStatus.Idle, () => {
      serverQueue.player.removeListener("error", errorListener);
      if (serverQueue.loop && serverQueue.keep) {
        serverQueue.songs.push(serverQueue.songs.shift());
      } else {
        serverQueue.songs.shift();
        if (serverQueue.loop === true) {
          serverQueue.keep = true;
        }
      }
      play(guild, serverQueue.songs[0], client);
    });

    serverQueue.textChannel.send({
      content: "**Now Playing**",
      tts: false,
      embeds: [
        {
          type: "rich",
          title: "",
          description: "",
          color: 0x462,
          author: {
            name: `${song.title} - ${song.durationTime.minutes}:${song.durationTime.seconds}`,
            icon_url: `https://media.discordapp.net/attachments/1011986872500764672/1090737187869438033/icons8-cd.gif`,
          },
        },
      ],
    });
  } catch (error) {
    console.error(`Error while playing: ${error.message}`);
  }
}

/**
 * @param {Client} client
 */
export function destroy(guild, client) {
  try {
    getVoiceConnection(guild.id).destroy();
    client.queue.delete(guild.id);
  } catch (error) {
    console.error(`Error while destroying connection: ${error.message}`);
  }
}

/**
 * Given a number, parses it into the form of mm:ss
 * @param {number} input number to parse.
 * @returns {object} object containing the parsed data.
 */
export function parse(input) {
  if (typeof input == "string" && input.indexOf(":") != -1) {
    let time = input.split(":");
    if (isNaN(time[0]) || isNaN(time[1]) || time[0] < 0 || time[1] < 0) {
    } else {
      let minutes = Number(time[0] * 60);
      let seconds = Number(time[1]);
      let timeToSeek = minutes + seconds;
      return timeToSeek;
    }
  } else if (typeof input == "number") {
    let minutes = Math.floor(input / 60);
    let seconds = input % 60 < 10 ? "0" + (input % 60) : input % 60;
    return { minutes: minutes, seconds: seconds };
  } else {
    return 0;
  }
}

export async function soundCloudUrl(url) {
  const soundcloudUrlRegex = /^https:\/\/soundcloud\.com\/[^\/]+\/[^\/]+$/;
  if (url.match(soundcloudUrlRegex)) {
    return url;
  }

  try {
    const response = await fetch(url);
    const html = await response.text();
    const originalTrackUrlRegex =
      /<meta\s+property=["']og:url["']\s+content=["'](https:\/\/soundcloud\.com\/[^"']+)["']>/;
    const match = html.match(originalTrackUrlRegex);

    if (match && match[1]) {
      return match[1];
    } else {
      throw new Error("Original track URL not found");
    }
  } catch (error) {
    console.error("Error extracting track URL:", error);
    return null;
  }
}
