import { default as IO, socketInterface } from "./socket";
import permissions from "./permissions";
import { Server } from "socket.io";
import { v4 as uuidv4 } from "uuid";

export interface Poll {
  username: string;
  dateCreate: Date;
  duration: number;
  title: string;
  options: Array<string>;
  votes: Record<string, number>;
  dateClose?: Date;
}

export class Polls {
  polls: Record<string, Poll>;
  constructor() {
    this.polls = {};
  }
  create(
    socket: socketInterface,
    title: string,
    options: Array<string>,
    duration: number
  ) {
    if (socket.accessLevel >= permissions.items["managePolls"]) {
      this.polls[uuidv4()] = {
        username: socket.username,
        duration,
        dateCreate: new Date(),
        title,
        options,
        votes: {},
      };
      IO().emit("poll", this.polls);
    }
  }
  close(socket: socketInterface, pollID: string) {
    if (socket.accessLevel >= permissions.items["managePolls"]) {
      if (this.polls[pollID]) {
        this.polls[pollID].dateClose = new Date();
        IO().emit("poll", this.polls);
      }
    }
  }
  check() {
    let now = new Date().getTime();
    let updated = false;
    for (let pollID in this.polls) {
      let poll = this.polls[pollID];
      if (poll.duration > 0) {
        if ((now - poll.dateCreate.getTime()) / 1000 > poll.duration) {
          updated = true;
          poll.dateClose = new Date();
          if (poll.options.length == 0) delete this.polls[pollID];
        }
      }
    }
    if (updated) IO().emit("poll", this.polls);
  }
  vote(socket: socketInterface, pollID: string, vote: number) {
    if (this.polls[pollID]) {
      this.polls[pollID].votes[socket.uuid] = vote;
      IO().emit("poll", this.polls);
    }
  }
  delete(socket: socketInterface, pollID: string) {
    if (socket.accessLevel >= permissions.items["managePolls"]) {
      delete this.polls[pollID];
      IO().emit("poll", this.polls);
    }
  }
  disconnect(socket: socketInterface) {
    for (let pollID in this.polls) {
      let poll = this.polls[pollID];
      delete poll.votes[socket.uuid];
    }
    IO().emit("poll", this.polls);
  }
  get(socket: Server | socketInterface) {
    socket.emit("poll", this.polls);
  }
}
let poll = new Polls();
export default function () {
  return poll;
}
