import { defineConfig } from 'vite';
import { resolve } from 'path';
import { glob } from 'glob';

// HTML入力ファイルを検索する関数
function findHtmlEntries() {
    return glob.sync('src/**/*.html');
}

export default defineConfig({
    root: resolve(__dirname),
    publicDir: resolve(__dirname, 'public'),
    build: {
        outDir: resolve(__dirname, 'dist'),
        rollupOptions: {
            input: findHtmlEntries().reduce<Record<string, string>>((entries, file) => {
                // ファイル名からエントリー名を生成
                const name = file.replace(/^src\//, '').replace(/\.html$/, '');
                entries[name] = resolve(__dirname, file);
                return entries;
            }, {}),
        },
    },
    server: {
        port: 3002,
        open: '/src/index.html', // デフォルトで開くファイル
    },
    optimizeDeps: {
        entries: [
            'src/**/*.ts',
            'src/**/*.html'
        ]
    },
    resolve: {
        alias: {
            '@': resolve(__dirname, 'src')
        }
    }
});