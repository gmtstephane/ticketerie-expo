import { User } from '@/src/api/model';
import { getUser, loginWithGoogle, refreshToken } from '@/src/api/ticketerie';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { jwtDecode } from 'jwt-decode';
import { decode } from 'base-64';
global.atob = decode;

export namespace Auth {
	export async function Logout() {
		await Token.Remove();
		await RefreshToken.Remove();
		await User.Remove();
	}

	export async function IsLoggedIn(): Promise<boolean> {
		//return true if we have token refresh token and user
		const token = await Token.Get();
		if (!token) {
			console.log('no token');
			return false;
		}
		const decodedToken = jwtDecode(token);
		if (!decodedToken) {
			console.log('no refresh token');
			return false;
		}

		if (decodedToken.exp && decodedToken.exp * 1000 < Date.now()) {
			const refreshToken = await RefreshToken.Get();
			if (!refreshToken) {
				console.log('no refresh token');
				return false;
			}
			try {
				await RefreshToken.Refresh(refreshToken);
				return true;
			} catch (error) {
				console.log('error', error);
				return false;
			}
		}

		const refreshToken = await RefreshToken.Get();
		const user = await User.Get();
		return token && refreshToken && user ? true : false;
	}

	export namespace User {
		export async function Set(user: User) {
			await AsyncStorage.setItem('user', JSON.stringify(user));
		}

		export async function Get(): Promise<User> {
			const user = await AsyncStorage.getItem('user');
			return user ? JSON.parse(user) : null;
		}
		export async function Remove() {
			await AsyncStorage.removeItem('user');
		}
	}

	export namespace Token {
		export async function Set(token: string) {
			await AsyncStorage.setItem('bearerToken', token);
		}
		export async function Get() {
			return await AsyncStorage.getItem('bearerToken');
		}
		export async function Remove() {
			await AsyncStorage.removeItem('bearerToken');
		}
	}

	export namespace RefreshToken {
		export async function Set(token: string) {
			await AsyncStorage.setItem('refreshToken', token);
		}
		export async function Get() {
			return await AsyncStorage.getItem('refreshToken');
		}
		export async function Remove() {
			await AsyncStorage.removeItem('refreshToken');
		}

		export async function Refresh(token: string) {
			console.log('refresh token');
			try {
				const resp = await refreshToken({ refreshToken: token });
				await Token.Set(resp.token);
				await RefreshToken.Set(resp.refreshToken);
				const user = await getUser();
				await User.Set(user);
				console.log('refresh token success');
			} catch (error) {
				console.log('refresh token error', error);
				throw error;
			}
		}
	}

	export namespace Google {
		// // const CLIENTID = process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID;
		GoogleSignin.configure({
			webClientId: '115420024441-o3fet5972ajokablcjcb7jmhuqrvlb9r.apps.googleusercontent.com', // client ID of type WEB for your server. Required to get the idToken on the user object, and for offline access.
		});

		export async function Login() {
			try {
				await GoogleSignin.hasPlayServices();
				const userInfo = await GoogleSignin.signIn({});

				if (!userInfo.idToken) throw new Error('No idToken');
				const resp = await loginWithGoogle({ idToken: userInfo.idToken });
				await Token.Set(resp.token);
				await RefreshToken.Set(resp.refreshToken);

				const user = await getUser();
				await User.Set(user);
			} catch (error) {
				console.log('error', error);
				throw error;
			}
		}
	}
}
