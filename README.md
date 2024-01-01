# Cynomystica

Online platform that syncs a playlist of videos that people can add to and watch. The goal is to make deployment as easy as possible. Heavily inspired by [`Cytube`](https://github.com/calzoneman/sync).
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
	<tr><td>TAB</td><td>autocompletes username/emote<br />tab again to cycle</td></tr>
	<tr><td>↑/↓</td><td>Cycles through previous<br />sent messages</td></tr>
</table>

### Supported Providers

- Twitch streams
- Youtube shorts, videos, streams
- Iframe embeds
- Raw mp4 and mp3 (including streaming mp3)

### Update Log

#### Dec 31, 2023

- Twitch live support (No vods yet)
- Mp3 live support
- Iframe embeds
- Permanent playlist items
- Custom info page

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
