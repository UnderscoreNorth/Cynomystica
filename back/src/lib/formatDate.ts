import { Moment } from "moment";
export default function formatDate(date: Moment) {
  return date.format("YYYY-MM-DD HH:mm:ss");
}
