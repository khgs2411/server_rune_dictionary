import type { ProcessArgs } from "common/types";
import UsersRepository from "repositories/users.repo";
import BaseService from "./service.base";
import { Actions } from "common/enums";
import type { UserModel } from "models/users.model";

export default class AuthService extends BaseService {
	private static session: Map<string, UserModel> = new Map();
	constructor() {
		super();
		this.run = {
			[Actions.AUTH_LOGIN]: this.login,
		};
	}
	public static async Call(args: ProcessArgs) {
		const action = args.strategy.action;
		const self = new AuthService();
		const run = self.run[action];
		if (!run) throw "runes.call - Invalid action provided!";
		return await run(args.strategy.data, args);
	}

	public static async Authenticate(username: string, api_key: string): Promise<UserModel>;
	public static async Authenticate(api_key: string): Promise<UserModel>;
	public static async Authenticate(username_or_api_key: string, api_key?: string): Promise<UserModel> {
		if (!this.session.has(username_or_api_key)) {
			const data = UsersRepository.GetValidationData(username_or_api_key, api_key);
			const user = await UsersRepository.Validate(data.api_key, data.username);
			this.session.set(username_or_api_key, user);
			return user;
		}
		return this.session.get(username_or_api_key) as UserModel;
	}

	//TODO: implement an actual login method with a user session
	private async login(data: any, args: ProcessArgs) {
		if (!data) throw "Something went wrong. Please try again later!";
		const { username, api_key } = data;
		if (!username || !api_key) throw "Something went wrong. Please try again later";
		const user = await UsersRepository.Validate(username, api_key);
		return {
			msg: "Success!",
			authorized: !!user,
		};
	}
}
