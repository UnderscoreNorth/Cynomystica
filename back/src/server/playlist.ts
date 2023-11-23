import { Server } from "socket.io";
import { socketInterface, default as IO } from "./socket";
import parseURL from "../lib/parseURL";
import { cycle } from "./cycle";
import schedule from "../sqliteTables/schedule";

export type PlaylistOrder = Array<number>;
export type PlaylistObj = Array<PlaylistItem>;
export interface PlaylistItem {
  id: number;
  name: string;
  url: string;
  startDate: Date | null;
  endDate: Date | null;
  username: string;
  duration: number;
  type: string;
  scheduledID: number | null;
}

class PlayList {
  playlist: PlaylistObj;
  currentSeekTime: number;
  playing: boolean;
  constructor() {
    this.playlist = [];
    this.currentSeekTime = 0;
    this.playing = false;
    console.log("Playlist Initialized");
  }
  send(socket: Server | socketInterface | null) {
    if (socket == null) socket = IO();
    /*const clientPlaylist: Array<object> = [];
    for (const id in this.order) {
      clientPlaylist[id] = this.playlist[this.order[id]];
    }*/
    console.log("playlist.send");
    socket.emit("playlist", {
      status: "success",
      playlist: this.playlist,
      playlistIndex: 0,
      seektime: this.currentSeekTime,
    });
  }
  updateDates() {
    if (!this.playlist.length) {
      this.currentSeekTime = 0;
      this.playing = false;
      return;
    }
    let change = false;
    if (this.playing) {
      this.currentSeekTime =
        Math.abs(new Date().getTime() - this.playlist[0].startDate.getTime()) /
        1000;
      if (this.currentSeekTime > this.playlist[0].duration) {
        this.deleteVideo(0);
        this.playing = false;
        change = true;
      }
    }
    if (!this.playing && this.playlist.length) {
      this.playing = true;
      this.currentSeekTime = 0;
      this.playlist[0].startDate = new Date();
      change = true;
    }
    let lastEndDate = null;
    for (let index in this.playlist) {
      let item = this.playlist[index];
      // @ts-ignore
      if (index > 0) {
        item.startDate = lastEndDate;
      }
      if (!(item.duration > 0)) break;
      item.endDate = new Date(item.startDate.getTime() + item.duration * 1000);
      lastEndDate = item.endDate;
    }
    console.log(this.playlist);
    if (change) playlist.send(IO());
    IO().emit("seek-update", {
      status: "success",
      seekTime: this.currentSeekTime,
    });
  }
  queueVideo = async (mediaURL: string, username: string) => {
    const id: number = Math.random();
    let playlistItem = await parseURL(mediaURL);
    playlistItem.id = id;
    playlistItem.username = username;
    this.playlist.push(playlistItem);
  };
  deleteVideo(index: number) {
    this.playlist.splice(index, 1);
    cycle();
  }
  checkSchedule = async () => {
    /*let scheduled = await schedule.getAll();
    if (scheduled[0] && Object.keys(playlist.obj)?.length == 0) {
      let nextScheduledItem = scheduled[0];
      if (new Date() >= new Date(nextScheduledItem.playTimeUTC) || 1 == 1) {
        playlist.queueVideo(nextScheduledItem.url, playlist.index);
      }
    }*/
  };
}

let playlist = new PlayList();
export default playlist;
