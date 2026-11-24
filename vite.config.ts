import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// base './' makes every asset path relative, so the same build works on localhost
// and under https://<user>.github.io/<repo>/ (the book uses #hash URLs, so no server routing is needed).
export default defineConfig({ base: './', plugins: [react()] });
