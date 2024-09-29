import React, { PropsWithChildren, useState } from 'react';
import { Channel as IChannel } from 'stream-chat';
import { DefaultStreamChatGenerics } from 'stream-chat-react-native-core';

interface IChatContext {
  channel: IChannel<DefaultStreamChatGenerics>;
  setChannel: (channel: IChannel<DefaultStreamChatGenerics>) => void;
}

export const ChatContext = React.createContext<IChatContext>({
  channel: null as unknown as IChannel<DefaultStreamChatGenerics>,
  setChannel: (channel: IChannel<DefaultStreamChatGenerics>) => {},
});

export const ChatProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [channel, setChannel] = useState<IChannel<DefaultStreamChatGenerics>>(
    null as unknown as IChannel<DefaultStreamChatGenerics>
  );

  return <ChatContext.Provider value={{ channel, setChannel }}>{children}</ChatContext.Provider>;
};

export const useChat = () => React.useContext(ChatContext);
