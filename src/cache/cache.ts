import AsyncStorage from '@react-native-async-storage/async-storage';
import { EventDescription } from '../api/model';

const cacheExpiration = 1000 * 60 * 5; // 5 minutes

export namespace Cache {
	export namespace Events {
		export async function SetEvents(events: EventDescription[]) {
			console.log('Setting events in cache');
			await AsyncStorage.setItem(
				'events-cache',
				JSON.stringify({
					data: events,
					expiration: Date.now() + cacheExpiration,
				})
			);
		}
		export async function GetEvents(): Promise<EventDescription[] | null> {
			const cache = await AsyncStorage.getItem('events-cache');
			if (cache === null) {
				return null;
			}
			const parsedCache = JSON.parse(cache);
			if (parsedCache.expiration < Date.now()) {
				return null;
			}
			return parsedCache.data;
		}
	}
}
