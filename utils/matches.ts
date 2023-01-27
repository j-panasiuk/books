export type Matches<F, T> = (
  value: Exclude<F, undefined>
) => (value: T) => boolean
