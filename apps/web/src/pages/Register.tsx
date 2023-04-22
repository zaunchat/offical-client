import {
	TextInput,
	PasswordInput,
	Anchor,
	Paper,
	Title,
	Text,
	Container,
	Button,
	Center,
} from "@mantine/core";

export function Register() {
	return (
		<Center style={{ height: "100%" }}>
			<Container size={420} my={40}>
				<Title
					align="center"
					sx={(theme: any) => ({
						fontFamily: `Greycliff CF, ${theme.fontFamily}`,
						fontWeight: 900,
					})}
				>
					Welcome to Zaun Chat!
				</Title>
				<Text color="dimmed" size="sm" align="center" mt={5}>
					Go back to{" "}
					<a href="/login">
						<Anchor size="sm" component="button">
							Login page
						</Anchor>
					</a>
				</Text>

				<Paper withBorder shadow="md" p={30} mt={30} radius="md">
					<TextInput label="username" placeholder="Ahmed" required />
					<TextInput
						label="Email"
						placeholder="you@mantine.dev"
						required
					/>
					<PasswordInput
						label="Password"
						placeholder="Your password"
						required
						mt="md"
					/>
					<Button fullWidth mt="xl">
						Register
					</Button>
				</Paper>
			</Container>
		</Center>
	);
}
