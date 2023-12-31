import parseRawVideo from "../videoProviders/parseRawVideo";
import parseYoutube from "../videoProviders/parseYoutube";
import parseTwitch from "../videoProviders/parseTwitch";
export default async function parseURL(url: string) {
  let parsedURL = parseRaw(new URL(url));
  try {
    switch (parsedURL.type) {
      case "raw":
        return await parseRawVideo(parsedURL.id);
      case "yt":
        return await parseYoutube(parsedURL.id);
      case "tw_vod":
        return await parseTwitch(parsedURL.id, "vod");
      case "tw_live":
        return await parseTwitch(parsedURL.id, "live");
      default:
        throw "type not accounted for yet";
    }
  } catch {
    throw "type not accounted for yet";
  }
}

export const parseRaw = (url: URL) => {
  switch (url.hostname.replace("www.", "")) {
    case "youtube.com":
      if (url.pathname == "/watch") {
        return { type: "yt", id: url.searchParams.get("v") || "" };
      }
      if (url.pathname.startsWith("/shorts/")) {
        return { type: "yt", id: url.pathname.slice(8, 19) || "" };
      }
      if (url.pathname == "/playlist") {
        return { type: "yp", id: url.searchParams.get("list") || "" };
      }
    // eslint-disable-next-line no-fallthrough
    case "youtu.be":
      return { type: "yt", id: url.pathname.slice(1) || "" };
    case "twitch.tv":
      if (url.pathname.startsWith("/videos/")) {
        //        return { type: "tw_vod", id: url.pathname.slice(7) };
      } else {
        return { type: "tw_live", id: url.pathname.slice(1) };
      }

    default:
      if (url.href.match(/^.*\.mp4$/) || url.href.match(/^.*\.mp3$/)) {
        return { type: "raw", id: url.toString() || "" };
      } else {
        return { type: "not supported" };
      }
  }
};
