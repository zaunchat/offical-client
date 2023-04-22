import {
	TextInput,
	PasswordInput,
	Checkbox,
	Anchor,
	Paper,
	Title,
	Text,
	Container,
	Group,
	Button,
	Center,
} from "@mantine/core";
import { useState } from "preact/hooks";

import { Client } from "@zaunapp/client";

export function Login() {
	const [token, setToken] = useState("");

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
					Welcome back!
				</Title>
				<Text color="dimmed" size="sm" align="center" mt={5}>
					Go back to{" "}
					<a href="/register">
						<Anchor size="sm" component="button">
							Create new account
						</Anchor>
					</a>
				</Text>

				<Paper withBorder shadow="md" p={30} mt={30} radius="md">
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
					<Group position="apart" mt="lg">
						<Checkbox label="Remember me" />
						<Anchor component="button" size="sm">
							Forgot password?
						</Anchor>
					</Group>
					<Button fullWidth mt="xl">
						Login
					</Button>
				</Paper>
			</Container>

			<Container size={420} my={40}>
				<Title
					align="center"
					sx={(theme: any) => ({
						fontFamily: `Greycliff CF, ${theme.fontFamily}`,
						fontWeight: 900,
					})}
				>
					Login with token
				</Title>

				<Paper withBorder shadow="md" p={30} mt={30} radius="md">
					<TextInput
						label="Token"
						onChange={(ev: any) => setToken(ev.currentTarget.value)}
						placeholder=""
						required
					/>

					<Button
						fullWidth
						mt="xl"
						onClick={async () => {
							const client = new Client();
							client
								.login(token)
								.then(() => {
									alert("Connected Successfully! ");
									localStorage.setItem("token", token);
								})
								.catch((err) => {
									alert("an error occurred");
									console.log(err);
								});
						}}
					>
						Login
					</Button>
				</Paper>
			</Container>
		</Center>
	);
}
