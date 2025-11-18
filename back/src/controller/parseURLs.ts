import { socketInterface } from "../server/socket";
import permissions from "../server/permissions";
import jsdom from 'jsdom'
export default async function parseURLs(
  socket: socketInterface,
  msg: string
) {
  if (socket.accessLevel >= permissions().items["manageSchedule"]) {
    try {
      if (typeof msg !== 'string' || msg.length == 0) return;
		try {
			let urls = msg.split(',');
			console.log(urls)
			let data: string[][] = [];
			for (let url of urls) {
				const response = await (await fetch(url.trim())).text();
				const doc = (new jsdom.JSDOM(response)).window.document;
                //@ts-ignore
				const links = Array.from(doc.querySelectorAll('a[href]')).map((link) => link.href).filter((href) => href.toLowerCase().endsWith('.mp4')).sort();
				for (let i in links) {
					if (data[i] == undefined) {
						data[i] = [];
					}
					let link = links[i] as string;
					if(!link.startsWith('http') && !link.startsWith('/')){
						link = url.trim() + '/' + link;
					}
					data[i].push(link);
				}
			}
			socket.emit("urls-parsed",
                data.map((i) => i.join('????')).join('\n'));
		} catch (err) {
			console.log(err);
		}
    } catch (err) {
      console.log(err);
      socket.emit("alert", {
        type: "queue",
        message: "Something went wrong with the request",
      });
    }
  }
}
