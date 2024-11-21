import { E_IS } from "common/enums";
import fs from "fs";
import path from "path";

class Lib {
	public static Log(...args: any) {
		const timestamp = new Date().toLocaleTimeString();
		console.log(`[${timestamp}]`, ...args);
	}

	public static Warn(...args: any) {
		const timestamp = new Date().toLocaleTimeString();
		console.error(`[${timestamp}] Handled Error: `, ...args);
	}

	public static $Log(...args: any) {
		const timestamp = new Date().toLocaleTimeString();
		console.error(`[${timestamp}]`, ...args);
	}

	public static LogObject(obj: any) {
		console.log(JSON.stringify(obj, null, 2));
	}

	public static GetDateTimestamp(date: string | Date, format: string = "DD/MM/YYYY HH:mm", isUTC: boolean = false): number {
		if (typeof date === "string") {
			const formatParts = format.split(/[-\/. :]/);
			const dateParts = date.split(/[-\/. :]/);

			let day: number | undefined;
			let month: number | undefined;
			let year: number | undefined;
			let hours: number = 0;
			let minutes: number = 0;

			formatParts.forEach((part, index) => {
				switch (part) {
					case "DD":
					case "dd":
						day = parseInt(dateParts[index], 10);
						break;
					case "MM":
						month = parseInt(dateParts[index], 10) - 1; // Months are 0-based in JavaScript Date
						break;
					case "YYYY":
					case "yyyy":
						year = parseInt(dateParts[index], 10);
						break;
					case "HH":
					case "hh":
						hours = parseInt(dateParts[index], 10);
						break;
					case "mm":
						minutes = parseInt(dateParts[index], 10);
						break;
				}
			});

			if (day === undefined || month === undefined || year === undefined) {
				throw new Error("Invalid date format or date string");
			}

			let dateObj;
			if (isUTC) {
				dateObj = new Date(Date.UTC(year, month, day, hours, minutes));
			} else {
				dateObj = new Date(year, month, day, hours, minutes);
			}
			return dateObj.getTime();
		} else {
			return date.getTime();
		}
	}

	public static FormatUnixToDate(unix_time_stamp: number, in_milliseconds: boolean = false): Date {
		return new Date(unix_time_stamp * (in_milliseconds ? 1 : 1000));
	}

	public static FormatDate(date: Date | string, format = "MM/dd/yyyy"): string {
		const leadingZero = (value: string) => (value.length < 2 ? `0${value}` : value);
		if (!date) throw new Error("Lib.FormatDate() Exception: Date is required");

		if (typeof date === "string") {
			date = new Date(date);
		}

		const day = format.includes("dd") ? String(date.getDate()).padStart(2, "0") : String(date.getDate());
		const month = format.includes("MM") ? String(date.getMonth() + 1).padStart(2, "0") : String(date.getMonth() + 1);
		const year = date.getFullYear();
		const hours = format.includes("HH") ? String(date.getHours()).padStart(2, "0") : String(date.getHours());
		const minutes = format.includes("mm") ? String(date.getMinutes()).padStart(2, "0") : String(date.getMinutes());
		const seconds = format.includes("ss") ? String(date.getSeconds()).padStart(2, "0") : String(date.getSeconds());

		const split = format.split(/[^a-zA-Z]/);
		let separator = format.match(/[^a-zA-Z]/) ?? ["/"];

		if (split.length < 3) throw new Error("Invalid format");

		const sign = separator[0];
		let output = `${split[0]}${sign}${split[1]}${sign}${split[2]}`;
		if (hours) output += ` ${leadingZero(hours)}`;
		if (minutes) output += `:${leadingZero(minutes)}`;
		if (seconds) output += `:${leadingZero(seconds)}`;

		return output
			.replace("MM", month)
			.replace("mm", month)
			.replace("dd", day)
			.replace("DD", day)
			.replace("yyyy", year.toString())
			.replace("YYYY", year.toString());
	}

