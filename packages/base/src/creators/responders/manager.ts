import type { CacheType, MessageComponentInteraction, ModalSubmitInteraction } from "discord.js";
import { styleText } from "node:util";
import { Router } from "../../utils/router.js";
import { BaseManager } from "../manager.js";
import { ResponderType, type Responder } from "./responder.js";

export type GenericResponder = Responder<string, readonly ResponderType[], any, CacheType>;

export type GenericResponderInteraction = 
    | MessageComponentInteraction
    | ModalSubmitInteraction;

export class ResponderManager extends BaseManager {
    private get config(){
        return this.app.config.responders
    }
    private readonly router = new Router<GenericResponder>();
    public set(responder: GenericResponder) {
        const path = responder.data.customId;
        for (const type of new Set(responder.data.types)) {
            this.router.add(type, path, responder);
            this.logs.push([
                styleText("greenBright", `▸ ${type}`),
                styleText("gray", `>`),
                styleText(["blue", "underline"], path),
                styleText("green", "✓"),
            ].join(" "));
        }

    }
    public getHandler(type: ResponderType, customId: string) {
        return this.router.find(type, customId);
    }
    private getType(interaction: GenericResponderInteraction) {
        return interaction.isButton() ? ResponderType.Button :
            interaction.isStringSelectMenu() ? ResponderType.StringSelect :
            interaction.isChannelSelectMenu() ? ResponderType.ChannelSelect :
            interaction.isRoleSelectMenu() ? ResponderType.RoleSelect :
            interaction.isUserSelectMenu() ? ResponderType.UserSelect :
            interaction.isMentionableSelectMenu() ? ResponderType.MentionableSelect :
            interaction.isModalSubmit() && interaction.isFromMessage() ? ResponderType.ModalComponent :
            interaction.isModalSubmit() ? ResponderType.Modal : undefined;
    };
    public async onResponder(interaction: GenericResponderInteraction) {
        const { middleware, onError, onNotFound } = this.config;

        const responderType = this.getType(interaction);
        if (!responderType) {
            onNotFound?.(interaction);
            return;
        }

        const handler = this.getHandler(responderType, interaction.customId)
        if (!handler) {
            onNotFound?.(interaction);
            return;
        }
        const data = handler.data.data;

        const params = handler.params && data.parse
            ? data.parse(handler.params)
            : (handler.params ?? {});

        let isBlock = false;
        const block = () => isBlock = true;
        if (middleware) await middleware(interaction, block, params);
        if (isBlock) return;

        //@ts-ignore
        await data.run(interaction, params)
            .catch(err => {
                if (onError) {
                    onError(err, interaction, params);
                    return;
                }
                throw err;
            });
    }
}