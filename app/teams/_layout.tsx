import { Stack } from 'expo-router';

export default function Nav() {
	return (
		<Stack
			screenOptions={{
				contentStyle: { backgroundColor: '#ffffff' },
			}}>
			<Stack.Screen
				name="index"
				options={{
					title: 'teamsID',
					headerShown: false,
				}}
			/>
		</Stack>
	);
}
