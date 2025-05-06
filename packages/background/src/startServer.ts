import { addMessageServer, type MessageReq } from "@taozi-chrome-extensions/common/src/messageServer";
import { MessageType } from "@taozi-chrome-extensions/common/src/constant/messageType";
import { requestBaiduTranslate } from "./api/baiduTranslate";
import { tapdTask } from "./tapd";

export function startServer() {
  addMessageServer(MessageType.BaiduTranslate, (req: MessageReq<string>, sender, sendResponse) => {
    sendResponse(requestBaiduTranslate(req.value || ""));
  });
  addMessageServer(MessageType.PopupOpen, (req, sender, sendResponse) => {
    sendResponse(tapdTask());
  });
}
