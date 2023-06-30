import { buildHooksContext } from '../index'


describe(buildHooksContext, () => {
  test('provides a context for working with hooks.', () => {
    const { acceptHooks, hook, hooksMeta } = buildHooksContext<{
      onA: () => void,
      onB: (name: string) => void,
    }, { x: number }>()

    const cb1 = jest.fn()
    const cb2 = jest.fn()
    const cb3 = jest.fn()
    const cb4 = jest.fn()

    const onA = hook('onA')
    const onB = hook('onB')

    const fn = () => {
      onA(() => cb1())
      onB((name) => cb2(name))
      onB((name) => cb3('X' + name))
      onB(() => cb4())
      hooksMeta().x = hooksMeta().x! + 1

      return 42
    }

    const [res, { hooks, meta }] = acceptHooks(fn, { x: 42 })

    expect(res).toBe(42)
    expect(meta.x).toBe(43)

    hooks.onB && hooks.onB('foo')
    hooks.onA && hooks.onA()

    expect(cb1).toBeCalledTimes(1)
    expect(cb2).toBeCalledTimes(1)
    expect(cb2).toBeCalledWith('foo')
    expect(cb3).toBeCalledTimes(1)
    expect(cb3).toBeCalledWith('Xfoo')
    expect(cb4).toBeCalledTimes(1)
  })

  test('can also be called without an initial context.', () => {
    const { acceptHooks, hook, hooksMeta } = buildHooksContext<{
      onA: () => void,
      onB: (name: string) => void,
    }, { x: number }>()

    const cb1 = jest.fn()
    const cb2 = jest.fn()
    const cb3 = jest.fn()
    const cb4 = jest.fn()

    const onA = hook('onA')
    const onB = hook('onB')

    const fn = () => {
      onA(() => cb1())
      onB((name) => cb2(name))
      onB((name) => cb3('X' + name))
      onB(() => cb4())
      hooksMeta().x = (hooksMeta().x || 0) + 1

      return 42
    }

    const [res, { hooks, meta }] = acceptHooks(fn)

    expect(res).toBe(42)
    expect(meta.x).toBe(1)

    hooks.onB && hooks.onB('foo')
    hooks.onA && hooks.onA()

    expect(cb1).toBeCalledTimes(1)
    expect(cb2).toBeCalledTimes(1)
    expect(cb2).toBeCalledWith('foo')
    expect(cb3).toBeCalledTimes(1)
    expect(cb3).toBeCalledWith('Xfoo')
    expect(cb4).toBeCalledTimes(1)
  })

  test('provides functions that can be called outside of a hooks context safely.', () => {
    const { hook, hooksMeta } = buildHooksContext<{
      onA: () => void,
      onB: (name: string) => void,
    }, { x: number }>()

    const onA = hook('onA')
    const onB = hook('onB')

    expect(() => onA(() => {})).not.toThrow()
    expect(() => onB(() => {})).not.toThrow()
    expect(() => hooksMeta()).not.toThrow()
  })
})
