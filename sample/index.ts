import { buildHooksContext } from '../src'


const { acceptHooks, hook } = buildHooksContext<{
  onA: () => void,
  onB: (name: string) => void,
}, { x: number }>()

const onA = hook('onA')
const onB = hook('onB')

const fn = () => {
  onA(() => { console.log('A') })
  onB((name) => { console.log('B:' + name) })

  return 42
}


const [res, { hooks }] = acceptHooks(fn)

console.log(res)
hooks.onB && hooks.onB('foo')
hooks.onA && hooks.onA()
