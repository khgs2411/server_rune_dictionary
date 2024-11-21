import { describe, expect, test, beforeAll } from "bun:test";
import type { AspectCreationData } from "core/aspect/aspect.types";
import type { ProcessArgs, Request } from "common/types";
import { Actions } from "common/enums";
import { main } from "main/index";
import AspectService from "services/aspects.service";
import { beforeEach } from "node:test";
import UsersRepository from "repositories/users.repo";
import { UserModel } from "models/users.model";
const api_key = "r_d_25c9dd62-ba12-44de-b303-67ef659ba7bd";
const service = new AspectService();
let user: UserModel;
describe("Aspect Tests", () => {
	beforeAll(async () => {
		const _user = await UsersRepository.Validate(api_key);
		if (!_user) throw "User not found!";
		user = _user;
	});
	test("Inserting an aspect that already exists should fail", async () => {
		const insert_one_data: AspectCreationData = {
			tier: 1,
			weight: 0.3,
			potency: 0,
			rune_ids: [],
			required_rune_ids: [],
			blocked_aspect_ids: [],
		};

		const args: ProcessArgs = {
			user,
			strategy: {
				action: Actions.ASPECT_INSERT_ASPECT,
				data: <AspectCreationData>insert_one_data,
				type: "aspect",
			},
		};
		expect(service.Call(args)).rejects.toThrow();
	});
});
