import parseRawVideo from "../videoProviders/parseRawVideo";
import {
  parseYoutube,
  parseYoutubePlaylist,
} from "../videoProviders/parseYoutube";
import parseTwitch from "../videoProviders/parseTwitch";
import { PlaylistItem } from "../server/playlist";
const isValidUrl = (urlString) => {
  var urlPattern = new RegExp(
    "^(https?:\\/\\/)?" + // validate protocol
      "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // validate domain name
      "((\\d{1,3}\\.){3}\\d{1,3}))" + // validate OR ip (v4) address
      "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // validate port and path
      "(\\?[;&a-z\\d%_.~+=-]*)?" + // validate query string
      "(\\#[-a-z\\d_]*)?$",
    "i"
  ); // validate fragment locator
  return !!urlPattern.test(urlString);
};

export default async function parseURL(url: string, allowMultiple = false) {
  try {
    let parsedURL = parseRaw(url);
    if (parsedURL.type == "yp" && !allowMultiple) throw "playlists not allowed";
    switch (parsedURL.type) {
      case "raw":
        return [await parseRawVideo(parsedURL.id)];
      case "yt":
        return [await parseYoutube(parsedURL.id)];
      case "yp":
        return await parseYoutubePlaylist(parsedURL.id);
      case "tw_vod":
        return [await parseTwitch(parsedURL.id, "vod")];
      case "tw_live":
        return [await parseTwitch(parsedURL.id, "live")];
      case "iframe":
        return [
          {
            id: 0,
            name: "Live Stream",
            url: parsedURL.id,
            startDate: null,
            endDate: null,
            username: "N/A",
            duration: -1,
            type: "iframe",
            scheduledID: null,
            permanent: false,
          } as PlaylistItem,
        ];
      default:
        throw "type not accounted for yet";
    }
  } catch (err) {
    if (err == "Invalid ID") throw "Invalid ID";
    throw "type not accounted for yet";
  }
}

export const parseRaw = (text: string) => {
  let url: URL;
  try {
    url = new URL(text);
    switch (url.hostname.replace("www.", "")) {
      case "youtube.com":
        if (url.pathname == "/watch") {
          return { type: "yt", id: url.searchParams.get("v") || "" };
        }
        if (url.pathname.startsWith("/shorts/")) {
          return { type: "yt", id: url.pathname.slice(8, 19) || "" };
        }
        if (url.pathname.startsWith("/live/")) {
          return { type: "yt", id: url.pathname.substring(6) || "" };
        }
        if (url.pathname == "/playlist") {
          return { type: "yp", id: url.searchParams.get("list") || "" };
        }
        break;
      // eslint-disable-next-line no-fallthrough
      case "youtu.be":
        return { type: "yt", id: url.pathname.slice(1) || "" };
      case "twitch.tv":
        if (url.pathname.startsWith("/videos/")) {
          //        return { type: "tw_vod", id: url.pathname.slice(7) };
        } else {
          return { type: "tw_live", id: url.pathname.slice(1) };
        }
      case "angelthump.com":
        return {
          type: "iframe",
          id: `<iframe title="Player" width="100%" height="100%" marginheight="0" marginwidth="0" frameborder="0" allow="autoplay; fullscreen" allowtransparency="true" allowfullscreen="" src="https://player.angelthump.com/?channel=${url.pathname.slice(
            1
          )}" scrolling="no" seamless=""></iframe>`,
        };
      case "player.angelthump.com":
        return {
          type: "iframe",
          id: `<iframe title="Player" width="100%" height="100%" marginheight="0" marginwidth="0" frameborder="0" allow="autoplay; fullscreen" allowtransparency="true" allowfullscreen="" src="${url.toString()}" scrolling="no" seamless=""></iframe>`,
        };
      default:
        break;
    }
    if (
      url.href.match(/^.*\.mp4$/) ||
      url.href.match(/^.*\.mp3$/) ||
      url.href.match(/^.*\webm$/)
    ) {
      return { type: "raw", id: url.toString() || "" };
    } else {
      return { type: "not supported" };
    }
  } catch {
    let iframe = text.match(/<iframe .*<\/iframe>/)?.[0];
    if (iframe) {
      return { type: "iframe", id: iframe };
    }
    return { type: "not supported" };
  }
};
