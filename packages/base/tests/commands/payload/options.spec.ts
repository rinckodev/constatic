// @ts-nocheck
import { setupCreators } from "#package";
import { beforeEach, describe, expect, it } from "bun:test";
import { ApplicationCommandOptionType, ApplicationCommandType } from "discord.js";
import { ConstaticApp } from "../../../src/app.js";

describe("Slash commands with primitive options data build", () => {
	beforeEach(() => {
		ConstaticApp.destroy();
	});

	it("Slash with string option", () => {
		const { createCommand } = setupCreators();
		const app = ConstaticApp.getInstance();

		createCommand({
			name: "hello",
			description: "Hello",
			options: [
				{
					name: "text",
					type: ApplicationCommandOptionType.String,
					description: "Text input",
					required: true
				}
			]
		});

		const payload = app.commands.build();

		expect(payload.length).toBe(1);

		expect(payload[0]).toMatchObject({
			name: "hello",
			type: ApplicationCommandType.ChatInput,
			options: [
				{
					name: "text",
					type: ApplicationCommandOptionType.String,
					description: "Text input",
					required: true
				}
			]
		});
	});

	it("Slash with number option", () => {
		const { createCommand } = setupCreators();
		const app = ConstaticApp.getInstance();

		createCommand({
			name: "math",
			description: "Math",
			options: [
				{
					name: "num",
					type: ApplicationCommandOptionType.Number,
					description: "A number"
				}
			]
		});

		const payload = app.commands.build();

		expect(payload[0].options![0]).toMatchObject({
			name: "num",
			type: ApplicationCommandOptionType.Number,
			description: "A number"
		});
	});

	it("Slash with boolean option", () => {
		const { createCommand } = setupCreators();
		const app = ConstaticApp.getInstance();

		createCommand({
			name: "flag",
			description: "Flag",
			options: [
				{
					name: "enabled",
					type: ApplicationCommandOptionType.Boolean,
					description: "Enabled?"
				}
			]
		});

		const payload = app.commands.build();

		expect(payload[0].options![0]).toMatchObject({
			name: "enabled",
			type: ApplicationCommandOptionType.Boolean,
			description: "Enabled?"
		});
	});

	it("Slash with integer option + min/max", () => {
		const { createCommand } = setupCreators();
		const app = ConstaticApp.getInstance();

		createCommand({
			name: "range",
			description: "Range",
			options: [
				{
					name: "value",
					type: ApplicationCommandOptionType.Integer,
					description: "Value",
					minValue: 1,
					maxValue: 10
				}
			]
		});

		const payload = app.commands.build();

		expect(payload[0].options![0]).toMatchObject({
			name: "value",
			type: ApplicationCommandOptionType.Integer,
			description: "Value",
			minValue: 1,
			maxValue: 10
		});
	});

	it("Slash with string option + choices (clamped to 25)", () => {
		const { createCommand } = setupCreators();
		const app = ConstaticApp.getInstance();

		const choices = Array.from({ length: 30 }, (_, i) => ({
			name: `c${i}`,
			value: `v${i}`
		}));

		createCommand({
			name: "choice",
			description: "Choice",
			options: [
				{
					name: "pick",
					type: ApplicationCommandOptionType.String,
					description: "Pick",
					choices
				}
			]
		});

		const payload = app.commands.build();
		const returnedChoices = payload[0].options![0].choices!;

		expect(returnedChoices.length).toBe(25);
		expect(returnedChoices[0]).toEqual(choices[0]);
		expect(returnedChoices[24]).toEqual(choices[24]);
	});

	it("Slash with channel option + allowed types", () => {
		const { createCommand } = setupCreators();
		const app = ConstaticApp.getInstance();

		createCommand({
			name: "channel",
			description: "Channel",
			options: [
				{
					name: "target",
					type: ApplicationCommandOptionType.Channel,
					description: "Target channel",
					channelTypes: [0, 2]
				}
			]
		});

		const payload = app.commands.build();

		expect(payload[0].options![0]).toMatchObject({
			name: "target",
			type: ApplicationCommandOptionType.Channel,
			description: "Target channel",
			channelTypes: [0, 2]
		});
	});
});
