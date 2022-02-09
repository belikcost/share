import { SocialTypesEnum } from "./enums";
declare type ShareElementAttributes = {
    ["data-social-type"]: SocialTypesEnum;
};
declare type EventWithTarget = Event & {
    target: IShareElement & {
        nodeName: "BUTTON" | "SPAN";
    };
};
declare type EventListenerCallback = EventListenerObject | ((event: EventWithTarget) => void) | null;
interface IShareElement extends Node {
    attributes: HTMLButtonElement["attributes"] & ShareElementAttributes;
    getAttribute: <T extends keyof ShareElementAttributes>(key: T) => ShareElementAttributes[T];
    setAttribute: <T extends keyof ShareElementAttributes>(key: T, value: ShareElementAttributes[T]) => void;
    addEventListener: (key: keyof HTMLElementEventMap, callback: EventListenerCallback) => void;
}
interface ISocial {
    hintText: string;
    content: string;
    type: SocialTypesEnum;
}
interface IShareSocialOptions {
    url: string;
    title: string;
    socials: ISocial[];
}
interface IShareSocial {
    init: () => void;
}
declare type ShareOptionsTitle = IShareSocialOptions["title"];
declare type ShareOptionsUrl = IShareSocialOptions["url"];
declare class ShareSocial implements IShareSocial {
    private readonly shareElements;
    private readonly socials;
    private readonly target;
    private readonly curriedHandleSocialSharing;
    private static handleSocialSharing;
    constructor(target: HTMLElement | HTMLElement[], { url, title, socials }: IShareSocialOptions);
    init(): void;
    private createShareButtons;
}
export type { IShareSocialOptions, IShareElement, ISocial, IShareSocial, ShareElementAttributes, ShareOptionsUrl, ShareOptionsTitle, EventWithTarget, EventListenerCallback };
export default ShareSocial;
