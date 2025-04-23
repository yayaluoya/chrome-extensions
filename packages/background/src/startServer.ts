import { onMessage, type MessageReq } from "@yayaluoya-extensions/common/src/message";
import { MessageType } from "@yayaluoya-extensions/common/src/constant/messageType";
import { requestBaiduTranslate } from "./api/baiduTranslate";

export function startServer() {
  onMessage(MessageType.baiduTranslate, (req: MessageReq<string>, sender, sendResponse) => {
    sendResponse(requestBaiduTranslate(req.value || ""));
  });
}
