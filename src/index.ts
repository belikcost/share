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
    className?: string;
}

interface IShareOptions {
    url: string;
    title: string;
    shared: IShared[];
}

interface IShare {
    init: () => void;
}

type ShareOptionsTitle = IShareOptions["title"];
type ShareOptionsUrl = IShareOptions["url"];

export default class Share implements IShare {
    private readonly shareElements: IShareElement[];
    private readonly shared: IShared[];
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

    constructor(target: HTMLElement | HTMLElement[], { url, title, shared }: IShareOptions) {
        this.target = target;
        this.shared = shared;
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
        this.shared.forEach(({ hintText, content, type, className }) => {
            const button = document.createElement("button");
            const span = document.createElement("span");

            button.setAttribute("title", hintText);
            button.setAttribute("data-type", type);
            if (className) button.setAttribute("class", className);

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