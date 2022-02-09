import * as sharing from "vanilla-sharing";
import { curry } from "ramda";

import { SharedTypesEnum } from "./enums";

type ShareElementAttributes = { ["data-type"]: SharedTypesEnum };
type EventWithTarget = Event & { target: IShareElement & { nodeName: "BUTTON" | "SPAN" } };
type EventListenerCallback = EventListenerObject | ((event: EventWithTarget) => void) | null;

interface IShareElement extends Node {
    attributes: HTMLButtonElement["attributes"] & ShareElementAttributes;
    getAttribute: <T extends keyof ShareElementAttributes>(key: T) => ShareElementAttributes[T];
    setAttribute: <T extends keyof ShareElementAttributes>(key: T, value: ShareElementAttributes[T]) => void;
    addEventListener: (key: keyof HTMLElementEventMap, callback: EventListenerCallback) => void;
}

interface IShared {
    hintText: string;
    content: string;
    type: SharedTypesEnum;
}

interface IShareOptions {
    url: string;
    title: string;
    socials: IShared[];
}

interface IShare {
    init: () => void;
}

type ShareOptionsTitle = IShareOptions["title"];
type ShareOptionsUrl = IShareOptions["url"];

class Share implements IShare {
    private readonly shareElements: IShareElement[];
    private readonly socials: IShared[];
    private readonly target: HTMLElement | HTMLElement[];
    private readonly curriedHandleSocialSharing: (event: EventWithTarget) => void;

    private static copyTextToClipboard(text: string) {
        const body = document.querySelector("body")!;
        const textarea = document.createElement("textarea");

        body.append(textarea);

        textarea.value = text;
        textarea.select();
        document.execCommand("copy");

        textarea.remove();
    }

    private static handleSocialSharing(title: ShareOptionsTitle, url: ShareOptionsUrl, event: EventWithTarget) {
        if (event.target.nodeName === "SPAN") {
            event.target.parentElement!.click();
            return;
        }

        const sharedType = event.target.getAttribute("data-type");

        if (sharedType === SharedTypesEnum.copy) {
            Share.copyTextToClipboard(url);
            return;
        }

        sharing[sharedType]({ title, url });
    }

    constructor(target: HTMLElement | HTMLElement[], { url, title, socials }: IShareOptions) {
        this.target = target;
        this.socials = socials;
        this.shareElements = [];
        this.curriedHandleSocialSharing = curry(Share.handleSocialSharing)(title, url);
    }

    init() {
        if (Array.isArray(this.target)) {
            this.target.forEach((element) => {
                this.createShareButtons(element);
            });
        } else {
            this.createShareButtons(this.target);
            this.target.append(...this.shareElements);
        }
    }

    private createShareButtons(element: HTMLElement) {
        this.socials.forEach(({ hintText, content, type }) => {
            const button = document.createElement("button");
            const span = document.createElement("span");

            button.setAttribute("title", hintText);
            button.setAttribute("data-type", type);

            button.append(span);
            element.append(button);

            span.innerHTML = content;

            const shareButton = button as unknown as IShareElement;

            this.shareElements.push(shareButton);

            shareButton.addEventListener("click", this.curriedHandleSocialSharing);
        });
    }
}

export type {
    IShareOptions,
    IShareElement,
    IShared,
    IShare,
    ShareElementAttributes,
    ShareOptionsUrl,
    ShareOptionsTitle,
    EventWithTarget,
    EventListenerCallback
};

export default Share;