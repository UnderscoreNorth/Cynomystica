export default function messageFormatter(msg: string) {
  msg = msg.replace(/</g, "&lt;");
  msg = msg.replace(/>/g, "&gt;");
  console.log(msg);
  let classStylers = [
    { type: "greentext", consume: false, regex: "&gt;" },
    { type: "redtext", consume: true, regex: "red:" },
    { type: "bluetext", consume: true, regex: "blue:" },
  ];
  let classes = [];
  let formatters = [
    { type: "link", matchRegex: /(http[^\s]+)/, replaceRegex: /(http[^\s]+)/ },
    {
      type: "strong",
      matchRegex: /(\*[^\*]+\*)/,
      replaceRegex: /\*([^\*]+)\*/,
    },
    { type: "italic", matchRegex: /(_[^_]+_)/, replaceRegex: /_([^_]+)_/ },
    {
      type: "spoiler",
      matchRegex: /(\[s\][^`]+\[\/s\])/,
      replaceRegex: /\[s\]([^`]+)\[\/s\]/,
    },
    {
      type: "pic",
      matchRegex: /(http[^\s]+:pic)/,
      replaceRegex: /(http[^\s]+):pic/,
    },
  ];
  msg = msg.trim();
  for (let classStyle of classStylers) {
    if (msg.indexOf(classStyle.regex) == 0) {
      classes.push(classStyle.type);
      if (classStyle.consume === true) {
        msg = msg.substring(classStyle.regex.length);
        msg = msg.trim();
      }
    }
  }
  let arr = [{ content: msg, type: "text" }];
  for (let formatter of formatters) {
    let newArr = [];
    for (let msgPart of arr) {
      let content = msgPart.content;
      if (msgPart.type == "text") {
        let tempArr = content.split(formatter.matchRegex);
        for (let splitContent of tempArr) {
          let type = "text";
          if (splitContent.match(formatter.matchRegex)) {
            type = formatter.type;
            splitContent =
              splitContent.match(formatter.replaceRegex)?.[1] ?? splitContent;
          }
          newArr.push({ content: splitContent, type });
        }
      } else {
        newArr.push(msgPart);
      }
    }
    arr = newArr;
  }
  let formattedMsg = "";
  for (let msgPart of arr) {
    if (msgPart.type == "strong") {
      formattedMsg += `<strong>${msgPart.content}</strong>`;
    } else if (msgPart.type == "italic") {
      formattedMsg += `<em>${msgPart.content}</em>`;
    } else if (msgPart.type == "spoiler") {
      formattedMsg += `<span class='spoilertext'>${msgPart.content}</span>`;
    } else if (msgPart.type == "pic") {
      formattedMsg += `<a href=${msgPart.content} target='_blank' rel="noreferrer"><img src=${msgPart.content} /></a>`;
    } else if (msgPart.type == "link") {
      formattedMsg += `<a href=${msgPart.content} target='_blank' rel="noreferrer">${msgPart.content}</a>`;
    } else {
      formattedMsg += `${msgPart.content}`;
    }
  }
  if (classes.length > 0) {
    formattedMsg = `<span class='${classes.join(" ")}'>${formattedMsg}</span>`;
  }
  return formattedMsg;
}
