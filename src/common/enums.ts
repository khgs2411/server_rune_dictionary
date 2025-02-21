export enum BOOLEANISH {
	FALSE,
	TRUE,
}

export enum E_IS {
	ARRAY = "array",
	OBJECT = "object",
	FUNCTION = "function",
	STRING = "string",
	NUMBER = "number",
	BOOLEAN = "boolean",
	REGEX = "regex",
}

export enum StrategyType {
	Rune = "rune",
	Aspect = "aspect",
	Auth = "auth",
}
export enum Actions {
	RUNE_GET_RUNE = "rune_get_rune",
	RUNE_GET_RUNES = "rune_get_runes",
	RUNE_INSERT_RUNE = "rune_insert_rune",
	RUNE_INSERT_RUNES = "rune_insert_runes",
	RUNE_UPDATE_RUNE = "rune_update_rune",
	RUNE_UPDATE_RUNES = "rune_update_runes",
	RUNE_DELETE_RUNE = "rune_delete_rune",
	RUNE_DELETE_RUNES = "rune_delete_runes",

	ASPECT_GET_ASPECT = "aspect_get_aspect",
	ASPECT_GET_ASPECTS = "aspect_get_aspects",
	ASPECT_INSERT_ASPECT = "aspect_insert_aspect",
	ASPECT_INSERT_ASPECTS = "aspect_insert_aspects",
	ASPECT_UPDATE_ASPECT = "aspect_update_aspect",
	ASPECT_UPDATE_ASPECTS = "aspect_update_aspects",
	ASPECT_DELETE_ASPECT = "aspect_delete_aspect",
	ASPECT_DELETE_ASPECTS = "aspect_delete_aspects",

	AUTH_LOGIN = "auth_login",
}
