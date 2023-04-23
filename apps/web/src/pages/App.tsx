import {
	AppShell,
	Avatar,
	Box,
	Burger,
	Center,
	Container,
	Group,
	Header,
	Indicator,
	Loader,
	MediaQuery,
	Navbar,
	ScrollArea,
	Stack,
	Text,
	Textarea,
	ThemeIcon,
	UnstyledButton,
	rem,
	useMantineTheme,
} from "@mantine/core";
import { IconChevronRight, IconChevronLeft } from "@tabler/icons-react";
import { Channel, Message } from "@zaunapp/client";
import { useEffect, useState } from "preact/hooks";
import { useClient } from "../utils";

export function User() {
	const client = useClient();
	const theme = useMantineTheme();
	return (
		<Box
			sx={{
				paddingTop: theme.spacing.sm,
				borderTop: `${rem(1)} solid ${
					theme.colorScheme === "dark"
						? theme.colors.dark[4]
						: theme.colors.gray[2]
				}`,
			}}
		>
			<UnstyledButton
				sx={{
					display: "block",
					width: "100%",
					padding: theme.spacing.xs,
					borderRadius: theme.radius.sm,
					color:
						theme.colorScheme === "dark"
							? theme.colors.dark[0]
							: theme.black,

					"&:hover": {
						backgroundColor:
							theme.colorScheme === "dark"
								? theme.colors.dark[6]
								: theme.colors.gray[0],
					},
				}}
			>
				<Group>
					<Avatar
						src={client.user!.avatar} // https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=255&q=80
						radius="xl"
					/>
					<Box sx={{ flex: 1 }}>
						<Text size="sm" weight={500}>
							{client.user!.username}
						</Text>
						<Text color="dimmed" size="xs">
							{client.user!.createdAt.toDateString()}
						</Text>
					</Box>

					{theme.dir === "ltr" ? (
						<IconChevronRight size={rem(18)} />
					) : (
						<IconChevronLeft size={rem(18)} />
					)}
				</Group>
			</UnstyledButton>
		</Box>
	);
}

interface MainLinkProps {
	color: string;
	label: string;
}

function MainLink({ color, label }: MainLinkProps) {
	return (
		<UnstyledButton
			sx={(theme) => ({
				display: "block",
				width: "100%",
				padding: theme.spacing.xs,
				borderRadius: theme.radius.sm,
				color:
					theme.colorScheme === "dark"
						? theme.colors.dark[0]
						: theme.black,

				"&:hover": {
					backgroundColor:
						theme.colorScheme === "dark"
							? theme.colors.dark[6]
							: theme.colors.gray[0],
				},
			})}
		>
			<Group>
				<ThemeIcon color={color} variant="light"></ThemeIcon>

				<Text size="sm">{label}</Text>
			</Group>
		</UnstyledButton>
	);
}

export function Channels({ channels }: { channels: Channel[] }) {
	const cs = channels.map((channel) => {
		if (channel.isGroup()) {
			return (
				<MainLink
					color="violet"
					label={channel.name}
					key={channel.id}
				/>
			);
		}

		if (channel.isText()) {
			return (
				<MainLink
					color="teal"
					label={"Text channel not support"}
					key={channel.id}
				/>
			);
		}
	});
	return <div>{cs}</div>;
}

function UserAvatar({ message }: { message: Message }) {
	return (
		<Indicator
			inline
			size={16}
			offset={7}
			position="bottom-end"
			color="red"
			withBorder
		>
			<Avatar size="lg" radius="xl" src={message.author.avatar} />
		</Indicator>
	);
}

