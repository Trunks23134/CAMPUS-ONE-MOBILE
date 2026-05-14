import * as Font from 'expo-font';
import * as Inter from '@expo-google-fonts/inter';

export const loadFonts = () => {
  return Font.loadAsync({
    Inter_400Regular: Inter.Inter_400Regular,
    Inter_500Medium: Inter.Inter_500Medium,
    Inter_600SemiBold: Inter.Inter_600SemiBold,
    Inter_700Bold: Inter.Inter_700Bold,
    Inter_800ExtraBold: Inter.Inter_800ExtraBold,
    Inter_900Black: Inter.Inter_900Black,
  });
};

export const themeFont = {
  inter: {
    regular: 'Inter_400Regular',
    medium: 'Inter_500Medium',
    semiBold: 'Inter_600SemiBold',
    bold: 'Inter_700Bold',
    extraBold: 'Inter_800ExtraBold',
    black: 'Inter_900Black',
  },
};

export const getFontStyle = (variant: keyof typeof themeFont.inter) => ({
  fontFamily: themeFont.inter[variant] as string,
});

