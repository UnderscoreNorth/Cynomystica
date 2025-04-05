import { Server } from "socket.io";
import { socketInterface, default as IO } from "./socket";
import { cycle } from "./cycle";
import schedule from "../sqliteTables/schedule";
import moment from "moment";
import playlists from "../sqliteTables/playlists";
import playlistItems from "../sqliteTables/playlistItems";
import { writeToLog } from "../lib/logger";
import permissions from "./permissions";
import settings from "./settings";
import { Moment } from "moment";
import subs from "./subs";
import { parseURLWorker } from "../lib/parseURLWorker";
import { parseRaw } from "../lib/parseURL";

export type PlaylistOrder = Array<number>;
export type PlaylistObj = Array<PlaylistItem>;
export interface PlaylistItem {
  id: number;
  name: string;
  url: string;
  startDate: Moment | null;
  endDate: Moment | null;
  username: string;
  duration: number;
  type: string;
  scheduledID: string | null;
  permanent: boolean;
}

let theThreeGuys = [];
const scheduleWiggle = 15;
class PlayList {
  playlist: PlaylistObj;
  currentSeekTime: number;
  playing: boolean;
  scheduleCheck: boolean;
  leaderSeekTime: number;
  constructor() {
    this.playlist = [];
    this.currentSeekTime = 0;
    this.playing = false;
    this.scheduleCheck = false;
    this.leaderSeekTime = -1;
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
              b?.lastMessage?.unix() ?? 0 - a?.lastMessage?.unix() ?? 0
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
      this.leaderSeekTime = -1;
      this.playing = false;
      return;
    }
    let change = false;
    if (this.playing) {
      if (this.leaderSeekTime >= 0)
        this.playlist[0].startDate = moment
          .utc()
          .subtract(this.leaderSeekTime, "seconds");

      this.currentSeekTime = Math.abs(
        moment.utc().diff(this.playlist[0].startDate) / 1000
      );
      if (
        this.currentSeekTime > this.playlist[0].duration &&
        this.playlist[0].duration > 0
      ) {
        if (!this.playlist[0].permanent) {
          console.log(this.playlist, this.currentSeekTime);
          this.deleteVideo(this.playlist[0].id);
        } else {
          this.currentSeekTime = 0;
          this.leaderSeekTime = -1;
          this.playlist.push(this.playlist.splice(0, 1)[0]);
          subs().finish();
        }
        this.playing = false;
        change = true;
      }
    }
    if (!this.playing && this.playlist.length) {
      this.playing = true;
      this.currentSeekTime = 0;
      this.leaderSeekTime = -1;
      this.playlist[0].startDate = moment.utc();
      writeToLog("playlist", [
        {
          url: this.playlist[0].url,
          title: this.playlist[0].name,
          username: this.playlist[0].username,
          time: moment.utc(),
        },
      ]);
      subs().new(this.playlist[0]);
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
      item.endDate = item.startDate.clone().add(item.duration, "seconds");
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

    await parseURLWorker(item.mediaURL)
      .then((res) => {
        for (const playlistItem of res) {
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
              continue;
            }

            if (
              socket.accessLevel < permissions().items["bypassQueueLimit"] &&
              settings().settings["maxTotalQueueLength"] > 0
            ) {
              for (let i of this.playlist) {
                if (i.username == username) currentLen += i.duration;
              }
              currentLen += playlistItem.duration;
              if (
                currentLen / 60 >
                settings().settings["maxTotalQueueLength"]
              ) {
                socketError(
                  `Can not have more than ${
                    settings().settings["maxTotalQueueLength"]
                  } min queued`
                );
                continue;
              }
            }
          }
          if (!this.playlist.length) {
            playlistItem.startDate = moment.utc();
            playlistItem.endDate = moment
              .utc()
              .add(playlistItem.duration, "seconds");
          }
          if (playlistItem.duration > 0) playlistItem.duration += 1;
          playlistItem.scheduledID = scheduleID;
          if (last) {
            this.playlist.push(playlistItem);
          } else {
            this.playlist.splice(1, 0, playlistItem);
          }
        }

        this.updateDates();
      })
      .catch((err) => {
        if (err == "Invalid ID") {
          socketError(err);
        } else {
          socketError(`Video type not supported`);
        }
      });
  };
  deleteVideo(id: number) {
    for (let index in this.playlist) {
      if (this.playlist[index].id == id) {
        this.playlist.splice(parseInt(index), 1);
        if (parseInt(index) == 0) {
          this.currentSeekTime = 0;
          subs().finish();
          this.leaderSeekTime = -1;
          this.playing = false;
        }
      }
    }
    cycle();
  }
  checkSchedule = async () => {
    if (this.scheduleCheck) return;
    this.scheduleCheck = true;
    try {
      let scheduled = await schedule.getAll(
        moment.utc().subtract(5, "seconds")
      );
      let nextScheduled = scheduled[0];
      if (!nextScheduled) {
        this.scheduleCheck = false;
        return;
      }
      let tempPlaylist = [];
      for (let item of scheduled) {
        let lastItem = this.playlist[this.playlist.length - 1] ?? {
          endDate: moment.utc(),
          scheduledID: "null",
          duration: -1,
        };
        let itemStart = moment.utc(item.playTimeUTC);
        let diff = lastItem.endDate.diff(itemStart) / 1000;
        let scheduledIDs = this.playlist
          .concat(tempPlaylist)
          .map((x) => x.scheduledID);
        if (scheduledIDs.includes(item.id)) continue;
        //Push out rest of playlist
        if (
          diff - item.leeway * 60 > 0 ||
          (lastItem.duration == -1 &&
            moment.utc(item.playTimeUTC).diff(moment.utc()) < 1)
        ) {
          for (let i = 0; i < this.playlist.length; i++) {
            if (
              this.playlist[i].endDate.diff(itemStart) / 1000 +
                item.leeway * 60 >
                -scheduleWiggle &&
              (!scheduledIDs.includes(this.playlist[i].scheduledID) ||
                !this.playlist[i].scheduledID)
            ) {
              tempPlaylist = this.playlist.splice(i, this.playlist.length - i);
              lastItem = this.playlist[i - 1] ?? {
                endDate: moment.utc(),
                scheduledID: "null",
                duration: -1,
              };
              diff = lastItem.endDate.diff(itemStart) / 1000;
              break;
            }
          }
        }
        if (!item.playlist) item.prequeueMinutes = 0;
        if (diff < -(item.prequeueMinutes * 60)) break;
        if (diff > item.leeway * 60) break;
        if (item.playlist && item.prequeueMinutes > 0) {
          let fillAttempt = await this.queuePlaylist({
            playlist: item.playlist,
            duration: -diff,
            leeWayAfter: item.leeway * 60,
          });
          if (!fillAttempt) {
            break;
          }
        }
        await this.queueVideo(
          { mediaURL: item.url, title: item.title },
          item.username,
          null,
          item.id,
          true
        );
      }
      this.playlist = this.playlist.concat(tempPlaylist);
    } catch (err) {
      console.log(err);
    } finally {
      this.scheduleCheck = false;
    }
  };
  queuePlaylist = async (options: any) => {
    let playlistMeta = await playlists.getPlaylistMeta(options.playlist);
    let complete = false;
    let minDuration = options.duration;
    let maxDuration = options.duration + scheduleWiggle;
    if (options.leeWayAfter) {
      maxDuration += options.leeWayAfter;
    }
    let items = await playlistItems.getPlaylist(
      options.playlist,
      playlistMeta.mode
    );
    if (items.length == 0) return false;
    let duration = 0;
    let queue = [];
    complete = false;
    let i = 0;
    do {
      const item = items[i];
      i++;
      if (duration + item.duration > maxDuration) continue;
      duration += item.duration;
      queue.push(item);
      if (duration > minDuration && duration <= maxDuration) {
        complete = true;
      }
    } while (!complete && i < items.length);
    for (let subitem of queue) {
      await this.queueVideo(
        { mediaURL: subitem.url },
        subitem.username,
        null,
        null,
        true
      );
      await playlistItems.updatePlayCount(subitem.id);
    }
    return complete;
  };
}

let playlist = new PlayList();
export default playlist;
