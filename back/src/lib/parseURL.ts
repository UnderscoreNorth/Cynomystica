import parseRawVideo from "../videoProviders/raw/parseRawVideo";
import parseYoutube from "../videoProviders/youtube/parseYoutube";
export default async function parseURL(url: string) {
  const indeterminable = () => {
    return new Error(
      "Could not determine video type. " +
        "Check https://git.io/fjtOK for a list of supported media providers."
    );
  };
  try {
    let parsedURL = parseRaw(new URL(url));
    switch (parsedURL.type) {
      case "raw":
        return await parseRawVideo(parsedURL.id);
      case "yt":
        return await parseYoutube(parsedURL.id);
      default:
        throw "type not accounted for yet";
    }
  } catch (err) {
    throw indeterminable();
  }
}

const parseRaw = (url: URL) => {
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
    default:
      return { type: "raw", id: url.toString() || "" };
  }
};
