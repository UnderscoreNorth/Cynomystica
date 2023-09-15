import { Server } from "socket.io";
import { socketInterface, default as IO } from "./socket";
import parseURL from "../lib/parseURL";
import { cycle } from "./cycle";

export type PlaylistOrder = Array<number>;
export type PlaylistObj = Array<PlaylistItem>;
export interface PlaylistItem {
  id: number;
  name: string;
  url: string;
  endDate: Date | null;
  user: string;
  duration: number;
  type: string;
}

class PlayList {
  obj: PlaylistObj;
  order: PlaylistOrder;
  currentSeekTime: number;
  index: number;
  currentVideoDuration: number | null;
  startTime: Date | null;
  constructor() {
    this.obj = [];
    this.order = [];
    this.currentSeekTime = 0;
    this.index = 0;
    this.currentVideoDuration = null;
    this.startTime = null;
    console.log("Playlist Initialized");
  }
  send(socket: Server | socketInterface | null) {
    if (socket == null) socket = IO();
    const clientPlaylist: Array<object> = [];
    for (const id in this.order) {
      clientPlaylist[id] = this.obj[this.order[id]];
    }
    console.log("playlist.send");
    socket.emit("playlist", {
      status: "success",
      playlist: clientPlaylist,
      playlistIndex: this.index,
      seektime: this.currentSeekTime,
    });
  }
  queueVideo = async (mediaURL: string, queueIndex: number) => {
    const id: number = Math.random();
    let playlistItem = await parseURL(mediaURL);
    this.obj[id] = playlistItem;
    this.order.splice(queueIndex + 1, 0, id);
  };
  deleteVideo(itemID: number) {
    const itemIndex = playlist.order.indexOf(itemID);
    delete this.obj[itemID];
    this.order.splice(itemIndex, 1);
    if (itemIndex == this.index) {
      this.currentSeekTime = 0;
      this.currentVideoDuration = 0;
      this.startTime = new Date();
    }
    cycle();
  }
}

let playlist = new PlayList();
export default playlist;
