module.exports = {
    transform: {
        '\\.ts$': 'esbuild-jest',
    },
    coveragePathIgnorePatterns: ['/node_modules/', '/fixtures/'],
    rootDir: __dirname,
    testMatch: [
        '<rootDir>/tests/*.test.[jt]s?(x)',
    ],
}