import {readFile} from "node:fs/promises";
const env = process.env;
const timeout = () => AbortSignal.timeout(15_000);

async function getJSON(url, options = {}) {
  const response = await fetch(url, {...options, signal: timeout()});
  if (!response.ok) throw new Error(`Remote API returned HTTP ${response.status}`);
  return response.json();
}

let requested = 0;
let twitchLive = false;
let youtubeLive = false;

if (env.TWITCH_CLIENT_ID && env.TWITCH_CLIENT_SECRET && env.TWITCH_USER_LOGIN) {
  requested++;
  const body = new URLSearchParams({client_id: env.TWITCH_CLIENT_ID, client_secret: env.TWITCH_CLIENT_SECRET, grant_type: "client_credentials"});
  const token = await getJSON("https://id.twitch.tv/oauth2/token", {method: "POST", headers: {"Content-Type": "application/x-www-form-urlencoded"}, body});
  if (typeof token.access_token !== "string") throw new Error("Twitch did not return an access token");
  const url = new URL("https://api.twitch.tv/helix/streams");
  url.searchParams.set("user_login", env.TWITCH_USER_LOGIN);
  const data = await getJSON(url, {headers: {"Client-Id": env.TWITCH_CLIENT_ID, Authorization: `Bearer ${token.access_token}`}});
  if (!Array.isArray(data.data)) throw new Error("Invalid Twitch response");
  twitchLive = data.data.length > 0;
}

if (env.YOUTUBE_API_KEY && env.YOUTUBE_CHANNEL_ID) {
  requested++;
  const url = new URL("https://www.googleapis.com/youtube/v3/search");
  for (const [key, value] of Object.entries({part: "id", channelId: env.YOUTUBE_CHANNEL_ID, eventType: "live", type: "video", key: env.YOUTUBE_API_KEY})) url.searchParams.set(key, value);
  const data = await getJSON(url);
  if (!Array.isArray(data.items)) throw new Error("Invalid YouTube response");
  youtubeLive = data.items.length > 0;
}

if (!requested) throw new Error("Status secrets are missing");
const previous = JSON.parse(await readFile("status.json", "utf8").catch(() => "{}"));
const unchangedOffline = !twitchLive && !youtubeLive && previous.twitch?.live === false && previous.youtube?.live === false;
const next = unchangedOffline ? previous : {updatedAt: new Date().toISOString(), twitch: {live: twitchLive}, youtube: {live: youtubeLive}};
process.stdout.write(JSON.stringify(next, null, 2) + "\n");
