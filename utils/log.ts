import c from 'chalk'

export const log = {
  info: (name, ...rest) => console.info(c.gray('› ' + name), ...rest),
  warn: (name, ...rest) => console.warn(c.yellowBright('! ' + name), ...rest),
  error: (name, ...rest) => console.error(c.redBright('✗ ' + name), ...rest),
  success: (name, ...rest) => console.log(c.greenBright('✓ ' + name), ...rest),
} satisfies Record<string, (name: string, ...rest: any[]) => void>
