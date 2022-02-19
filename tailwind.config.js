const plugin = require('tailwindcss/plugin')
const { configureColors } = require('tailwindcss-color-suite')

module.exports = {
    content: [
        './index.html',
        './src/**/*.{js,ts,vue}',
    ],
    safelist: [],
    theme: {
        base: {
            default: '20px',
            xs: '22px',
            lg: '24px'
        },
        colors: configureColors(),
        extend: {
            screens: {
                xs: '360px'
            },
            strokeWidth: (theme) => ({
                DEFAULT: '1px',
                '0': '0',
                ...theme('spacing')
            }),
            stroke: (theme) => ({
                ...theme('colors')
            }),
            fill: (theme) => ({
                ...theme('colors')
            }),
            lineHeight: (theme) => ({
                ...theme('spacing')
            }),
        }
    },
    plugins: [
        require('tailwindcss-interaction-media'),
        require('tailwindcss-gridlines')
    ],
}
