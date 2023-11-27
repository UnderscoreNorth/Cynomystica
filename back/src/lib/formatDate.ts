export default function formatDate(date: Date) {
  let start = date.toLocaleTimeString("en-Gb", {
    timeZone: "UTC",
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    hour12: false,
  });
  let formattedDate = `${start.substring(6, 10)}-${start.substring(
    3,
    5
  )}-${start.substring(0, 2)} ${start.substring(12)}`;
  return formattedDate;
}
