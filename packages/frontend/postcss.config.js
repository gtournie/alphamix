import autoprefixer from 'autoprefixer';
import postcssPxToEm from 'postcss-px-to-em'

/** @type {import('postcss-load-config').Config} */
const config = {
    plugins: [autoprefixer(), postcssPxToEm()]
};

export default config;