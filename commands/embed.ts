import { DiscordAPIError, MessageEmbed } from "discord.js";
import { ICommand } from "wokcommands";

export default {
    category: 'testing',
    description: 'Sends an embed',
    permissions: ['ADMINISTRATOR'],

    callback: async ({ text }) => {
        return new MessageEmbed(JSON.parse(text))
    }
} as ICommand