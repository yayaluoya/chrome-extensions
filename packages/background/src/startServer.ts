import { onMessage, type MessageReq } from "@taozi-chrome-extensions/common/src/message";
import { MessageType } from "@taozi-chrome-extensions/common/src/constant/messageType";
import { requestBaiduTranslate } from "./api/baiduTranslate";

export function startServer() {
  onMessage(MessageType.baiduTranslate, (req: MessageReq<string>, sender, sendResponse) => {
    sendResponse(requestBaiduTranslate(req.value || ""));
  });
}
