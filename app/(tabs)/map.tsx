import { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import MapView, { MapMarker } from 'react-native-maps';
import * as Location from 'expo-location';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { EventDescription } from '@/src/api/model';
import { Image } from 'expo-image';
import { Category } from '@/components/EventCategory';

export default function MapPage() {
	const { initEvents } = useLocalSearchParams<{ initEvents: string }>();
	const eventinit: EventDescription[] = JSON.parse(initEvents);

	const [location, setLocation] = useState<Location.LocationObject | null>(null);
	const [errorMsg, setErrorMsg] = useState<string | null>(null);
	const router = useRouter();

	useEffect(() => {
		(async () => {
			let { status } = await Location.requestForegroundPermissionsAsync();
			if (status !== 'granted') {
				setErrorMsg('Permission to access location was denied');
				return;
			}

			let location = await Location.getCurrentPositionAsync({});
			setLocation(location);
		})();
	}, []);

	if (location === null) {
		return (
			<View className=" h-full w-full">
				<Text>Location is nil</Text>
			</View>
		);
	}

	const cate: Category = {
		Description: 'evens by locations',
		Name: 'Location',
		Events: eventinit,
	};

	const groupedEvents = groupEventsByLocation(eventinit);
	return (
		<View className="bg-white h-full w-full">
			<MapView
				showsUserLocation
				camera={{
					center: {
						latitude: location.coords.latitude,
						longitude: location.coords.longitude,
					},
					zoom: 16,
					heading: 0,
					pitch: 0,
					altitude: 60000,
				}}
				className="h-full w-full">
				{groupedEvents.map((group) => {
					return (
						<MapMarker
							key={group.Name}
							coordinate={{
								latitude: group.Events[0].latitude,
								longitude: group.Events[0].longitude,
							}}
							onPress={() => {
								router.push({
									pathname: '/locationList',
									params: {
										category: JSON.stringify(group),
									},
								});
							}}>
							<Image source={group.Events[0].icon} className="w-12 h-12" contentFit="contain"></Image>
						</MapMarker>
					);
				})}
				{/* {eventinit.map((event) => (
					<MapMarker
						key={event.id}
						coordinate={{
							latitude: event.latitude,
							longitude: event.longitude,
						}}
						onPress={() => {
							router.push({
								pathname: '/locationList',
								params: {
									category: JSON.stringify(cate),
								},
							});
						}}>
						<Image source={event.icon} className="w-12 h-12" contentFit="contain"></Image>
					</MapMarker>
				))} */}
			</MapView>
		</View>
	);
}

function groupEventsByLocation(events: EventDescription[]): Category[] {
	const groupedEvents: { [key: string]: EventDescription[] } = {};
	events.forEach((event) => {
		if (groupedEvents[event.location] === undefined) {
			groupedEvents[event.location] = [];
		}
		groupedEvents[event.location].push(event);
	});

	return Object.keys(groupedEvents).map((location) => {
		return {
			Description: 'events by locations',
			Name: location,
			Events: groupedEvents[location],
		};
	});
}
