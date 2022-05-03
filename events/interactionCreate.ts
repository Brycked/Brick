import { ApplicationCommandOptionType, Interaction, Permissions } from "discord.js";
import { EventTemplate, SlashCommand } from "../handlers";

export default {
    run: (client, interaction: Interaction) => {
        if (!interaction.isCommand()) return
        
        const slash = client.slashcommands.get(interaction.commandName)

        if (!slash) return interaction.reply('Slash command not found')

        let missing = interaction.member ? interaction.memberPermissions?.missing(slash.permissions||[])! : new Permissions(slash.permissions||[]).toArray()
        if (missing.length > 0)
            return interaction.reply({
                content: `Missing permissions to run this command:\n>>> ${missing.join('\n')}`,
                ephemeral: true
            })
        
        const options = interaction.options
        const args = slash.options?.map((option, i) => {
            switch (option.type) {
                case 'BOOLEAN': return options.getBoolean(option.name)
                case 'CHANNEL' : return options.getChannel(option.name)
                case 'INTEGER': return options.getInteger(option.name)
                case 'MENTIONABLE': return options.getMentionable(option.name)
                case 'NUMBER': return options.getNumber(option.name)
                case 'STRING': return options.getString(option.name)
                case 'USER': return options.getMember(option.name) || options.getUser(option.name)
            }
        }) || []

        try {
            slash.run({client, interaction}, ...args)
        }
        catch (err) {
            if (err instanceof Error && err.toString().startsWith('?'))
                interaction.reply({
                    content: err.toString(),
                    ephemeral: true
                })
            else 
                console.error(err)
        }
    }
} as EventTemplate