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
	private static items = new Collection<string, ModalData<any, any, any>>();
	constructor(data: ModalData<I, C, M>) {
		Modal.items.set(data.customId, data);
	}
	public static onModal(interaction: ModalSubmitInteraction){
		const { customId } = interaction;
		if (Modal.items.has(customId)){
			const modal = Modal.items.get(customId)!;
			modal.run(interaction, {});
			return;
		}

		const modal = Modal.items.find(data => !!getCustomIdParams(data.customId, customId));
        if (!modal) return;
		const params = getCustomIdParams(modal.customId, customId);
        modal.run(interaction, params??{});
	}

	public static logs(){
		Modal.items.forEach(({ customId }) => {
			log.success(ck.green(`${ck.cyan.underline(customId)} modal loaded successfully!`));
		});
	}
}