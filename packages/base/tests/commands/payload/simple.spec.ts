import { setupCreators } from "#package";
import { beforeEach, describe, expect, it } from "bun:test";
import { ApplicationCommandType } from "discord.js";
import { ConstaticApp } from "../../../src/app.js";

describe("Simple command data build", () => {
    beforeEach(() => {
        ConstaticApp.destroy();
    });

    it("Should build a simple slash command", () => {
        const { createCommand } = setupCreators();
        const app = ConstaticApp.getInstance();

        createCommand({
            name: "ping",
            description: "Ping command",
        });

        const payload = app.commands.build();

        expect(payload).toBeArray();
        expect(payload.length).toBe(1);

        expect(payload[0]).toEqual({
            name: "ping",
            description: "Ping command",
            type: ApplicationCommandType.ChatInput,
            dmPermission: false,
            descriptionLocalizations: undefined,
        });
    });

    it("Should build a user context menu command", () => {
		const { createCommand } = setupCreators();
		const app = ConstaticApp.getInstance();

		createCommand({
			name: "userinfo",
			type: ApplicationCommandType.User,
		});

		const payload = app.commands.build();

		expect(payload).toBeArray();
		expect(payload.length).toBe(1);

		expect(payload[0]).toEqual({
			name: "userinfo",
			type: ApplicationCommandType.User,
			dmPermission: false,
		});
	});

    it("Should build a message context menu command", () => {
		const { createCommand } = setupCreators();
		const app = ConstaticApp.getInstance();

		createCommand({
			name: "inspectmessage",
			type: ApplicationCommandType.Message
		});

		const payload = app.commands.build();

		expect(payload).toBeArray();
		expect(payload.length).toBe(1);

		expect(payload[0]).toEqual({
			name: "inspectmessage",
			type: ApplicationCommandType.Message,
			dmPermission: false
		});
	});
});
