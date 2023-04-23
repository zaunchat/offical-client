import { render } from "preact";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { App, Login, Register } from "./pages";
import "./styles/index.css";
import { MantineProvider } from "@mantine/core";
export function Main() {
	const router = createBrowserRouter([
		{
			path: "/app",
			element: <App />,
		},
		{
			path: "/login",
			element: <Login />,
		},
		{
			path: "/register",
			element: <Register />,
		},
	]);
	return (
		<MantineProvider
			withNormalizeCSS
			withGlobalStyles
			theme={{ colorScheme: "dark", loader: "bars" }}
		>
			<RouterProvider router={router} />
		</MantineProvider>
	);
}

render(<Main />, document.getElementById("app") as HTMLElement);
