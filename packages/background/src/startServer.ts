import { onMessage, type MessageReq } from "@taozi-chrome-extensions/common/src/message";
import { MessageType } from "@taozi-chrome-extensions/common/src/constant/messageType";
import { requestBaiduTranslate } from "./api/baiduTranslate";
import { papdTask } from "./tapd";

export function startServer() {
  onMessage(MessageType.baiduTranslate, (req: MessageReq<string>, sender, sendResponse) => {
    sendResponse(requestBaiduTranslate(req.value || ""));
  });
  onMessage(MessageType.popupOpen, (req, sender, sendResponse) => {
    sendResponse(papdTask());
  });
}
