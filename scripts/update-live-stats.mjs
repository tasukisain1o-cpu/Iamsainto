import {readFile} from "node:fs/promises";
const current = JSON.parse(await readFile("live-stats.json", "utf8").catch(() => '{"youtube":{},"twitch":{}}'));
const youtube = {...(current.youtube || {})};
const twitch = {...(current.twitch || {})};
const ytMap = JSON.parse(process.env.YOUTUBE_CHANNELS_JSON || "{}");
const twMap = JSON.parse(process.env.TWITCH_CHANNELS_JSON || "{}");
let requested = 0;

async function getJSON(url, options) {
  const response = await fetch(url, {...options, signal: AbortSignal.timeout(15_000)});
  if (!response.ok) throw new Error(`${response.status} ${url}`);
  return response.json();
}

if (process.env.YOUTUBE_API_KEY && Object.keys(ytMap).length) {
  requested++;
  const ids = Object.values(ytMap).join(",");
  const url = new URL("https://www.googleapis.com/youtube/v3/channels");
  url.searchParams.set("part", "statistics");
  url.searchParams.set("id", ids);
  url.searchParams.set("key", process.env.YOUTUBE_API_KEY);
  const data = await getJSON(url);
  const byId = Object.fromEntries(data.items.map(item => [item.id, Number(item.statistics.subscriberCount)]));
  for (const [name, id] of Object.entries(ytMap)) {
    if (!Number.isFinite(byId[id])) throw new Error(`YouTube channel not returned: ${name}`);
    youtube[name] = byId[id];
  }
}

if (process.env.TWITCH_CLIENT_ID && process.env.TWITCH_CLIENT_SECRET && Object.keys(twMap).length) {
  requested++;
  const tokenBody = new URLSearchParams({client_id: process.env.TWITCH_CLIENT_ID, client_secret: process.env.TWITCH_CLIENT_SECRET, grant_type: "client_credentials"});
  const token = await getJSON("https://id.twitch.tv/oauth2/token", {method: "POST", headers: {"Content-Type": "application/x-www-form-urlencoded"}, body: tokenBody});
  if (typeof token.access_token !== "string") throw new Error("Twitch did not return an access token");
  for (const [name, broadcasterId] of Object.entries(twMap)) {
    const data = await getJSON(`https://api.twitch.tv/helix/channels/followers?broadcaster_id=${encodeURIComponent(broadcasterId)}`, {headers: {"Client-Id": process.env.TWITCH_CLIENT_ID, Authorization: `Bearer ${token.access_token}`}});
    if (!Number.isFinite(data.total)) throw new Error(`Twitch channel not returned: ${name}`);
    twitch[name] = data.total;
  }
}

if (!requested) throw new Error("Live-stats secrets or channel maps are missing");
process.stdout.write(JSON.stringify({updatedAt: new Date().toISOString(), youtube, twitch}, null, 2) + "\n");
