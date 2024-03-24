import { Link, Stack, useGlobalSearchParams } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';

export default function NotFoundScreen() {
	const local = useGlobalSearchParams();
	console.log(local.error);

	return (
		<>
			<Stack.Screen options={{ title: 'Oops!' }} />
			<View className="w-full h-full flex items-center justify-center">
				<Text variant="headlineLarge">{local.error}</Text>
			</View>
		</>
	);
}
