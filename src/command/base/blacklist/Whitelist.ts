import { Message } from '../../../types/Message';
import { Command } from '../../Command';
import { Middleware } from '../../middleware/Middleware';
import { User } from 'discord.js';
import * as CommandDecorators from '../../CommandDecorators';
const { using } = CommandDecorators;

export default class extends Command
{
	public constructor()
	{
		super({
			name: 'whitelist',
			desc: 'Remove a user from the command blacklist',
			aliases: ['wl'],
			usage: '<prefix>whitelist <user> [\'global\']',
			callerPermissions: ['ADMINISTRATOR']
		});
	}

	@using(Middleware.resolve({ '<user>': 'User' }))
	@using(Middleware.expect({ '<user>': 'User' }))
	public async action(message: Message, [user, global]: [User, string]): Promise<Message | Message[]>
	{
		if (global === 'global')
		{
			if (!this.client.isOwner(message.author))
				return message.channel.send('Only bot owners may remove a global blacklisting.');

			const globalBlacklist: any = await this.client.storage.get('blacklist') || {};
			if (!globalBlacklist[user.id])
				return message.channel.send('That user is not currently globally blacklisted.');

			await this.client.storage.remove(`blacklist.${user.id}`);
			this.client.emit('blacklistRemove', user, true);
			return message.channel.send(`Removed ${user.tag} from the global blacklist.`);
		}

		const guildBlacklist: any = await message.guild.storage.settings.get('blacklist') || {};
		if (!guildBlacklist[user.id])
			return message.channel.send('That user is not currently blacklisted in this server.');

		await message.guild.storage.settings.remove(`blacklist.${user.id}`);
		this.client.emit('blacklistRemove', user, false);
		return message.channel.send(`Removed ${user.tag} from this server's blacklist.`);
	}
}
