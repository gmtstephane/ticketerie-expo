import AsyncStorage from '@react-native-async-storage/async-storage';

export namespace Favorites {
	export namespace Events {
		export async function Set(eventId: string) {
			await AsyncStorage.setItem(`fav-event-${eventId}`, 'true');
		}
		export async function Remove(eventId: string) {
			await AsyncStorage.removeItem(`fav-event-${eventId}`);
		}
		export async function Is(eventId: string) {
			return (await AsyncStorage.getItem(`fav-event-${eventId}`)) === 'true';
		}
		export async function List() {
			const keys = await AsyncStorage.getAllKeys();
			return keys.filter((key) => key.startsWith('fav-event-')).map((key) => key.replace('fav-event-', ''));
		}
	}

	export namespace Team {
		export async function Set(teamId: number) {
			await AsyncStorage.setItem(`fav-team-${teamId.toString()}`, 'true');
		}
		export async function Remove(teamId: number) {
			await AsyncStorage.removeItem(`fav-team-${teamId.toString()}`);
		}
		export async function Is(teamId: number) {
			return (await AsyncStorage.getItem(`fav-team-${teamId.toString()}`)) === 'true';
		}
		export async function List() {
			const keys = await AsyncStorage.getAllKeys();
			return keys.filter((key) => key.startsWith('fav-team-')).map((key) => key.replace('fav-team-', ''));
		}
	}
}
