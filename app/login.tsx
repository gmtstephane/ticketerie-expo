import { StyleSheet, View } from 'react-native';
import { GoogleSigninButton } from '@react-native-google-signin/google-signin';
import { useState } from 'react';
import axios from 'axios';
import { Auth } from '@/src/auth/auth';
import { router } from 'expo-router';
import { Text } from 'react-native-paper';

interface LoginScreenProps {
	onLoggingSuccess: () => void;
	onLoggingFailure: (e: any) => void;
}
export default function LoginPage({ onLoggingSuccess, onLoggingFailure }: LoginScreenProps) {
	return (
		<View style={styles.container}>
			<Text style={styles.title}>Tab One</Text>
			<View style={styles.separator} />
			<GoogleSigninButton
				size={GoogleSigninButton.Size.Wide}
				color={GoogleSigninButton.Color.Dark}
				onPress={async () => {
					await Auth.Google.Login()
						.then(() => {
							if (onLoggingSuccess) {
								onLoggingSuccess();
							} else {
								router.push({ pathname: '/' });
							}
						})
						.catch((error) => {
							console.log('error', error);
							if (onLoggingFailure) {
								onLoggingFailure(error);
							}
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
