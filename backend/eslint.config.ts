import tseslint from 'typescript-eslint';

export default [
    {
        files: ['**/*.ts'],
        languageOptions: {
            ecmaVersion: 'latest',
            sourceType: 'module',
            // Needed to parse TypeScript syntax + decorators used by NestJS
            parser: tseslint.parser,
        },
        plugins: {
            '@typescript-eslint': tseslint.plugin,
        },
        rules: {
            'no-unused-vars': 'off',
            '@typescript-eslint/no-unused-vars': [
                'error',
                {
                    argsIgnorePattern: '^_',
                    varsIgnorePattern: '^_',
                    caughtErrorsIgnorePattern: '^_',
                },
            ],
            'object-shorthand': ['error', 'always'],
            curly: ['error', 'all'],
            'no-redeclare': 'error',
            quotes: ['error', 'single'],
            'keyword-spacing': 'error',
            eqeqeq: ['error', 'always'],
            'no-unreachable': 'error',
        },
    },
];

