/**
 * clsx utility — lightweight className combiner
 * (avoids adding the full clsx package as a dependency when it may not be installed)
 */
export function clsx(...args) {
  return args
    .flat()
    .filter((x) => typeof x === 'string' && x)
    .join(' ')
}
