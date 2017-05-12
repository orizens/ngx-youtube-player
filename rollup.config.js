import { PACKAGE } from './build';

export default {
    entry: `./dist/modules/${PACKAGE}.es5.js`,
    dest: `./dist/bundles/${PACKAGE}.umd.js`,
    format: 'umd',
    exports: 'named',
    moduleName: 'ng.ng2YoutubePlayer',
    external: [
        '@angular/core',
        '@angular/common',
        'rxjs/Observable',
        'rxjs/Observer'
    ],
    globals: {
        '@angular/core': 'ng.core',
        '@angular/common': 'ng.common',
        'rxjs/Observable': 'Rx',
        'rxjs/Observer': 'Rx'
    },
    onwarn: () => { return }
}