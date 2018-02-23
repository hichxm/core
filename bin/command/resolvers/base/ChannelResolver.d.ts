import { Resolver } from '../Resolver';
import { Client } from '../../../client/Client';
import { Command } from '../../Command';
import { Message } from '../../../types/Message';
import { TextChannel } from 'discord.js';
export declare class ChannelResolver extends Resolver {
    constructor(client: Client);
    validate(value: any): Promise<boolean>;
    resolve(message: Message, command: Command, name: string, value: string): Promise<TextChannel>;
}
