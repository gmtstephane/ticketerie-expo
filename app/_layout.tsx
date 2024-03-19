import FontAwesome from '@expo/vector-icons/FontAwesome';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack, router } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';

import { useColorScheme } from '@/components/useColorScheme';
import { Auth } from '@/src/auth/auth';
import { Text } from 'react-native';
import TabOneScreen from './login';

export {
	// Catch any errors thrown by the Layout component.
	ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
	// Ensure that reloading on `/modal` keeps a back button present.
	initialRouteName: '/login',
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
	const [loaded, error] = useFonts({
		SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
		...FontAwesome.font,
	});

	// Expo Router uses Error Boundaries to catch errors in the navigation tree.
	useEffect(() => {
		if (error) throw error;
	}, [error]);

	useEffect(() => {
		if (loaded) {
			SplashScreen.hideAsync();
		}
	}, [loaded]);

	if (!loaded) {
		return null;
	}

	return <RootLayoutNav />;
}

function RootLayoutNav() {
	const colorScheme = useColorScheme();

	const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);

	useEffect(() => {
		console.log('AKOUKOU');
		Auth.IsLoggedIn()
			.then((isLoggedIn) => {
				console.log('isLoggedIn', isLoggedIn);
				if (isLoggedIn) {
					setIsLoggedIn(true);
				} else {
					setIsLoggedIn(false);
				}
			})
			.catch((error: any) => {
				setIsLoggedIn(false);
			});
	}, []);

	if (isLoggedIn === null) {
		return <Text>Loading</Text>;
	}
	if (isLoggedIn === false) {
		console.log('rendering loggin screen');
		return (
			<TabOneScreen
				onLoggingFailure={(e) => {
					console.log('error', e);
				}}
				onLoggingSuccess={() => {
					setIsLoggedIn(true);
				}}
			/>
		);
		// <Stack.Screen name="login" options={{ headerShown: false }} />

		// <Text>Wating</Text>
		// <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
		// 	<Stack>
		// 	</Stack>
		// </ThemeProvider>
	}

	return (
		<ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
			<Stack>
				<Stack.Screen name="(tabs)" options={{ headerShown: false }} />
				{/* <Stack.Screen name="login" options={{ headerShown: false }} /> */}

				<Stack.Screen name="modal" options={{ presentation: 'modal' }} />
			</Stack>
		</ThemeProvider>
	);
}