export function App() {
	const theme = useMantineTheme();
	const [opened, setOpened] = useState(false);
	const [logged, setLogged] = useState(false);
	const [currentChannel, setCurrentChannel] = useState("");
	const [fmessages, setFmessages] = useState(true);
	const [debug, setDebug] = useState("Welcome to Zaun chat!");
	const [error, setError] = useState("");
	const client = useClient();

	const [textAreaContent, setTextAreaContent] = useState("");

	const [channels, setChannels] = useState<Channel[]>([]);
	const [messages, setMessages] = useState<Message[]>([]);

	const [waitSending, setWaitSending] = useState(false);
	useEffect(() => {
		const token = localStorage.getItem("token");
		if (!token) {
			window.location.href = "/login";
			return;
		}
		client.on("debug", (msg) => {
			console.log(msg);
			setDebug(msg);
		});
		client.on("error", (err) => {
			setError(err as any);
			console.error(err);
		});
		client.login(token).catch(() => {
			window.location.href = "/login";
		});
	}, []);

	useEffect(() => {
		client.once("ready", async () => {
			const channels = Array.from(client.channels.cache.values());
			setChannels(channels);
			setLogged(true);
			const channel = channels[0];
			setCurrentChannel(channel.id);
			if (channel) {
				if (channel.isGroup()) {
					const messages = await channel.messages.fetch();
					setMessages(Array.from(messages.values()));
					setFmessages(false);
				}
			}
		});
	}, []);

	const handleKeypress = async (e: any) => {
		if (e.keyCode === 13) {
			const channel = client.channels.cache.get(currentChannel);
			if (channel?.isText()) {
				setTextAreaContent("");
				setWaitSending(true);
				try {
					await channel.send(textAreaContent);
					setMessages(Array.from(channel.messages.cache.values()));
				} catch (err) {}
				setWaitSending(false);
			}
		}
	};

	if (!logged) {
		return (
			<Center
				style={{
					height: "100%",
					flexDirection: "column",
				}}
			>
				<Loader />
				<br />
				{debug.replace(/\[(.*?)\]:/g, "")}
			</Center>
		);
	}

	return (
		<AppShell
			styles={{
				main: {
					minHeight: "100%",
					minWidth: "100%",
					background:
						theme.colorScheme === "dark"
							? theme.colors.dark[8]
							: theme.colors.gray[0],
				},
			}}
			navbarOffsetBreakpoint="sm"
			asideOffsetBreakpoint="sm"
			navbar={
				<Navbar p="xs" width={{ base: 300 }}>
					<Navbar.Section>{/* Header with logo */}</Navbar.Section>
					<Navbar.Section component={ScrollArea} grow mt="md">
						<Channels channels={channels} />
					</Navbar.Section>
					<Navbar.Section>
						<User />
					</Navbar.Section>
				</Navbar>
			}
			header={
				<Header height={{ base: 50, md: 70 }} p="md">
					<div
						style={{
							display: "flex",
							alignItems: "center",
							height: "100%",
						}}
					>
						<MediaQuery
							largerThan="sm"
							styles={{ display: "none" }}
						>
							<Burger
								opened={opened}
								onClick={() => setOpened((o) => !o)}
								size="sm"
								color={theme.colors.gray[6]}
								mr="xl"
							/>
						</MediaQuery>

						<Text>Zaun chat</Text>
					</div>
				</Header>
			}
		>
			<Stack sx={{ height: "90vh" }}>
				<ScrollArea scrollbarSize={10}>
					<Stack spacing="xl">
						{!fmessages ? (
							messages.map((message) => (
								<MessageContainer message={message} />
							))
						) : (
							<Center
							grow
								style={{
									height: "90vh",
									flexDirection: "column",
								}}
							>
								<Loader variant="dots" />
								<br />
								{error ? error : debug}
							</Center>
						)}
					</Stack>
				</ScrollArea>

				<Textarea
					onChange={(ev: any) =>
						setTextAreaContent(ev.currentTarget.value)
					}
					onKeyPress={handleKeypress}
					value={textAreaContent}
					disabled={fmessages || waitSending}
					placeholder="Your comment"
					withAsterisk
					autosize
					minRows={2}
					maxRows={4}
				/>
			</Stack>
		</AppShell>
	);
}
function MessageContainer({ message }: { message: Message }) {
	return (
		<Text>
			<Center inline>
				<UserAvatar message={message} />
				<Text
					span
					variant="gradient"
					gradient={{ from: "indigo", to: "cyan", deg: 45 }}
					sx={{ fontFamily: "Greycliff CF, sans-serif" }}
					fz="xl"
					fw={700}
				>
					{message.author.username}:
				</Text>{" "}
			</Center>
			<Text span>{message.content}</Text>
		</Text>
	);
}
