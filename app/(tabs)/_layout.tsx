import React, { useEffect } from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Link, Tabs } from 'expo-router';
import { Pressable, useColorScheme } from 'react-native';

import Colors from '@/constants/Colors';
import { Auth } from '@/src/auth/auth';
import { router } from 'expo-router';
import { EventDescription } from '@/src/api/model';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { MD3Colors, useTheme } from 'react-native-paper';

// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
function TabBarIcon(props: { name: React.ComponentProps<typeof FontAwesome>['name']; color: string }) {
	return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
	const colors = useTheme().colors;
	return (
		<Tabs
			screenOptions={{
				// Disable the static render of the header on web
				// to prevent a hydration error in React Navigation v6.
				tabBarActiveTintColor: colors.primary,
				tabBarStyle: {
					borderTopWidth: 0,
				},
			}}>
			<Tabs.Screen
				name="index"
				options={{
					title: 'Evenements',
					headerTintColor: colors.primary,
					headerShown: false,
					tabBarIcon: ({ color, focused }) =>
						focused ? (
							<MaterialCommunityIcons name="map-marker" size={24} color={color} />
						) : (
							<MaterialCommunityIcons name="map-marker-outline" size={24} color={color} />
						),
				}}
			/>
		</Tabs>
	);
}
