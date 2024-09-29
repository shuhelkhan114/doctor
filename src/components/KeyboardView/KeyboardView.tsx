import { KeyboardAvoidingView, Platform, StyleSheet, ViewProps } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

interface KeyboardViewProps extends ViewProps {
  children: React.ReactNode;
}

const KeyboardView: React.FC<KeyboardViewProps> = (props) => {
  const { children, style, ...restProps } = props;

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[styles.container, style]}
      {...restProps}>
      {children}
    </KeyboardAvoidingView>
  );
};

export default KeyboardView;
