import { Platform, ViewStyle } from 'react-native';

type ShadowLevel = 'card' | 'button';

export const getShadow = (level: ShadowLevel): ViewStyle => {
  if (Platform.OS === 'ios') {
    return {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: level === 'card' ? 2 : 4 },
      shadowOpacity: level === 'card' ? 0.08 : 0.15,
      shadowRadius: level === 'card' ? 4 : 6,
    };
  }

  return {
    elevation: level === 'card' ? 2 : 4,
  };
};