	public static DaysBetweenDates(startDate: Date | string | undefined, endDate: Date | string | undefined): number {
		if (this.IsNil(startDate) || this.IsNil(endDate)) throw new Error("Lib.DaysBetweenDates() Exception: Dates are required");
		const start = new Date(this.FormatDate(startDate as string | Date, "MM/dd/yyyy")).getTime();
		const end = new Date(this.FormatDate(endDate as string | Date, "MM/dd/yyyy")).getTime();
		const difference = end - start;
		const daysPassed = difference / (1000 * 3600 * 24);
		return Math.floor(daysPassed);
	}

	public static IsDateInPast(date: Date | string): boolean {
		const now = this.FormatDate(new Date(), "MM/dd/yyyy");
		const check = this.FormatDate(date, "MM/dd/yyyy");
		return new Date(now).getTime() > new Date(check).getTime();
	}

	public static IsDateInPastFrom(date: Date | string, from: Date | string): boolean {
		const now = this.FormatDate(from, "MM/dd/yyyy");
		const check = this.FormatDate(date, "MM/dd/yyyy");
		console.log("from", check, "to", now);
		return new Date(now).getTime() > new Date(check).getTime();
	}

	public static UUID() {
		return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
			let r = (Math.random() * 16) | 0,
				v = c === "x" ? r : (r & 0x3) | 0x8;
			return v.toString(16);
		});
	}

	public static Debounce(callback: (...args: any[]) => void, delay = 500): (...args: any[]) => any {
		let timeout: Timer;
		return (...args: any[]) => {
			clearTimeout(timeout);
			timeout = setTimeout(() => {
				return callback(...args);
			}, delay);
		};
	}

	public static IsNil(value: any): boolean {
		return value === null || value === undefined;
	}

	public static IsPrimitive(value: any): boolean {
		return this.IsNumber(value) || this.IsString(value) || this.IsBoolean(value);
	}

	public static EmptyObject(value: any): boolean {
		let empty_object = true;
		if (this.GetType(value) !== "object") {
			empty_object = false;
			return empty_object;
		}
		if (Object.keys(value).length === 0) {
			empty_object = true;
			return empty_object;
		}
		for (let k in value) {
			if (!this.IsNil(value[k]) && value[k] !== "") {
				empty_object = false;
			}
		}
		return empty_object;
	}

	public static IsNumpty(value: any, _objectsOnly: boolean = false): boolean {
		return typeof value === "number" ? false : this.IsNil(value) || this.IsEmpty(value, _objectsOnly);
	}

	public static IsEmpty(value: any, _objectsOnly: boolean = false): boolean {
		return (
			(this.GetType(value) === "array" && value.length === 0 && !_objectsOnly) ||
			(this.GetType(value) === "object" && this.EmptyObject(value)) ||
			(typeof value === "string" && value.trim().length === 0)
		);
	}

	public static IsArray(variable: any): boolean {
		return this.GetType(variable) === E_IS.ARRAY;
	}

	public static IsString(variable: any): boolean {
		return this.GetType(variable) === E_IS.STRING;
	}

	public static IsNumber(variable: any): boolean {
		return this.GetType(variable) === E_IS.NUMBER;
	}

	public static IsObject(variable: any): boolean {
		return this.GetType(variable) === E_IS.OBJECT;
	}

	public static IsFunction(variable: any): boolean {
		return this.GetType(variable) === E_IS.FUNCTION;
	}

	public static IsRegex(variable: any): boolean {
		return this.GetType(variable) === E_IS.REGEX;
	}

	public static IsBoolean(variable: any): boolean {
		return this.GetType(variable, true) === E_IS.BOOLEAN;
	}

	public static GetType(value: any, asTypeOf = false): null | string | boolean {
		if (asTypeOf) {
			return typeof value;
		}
		if (value === "0" || value === "1") {
			return "number";
		}
		if (value === true) {
			return true;
		} else if (value === false) {
			return false;
		} else if (value === null || value === undefined) {
			return null;
		} else if (Array.isArray(value)) {
			return "array";
		} else if (value instanceof RegExp) {
			return "regex";
		} else if (!isNaN(Number(value))) {
			return "number";
		} else if (typeof value === "string") {
			return "string";
		} else if ({}.toString.call(value) === "[object Function]" || typeof value === "function") {
			return "function";
		} else {
			return "object";
		}
	}

	public static GetProjectRoot(startDir: string = __dirname, rootReference: string = "package.json"): string {
		let currentDir = startDir;

		while (!fs.existsSync(path.join(currentDir, rootReference))) {
			const parentDir = path.resolve(currentDir, "..");
			if (parentDir === currentDir) {
				throw new Error("Unable to find project root");
			}
			currentDir = parentDir;
		}

		return currentDir;
	}

	public static async RunTaskWithTimeout(task: () => Promise<void>, timeout: number) {
		return Promise.race([task(), new Promise((_, reject) => setTimeout(() => reject(new Error("Task timed out")), timeout))]);
	}

	public static GetFolderPath(folder: string): string {
		return path.join(this.GetProjectRoot(), folder);
	}

	public static GetFilePath(folder: string, file: string): string {
		return path.join(this.GetFolderPath(folder), file);
	}

	public static async CreateDirectory(folderToCreate: string) {
		const directoryPath = Lib.GetFolderPath(folderToCreate);
		await fs.promises.access(directoryPath, fs.constants.F_OK).catch(async () => {
			await fs.promises.mkdir(directoryPath, { recursive: true });
		});
		return directoryPath;
	}

	public static async DeleteDirectory(folderToDelete: string) {
		const directoryPath = path.join(this.GetProjectRoot(), folderToDelete);
		await fs.promises.rm(directoryPath, { recursive: true, force: true });
	}

	public static async CreateFile(folderPath: string, filePath: string, content: string) {
		await Lib.CreateDirectory(folderPath);
		const file = Lib.GetFilePath(folderPath, filePath);
		await fs.promises.writeFile(file, content, "utf8");
	}

	public static GetFile(filePathFromRoot: string) {
		return fs.createReadStream(filePathFromRoot);
	}

	public static GetFilesInDirectory(directoryPath: string): string[] {
		return fs.readdirSync(directoryPath);
	}

	public static async DeleteFile(filePathFromRoot: string) {
		await fs.promises.unlink(filePathFromRoot);
	}

	public static Timestamp(log: boolean = false) {
		const currentTime = new Date().toLocaleTimeString();
		if (log) console.log(`[${currentTime}]`);
		return currentTime;
	}

	public static RemoveWhitespace(value: string): string {
		return value.replace(/\s/g, "");
	}

	public static msToString(ms: number): string {
		if (ms < 1000) {
			return `${ms.toFixed(2)}ms`;
		}
		const seconds = Math.floor(ms / 1000);
		const minutes = Math.floor(seconds / 60);
		const hours = Math.floor(minutes / 60);
		let output = hours > 0 ? `${hours}h ` : "";
		output += minutes > 0 ? `${minutes % 60}m ` : "";
		output += seconds % 60 > 0 ? `${seconds % 60}s` : "";
		return output.trim();
	}

	public static async RetryHandler<T extends (...args: any[]) => any>(
		func: T,
		retries: number = 3,
		...args: Parameters<T>
	): Promise<ReturnType<T>> {
		let attempts = 0;
		let error;

		while (attempts < retries) {
			try {
				return await func(...args);
			} catch (e) {
				attempts++;
				error = e;
				if (attempts < retries) {
					Lib.Warn(`Attempt ${attempts} failed. Retrying...(${func.name})`);
					if (attempts == 1) Lib.Warn(error);
					//? Wait for 1 second before retrying
					await new Promise((resolve) => setTimeout(resolve, 1000));
				}
			}
		}

		throw error;
	}

	public static async ReadFileContent(filePath: string): Promise<string> {
		return fs.promises.readFile(filePath, "utf8");
	}
}

export default Lib;
