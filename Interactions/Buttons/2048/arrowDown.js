import { move, message2048, parseDesc, calculateScore } from "../../../Helpers/helpers2048.js";

export default {
  name: '2048down',
  deferUpdate: true,
  execute: async (interaction) => {
   await interaction.deferUpdate();
      const description = interaction.message.embeds[0].description; 
   let newDescription = move(description, 'down'); 
  
   let msg = message2048({ 
     description: newDescription, 
     score: calculateScore(parseDesc(newDescription)), 
   }); 
   return interaction.message.edit(msg);
  }
};
