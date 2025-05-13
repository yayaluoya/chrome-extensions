import { MessageType } from "./constant/messageType";

export interface MessageReq<T = any> {
  type: string;
  value?: T;
}
interface MessageRes<T = any> {
  succeed: boolean;
  msg?: string;
  data?: T;
}

/**
 * 发送消息
 * @param req
 * @returns
 */
export function sendMessage<T = any>(req: MessageReq) {
  return chrome.runtime.sendMessage(req).then((res: MessageRes<T>) => {
    if (res.succeed) {
      return res.data;
    } else {
      throw new Error(res.msg || "");
    }
  });
}

type handleFType = (
  req: MessageReq,
  sender: chrome.runtime.MessageSender,
  sendResponse: (res: any | Promise<any>) => void,
  next?: () => void
) => void;

const listeners: {
  type: MessageType;
  handleF: handleFType;
}[] = [];

chrome.runtime.onMessage.addListener((req: MessageReq, sender, sendResponse_: any) => {
  const sendResponse = (res: MessageRes) => {
    sendResponse_(res);
  };
  const handleListeners = listeners.filter(item => item.type === req.type);
  if (handleListeners.length <= 0) {
    sendResponse({ succeed: false, msg: "找不到消息处理服务" });
    return false;
  }
  const handleF = () => {
    if (handleListeners.length <= 0) {
      return;
    }
    let onHandle = handleListeners.shift()!;
    try {
      onHandle.handleF(
        req,
        sender,
        res => {
          Promise.resolve(res)
            .then(data => sendResponse({ succeed: true, data }))
            .catch(err =>
              sendResponse({
                succeed: false,
                msg: err.toString()
              })
            );
        },
        handleF
      );
    } catch (err: any) {
      sendResponse({
        succeed: false,
        msg: err.toString()
      });
    }
  };
  handleF();
  return true;
});

/**
 * 添加消息服务
 * @param type
 * @param handleFs
 */
export function addMessageServer(type: MessageType, ...handleFs: handleFType[]) {
  handleFs.forEach(handleF => {
    listeners.push({ type, handleF });
  });
}

/**
 * 添加一次性消息服务
 * @param type
 * @param handleF
 */
export function addOnceMessageServer(type: MessageType, handleF: handleFType) {
  listeners.push({
    type,
    handleF: (...args) => {
      handleF(...args);
      removeMessageServer(type, handleF);
    }
  });
}

/**
 * 移除消息服务
 * @param type
 * @param handleF
 */
export function removeMessageServer(type: MessageType, handleF: handleFType) {
  const index = listeners.findIndex(item => item.type === type && item.handleF === handleF);
  if (index !== -1) {
    listeners.splice(index, 1);
  }
}
