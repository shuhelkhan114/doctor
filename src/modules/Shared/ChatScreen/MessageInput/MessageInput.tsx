import AudioRecorder from '@components/AudioRecorder/AudioRecorder';
import Block from '@components/Block/Block';
import Icon from '@components/Icon/Icon';
import { useChat } from '@context/ChatContext';
import toast from '@core/lib/toast';
import API from '@core/services';
import { logError } from '@core/utils/logger';
import useAppTheme from '@hooks/useTheme';
import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system';
import * as ImagePicker from 'expo-image-picker';
import React, { useRef, useState } from 'react';
import { ActivityIndicator, Image, TextInput } from 'react-native';

interface MessageInputProps {}

let recording: Audio.Recording | null = new Audio.Recording();

const MessageInput: React.FC<MessageInputProps> = (props) => {
  const { channel, setChannel } = useChat();
  const theme = useAppTheme();
  const recorder = useRef<any>();
  const [sendingDisabled, setSendingDisabled] = useState(false);
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState('');
  const [record, setRecord] = useState<any>(null);
  const [audioRecorderVisible, setAudioRecorderVisible] = useState(false);
  const [image, setImage] = useState<string | null>(null);
  const [height, setHeight] = useState(35);

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      const url = result?.assets?.[0].uri;
      const fileExtension = url!.split('.').pop();
      const destinationUri = `${FileSystem.documentDirectory}${Date.now()}.${fileExtension}`;
      // TODO: Delete local file after uploaded
      await FileSystem.moveAsync({
        from: url!,
        to: destinationUri,
      });

      if (!result.canceled) {
        setImage(destinationUri);
      }
    } catch (error) {
      logError(error);
      toast.error('Unable to pick files, please check your permissions or try again');
    }
  };

  return (
    <Block flex1 style={{ paddingHorizontal: 12 }}>
      {image && (
        <Block>
          <Image
            source={{ uri: image }}
            style={{ height: 200, width: 200, borderRadius: 8 }}
            resizeMode="contain"
          />
        </Block>
      )}
      <Block flexDirection="row" align="center">
        <Block
          style={{ display: audioRecorderVisible ? 'flex' : 'none' }}
          flexDirection="row"
          justify="space-between"
          align="center"
          flex1
          mR="md">
          <AudioRecorder
            // @ts-ignore
            ref={recorder as any}
            recording={recording}
            onCancelRecording={() => setSendingDisabled(false)}
            onStartRecoding={() => setSendingDisabled(true)}
            onRecordComplete={(record) => {
              setSendingDisabled(false);
              setRecord(record);
            }}
          />
        </Block>

        <Block
          bgColor="lightest2"
          pV="lg"
          flex1
          pH="xxxl"
          style={{ borderRadius: 56, display: audioRecorderVisible ? 'none' : 'flex' }}
          flexDirection="row"
          mR="md"
          align="center">
          <TextInput
            placeholderTextColor={theme.colors.dark}
            placeholder="Write a message"
            value={message}
            multiline
            onChangeText={setMessage}
            style={{
              flex: 1,
              height: height <= 35 ? height + 3 : 35,
            }}
            onContentSizeChange={(e) => setHeight(e.nativeEvent.contentSize.height)}
          />
          <Block onPress={pickImage}>
            <Image
              source={require('@assets/icons/attachment.png')}
              style={{
                height: 24,
                width: 24,
              }}
            />
          </Block>
        </Block>

        <Block
          bgColor={sendingDisabled ? 'dark' : 'mainBlue'}
          style={{ height: 56, width: 56, borderRadius: 56 }}
          justify="center"
          align="center"
          onPress={async () => {
            if (sending || sendingDisabled) return;
            if (message || record || image) {
              try {
                setSending(true);
                let uploadUrl = '';
                if (record) {
                  const uploadRes = await channel?.sendFile(record.file);
                  uploadUrl = uploadRes.file;
                } else if (image) {
                  const uploadRes = await channel?.sendImage(image);
                  uploadUrl = uploadRes.file;
                }

                await channel?.sendMessage({
                  text: message,
                  ...(uploadUrl && {
                    attachments: [
                      {
                        type: image ? 'image' : 'audio',
                        asset_url: uploadUrl,
                        thumb_url: uploadUrl,
                        ...(record && {
                          duration: record.duration,
                        }),
                      },
                    ],
                  }),
                });

                setImage(null);
                setRecord(undefined);
                setAudioRecorderVisible(false);
                setMessage('');
                recording = new Audio.Recording();
                recorder?.current.resetRecorder();
              } catch (error) {
                logError(error);
              } finally {
                setSending(false);
                if (Object.values(channel?.state.messages).length === 0) {
                  const cId = channel.id;
                  const updatedChannel = await API.stream.getChannelById(cId!);
                  setChannel(null as any);
                  setTimeout(() => {
                    setChannel(updatedChannel);
                  }, 0);
                }
              }
            } else {
              if (audioRecorderVisible) {
                setAudioRecorderVisible(false);
                recording = new Audio.Recording();
                recorder?.current.resetRecorder();
              } else {
                recorder.current?.startRecording?.();
                setAudioRecorderVisible(true);
              }
            }
          }}>
          {sending ? (
            <ActivityIndicator color="white" />
          ) : (
            <Icon
              name={
                message || record || image ? 'send' : audioRecorderVisible ? 'close' : 'microphone'
              }
              size={32}
              color={theme.colors.white}
            />
          )}
        </Block>
      </Block>
    </Block>
  );
};

export default MessageInput;
