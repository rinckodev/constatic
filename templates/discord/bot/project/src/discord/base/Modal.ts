import { CacheType, Collection, ModalMessageModalSubmitInteraction, ModalSubmitInteraction } from "discord.js";
import { Params, Prettify, getCustomIdParams } from "./utils/Params.js";
import { log } from "#settings";
import ck from "chalk";

type GetInteraction<C extends CacheType = CacheType, M extends boolean = boolean> = 
	M extends true ? ModalMessageModalSubmitInteraction<C> : ModalSubmitInteraction<C>;

type ModalData<I extends string, C extends CacheType = CacheType, M extends boolean = boolean> = {
	customId: I; cache?: C; isFromMessage?: M;
	run(interaction: GetInteraction<C, M>, params: Prettify<Params<I>>): void;
}

export class Modal<I extends string, C extends CacheType = CacheType, M extends boolean = boolean> {
	private static modals = new Collection<string, ModalData<any, any, any>>();
	constructor(data: ModalData<I, C, M>) {
		Modal.modals.set(data.customId, data);
	}
	public static onModal(interaction: ModalSubmitInteraction){
		const { customId } = interaction;
		if (Modal.modals.has(customId)){
			const modal = Modal.modals.get(customId)!;
			modal.run(interaction, null);
			return;
		}

		const modal = Modal.modals.find(data => !!getCustomIdParams(data.customId, customId));
        if (!modal) return;
		const params = getCustomIdParams(modal.customId, customId);
        modal.run(interaction, params as never);
	}

	public static logs(){
		Modal.modals.forEach(({ customId }) => {
			log.success(ck.green(`${ck.cyan.underline(customId)} modal loaded successfully!`));
		});
	}
}