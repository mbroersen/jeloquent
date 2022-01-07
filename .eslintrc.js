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
        "@typescript-eslint/member-ordering": [
            2,
            {
                "default": {
                    "memberTypes": [
                        // Index signature
                        "signature",

                        // Fields
                        "public-static-field",
                        "protected-static-field",
                        "private-static-field",
                        "public-decorated-field",
                        "protected-decorated-field",
                        "private-decorated-field",
                        "public-instance-field",
                        "protected-instance-field",
                        "private-instance-field",
                        "public-abstract-field",
                        "protected-abstract-field",
                        "private-abstract-field",

                        // Constructors
                        "public-constructor",
                        "protected-constructor",
                        "private-constructor",

                        // Getters
                        "public-static-get",
                        "protected-static-get",
                        "private-static-get",

                        "public-decorated-get",
                        "protected-decorated-get",
                        "private-decorated-get",

                        "public-instance-get",
                        "protected-instance-get",
                        "private-instance-get",

                        "public-abstract-get",
                        "protected-abstract-get",
                        "private-abstract-get",

                        "public-get",
                        "protected-get",
                        "private-get",

                        "static-get",
                        "instance-get",
                        "abstract-get",

                        "decorated-get",

                        "get",

                        // Setters
                        "public-static-set",
                        "protected-static-set",
                        "private-static-set",

                        "public-decorated-set",
                        "protected-decorated-set",
                        "private-decorated-set",

                        "public-instance-set",
                        "protected-instance-set",
                        "private-instance-set",

                        "public-abstract-set",
                        "protected-abstract-set",
                        "private-abstract-set",

                        "public-set",
                        "protected-set",
                        "private-set",

                        "static-set",
                        "instance-set",
                        "abstract-set",

                        "decorated-set",

                        "set",

                        // Methods
                        "public-static-method",
                        "protected-static-method",
                        "private-static-method",
                        "public-decorated-method",
                        "protected-decorated-method",
                        "private-decorated-method",
                        "public-instance-method",
                        "protected-instance-method",
                        "private-instance-method",
                        "public-abstract-method",
                        "protected-abstract-method",
                        "private-abstract-method"
                    ],
                    "order": "alphabetically",
                }
            }
        ],
        "lines-between-class-members": ["error", "always"],
        "indent": ["error", 4],
    },
};
