import React from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';

interface AdmissionsWebViewProps {
  navigation: any;
}

export default function AdmissionsWebView({ navigation }: AdmissionsWebViewProps) {
  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <WebView
        source={{ uri: 'http://192.168.68.108:5173/admissions' }}
        style={styles.webview}
        startInLoadingState={true}
        renderLoading={() => (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#F59E0B" />
          </View>
        )}
        // Allow the web page to handle navigation
        onShouldStartLoadWithRequest={(request) => {
          // Allow all navigation within the app
          return true;
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  webview: {
    flex: 1,
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#2d3748',
  },
});
