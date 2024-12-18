import * as fs from "fs";
import * as csv from "csv";
import moment, { Moment } from "moment";

const template = `
[Script Info]
; Script generated by Aegisub 3.2.2
; http://www.aegisub.org/
Title: Default Aegisub file
ScriptType: v4.00+
WrapStyle: 0
ScaledBorderAndShadow: yes
YCbCr Matrix: TV.601
PlayResX: 1280
PlayResY: 720


[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
Style: Default,Arial,20,&H8000FFF7,&H000000FF,&H7B000000,&HFF000000,0,0,0,0,100,100,0,0,1,4.5,4.5,1,23,23,90,1
[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text`;

const maxLines = 16;
async function main() {
  let chat: Array<{
    username: string;
    message: string;
    icon: string;
    time: Moment;
  }> = [];
  let vids: Array<{ url: string; title: string; time: Moment }> = [];
  for (let i = 1; i <= 9; i++) {
    chat = chat.concat(await processChat(`./logs/chat/2024/12/${i}.csv`));
    vids = vids.concat(await processVid(`./logs/playlist/2024/12/${i}.csv`));
  }
  for (let i = 0; i < vids.length - 1; i++) {
    const vid = vids[i];
    const vidStart = vid.time;
    const vidEnd = vids[i + 1].time;
    const vidLength = vidEnd.diff(vidStart) / 1000;
    if (vidLength < 300) continue;
    if (!vid.url.includes("isthisliv")) continue;
    let currentChat: string[] = [];
    let subtitles = template;
    let lastTime = 0;
    for (const msg of chat) {
      if (msg.time >= vidStart && msg.time <= vidEnd) {
        let time = msg.time.diff(vidStart) / 1000;
        if (Math.floor(time) == Math.floor(lastTime)) {
          do {
            time += 0.05;
          } while (time <= lastTime);
        }
        for (const j in currentChat) {
          let msg = currentChat[j];
          let last = "";
          do {
            last = msg;
            msg = msg.replace(/<span [^>]*>/gm, "");
            msg = msg.replace(`</span>`, "");
            msg = msg.replace(/&gt;/gm, ">");
            msg = msg.replace(/&lt;/gm, "<");
            msg = msg.replace(/<strong>/gm, ">");
            msg = msg.replace(/<\/strong>/gm, ">");
          } while (last !== msg);

          subtitles += `
Dialogue: 0,${formatTime(lastTime)},${formatTime(time)},Default,,0,0,${
            (parseInt(j) + 15) * 10
          },,${msg}`;
        }
        currentChat.unshift(msg.username + ": " + msg.message);
        currentChat.splice(maxLines);
        lastTime = time;
      }
    }
    const time = vidLength;
    for (const j in currentChat) {
      subtitles += `
Dialogue: 0,${formatTime(lastTime)},${formatTime(time)},Default,,0,0,${
        (parseInt(j) + 15) * 10
      },,${currentChat[j]}`;
    }
    fs.writeFileSync(`./logs/${vid.title}.ass`, subtitles);
  }
}

main();
function formatTime(seconds: number) {
  let milliseconds = Math.round((seconds - Math.floor(seconds)) * 100);
  return `${Math.floor(seconds / 3600)}:${Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0")}:${(Math.floor(seconds) % 60)
    .toString()
    .padStart(2, "0")}.${milliseconds}`;
}
async function processChat(file: string) {
  const records: Array<{
    username: string;
    message: string;
    icon: string;
    time: Moment;
  }> = [];
  const parser = fs.createReadStream(file).pipe(
    csv.parse({
      // CSV options if any
    })
  );
  for await (const record of parser) {
    // Work with each record
    records.push({
      username: record[0],
      message: record[1],
      icon: record[2],
      time: moment.utc(record[3]).add("-2", "seconds"),
    });
  }
  return records;
}

async function processVid(file: string) {
  const records: Array<{ url: string; title: string; time: Moment }> = [];
  const parser = fs.createReadStream(file).pipe(
    csv.parse({
      // CSV options if any
    })
  );
  for await (const record of parser) {
    // Work with each record
    records.push({
      url: record[0],
      title: record[1],
      time: moment.utc(record[3]),
    });
  }
  return records;
}
