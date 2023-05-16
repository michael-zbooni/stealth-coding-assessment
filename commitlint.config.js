const { TYPE_NAMES: types } = require('commitizen-emoji/dist/constants/types')

const typeEnum = types.map(([code, text]) => `${code} ${text}`)

// prettier-ignore
const defaultHeaderPatternWithEmoji =
  `^(${typeEnum.join('|')})(?:\\((.*)\\))?!?: (.*)$`

module.exports = {
  extends: ['@commitlint/config-conventional'],
  parserPreset: {
    parserOpts: {
      headerPattern: new RegExp(defaultHeaderPatternWithEmoji),
    },
  },
  rules: {
    'type-enum': [2, 'always', typeEnum],
  },
}
