import { Stack } from 'expo-router';

export default function Nav() {
	return (
		<Stack>
			<Stack.Screen
				name="index"
				options={{
					title: 'EventID',
					headerShown: false,
				}}
			/>
		</Stack>
	);
}
