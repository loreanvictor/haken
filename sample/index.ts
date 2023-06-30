import { buildHooksContext } from '../src'


const { acceptHooks, hook, hooksMeta } = buildHooksContext<{
  onA: () => void,
  onB: (name: string) => void,
}, { x: number }>()

const onA = hook('onA')
const onB = hook('onB')

const fn = () => {
  onA(() => { return 42 })
  onB((name) => { console.log('B:' + name) })
  hooksMeta().x = 42

  return 42
}


const [res, { hooks }] = acceptHooks(fn)

console.log(res)
hooks.onB && hooks.onB('foo')
hooks.onA && hooks.onA()
