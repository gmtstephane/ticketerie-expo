import { EventDescription, User } from '@/src/api/model';
import { RefreshControl, SafeAreaView, ScrollView, View } from 'react-native';
import { Card, Searchbar, useTheme } from 'react-native-paper';
import { useGetEvents } from '@/src/api/ticketerie';
import { EventCard } from '@/components/EventCard';
import { useEffect, useState } from 'react';
import { Image } from 'expo-image';
import { Auth } from '@/src/auth/auth';

export default function Page() {
	const theme = useTheme();

	const [search, setSearch] = useState('');
	const [user, setUser] = useState<User | null>(null);
	useEffect(() => {
		Auth.User.Get().then((u) => setUser(u));
	}, []);

	const response = useGetEvents();
	if (!response.data) return null;
	if (!user) return null;

	return (
		<SafeAreaView style={{ backgroundColor: theme.colors.background }} className="h-full w-full">
			<View className="px-4">
				<View className=" w-full flex flex-row items-center mb-8">
					<Searchbar
						className="flex-grow"
						placeholder="Search"
						right={(props) => <Image {...props} className="h-8 w-8 rounded-md" source={user.picture}></Image>}
						onChangeText={(e) => {
							setSearch(e);
						}}
						value={search}
					/>
				</View>
			</View>
			<ScrollView
				refreshControl={
					<RefreshControl
						refreshing={response.isLoading}
						onRefresh={response.refetch}
						colors={[theme.colors.primary]}
						progressBackgroundColor={theme.colors.background}
					/>
				}
				className="flex-1 gap-y-5 "
				style={{ backgroundColor: theme.colors.background }}>
				<EventsPage events={response.data} />
			</ScrollView>
		</SafeAreaView>
	);
}

function EventsPage({ events }: { events: EventDescription[] }) {
	UpcomingEvents.Events = events.filter((e) => UpcomingEvents.Condition(e));
	AllEvents.Events = events.filter((e) => AllEvents.Condition(e));

	const cate = [UpcomingEvents, AllEvents];
	return (
		<View className="flex">
			{cate.map((category) => (
				<View key={category.Name + 'Container'}>
					<CategoryView key={category.Name} category={category} />
				</View>
			))}
		</View>
	);
}

interface Category {
	Name: string;
	Description: string;
	Events: EventDescription[];
	Condition: (event: EventDescription) => boolean;
}

let UpcomingEvents: Category = {
	Name: 'A venir',
	Description: 'Les événements à venir',
	Events: [],
	Condition: (event) => {
		const now = new Date();
		const nextWeek = new Date(now);
		const eventDate = new Date(event.date);
		nextWeek.setDate(now.getDate() + 7);
		return eventDate >= now && eventDate <= nextWeek;
	},
};

let AllEvents: Category = {
	Name: 'Tous les événements',
	Description: 'Tous les événements',
	Events: [],
	Condition: () => {
		return true;
	},
};

function CategoryView({ category }: { category: Category }) {
	return (
		<View>
			<Card.Title titleVariant="titleLarge" title={category.Name} subtitle={category.Description} className="" />
			<ScrollView horizontal className="py-3" showsHorizontalScrollIndicator={false}>
				{category.Events.map((event: EventDescription) => (
					<View className="max-w-xs h-[180px] p-2" key={event.id + 'Container'}>
						<EventCard event={event} key={event.id} />
					</View>
				))}
			</ScrollView>
		</View>
	);
}
