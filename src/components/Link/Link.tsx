import { Pressable } from 'react-native';

import Typography, { TypographyProps } from '../Typography/Typography';

interface LinkProps extends TypographyProps {
  onPress?: () => void;
}

const Link: React.FC<LinkProps> = (props) => {
  const { onPress, ...restProps } = props;
  return (
    <Pressable
      onPress={() => onPress?.()}
      style={({ pressed }) => ({ opacity: pressed ? 0.8 : 1 })}>
      <Typography {...restProps} />
    </Pressable>
  );
};

export default Link;
