export interface ISingletonConstructor<T> {
	new (): T;
	GetInstance<U extends Singleton>(this: new () => U): U;
}

class Singleton {
	private static instances: Map<Function, Singleton> = new Map();

	protected constructor() {}

	public static GetInstance<T extends Singleton>(this: new () => T): T;
	public static GetInstance<T extends Singleton, U>(this: new (arg: U) => T, arg: U): T;
	public static GetInstance<T extends Singleton, U>(this: new (arg?: U) => T, arg?: U): T {
		const classReference = this;
		if (!Singleton.instances.has(classReference)) {
			Singleton.instances.set(classReference, new this(arg));
		}
		return Singleton.instances.get(classReference) as T;
	}
}

export default Singleton;
