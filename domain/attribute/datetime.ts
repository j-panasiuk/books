import * as s from 'superstruct'

export const datetimeStruct = s.pattern(s.string(), /^\d{4}-\d{2}-\d{2}T/)
