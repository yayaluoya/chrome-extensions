import { sendMessage } from "@taozi-chrome-extensions/common/src/message";
import App from "./AppPopup.vue";
import { createApp } from "./createApp";
import { MessageType } from "@taozi-chrome-extensions/common/src/constant/messageType";

createApp(App);

sendMessage({
  type: MessageType.popupOpen
});
