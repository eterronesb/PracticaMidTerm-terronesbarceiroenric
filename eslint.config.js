export default [
    {
        files: ['src/**/*.js'],
        languageOptions: {
            ecmaVersion: 'latest',
            sourceType: 'module',
            globals: {
                document: 'readonly',
                window: 'readonly',
                console: 'readonly',
                sessionStorage: 'readonly',
                localStorage: 'readonly',
                fetch: 'readonly',
                setTimeout: 'readonly',
                clearTimeout: 'readonly',
                setInterval: 'readonly',
                clearInterval: 'readonly',
            },
        },
        rules: {
            'no-unused-vars': 'error',
            'no-undef': 'error',
            'no-console': 'warn',
        },
    },
];