import { AttachmentBuilder, Message } from "discord.js";
import sharp from "sharp";
import fetch from "node-fetch";
import emojiRegex from "emoji-regex";
import { getCaptionInput } from "../../Helpers/helpersImage.js";

export default {
  name: "rvcj",
  description: "Create RVCJ styled image",
  aliases: ["cid"],
  usage: "rvcj <image: emoji, url, attachment, sticker>&<caption:text>",
  guildOnly: false,
  args: true,
  permissions: {
    bot: [],
    user: [],
  },
  /**
   * @param {Message} message
   */
  execute: async (message) => {
    try {
      const image = await getCaptionInput(message);

      const reg = /https?:\/\/.*\.(?:png|jpg|jpeg|gif)/i;
      const text = message.content
        .split(" ")
        .splice(1)
        .join(" ")
        .replace(reg, "")
        .trim();

      // Temporarily replace emojis with placeholders in a duplicate of 'text'
      let tempText = text;
      const emojiPlaceholder = '⛄'; // Example placeholder that won't conflict with regular text
      const regexEmoji = emojiRegex();
      tempText = tempText.replace(regexEmoji, emojiPlaceholder);

      const words = tempText.split(' ');
      const lines = [];
      let currentLine = '';
      words.forEach(word => {
        if ((currentLine + word).length <= 24) {
          currentLine += (currentLine.length ? ' ' : '') + word;
        } else {
          lines.push(currentLine);
          currentLine = word;
        }
      });
      if (currentLine) {
        lines.push(currentLine);
      }

      let textLines = [];
      let textHeight = 0;

      for (const line of lines) {
        let emoteAndEmojiRegex = /<:[a-zA-Z0-9_]+:[0-9]+>|[\u{1F600}-\u{1F64F}]|./gu;
        let characters = line.match(emoteAndEmojiRegex);
        // Handle case where 'characters' is null (no matches found)
        characters = characters || [];

        let textChars = [];
        let currentLeft = 0;

        for (const character of characters) {
          if (isEmoji(character)) {
            let emojiBuffer = await getEmojiImage(character).catch(err => {
              throw new Error(`Failed to fetch emoji: ${err.message}`);
            });
            emojiBuffer = await sharp(emojiBuffer).resize(48, 48).png().toBuffer();
            textChars.push({
              input: emojiBuffer,
              top: 0,
              left: currentLeft
            });
            currentLeft += 51;
          } else if (character === " ") {
            const spaceBuffer = await sharp({
              create: {
                width: 15,
                height: 60,
                channels: 4,
                background: { r: 255, g: 255, b: 255, alpha: 0 },
              },
            }).png().toBuffer();
            textChars.push({
              input: spaceBuffer,
              top: 0,
              left: currentLeft
            });
            currentLeft += 15;
          } else {
            let textChar = await sharp({
              text: {
                text: character.toUpperCase(),
                dpi: 400,
                align: 'center',
                font: "Baloo 2 ExtraBold",
                fontfile: "./Assets/baloo.ttf",
              },
            }).png().toBuffer();

            let textCharMeta = await sharp(textChar).metadata();
            textChars.push({
              input: textChar,
              blend: 'difference',
              top: 0,
              left: currentLeft
            });
            currentLeft += textCharMeta.width + 3;
          }
        }

        const textLine = await sharp({
          create: {
            width: currentLeft,
            height: 60,
            background: { r: 255, g: 255, b: 255, alpha: 1 },
            channels: 4,
          },
        })
          .composite(textChars)
          .png()
          .toBuffer();

        let textLineMeta = await sharp(textLine).metadata();
        let leftPos = Math.floor((1080 - textLineMeta.width) / 2);
        textLines.push({
          input: textLine,
          top: textHeight,
          left: leftPos,
        });

        textHeight += 60;
      }

      const overlay = await sharp({
        create: {
          width: 1080,
          height: textHeight,
          background: { r: 255, g: 255, b: 255, alpha: 1 },
          channels: 4,
        },
      })
        .composite(textLines)
        .png()
        .toBuffer();

      const finalHeight = 48 + 145 + 30 + textHeight + md.height;

      const finalImage = await sharp({
        create: {
          width: 1080,
          height: finalHeight,
          background: { r: 255, g: 255, b: 255, alpha: 1 },
          channels: 4,
        },
      })
        .composite([
          { input: "./Assets/rvcjheader.png", top: 0, left: 0 },
          { input: overlay, top: 145, left: 0 },
          { input: input, top: 145 + textHeight + 30, left: 0 },
          { input: "./Assets/rvcjfooter.png", top: finalHeight - 48, left: 0 },
        ])
        .png()
        .toBuffer();

      const file = new AttachmentBuilder(finalImage, {
        name: "rvcj.png",
      });
      message.reply({
        content: "men are simple 🙂",
        files: [file],
      });
    } catch (err) {
      console.error(err);
      message.reply(`An error occurred: ${err.message}`);
    }
  },
};

const getEmojiImage = async (emoji) => {
  const customEmojiRegex = /<:([a-zA-Z0-9_]+):([0-9]+)>/;
  const match = emoji.match(customEmojiRegex);
  if (match) {
    const emojiId = match[2];
    const emojiUrl = `https://cdn.discordapp.com/emojis/${emojiId}.png`;
    const response = await fetch(emojiUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch emoji: ${response.statusText}`);
    }
    const buffer = await response.arrayBuffer();
    return Buffer.from(buffer);
  } else {
    const encodedEmoji = encodeURIComponent(emoji);
    const emojiUrl = `https://raw.githubusercontent.com/luizbizzio/emojis/main/apple/${encodedEmoji}.png`;
    const response = await fetch(emojiUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch emoji: ${response.statusText}`);
    }
    const buffer = await response.arrayBuffer();
    return Buffer.from(buffer);
  }
};

const isEmoji = (part) => {
  const regex = emojiRegex();
  const customEmojiRegex = /<:[a-zA-Z0-9_]+:[0-9]+>/;
  return regex.test(part) || customEmojiRegex.test(part);
};