import { defineConfig } from 'vite';
import { resolve } from 'path';
import { glob } from 'glob';

// HTML入力ファイルを検索する関数
function findHtmlEntries() {
    const completeEntries = glob.sync('packages/complete/src/**/*.html');
    const studyEntries = glob.sync('packages/study/src/**/*.html');
    return [...completeEntries, ...studyEntries];
}

export default defineConfig({
    // ルートディレクトリをプロジェクトのルートに設定
    root: __dirname,
    publicDir: resolve(__dirname, 'public'),
    build: {
        outDir: resolve(__dirname, 'dist'),
        rollupOptions: {
            input: findHtmlEntries().reduce((entries, file) => {
                // ファイル名からエントリー名を生成
                const name = file.replace(/^packages\/(complete|study)\/src\//, '$1-').replace(/\.html$/, '');
                entries[name] = resolve(__dirname, file);
                return entries;
            }, {}),
        },
    },
    server: {
        port: 3000,
        open: '/packages/study/src/steps/step1.html', // デフォルトで開くファイル
    },
    // 複数エントリーポイントの設定
    optimizeDeps: {
        entries: [
            'packages/complete/src/**/*.ts',
            'packages/study/src/**/*.ts',
            'packages/complete/src/**/*.html',
            'packages/study/src/**/*.html'
        ]
    },
    resolve: {
        alias: {
            '@complete': resolve(__dirname, 'packages/complete/src'),
            '@study': resolve(__dirname, 'packages/study/src')
        }
    }
});