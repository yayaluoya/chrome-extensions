export interface MessageReq<T = any> {
  type: string;
  value?: T;
}
export interface MessageRes<T = any> {
  succeed: boolean;
  msg?: string;
  content?: T;
}

/**
 * 发送消息
 * @param req
 * @returns
 */
export function sendMessage<T>(req: MessageReq) {
  return chrome.runtime.sendMessage(req).then((res: MessageRes<T>) => {
    if (res.succeed) {
      return res.content;
    } else {
      throw new Error(res.msg || "");
    }
  });
}

type handleFType = (
  req: MessageReq,
  sender: chrome.runtime.MessageSender,
  sendResponse: (res: MessageRes | Promise<MessageRes>) => void,
  next?: () => void
) => void;

const listeners: {
  type: string;
  handleF: handleFType;
}[] = [];

chrome.runtime.onMessage.addListener((req: MessageReq, sender, sendResponse) => {
  const handleListeners = listeners.filter(item => item.type == req.type);
  if (handleListeners.length <= 0) {
    return false;
  }
  const handleF = () => {
    if (handleListeners.length <= 0) {
      return;
    }
    let onHandle = handleListeners.shift()!;
    onHandle.handleF(
      req,
      sender,
      res => {
        Promise.resolve(res).then(sendResponse);
      },
      handleF
    );
  };
  handleF();
  return true;
});

/**
 * 监听消息
 * @param type
 * @param handleFs
 */
export function onMessage(type: string, ...handleFs: handleFType[]) {
  handleFs.forEach(handleF => {
    listeners.push({ type, handleF });
  });
}
