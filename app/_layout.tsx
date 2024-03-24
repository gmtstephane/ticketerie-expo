import FontAwesome from '@expo/vector-icons/FontAwesome';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack, router } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import { configureFonts, MD3DarkTheme, MD3LightTheme, useTheme } from 'react-native-paper';

import { Auth } from '@/src/auth/auth';
import { Text } from 'react-native';
import Login from './login';
export {
	// Catch any errors thrown by the Layout component.
	ErrorBoundary,
} from 'expo-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import axios from 'axios';
import { PaperProvider } from 'react-native-paper';
import { ThemeProp } from 'react-native-paper/lib/typescript/types';
const queryClient = new QueryClient();

export const unstable_settings = {
	// Ensure that reloading on `/modal` keeps a back button present.
	initialRouteName: '/login',
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
	const [loaded, error] = useFonts({
		SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
		'Poppins-Bold': require('../assets/fonts/Poppins-Bold.ttf'),
		'Poppins-Italic': require('../assets/fonts/Poppins-Italic.ttf'),
		'Poppins-BoldItalic': require('../assets/fonts/Poppins-BoldItalic.ttf'),
		'Poppins-Regular': require('../assets/fonts/Poppins-Regular.ttf'),
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
	// axios.defaults.baseURL = 'http://localhost:4321/'; // use your own URL here or environment variable

	const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);

	useEffect(() => {
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
			<Login
				onLoggingFailure={(e) => {
					console.log('error', e);
				}}
				onLoggingSuccess={() => {
					setIsLoggedIn(true);
				}}
			/>
		);
	}

	const lightTheme: ThemeProp = {
		...MD3LightTheme,
		fonts: configureFonts({
			config: {
				fontFamily: 'Poppins-Regular',
				fontStyle: 'normal',
			},
		}),
		colors: {
			...MD3LightTheme.colors,
			background: '#ffffff',
			onSecondary: '#ffffff',
			surface: '#ffffff',
			onSecondaryContainer: '#ffffff',
			primary: '#5E81AC',
			elevation: {
				level3: '#F2FAFF',
			},
			primaryContainer: '#F2FAFF',
		},
		roundness: 2,
	};

	return (
		<QueryClientProvider client={queryClient}>
			<PaperProvider theme={lightTheme}>
				<Stack>
					<Stack.Screen name="(tabs)" options={{ headerShown: false }} />
					<Stack.Screen name="events" options={{ headerShown: false }} />
					<Stack.Screen
						name="login"
						options={{
							title: 'Login',
							headerShown: false,
						}}
					/>
				</Stack>
			</PaperProvider>
		</QueryClientProvider>
	);
}
