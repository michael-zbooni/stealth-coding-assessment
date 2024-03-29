module.exports = {
  transform: {
    '^.+\\.(t|j)s$': [
      '@swc/jest',
      {
        sourceMaps: 'inline',
        jsc: {
          transform: {
            legacyDecorator: true,
            decoratorMetadata: true,
          },
          parser: {
            syntax: 'typescript',
            decorators: true,
          },
          baseUrl: __dirname,
          paths: {
            'src/*': ['src/*'],
          },
        },
      },
    ],
  },
  setupFilesAfterEnv: ['jest-extended/all'],
}
