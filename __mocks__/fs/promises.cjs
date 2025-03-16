// To automatically redirect every fs call to memfs
// @see https://vitest.dev/guide/mocking#file-system

const { fs } = require('memfs')
module.exports = fs.promises