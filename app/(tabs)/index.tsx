import { EventDescription, SearchEvent, User } from '@/src/api/model';
import { Pressable, RefreshControl, SafeAreaView, ScrollView, View } from 'react-native';
import { Card, Icon, List, Searchbar, SegmentedButtons, Text, TextInput, useTheme } from 'react-native-paper';
import { getEvents, useGetEvents, useSearchEvents, useSearchTeams } from '@/src/api/ticketerie';
import { useEffect, useRef, useState } from 'react';
import { Image } from 'expo-image';
import { Auth } from '@/src/auth/auth';
import { Link, useLocalSearchParams, useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { CategoryBuilder, CategoryViewHorizontal } from '@/components/EventCategory';
import { Cache } from '@/src/cache/cache';

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
			<View className="px-5 py-6">
				<Searchbar
					elevation={0}
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
										searchbarRef.current.blur();
										setSearch('');
										setIsSearching(false);
									}}
									name="close"
									{...props}
									size={32}
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

			<EventsPage hidden={isSearching} />
			<SearchView hidden={!isSearching} name={search} />
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

function EventsPage({ hidden }: { hidden?: boolean }) {
	const { initEvents } = useLocalSearchParams<{ initEvents: string }>();
	const eventinit: EventDescription[] = JSON.parse(initEvents);

	const [events, setEvents] = useState<EventDescription[]>(eventinit);
	const [isRefreshing, setIsRefreshing] = useState(false);
	const theme = useTheme();
	const router = useRouter();

	function refetch() {
		setIsRefreshing(true);
		getEvents()
			.then((events) => {
				console.log('new events');
				setEvents(events);
			})
			.catch((e) => {
				console.error(e);
			})
			.finally(() => {
				setIsRefreshing(false);
			});
	}

	UpcomingEvents.Events = events.filter((e) => UpcomingEvents.Condition(e));
	AllEvents.Events = events.filter((e) => AllEvents.Condition(e));

	const cate = [UpcomingEvents, AllEvents];
	return (
		<ScrollView
			style={{ display: hidden ? 'none' : 'flex' }}
			refreshControl={
				<RefreshControl
					refreshing={isRefreshing}
					onRefresh={refetch}
					colors={[theme.colors.primary]}
					progressBackgroundColor={theme.colors.background}
				/>
			}
			className="flex-1 gap-y-5 ">
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

function SearchView({ name, hidden }: { name: string; hidden?: boolean }) {
	const [value, setValue] = useState('event');

	const searchResponse = useSearchEvents({ name: name }, { query: { enabled: !!name } });

	if (searchResponse.isError) {
		return null;
	}

	return (
		<View style={{ display: hidden ? 'none' : 'flex' }} className="px-5">
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
			<ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false} className="h-full">
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
