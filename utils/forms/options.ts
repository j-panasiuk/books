import { T } from 'utils/translate'

export enum OPTION {
  NONE = '-',
  SOME = '*',
}

export function getOptionLabel(option?: string): string {
  switch (option) {
    case undefined:
      return T('')
    case OPTION.NONE:
      return T('- (none)')
    case OPTION.SOME:
      return T('* (some)')
    default:
      return option
  }
}
