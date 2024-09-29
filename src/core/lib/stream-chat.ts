import { StreamChat } from 'stream-chat';

import { chatApiKey } from '../config/app';

export const chatClient = StreamChat.getInstance(chatApiKey);
