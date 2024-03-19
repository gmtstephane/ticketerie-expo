import { StyleSheet } from 'react-native';
import { GoogleSigninButton } from '@react-native-google-signin/google-signin';
import { Text, View } from '@/components/Themed';
import { useState } from 'react';
import axios from 'axios';
import { Auth } from '@/src/auth/auth';
import { router } from 'expo-router';

interface LoginScreenProps {
	onLoggingSuccess: () => void;
	onLoggingFailure: (error: Error) => void;
}
export default function TabOneScreen({ onLoggingSuccess, onLoggingFailure }: LoginScreenProps) {
	axios.defaults.baseURL = 'http://localhost:4321/'; // use your own URL here or environment variable

	return (
		<View style={styles.container}>
			<Text style={styles.title}>Tab One</Text>
			<View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
			<GoogleSigninButton
				size={GoogleSigninButton.Size.Wide}
				color={GoogleSigninButton.Color.Dark}
				onPress={async () => {
					await Auth.Google.Login()
						.then(() => {
							onLoggingSuccess();
						})
						.catch((error) => {
							onLoggingFailure(error);
						});
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
