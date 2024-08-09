// Type utility to check if a type is optional
type IsOptional<T> = undefined extends T ? true : false;

// Utility to check if a type is a function
export type Func = (...args: any[]) => any;
type IsFunction<T> = T extends Func ? true : false;

// Utility to check if a type is a primitive or a simple value type
type IsValueType<T> = T extends string | number | boolean | null | undefined | Date | Set<any> | Map<any, any> | Array<any> ? true : false;

// Type transformations for specific value types
type ReplaceDate<T> = T extends Date ? string : T;
type ReplaceSet<T> = T extends Set<infer X> ? X[] : T;
type ReplaceMap<T> = T extends Map<infer K, infer I> ? Record<K extends string | number | symbol ? K : string, Dto<I>> : T;
type ReplaceArray<T> = T extends Array<infer X> ? Dto<X>[] : T;

// Utility type to exclude function properties from an object type
type ExcludeFuncsFromObj<T> = {
	[K in keyof T]: IsFunction<T[K]> extends true ? never : K;
}[keyof T];

// Main transformation logic to convert a type to its DTO representation
type Dtoified<T> = IsValueType<T> extends true
	? ReplaceDate<ReplaceMap<ReplaceSet<ReplaceArray<T>>>>
	: { [K in keyof Pick<T, ExcludeFuncsFromObj<T>>]: Dto<T[K]> };

// Final DTO type definition
export type Dto<T> = IsFunction<T> extends true ? never : IsOptional<T> extends true ? Dtoified<Exclude<T, undefined>> | null : Dtoified<T>;

// Serializable interface
export type Serializable<T> = T & { serialize(): Dto<T> };
