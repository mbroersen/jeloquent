module.exports = {
    "env": {
        "browser": true,
        "es2021": true
    },
    root: true,
    parser: '@typescript-eslint/parser',
    plugins: [
        '@typescript-eslint',
    ],
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
    ],
    "rules": {
        "curly": ["error", "all"],
        "@typescript-eslint/no-namespace": "off",
        "lines-between-class-members": ["error", "always"],
        "indent": ["error", 4],
    }
};
