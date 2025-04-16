
import { baiduTranslate } from "./translate/baiduTranslate";
import { onMessage, type MessageReq } from "@yayaluoya-extensions/common/src/message"
import { MessageType } from "@yayaluoya-extensions/common/src/constant/messageType";

export function startServer() {
    onMessage(MessageType.baiduTranslate, (req: MessageReq<string>, sender, sendResponse) => {
        baiduTranslate(req.value!)
            .then(str => sendResponse({ succeed: true, content: str }))
            .catch(() => sendResponse({ succeed: false }));
    });
}