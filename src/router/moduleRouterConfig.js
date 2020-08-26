const files = require.context('@/modules', true, /router\.config\.js$/)
const moduleConfig = []

files.keys().forEach(key => {
  moduleConfig.push(files(key).default)
})

export default moduleConfig
