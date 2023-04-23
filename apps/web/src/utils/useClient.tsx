import { Client } from "@zaunapp/client";

const client = new Client();
export function useClient() {
	return client;
}