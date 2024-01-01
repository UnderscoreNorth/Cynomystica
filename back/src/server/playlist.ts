import { Server } from "socket.io";
import { socketInterface, default as IO } from "./socket";
import parseURL, { parseRaw } from "../lib/parseURL";
import { cycle } from "./cycle";
import schedule from "../sqliteTables/schedule";
import moment from "moment";
import playlists from "../sqliteTables/playlists";
import { writeToLog } from "../lib/logger";
import permissions from "./permissions";
import settings from "./settings";

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
  scheduledID: string | null;
  permanent: boolean;
}

let theThreeGuys = [];

class PlayList {
  playlist: PlaylistObj;
  currentSeekTime: number;
  playing: boolean;
  scheduleCheck: boolean;
  constructor() {
    this.playlist = [];
    this.currentSeekTime = 0;
    this.playing = false;
    this.scheduleCheck = false;
    console.log("Playlist Initialized");
  }
  async send(socket: Server | socketInterface | null) {
    if (socket == null) socket = IO();
    /*const clientPlaylist: Array<object> = [];
    for (const id in this.order) {
      clientPlaylist[id] = this.playlist[this.order[id]];
    }*/
    if (this.playlist?.[0]?.name.includes("School Days")) {
      if (theThreeGuys.length == 0) {
        theThreeGuys = ["TheThirdGuy"];
        let sockets = Object.values(await IO().sockets.fetchSockets());
        theThreeGuys = [];
        for (let socket of sockets as unknown as socketInterface[]) {
          if (socket.username) {
            theThreeGuys.push(socket);
          }
        }
        theThreeGuys = theThreeGuys
          .sort(
            (a: socketInterface, b: socketInterface) =>
              b?.lastMessage?.getTime() ?? 0 - a?.lastMessage?.getTime() ?? 0
          )
          .slice(0, 10);
        console.log(
          "TheTenGuys",
          theThreeGuys.map((a) => a.username)
        );
        theThreeGuys = theThreeGuys
          .map((value) => ({ value, sort: Math.random() }))
          .sort((a, b) => a.sort - b.sort)
          .map(({ value }) => value.username);
        theThreeGuys = theThreeGuys.slice(0, 3);
        console.log("TheThreeGuys", theThreeGuys);
      }
    } else {
      theThreeGuys = [];
    }
    socket.emit("playlist", {
      status: "success",
      playlist: this.playlist,
      playlistIndex: 0,
      seektime: this.currentSeekTime,
      theThreeGuys,
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
      if (
        this.currentSeekTime > this.playlist[0].duration &&
        this.playlist[0].duration > 0
      ) {
        if (!this.playlist[0].permanent) {
          this.deleteVideo(this.playlist[0].id);
        } else {
          this.currentSeekTime = 0;
          this.playlist.push(this.playlist.splice(0, 1)[0]);
        }
        this.playing = false;
        change = true;
      }
    }
    if (!this.playing && this.playlist.length) {
      this.playing = true;
      this.currentSeekTime = 0;
      this.playlist[0].startDate = new Date();
      writeToLog("playlist", [
        {
          url: this.playlist[0].url,
          title: this.playlist[0].name,
          username: this.playlist[0].username,
          time: new Date(),
        },
      ]);
      change = true;
    }
    let lastEndDate = null;
    for (let index in this.playlist) {
      let item = this.playlist[index];
      // @ts-ignore
      if (index > 0) {
        item.startDate = lastEndDate;
      }
      if (item.duration == 0) break;
      item.endDate = new Date(item.startDate.getTime() + item.duration * 1000);
      if (item.duration == -1) {
        item.endDate = item.startDate;
      }
      lastEndDate = item.endDate;
    }
    if (change) this.send(null);
    IO().emit("seek-update", {
      status: "success",
      seekTime: this.currentSeekTime,
    });
  }
  queueVideo = async (
    item: { mediaURL: string; permanent?: boolean; title?: string },
    username: string,
    socket: socketInterface,
    scheduleID: string | null = null,
    last = false
  ) => {
    const id: number = Math.random();
    const socketError = (message: string) => {
      if (socket) {
        socket.emit("alert", {
          type: "queue",
          message,
        });
      }
    };
    /*if (item.mediaURL.includes(" ")) {
      socketError("Invalid link");
      return;
    }*/
    if (!item?.mediaURL) {
      socketError("Empty link");
      return;
    }
    if (socket) {
      if (
        parseRaw(item.mediaURL).type == "raw" &&
        !(socket.accessLevel >= permissions().items["queueRaw"])
      ) {
        socketError(`You don't have permission to queue raw videos`);
        return;
      }
    }
    await parseURL(item.mediaURL)
      .then((playlistItem) => {
        playlistItem.id = id;
        playlistItem.username = username;
        if (item.title) playlistItem.name = item.title;
        if (item.permanent) playlistItem.permanent = true;
        let currentLen = 0;
        if (socket) {
          if (
            socket.accessLevel < permissions().items["queueLive"] &&
            playlistItem.duration == -1
          ) {
            socketError(
              `You do not have permission to queue live videos/iframes`
            );
            return;
          }

          if (
            socket.accessLevel < permissions().items["bypassQueueLimit"] &&
            settings().settings["maxTotalQueueLength"] > 0
          ) {
            for (let i of this.playlist) {
              if (i.username == username) currentLen += i.duration;
            }
            currentLen += playlistItem.duration;
            if (currentLen / 60 > settings().settings["maxTotalQueueLength"]) {
              socketError(
                `Can not have more than ${
                  settings().settings["maxTotalQueueLength"]
                } min queued`
              );
              return;
            }
          }
        }

        if (!this.playlist.length) {
          playlistItem.startDate = new Date();
          playlistItem.endDate = new Date(
            Date.now() + playlistItem.duration * 1000
          );
        }
        playlistItem.scheduledID = scheduleID;
        if (last) {
          this.playlist.push(playlistItem);
        } else {
          this.playlist.splice(1, 0, playlistItem);
        }
        this.updateDates();
      })
      .catch(() => {
        socketError(`Video type not supported`);
      });
  };
  deleteVideo(id: number) {
    for (let index in this.playlist) {
      if (this.playlist[index].id == id) {
        this.playlist.splice(parseInt(index), 1);
        if (parseInt(index) == 0) {
          this.currentSeekTime = 0;
          this.playing = false;
        }
      }
    }
    cycle();
  }
  checkSchedule = async () => {
    if (!this.scheduleCheck) {
      this.scheduleCheck = true;
      try {
        let scheduled = await schedule.getAll(new Date(Date.now() - 5000));
        let nextScheduled = scheduled[0];
        if (nextScheduled) {
          let tempPlaylist = [];
          for (let item of scheduled) {
            if (this.playlist.length == 0) {
              if (moment.utc(item.playTimeUTC).diff(moment()) / 1000 <= 5) {
                await this.queueVideo(
                  { mediaURL: item.url },
                  item.username,
                  null,
                  item.id
                );
              } else {
                break;
              }
            } else {
              let lastItem = this.playlist[this.playlist.length - 1];
              let diff =
                moment.utc(item.playTimeUTC).diff(moment(lastItem.endDate)) /
                1000;
              let scheduledIDs = this.playlist.map((x) => x.scheduledID);
              if (
                diff <= item.minutes * 60 &&
                item.playlist !== "" &&
                diff > 0 &&
                !scheduledIDs.includes(item.id)
              ) {
                let fillAttempt = await this.queuePlaylist({
                  mode: item.selection,
                  playlist: item.playlist,
                  duration: diff,
                });
                if (fillAttempt) {
                  await this.queueVideo(
                    { mediaURL: item.url },
                    item.username,
                    null,
                    item.id
                  );
                } else {
                  break;
                }
              } else {
                let diff = moment.utc(item.playTimeUTC).diff(moment()) / 1000;
                if (diff <= 0 && !scheduledIDs.includes(item.id)) {
                  tempPlaylist = structuredClone(this.playlist);
                  this.playlist = [];
                  await this.queueVideo(
                    { mediaURL: item.url },
                    item.username,
                    null,
                    item.id
                  );
                } else {
                  break;
                }
              }
            }
          }
          this.playlist = this.playlist.concat(tempPlaylist);
        }
      } finally {
        this.scheduleCheck = false;
      }
    }
  };
  queuePlaylist = async (options: any) => {
    let items = await playlists.getPlaylist(options.playlist);
    if (items.length == 0) return false;
    let maxTries = 1000;
    let tries = 0;
    let complete = false;
    let minDuration = options.duration;
    let maxDuration = options.duration;
    if (options.leeWayAfter) {
      maxDuration += options.leeWayAfter;
    }
    do {
      let duration = 0;
      let queue = [];
      complete = false;
      loop: for (let item of items) {
        duration += item.duration;
        queue.push(item);
        if (duration >= minDuration && duration <= maxDuration) {
          complete = true;
          for (let subitem of queue) {
            await this.queueVideo(subitem.url, subitem.username, null);
            await playlists.updatePlayCount(subitem.id);
          }
          break loop;
        } else if (duration > maxDuration) {
          break;
        }
      }
      tries++;
      shuffleArray(items);
    } while (tries < maxTries && !complete);
    return complete;
    function shuffleArray(array: any) {
      for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
      }
    }
  };
}

let playlist = new PlayList();
export default playlist;
