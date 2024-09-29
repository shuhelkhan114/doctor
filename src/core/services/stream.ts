import { chatClient } from '@core/lib/stream-chat';

interface CreateChannelParams {
  members: string[];
  isGroup?: boolean;
  users?: any[];
}

export const createChannel = async (params: CreateChannelParams) => {
  const channel = chatClient.channel('messaging', {
    members: params.members,
    isGroup: params.isGroup,
  });
  await channel.create();
  return channel;
};

export const getChannelById = async (channelId: string) => {
  const channels = await chatClient.queryChannels({
    id: channelId,
  });
  return channels?.[0];
};

export const getUserById = async (userId: string) => {
  const res = await chatClient.queryUsers({
    id: { $eq: userId },
  });
  return res?.users?.[0];
};

export const getChannel = async (members: string[]) => {
  const channels = await chatClient.queryChannels({
    type: 'messaging',
    members: {
      $eq: members,
    },
  });
  return channels?.[0];
};

export const getOrCreateChannel = async (members: string[]) => {
  const channel = await getChannel(members);
  if (channel) {
    return channel;
  } else {
    const newChannel = await createChannel({ members });
    return newChannel;
  }
};
