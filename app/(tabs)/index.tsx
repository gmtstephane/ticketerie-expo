import { Button, Image, StyleSheet } from 'react-native';

import EditScreenInfo from '@/components/EditScreenInfo';
import { Text, View } from '@/components/Themed';
import { Auth } from '@/src/auth/auth';
import { useEffect, useState } from 'react';
import { User } from '@/api/model';
import { router } from 'expo-router';

export default function TabTwoScreen() {
	const [user, setUser] = useState<User | null>(null);
	useEffect(() => {
		(async () => {
			const user = await Auth.User.Get();
			setUser(user);
		})();
	}, [user]);

	return (
		<View style={styles.container}>
			<Text style={styles.title}>Tab One</Text>
			<Image source={{ uri: user?.picture }} style={{ width: 100, height: 100 }} />
			{/* <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" /> */}
			{/* <EditScreenInfo path="app/(tabs)/two.tsx" /> */}
			<Button
				title="Logout"
				onPress={async () => {
					await Auth.Logout();
					router.replace('/login');
				}}
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
	},
	title: {
		fontSize: 20,
		fontWeight: 'bold',
	},
	separator: {
		marginVertical: 30,
		height: 1,
		width: '80%',
	},
});
