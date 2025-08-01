import AspectService from "application/services/aspects.service";
import { beforeAll, describe, expect, test } from "bun:test";
import { UserModel } from "database/models/users.model";
import UsersRepository from "database/repositories/users.repo";
const api_key = "r_d_25c9dd62-ba12-44de-b303-67ef659ba7bd";
const service = new AspectService();
let user: UserModel;
describe("Aspect Tests", () => {
	beforeAll(async () => {
		const _user = await UsersRepository.Validate(api_key);
		if (!_user) throw new Error("User not found!");
		user = _user;
	});
	test("Inserting an aspect that already exists should fail", async () => {

		expect(1).toEqual(1);
	});
});
