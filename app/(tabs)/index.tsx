import { EventDescription, SearchEvent, User } from '@/src/api/model';
import { Pressable, RefreshControl, SafeAreaView, ScrollView, View } from 'react-native';
import { Card, Icon, List, Searchbar, SegmentedButtons, Text, useTheme } from 'react-native-paper';
import { useGetEvents, useSearchEvents, useSearchTeams } from '@/src/api/ticketerie';
import { useEffect, useRef, useState } from 'react';
import { Image } from 'expo-image';
import { Auth } from '@/src/auth/auth';
import { Link, useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { CategoryBuilder, CategoryViewHorizontal } from '@/components/EventCategory';

export default function Page() {
	const theme = useTheme();
	const router = useRouter();
	const [search, setSearch] = useState('');
	const [isSearching, setIsSearching] = useState(false);
	const [user, setUser] = useState<User | null>(null);
	const searchbarRef = useRef<any>(null);

	useEffect(() => {
		Auth.User.Get().then((u) => setUser(u));
	}, []);

	if (!user) return null;

	return (
		<SafeAreaView style={{ backgroundColor: theme.colors.background }} className="h-full w-full">
			<View className="p-5">
				<Searchbar
					ref={searchbarRef}
					placeholder="Rechercher"
					onFocus={() => setIsSearching(true)}
					right={(props) => (
						<View>
							{!isSearching && (
								<Pressable
									onPress={() => {
										router.push({ pathname: '/profile' });
									}}>
									<Image {...props} className="h-8 w-8 rounded-full" source={user.picture} />
								</Pressable>
							)}
							{isSearching && (
								<MaterialCommunityIcons
									onPress={() => {
										setSearch('');
										setIsSearching(false);
										searchbarRef.current.blur();
									}}
									name="close"
									{...props}
									size={24}
								/>
							)}
						</View>
					)}
					onChangeText={(e) => {
						setSearch(e);
					}}
					value={search}
				/>
			</View>

			{!isSearching && <EventsPage />}
			{isSearching && <SearchView name={search} />}
		</SafeAreaView>
	);
}

let UpcomingEvents: CategoryBuilder = {
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

let AllEvents: CategoryBuilder = {
	Name: 'Tous les événements',
	Description: 'Tous les événements',
	Events: [],
	Condition: () => {
		return true;
	},
};

function EventsPage() {
	const response = useGetEvents();
	const theme = useTheme();
	const router = useRouter();
	if (response.isError) {
		router.push({ pathname: `/error`, params: { error: response.error.message } });
		return null;
	}

	if (!response.data) return null;

	UpcomingEvents.Events = response.data.filter((e) => UpcomingEvents.Condition(e));
	AllEvents.Events = response.data.filter((e) => AllEvents.Condition(e));

	const cate = [UpcomingEvents, AllEvents];
	return (
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
			<View className="flex">
				{cate.map((category) => (
					<View key={category.Name + 'Container'}>
						<CategoryViewHorizontal
							key={category.Name}
							category={category}
							onPress={() => {
								router.push({ pathname: '/eventList', params: { category: JSON.stringify(category) } });
							}}
						/>
					</View>
				))}
			</View>
		</ScrollView>
	);
}

function SearchView({ name }: { name: string }) {
	const [value, setValue] = useState('event');

	const searchResponse = useSearchEvents({ name: name }, { query: { enabled: !!name } });

	if (searchResponse.isError) {
		return null;
	}

	return (
		<View className="px-5">
			<SegmentedButtons
				value={value}
				theme={{}}
				onValueChange={setValue}
				buttons={[
					{
						value: 'event',
						label: 'Evenement',
					},
					{
						value: 'team',
						label: 'Equipe',
					},
				]}
			/>
			<ScrollView showsVerticalScrollIndicator={false} className="h-full">
				{value === 'event' && <SearchViewEvents name={name} />}
				{value === 'team' && <SearchViewTeam name={name} />}
			</ScrollView>
		</View>
	);
}

function SearchViewEvents({ name }: { name: string }) {
	const searchResponse = useSearchEvents({ name: name });

	if (searchResponse.isError) {
		return null;
	}

	return (
		<List.Section className="h-full ">
			{searchResponse.data?.map((event) => (
				<Link
					key={event.id + 'link'}
					href={{
						pathname: '/events/',
						params: {
							id: event.id,
						},
					}}
					asChild>
					<Pressable key={event.id + 'pressable'}>
						<List.Item
							key={event.id}
							titleStyle={{ fontSize: 14 }}
							title={event.name}
							className="rounded-md"
							left={(props) => <Image contentFit="contain" {...props} source={event.icon} className=" h-8 w-8 "></Image>}
						/>
					</Pressable>
				</Link>
			))}
		</List.Section>
	);
}

function SearchViewTeam({ name }: { name: string }) {
	const searchResponse = useSearchTeams({ name: name });

	if (searchResponse.isError) {
		return null;
	}

	return (
		<List.Section className="h-full ">
			{searchResponse.data?.map((event) => (
				<Link
					key={event.id + 'link'}
					href={{
						pathname: '/teams/',
						params: {
							id: event.id,
						},
					}}
					asChild>
					<Pressable key={event.id + 'pressable'}>
						<List.Item
							key={event.id}
							titleStyle={{ fontSize: 14 }}
							title={event.name}
							className="rounded-md"
							left={(props) => <Image contentFit="contain" {...props} source={event.icon} className=" h-8 w-8 "></Image>}
						/>
					</Pressable>
				</Link>
			))}
		</List.Section>
	);
}
