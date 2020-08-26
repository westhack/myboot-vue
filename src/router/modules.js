const files = require.context('@/modules', true, /router\.js$/)
const modules = {}

files.keys().forEach(key => {
  Object.assign(modules, files(key).default)
})

export default modules
