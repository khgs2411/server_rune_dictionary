import Database from "base/base.database";
import Lib from "common/lib";
import * as mongoose from "mongoose";

class Mongo extends Database {
	private readonly username: string;
	private readonly password: string;
	private readonly host: string;
	private readonly uri: string;

	public client: mongoose.Mongoose | undefined;

	constructor() {
		super();
		this.username = process.env.MONGO_USERNAME || "";
		this.password = process.env.MONGO_PASSWORD || "";
		this.host = process.env.MONGO_HOST || "";
		this.uri = `mongodb+srv://${this.username}:${this.password}@${this.host}`;
	}

	public async connect(dbName: string = process.env.MONGO_DATABASE || "default"): Promise<void> {
		if(!this.validateConnectionString()) throw new Error("Invalid connection string");
		this.connected = false;
		this.client = await mongoose.connect(this.uri, { dbName: dbName });
		this.connected = true;

		Lib.Log(`MongoDB connected`);
	}

	public async disconnect(): Promise<void> {
		await this.client?.connection.close();
		this.connected = false;
		Lib.Log("MongoDB disconnected");
	}

	public getMongoClient(): mongoose.mongo.MongoClient | undefined {
		if (this.client) return this.client.connection.getClient();
		return undefined;
	}

	public async setDatabase(dbName: string) {
		await this.disconnect();
		await this.connect(dbName);
	}

	private validateConnectionString(): boolean {
		return !Lib.IsNumpty(this.username) || !Lib.IsNumpty(this.password) || !Lib.IsNumpty(this.host);
	}

	public static GetConnectionString(): string {
		const username = process.env.MONGO_USERNAME || "";
		const password = process.env.MONGO_PASSWORD || "";
		const host = (process.env.NODE_ENV == "production" ? process.env.MONGO_PRODUCTION_HOST : process.env.MONGO_HOST) || "";
		console.log("GetConnectionString", `mongodb+srv://${username}:${password}@${host}`);
		return `mongodb+srv://${username}:${password}@${host}`;
	}
}
export default Mongo;
