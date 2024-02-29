import { defineConfig } from 'vite';
import preact from '@preact/preset-vite';
import { readFileSync } from 'fs';

export default defineConfig({
    plugins: [preact()],
    build: {
        rollupOptions: {
            // 수정된 rollup 옵션을 여기에 추가합니다.
            output: {
                manualChunks: () => 'everything.js', // JavaScript 파일을 하나의 청크로 만듭니다.
            },
            // CSS 파일을 인라인으로 변환합니다.
            plugins: [
                {
                    name: 'inline-css',
                    async generateBundle(_, bundle) {
                        for (const fileName in bundle) {
                            if (bundle[fileName].type === 'chunk' && fileName.endsWith('.css')) {
                                const cssContent = readFileSync(bundle[fileName].fileName, 'utf-8');
                                const cssChunk = `\n<style>${cssContent}</style>\n`;
                                // @ts-ignore
                                bundle[fileName].source = {
                                    code: cssChunk,
                                    map: null
                                };
                            }
                        }
                    },
                },
            ],
        },
    },
});
