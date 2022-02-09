import Share from "../src";
import { SharedTypesEnum } from "../src/enums";

const url = window.location.href;
const title = document.title;

const shared = [
    {
        hintText: "Share in Twitter",
        content: "Twitter",
        type: SharedTypesEnum.twitter
    },
    {
        hintText: "Share in Telegram",
        content: "Telegram",
        type: SharedTypesEnum.telegram
    },
    {
        hintText: "Share in WhatsApp",
        content: "WhatsApp",
        type: SharedTypesEnum.whatsapp
    },
    {
        hintText: "Copy link",
        content: "Copy",
        type: SharedTypesEnum.copy,
        className: "copy-link"
    }
];

const shareSocial = new Share(document.getElementById("test"), { url, title, shared });
shareSocial.init();