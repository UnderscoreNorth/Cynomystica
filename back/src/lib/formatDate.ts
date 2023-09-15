export default function formatDate(date: Date) {
  return date
    .toLocaleTimeString("en-ca", {
      timeZone: "UTC",
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
      hour12: false,
    })
    .replace("/", "-")
    .replace(",", "");
}
