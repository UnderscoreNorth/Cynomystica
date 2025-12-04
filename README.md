# Cynomystica

Svelte remake of [`Cytube`](https://github.com/calzoneman/sync).
Cynomystica is named after the prairie dog.

## How to Use

### Chat Commands

<table>
	<tr><td>*text*</td><td><b>text</b></td></tr>
	<tr><td>_text_</td><td><em>text</em></td></tr>
	<tr><td>CTRL+S</td><td>inserts or wraps selected<br />text in [s][/s] tags</td></tr>
	<tr><td>[s]text[/s]</td><td><span style='background:black'>text</span></td></tr>
	<tr><td>red: text</td><td><span style='color:red'>text</span></td></tr>
	<tr><td>blue: text</td><td><span style='color:blue'>text</span></td></tr>
	<tr><td>>text</td><td><span style='color:#789922'>>text</span></td></tr>
	<tr><td>/me text</td><td><span class="actiontext">Username text</span></td></tr>
	<tr><td>link:pic</td><td>Image (Requires permissions)</td></tr>
	<tr><td>link:vid</td><td>Video (Requires permissions)</td></tr>
	<tr><td>TAB</td><td>autocompletes username/emote/media suffix<br />tab again to cycle</td></tr>
	<tr><td>↑/↓</td><td>Cycles through previous<br />sent messages</td></tr>
</table>

### Supported Providers

- Twitch streams
- Youtube shorts, videos, streams
- Iframe embeds
- Raw mp4 and mp3 (including streaming mp3)

### Multiple Sources

When queuing raw mp4s, you can combine differents links together with ????, for example, https://source1.com/DSADSA.mp4????https://source2.com/265654.mp4????https://source3.com/dsa80AD.mp4, and it will give users the options to pick between the servers

### Leader Mode

With a sufficient permission level, a user can become leader by hovering over the video player and toggling the star. In leader mode, the stream will sync to the leader, allowing them to seek through the video

### Scheduling and Playlists

Items may be scheduled in advance, either one at a time, or in bulk mode. Bulk mode has scheduling options to adjust how far to space the items apart in the schedule (Eg. Every Sat at 9pm, or Every Mon-Thu at 2pm). Items can be set to snap to a neighbor so they start one after the other, and leeway may be provided on how late an item can start after it's scheduled time.
Playlists can be created for later use. Playlists can be configured to range from a permanent random rotation to a queue where items are deleted after queueing. To use a playlist, it must be selected when scheduling an item. If a playlist is used without scheduling a link, the scheduled block will be reserved completely for the playlist. If used in combination with a link, the playlist will queue up it's contents before the scheduled item begins. (Eg. Scheduling a video at 9pm with 5 minutes of prequeue will slot in 5 minutes of the playlist's contents from 8:55-9:00, after which the scheduled video will play)

### Internal Queuing

After starting the backend, there'll be a queue folder in the root. Placing a txt file with a link inside will queue up that link. This can be used by other applications or scripts.

### Update Log

#### Dec 4, 2025

- The queue can be pinned above the chat messages, the number of items can be set in the user settings

#### Nov 21, 2025

- Items can be snapped and deleted in bulk
- Bulk queueing now skips a day if it conflicts with something in the schedule
- Bulk queuing can parse folder links to grab all the video links, chaining URLs with a comma will glue the links together (Used for cases where videos are hosted on multiple servers)

#### Apr 5, 2025

- Video meta processing offloaded to a worker to keep chat and video syncing smooth
- Bulk adding can now provide an offset Eg. |n+3| would start the bulk on 4 instead of 1

#### Nov 15, 2024

- Site theme colour can now be changed by user

#### Nov 11, 2024

- Scheduled items can now be coloured
- Schedule conflicts are highlighted with red borders

#### Jun 23, 2024

- Queue folder on the system side to allow for queuing by other processes
- Forcable anon mode by permission level

#### Feb 17, 2024

- Scheduled items can now be snapped to neighbors, with leeway allowances

#### Feb 10, 2024

- Playlists for prequeuing

#### Jan 5, 2024

- Leader syncing

#### Dec 31, 2023

- Twitch live support (No vods yet)
- Mp3 live support
- Iframe embeds
- Permanent playlist items
- Custom info page
- Posting videos in chat

#### Dec 30, 2023

- User management, can ignore, mute, ban, etc
- Actual queue next
- User settings now saved in local storage

#### Dec 27, 2023

- Video server selection support, use ???streamurl??? to seperate links to the same video
- Modal to view and select emotes
- Ability to hide images posted in chat

#### Dec 26, 2023

- Opacity setting on Video Minimal Mode
- Scroll lock button
- Refresh video button
- Schedule List View

#### Dec 21, 2023

- Youtube livestream support
- Max chat size user setting
- Optional SFX on chat trigger
- Video Minimal mode

#### Dec 19, 2023

- Added a single emote
- Polls/Pinned Messages

#### Dec 18, 2023

- The Three Guys
- Close button on modals
- Anonymous chat

#### Dec 17, 2023

- Persistent user settings
- Can move chat window to the right side
- Vertical mode applies if height is greater than width of screen
- Danmaku text shouldn't wrap anymore
- Danmaku transparency option
- Text formatting on danmaku
- Red,blue, /me, and spoiler text filters
- Chat bar moved to top of chat window in vertical mode

## Installation

- [back/config.json](back/config.example.json)
- [front/src/lib/clientconfig.json](front/src/lib/clientconfig.example.json)
