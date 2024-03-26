import { frenchDate } from '@/components/EventCard';
import { Championship, Event, EventGeneric, EventPlayer, EventTeam, Location, Ticket } from '@/src/api/model';
import { useGetEventById } from '@/src/api/ticketerie';
import { Favorites } from '@/src/favs/store';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useGlobalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { ScrollView, View } from 'react-native';
import MapView from 'react-native-maps';
import { Appbar, Chip, List, MD3Colors, Text, useTheme } from 'react-native-paper';

export default function Page() {
	const local = useGlobalSearchParams();
	const colors = useTheme().colors;
	const router = useRouter();
	const [favorite, setFavorite] = useState(false);
	let id: string;
	if (!local.id || typeof local.id !== 'string') {
		router.back();
		return null;
	}
	id = local.id;

	useEffect(() => {
		Favorites.Events.Is(id).then((is) => setFavorite(is));
	});

	const resp = useGetEventById(local.id);
	if (!resp.data) {
		return <View className="h-full w-full" style={{ backgroundColor: colors.background }} />;
	}

	return (
		<View style={{ flex: 1, backgroundColor: colors.background }}>
			<Appbar.Header className="">
				<Appbar.BackAction
					onPress={() => {
						router.back();
					}}
				/>
				<Appbar.Content title={resp.data.sport.name} />
				<Appbar.Action
					icon={favorite ? 'heart' : 'heart-outline'}
					iconColor={colors.primary}
					size={32}
					onPress={() => {
						if (favorite) {
							Favorites.Events.Remove(id);
							setFavorite(false);
						} else {
							Favorites.Events.Set(id);
							setFavorite(true);
						}
					}}
				/>
			</Appbar.Header>
			<ScrollView showsVerticalScrollIndicator={false}>
				<EventPage event={resp.data} />
				<LocationView location={resp.data.location} />
			</ScrollView>
		</View>
	);
}

function LocationView({ location }: { location: Location }) {
	return (
		<List.Section className="px-3 pb-10">
			<List.Subheader>Acces</List.Subheader>
			<View className="h-48 w-full px-5 rounded-md overflow-hidden ">
				<View className="h-full w-full rounded-xl bg-red-50 overflow-hidden">
					<MapView
						scrollEnabled={false}
						camera={{
							center: {
								latitude: location.latitude,
								longitude: location.longitude,
							},
							zoom: 9,
							altitude: 1000,
							heading: 0,
							pitch: 40,
						}}
						className="h-full w-full rounded-md"
					/>
				</View>
			</View>
			<View className="h-10"></View>
		</List.Section>
	);
}

function EventPage({ event }: { event: Event }) {
	if (isEventTeam(event)) {
		return <EventTeamPage event={event} />;
	}
	if (isEventPlayer(event)) {
		return <EventPlayerPage event={event} />;
	}
	if (isEventGeneric(event)) {
		return <EventGenericPage event={event} />;
	}
	return <Text>Unknown Event</Text>;
}

function EventGenericPage({ event }: { event: EventGeneric }) {
	return (
		<View className="px-3">
			<View className="w-full  h-32 px-20 mb-6">
				<View className=" w-full h-32 flex justify-center text-center items-center">
					<Image contentFit="contain" source={event.icon} className="w-full h-full"></Image>
					<Text variant="headlineSmall">{event.name}</Text>
				</View>
			</View>
			<InfoSection location={event.location} eventDate={event.eventDate} />
			<TicketingSection tickets={event.tickets} />
		</View>
	);
}
function EventTeamPage({ event }: { event: EventTeam }) {
	const router = useRouter();

	function pushTeam(id: number) {
		router.push({
			pathname: '/teams/',
			params: {
				id: id,
			},
		});
	}

	return (
		<View className="px-3">
			<List.Section>
				<List.Item
					title={event.homeTeam.name}
					onPress={() => {
						pushTeam(event.homeTeamId);
					}}
					titleStyle={{ fontSize: 20 }}
					left={(props) => (
						<Image contentFit="contain" {...props} source={event.homeTeam.icon} className=" h-12 w-12 aspect-square"></Image>
					)}
				/>
				<List.Item
					title={event.awayTeam.name}
					onPress={() => {
						pushTeam(event.awayTeam.id);
					}}
					titleStyle={{ fontSize: 20 }}
					left={(props) => (
						<Image contentFit="contain" {...props} source={event.awayTeam.icon} className=" h-12 w-12 aspect-square"></Image>
					)}
				/>
			</List.Section>
			<InfoSection championship={event.championship} location={event.location} eventDate={event.eventDate} />
			<TicketingSection tickets={event.tickets} />
		</View>
	);
}

function EventPlayerPage({ event }: { event: EventPlayer }) {
	return (
		<View className="px-3">
			<List.Section>
				<List.Item title={event.player1.name} titleStyle={{ fontSize: 20 }} />
				<List.Item title={event.player2.name} titleStyle={{ fontSize: 20 }} />
			</List.Section>
			<InfoSection championship={event.championship} location={event.location} eventDate={event.eventDate} />
			<TicketingSection tickets={event.tickets} />
		</View>
	);
}

interface InfoSectionProps {
	championship?: Championship;
	location: Location;
	eventDate: string;
}
function InfoSection({ championship, location, eventDate }: InfoSectionProps) {
	const colors = useTheme().colors;
	return (
		<List.Section>
			<List.Subheader>Informations</List.Subheader>
			{championship && (
				<List.Item
					titleStyle={{ fontSize: 14 }}
					title={championship.name}
					className="pl-2"
					left={(props) => <Image contentFit="contain" {...props} source={championship.icon} className=" h-6 w-6 "></Image>}
				/>
			)}
			<List.Item
				titleStyle={{ fontSize: 14 }}
				title={location.name}
				className="pl-6"
				left={({ color }) => <List.Icon color={color} icon="map-marker" />}
			/>
			<List.Item
				titleStyle={{ fontSize: 14 }}
				title={frenchDate(eventDate)}
				className="pl-6"
				left={({ color }) => <List.Icon color={color} icon="calendar" />}
			/>
		</List.Section>
	);
}

function TicketingSection(tickets: { tickets: Ticket[] }) {
	const colors = useTheme().colors;

	return (
		<List.Section>
			<List.Subheader>Billeteries</List.Subheader>
			{tickets.tickets.map((ticket) => (
				<List.Item
					key={ticket.id}
					titleStyle={{ fontSize: 14 }}
					title={ticket.ticketing.name}
					className="pl-2"
					right={(props) => (
						<Chip className="font-semibold">
							<Text
								style={{
									fontWeight: 'bold',
								}}>
								{ticket.price}€
							</Text>
						</Chip>
					)}
					left={(props) => <Image contentFit="contain" {...props} source={ticket.ticketing.icon} className=" h-6 w-6 "></Image>}
				/>
			))}
		</List.Section>
	);
}

function isEventTeam(event: Event): event is EventTeam {
	return (event as EventTeam).awayTeamId !== undefined && (event as EventTeam).homeTeamId !== undefined;
}

function isEventPlayer(event: Event): event is EventPlayer {
	return (event as EventPlayer).player1 !== undefined && (event as EventPlayer).player2 !== undefined;
}

function isEventGeneric(event: Event): event is EventGeneric {
	return isEventPlayer(event) === false && isEventTeam(event) === false;
}
