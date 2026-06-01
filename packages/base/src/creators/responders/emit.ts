import { ConstaticApp } from "../../app.js";
import type { GenericResponderInteraction } from "./manager.js";

export type WithCustomId<T> = T & { customId: string };

type EmitResponderInteraction = Omit<GenericResponderInteraction, "customId">;

interface EmitResponderData {
    customId: string;
    interaction: EmitResponderInteraction
}

export function emitResponder(customId: string, interaction: EmitResponderInteraction): void
export function emitResponder(data: EmitResponderData): void
export function emitResponder(a: string | EmitResponderData, b?: EmitResponderInteraction){
    const { customId, interaction } = typeof a === "string" 
        ? { customId: a, interaction: b! }
        : a;

    const app = ConstaticApp.getInstance();
    app.responders.onResponder(
        Object.assign(interaction, { customId }) as GenericResponderInteraction
    );
}