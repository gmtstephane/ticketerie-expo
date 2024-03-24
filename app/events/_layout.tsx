import { Stack } from 'expo-router';
import { View } from 'react-native';

export default function Nav() {
	return (
		<View className="bg-white h-full w-full">
			<Stack
				screenOptions={{
					contentStyle: { backgroundColor: '#ffffff' },
				}}>
				<Stack.Screen
					name="index"
					options={{
						title: 'EventID',
						headerShown: false,
					}}
				/>
			</Stack>
		</View>
	);
}
