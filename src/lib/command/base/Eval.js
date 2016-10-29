'use babel';
'use strict';

import Command from '../Command';
import { inspect } from 'util';

export default class Eval extends Command
{
	constructor(bot)
	{
		super(bot, {
			name: 'eval',
			aliases: [],
			description: 'Evaluate provided Javascript code',
			usage: '<prefix>eval [code]',
			extraHelp: '',
			group: 'base',
			stringArgs: true,
			ownerOnly: true
		});
	}

	async action(message, args)
	{
		if (this.bot.selfbot) message.delete();
		const code = args.join(' ');
		if (!code) return this._respond(message, '**ERROR:** ```xl\nNo code provided to evaluate.\n```');

		try
		{
			var evaled = eval(code);
			if (typeof evaled !== 'string')	evaled = inspect(evaled, { depth: 0 });
			return this._respond(message,
				`**INPUT:**\n\`\`\`js\n${code}\n\`\`\`\n**OUTPUT:**\n\`\`\`xl\n${this._clean(evaled)}\n\`\`\``);
		}
		catch (err)
		{
			return this._respond(message,
				`**INPUT:**\n\`\`\`js\n${code}\n\`\`\`\n**ERROR:**\n\`\`\`xl\n${this._clean(evaled)}\n\`\`\``);
		}
	}

	_clean(text)
	{
		return typeof text === 'string' ? text
			.replace(/`/g, `\`${String.fromCharCode(8203)}`)
			.replace(/@/g, `@${String.fromCharCode(8203)}`)
			.replace(/[\w\d]{24}\.[\w\d]{6}\.[\w\d-_]{27}/g, '[REDACTED]')
			.replace(/email: '[^']+'/g, `email: '[REDACTED]'`)
			: text;
	}
}
