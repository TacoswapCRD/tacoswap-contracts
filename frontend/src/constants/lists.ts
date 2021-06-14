// used to mark unsupported tokens, these are hosted lists of unsupported tokens
/**
 * @TODO add list from blockchain association
 */
export const UNSUPPORTED_LIST_URLS: string[] = []

const COMBINE_FINANCE_LIST = 'https://combine.exchange/tokens.json'

// lower index == higher priority for token import
export const DEFAULT_LIST_OF_LISTS: string[] = [COMBINE_FINANCE_LIST]

// default lists to be 'active' aka searched across
export const DEFAULT_ACTIVE_LIST_URLS: string[] = [COMBINE_FINANCE_LIST]
