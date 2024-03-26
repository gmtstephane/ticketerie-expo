import React from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Tabs, router } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from 'react-native-paper';
import { useGetEvents } from '@/src/api/ticketerie';

export default function TabLayout() {
	const colors = useTheme().colors;
	const response = useGetEvents();
	if (response.isError) {
		router.push({ pathname: `/error`, params: { error: response.error.message } });
		return null;
	}
	if (!response.data) {
		return null;
	}

	return (
		<Tabs
			screenOptions={{
				// Disable the static render of the header on web
				// to prevent a hydration error in React Navigation v6.
				tabBarActiveTintColor: colors.primary,
				lazy: false,
				// tabBarInactiveTintColor: colors.onPrimaryContainer,
				tabBarStyle: {
					borderTopWidth: 0,
					backgroundColor: colors.background,
				},
			}}>
			<Tabs.Screen
				name="index"
				initialParams={{ initEvents: JSON.stringify(response.data) }}
				options={{
					title: 'Evenements',
					headerTintColor: colors.primary,

					headerShown: false,
					tabBarIcon: ({ color, focused }) =>
						focused ? (
							<MaterialCommunityIcons name="earth" size={24} color={color} />
						) : (
							<MaterialCommunityIcons name="earth" size={24} color={color} />
						),
				}}
			/>

			<Tabs.Screen
				name="map"
				initialParams={{ initEvents: JSON.stringify(response.data) }}
				options={{
					title: 'Explorer',
					headerTintColor: colors.primary,
					lazy: false,
					headerShown: false,
					tabBarIcon: ({ color, focused }) =>
						focused ? (
							<MaterialCommunityIcons name="map" size={24} color={color} />
						) : (
							<MaterialCommunityIcons name="map-outline" size={24} color={color} />
						),
				}}
			/>

			<Tabs.Screen
				name="favorites"
				options={{
					// unmountOnBlur: true,
					title: 'Favoris',
					headerTintColor: colors.primary,
					headerShown: false,
					tabBarIcon: ({ color, focused }) =>
						focused ? (
							<MaterialCommunityIcons name="heart" size={24} color={color} />
						) : (
							<MaterialCommunityIcons name="heart-outline" size={24} color={color} />
						),
				}}
			/>
		</Tabs>
	);
}
