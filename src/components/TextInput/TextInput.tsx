import Block from '@components/Block/Block';
import Icon from '@components/Icon/Icon';
import { getSize } from '@core/utils/responsive';
import useAppTheme from '@hooks/useTheme';
import { useMemo } from 'react';
import { TextInput as NativeTextInput, StyleSheet } from 'react-native';

interface TextInputProps {}

const TextInput: React.FC<TextInputProps> = (props) => {
  const theme = useAppTheme();
  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingHorizontal: theme.spacing.xl,
          paddingVertical: theme.spacing.sm,
          backgroundColor: theme.colors.white,
          borderRadius: theme.spacing.xs,
        },
        input: {
          flex: 1,
          fontSize: getSize(14),
          fontFamily: 'Poppins-Regular',
          fontWeight: '400',
          letterSpacing: 0,
          color: theme.colors.black,
          marginLeft: theme.spacing.xs,
        },
      }),
    []
  );

  return (
    <Block style={styles.container}>
      <NativeTextInput
        style={styles.input}
        placeholder="Search"
        placeholderTextColor={theme.colors.black + '66'}
      />
      <Icon name="search" size={24} />
    </Block>
  );
};

export default TextInput;
