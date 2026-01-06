/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    tailwindcss: {}, // No '@tailwindcss/postcss' here!
    autoprefixer: {},
  },
};

export default config;