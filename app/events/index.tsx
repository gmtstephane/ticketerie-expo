import { frenchDate } from '@/components/EventCard';
import { Championship, Event, EventGeneric, EventPlayer, EventTeam, Location, Ticket } from '@/src/api/model';
import { useGetEventById } from '@/src/api/ticketerie';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useGlobalSearchParams } from 'expo-router';
import { View } from 'react-native';
import { Appbar, Chip, List, MD3Colors, Text, useTheme } from 'react-native-paper';

export default function Page() {
	const local = useGlobalSearchParams();
	const colors = useTheme().colors;
	const router = useRouter();

	if (!local.id || typeof local.id !== 'string') {
		router.back();
		return null;
	}

	const resp = useGetEventById(local.id);
	if (!resp.data) {
		return null;
	}
	return (
		<View
			style={{
				flex: 1,
				backgroundColor: colors.background,
			}}>
			<Appbar.Header className="">
				<Appbar.BackAction
					onPress={() => {
						router.back();
					}}
				/>
				<Appbar.Content title={resp.data.sport.name} />

				<Appbar.Action icon={'heart'} iconColor={colors.primary} />
			</Appbar.Header>
			<EventPage event={resp.data} />
		</View>
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
	return (
		<View className="px-3">
			<List.Section>
				<List.Item
					title={event.homeTeam.name}
					titleStyle={{ fontSize: 20 }}
					left={(props) => (
						<Image contentFit="contain" {...props} source={event.homeTeam.icon} className=" h-12 w-12 aspect-square"></Image>
					)}
				/>
				<List.Item
					title={event.awayTeam.name}
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
				left={() => <List.Icon color={colors.primary} icon="map-marker" />}
			/>
			<List.Item
				titleStyle={{ fontSize: 14 }}
				title={frenchDate(eventDate)}
				className="pl-6"
				left={() => <List.Icon color={colors.primary} icon="calendar" />}
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
						<Chip style={{ backgroundColor: colors.primaryContainer }}>
							<Text>{ticket.price}€</Text>
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
