export enum OPTION {
  NONE = '-',
  SOME = '*',
}

export function getOptionLabel(option?: string): string {
  switch (option) {
    case undefined:
      return ''
    case OPTION.NONE:
      return '- (none)'
    case OPTION.SOME:
      return '* (some)'
    default:
      return option
  }
}
