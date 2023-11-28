import { default as IO } from "./socket";
import schedule from "../sqliteTables/schedule";

export const getSchedule = async () => {
  IO().emit("schedule", {
    status: "success",
    schedule: await schedule.getAll(new Date("Jan 1 2000")),
  });
};
