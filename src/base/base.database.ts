import Singleton, { type ISingletonConstructor } from "base/singleton";

abstract class Database extends Singleton {
	constructor() {
		super();
	}

	public abstract connect(): Promise<void>;
	public abstract disconnect(): Promise<void>;

	protected connected: boolean = false;
	protected processing: boolean = false;

	public static async Connection<T extends Database>(this: ISingletonConstructor<T>): Promise<T> {
		try {
			const instance = this.GetInstance(); //
			if (!instance.connected && !instance.processing) await instance.connect();
			return instance;
		} catch (e) {
			console.error(e);
			throw e;
		}
	}
}

export default Database;
