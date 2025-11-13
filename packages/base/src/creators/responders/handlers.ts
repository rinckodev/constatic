import { MessageComponentInteraction, ModalSubmitInteraction } from "discord.js";
import { ConstaticApp } from "../../app.js";
import { ResponderType } from "./responder.js";

export type GenericResponderInteraction = 
    | MessageComponentInteraction
    | ModalSubmitInteraction;

export abstract class BaseResponderHandlers {
    private static getType(interaction: GenericResponderInteraction) {
        return interaction.isButton() ? ResponderType.Button :
            interaction.isStringSelectMenu() ? ResponderType.StringSelect :
            interaction.isChannelSelectMenu() ? ResponderType.ChannelSelect :
            interaction.isRoleSelectMenu() ? ResponderType.RoleSelect :
            interaction.isUserSelectMenu() ? ResponderType.UserSelect :
            interaction.isMentionableSelectMenu() ? ResponderType.MentionableSelect :
            interaction.isModalSubmit() && interaction.isFromMessage() ? ResponderType.ModalComponent :
            interaction.isModalSubmit() ? ResponderType.Modal : undefined;
    };
    public static async onResponder(interaction: GenericResponderInteraction) {
        const app = ConstaticApp.getInstance();

        const { middleware, onError, onNotFound } = app.config.responders;

        const responderType = BaseResponderHandlers.getType(interaction);
        if (!responderType) {
            onNotFound?.(interaction);
            return;
        }

        const handler = app.responders.getHandler(responderType, interaction.customId)
        if (!handler) {
            onNotFound?.(interaction);
            return;
        }
        const data = handler.data.data;

        const params = handler.params && data.parse
            ? data.parse(handler.params)
            : (handler.params??{});

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