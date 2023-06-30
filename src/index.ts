export type Hooks = Record<string, Function>
export type Meta = Record<string, unknown>

export type HookResult<H extends Hooks, M extends Meta> = {
  hooks: Partial<H>,
  meta: Partial<M>,
}

type Frame<H extends Hooks, M extends Meta> = {
  hooks: { [K in keyof H]?: H[K] | H[K][] }
  meta: Partial<M>
}


function prepareFrame<H extends Hooks, M extends Meta>(frame: Frame<H, M>): HookResult<H, M> {
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


export function buildHooksContext<H extends Hooks, M extends Meta = {}>() {
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
      F extends NonNullable<H[K]>,
    >(key: K) {
      return (hook: F) => {
        const frame = stack[stack.length - 1]
        if (frame) {
          const currentHook = frame.hooks[key]
          if (currentHook) {
            if (Array.isArray(currentHook)) {
              currentHook.push(hook as any)
            } else {
              frame.hooks[key] = [currentHook, hook as any]
            }
          } else {
            frame.hooks[key] = hook
          }
        }
      }
    },

    currentMeta(): Partial<M> {
      return stack[stack.length - 1]?.meta || {}
    }
  }
}
