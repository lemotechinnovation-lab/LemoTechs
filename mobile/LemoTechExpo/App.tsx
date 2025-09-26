import React from 'react';
import * as SplashScreen from 'expo-splash-screen';
import { AppNavigator } from './src/navigation/AppNavigator';
import { MobileSplashScreen } from './src/features/splash/SplashScreen';

// Main App Component with Navigation
export default function App() {
  const [showSplash, setShowSplash] = React.useState(true);
  React.useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        await SplashScreen.preventAutoHideAsync();
        // Simulate minimal load to ensure splash is visible
        await new Promise((res) => setTimeout(res, 300));
      } catch {}
      if (isMounted) {
        // Hide when app is ready
        SplashScreen.hideAsync().catch(() => {});
      }
    })();
    return () => { isMounted = false; };
  }, []);

  if (showSplash) {
    return (
      <MobileSplashScreen onComplete={() => setShowSplash(false)} durationMs={1400} />
    );
  }

  return <AppNavigator />;
}