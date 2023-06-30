export type Hook<F> = F extends (...args: any[]) => infer R ? R extends void ? F : never : never
export type Hooks<H extends Record<string, Function>> = {
  [K in keyof H]: H[K] extends Hook<H[K]> ? H[K] : never
}
export type Meta = Record<string, unknown>

export type HookResult<H extends Hooks<H>, M extends Meta> = {
  hooks: Partial<H>,
  meta: Partial<M>,
}

type Frame<H extends Hooks<H>, M extends Meta> = {
  hooks: { [K in keyof H]?: H[K] | H[K][] }
  meta: Partial<M>
}


function prepareFrame<H extends Hooks<H>, M extends Meta>(frame: Frame<H, M>): HookResult<H, M> {
  const result: any = { meta: frame.meta, hooks: {} }
  for (const key in frame.hooks) {
    const value = frame.hooks[key]
    if (value) {
      if (Array.isArray(value)) {
        result.hooks[key] = ((...args: any[]) => {
          for (const fn of value) {
            fn(...args)
          }
        }) as any
      } else {
        result.hooks[key] = value
      }
    }
  }

  return result
}


export function buildHooksContext<H extends Hooks<H>, M extends Meta = {}>() {
  const stack: Frame<H, M>[] = []

  return {
    acceptHooks<T>(fn: () => T, meta?: Partial<M>): [T, HookResult<H, M>] {
      const frame: Frame<H, M> = {
        hooks: {},
        meta: meta || {},
      }
      stack.push(frame)
      const result = fn()
      stack.pop()

      return [result, prepareFrame(frame)]
    },

    hook<
      K extends keyof H,
      F extends Hook<H[K]>,
    >(key: K) {
      return (hook: F) => {
        const frame = stack[stack.length - 1]
        if (frame) {
          const currentHook = frame.hooks[key]
          if (currentHook) {
            if (Array.isArray(currentHook)) {
              (currentHook as any).push(hook)
            } else {
              frame.hooks[key] = [currentHook, hook as any]
            }
          } else {
            frame.hooks[key] = hook
          }
        }
      }
    },

    hooksMeta(): Partial<M> {
      return stack[stack.length - 1]?.meta || {}
    }
  }
}
