import { SvelteKitAuth } from '@auth/sveltekit';

import Discord from '@auth/core/providers/discord';
import { DISCORD_CLIENT_ID, DISCORD_CLIENT_SECRET } from '$env/static/private';
export const handle = SvelteKitAuth({
	providers: [
		Discord({
			authorization: `https://discord.com/api/oauth2/authorize?client_id=1171885043711496254&redirect_uri=http%3A%2F%2Flocalhost%3A5173&response_type=code&scope=identify`,
			clientId: DISCORD_CLIENT_ID,
			clientSecret: DISCORD_CLIENT_SECRET
		})
	]
});
