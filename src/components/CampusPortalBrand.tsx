import React from 'react';
import { View, Text, StyleSheet, StyleProp, ViewStyle, TextStyle } from 'react-native';

type Props = {
  containerStyle?: StyleProp<ViewStyle>;
  titleStyle?: StyleProp<TextStyle>;
  showPortal?: boolean;
};

export default function CampusPortalBrand({
  containerStyle,
  titleStyle,
  showPortal = true,
}: Props) {
  return (
    <View style={[styles.container, containerStyle]}>
      <Text style={[styles.title, titleStyle]}>
        <Text style={styles.campus}>CAMPUS</Text>
        {showPortal && <Text style={styles.portal}> Portal</Text>}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: -0.5,
  },
  campus: {
    color: '#F59E0B',
  },
  portal: {
    color: '#fff',
  },
});
