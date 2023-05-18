module.exports = {
  transform: {
    '^.+\\.(t|j)s$': [
      '@swc/jest',
      {
        sourceMaps: true,
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
}
