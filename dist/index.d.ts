import { SharedTypesEnum } from "./enums";
declare type ShareElementAttributes = {
    ["data-type"]: SharedTypesEnum;
};
declare type EventWithTarget = Event & {
    target: IShareElement & {
        nodeName: string;
    };
};
declare type EventListenerCallback = EventListenerObject | ((event: EventWithTarget) => void) | null;
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
declare type ShareOptionsTitle = IShareOptions["title"];
declare type ShareOptionsUrl = IShareOptions["url"];
export default class Share implements IShare {
    private readonly shareElements;
    private readonly shared;
    private readonly target;
    private readonly curriedHandleSocialSharing;
    private static copyTextToClipboard;
    private static handleSocialSharing;
    constructor(target: HTMLElement | HTMLElement[], { url, title, shared }: IShareOptions);
    init(): void;
    private createShareButtons;
}
export type { IShareOptions, IShareElement, IShared, IShare, ShareElementAttributes, ShareOptionsUrl, ShareOptionsTitle, EventWithTarget, EventListenerCallback };
