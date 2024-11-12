import { v4 as uuidv4 } from "uuid";
import md5 from "md5";
import moment from "moment";

import { socketInterface, sendUserList } from "../server/socket";
import chat from "../server/chat";
import userModeration from "../sqliteTables/userModeration";
import {
  default as permissions,
  init as permissionsInit,
} from "../server/permissions";
import { default as settings, init as settingsInit } from "../server/settings";
import { default as moderation, init as modInit } from "../server/moderation";
import { init as effectInit } from "../server/effects";

import message from "../controller/message";
import deleteItem from "../controller/delete-item";
import disconnect from "../controller/disconnect";
import getPlaylist from "../controller/get-playlist";
import loginGuest from "../controller/login-guest";
import queueNext from "../controller/queue-next";
import signIn from "../controller/login-password";
import signUp from "../controller/sign-up";
import upsertSchedule from "../controller/upsert-schedule";
import loginToken from "../controller/login-token";
import getSchedule from "../controller/get-schedule";
import upsertPermissions from "../controller/settings/upsert-permissions";
import userMod from "../controller/moderation/user-mod";
import version from "../controller/version";
import upsertUserSettings from "../controller/settings/upsert-usersettings";
import closePoll from "../controller/polls/close-poll";
import createPoll from "../controller/polls/create-poll";
import deletePoll from "../controller/polls/delete-poll";
import votePoll from "../controller/polls/vote-poll";
import upsertIcons from "../controller/settings/upsert-icons";
import getUserManagement from "../controller/settings/get-user-management";
import updateUserRole from "../controller/settings/update-user-role";
import upsertEmotes from "../controller/settings/upsert-emotes";
import upsertPresets from "../controller/settings/upsert-presets";
import upsertSettings from "../controller/settings/upsert-settings";
import updatePlaylist from "../controller/update-playlist";
import getModeration from "../controller/moderation/get-moderation";
import undoModeration from "../controller/moderation/undo-moderation";
import queueLast from "../controller/queue-last";
import deleteSchedule from "../controller/delete-schedule";
import updateInfo from "../controller/settings/update-info";
import leaderSync from "../controller/leader-sync";
import setLeader from "../controller/set-leader";
import effect from "../controller/effect";
import recheck from "../controller/recheck";

import playlist from "../server/playlist";

import SyncPlay from "../server/syncplay";
import sendEmotes from "../lib/sendEmotes";
import polls from "../server/polls";
import sendIcons from "../lib/sendIcons";
import { Server } from "socket.io";
import addToPlaylist from "../controller/playlists/add-to-playlist";
import getPlaylists from "../controller/playlists/get-playlists";
import upsertPlaylist from "../controller/playlists/upsert-playlist";
import deletePlaylist from "../controller/playlists/delete-playlist";
export default function ioInit(io: Server) {
  settingsInit();
  permissionsInit();
  modInit();
  effectInit();
  const ioEvents = {
    "delete-item": deleteItem,
    disconnect: disconnect,
    "get-playlist": getPlaylist,
    "login-guest": loginGuest,
    message: message,
    "queue-next": queueNext,
    "sign-in": signIn,
    "sign-up": signUp,
    "upsert-schedule": upsertSchedule,
    "login-token": loginToken,
    "get-schedule": getSchedule,
    "user-mod": userMod,
    version: version,
    "update-playlist": updatePlaylist,
    "upsert-usersettings": upsertUserSettings,
    "close-poll": closePoll,
    "create-poll": createPoll,
    "delete-poll": deletePoll,
    "vote-poll": votePoll,
    "upsert-icons": upsertIcons,
    "upsert-permissions": upsertPermissions,
    "get-user-management": getUserManagement,
    "update-user-role": updateUserRole,
    "upsert-emotes": upsertEmotes,
    "upsert-presets": upsertPresets,
    "upsert-settings": upsertSettings,
    "get-moderation": getModeration,
    "undo-moderation": undoModeration,
    "queue-last": queueLast,
    "delete-schedule": deleteSchedule,
    "update-info": updateInfo,
    "leader-sync": leaderSync,
    "set-leader": setLeader,
    "add-to-playlist": addToPlaylist,
    "get-playlists": getPlaylists,
    "upsert-playlist": upsertPlaylist,
    "delete-playlist": deletePlaylist,
    recheck: recheck,
    effect: effect,
  };
  io.on("connection", async (socket: socketInterface) => {
    socket.uuid = uuidv4();
    socket.handshake.headers["x-real-ip"] = md5(
      socket.handshake.headers["x-real-ip"] ?? ""
    );
    console.log("new connection", socket.handshake.headers["x-real-ip"]);
    if (!socket.request.headers["user-agent"]) socket.disconnect();
    if (
      typeof moderation().users?.[
        socket.handshake.headers["x-real-ip"].toString()
      ]?.["IP Ban"] == "object"
    ) {
      socket.emit("alert", {
        type: "IP banned",
        message: "This IP has been banned",
      });
      socket.disconnect();
      return;
    }
    socket.emit("connected", socket.uuid);
    socket.use((s, next) => {
      console.log(new Date(), socket.username, s);
      next();
    });
    for (let event in ioEvents) {
      try {
        socket.on(event, async (msg) => {
          ioEvents[event](socket, msg);
        });
      } catch (err) {
        console.log(socket.username, moment.utc(), err);
      }
    }
    socket.on("connection", (socket2) => {
      console.log("reconnection", socket.username, socket2.username);
    });
    sendUserList();
    permissions().send(socket);
    sendEmotes(socket);
    chat().getRecent(socket);
    polls().get(socket);
    sendIcons(socket);
    getSchedule(socket, new Date().toLocaleString());
    settings().sendPreset(socket);
    settings().sendSettings(socket);
    settings().sendInfo(socket);
    settings().sendLeader(socket);
  });
}
