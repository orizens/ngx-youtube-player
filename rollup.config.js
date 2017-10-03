export default {
    entry: './dist/modules/ngx-youtube-player.es5.js',
    dest: './dist/bundles/ngx-youtube-player.umd.js',
    format: 'umd',
    exports: 'named',
    moduleName: 'ng.ngxYoutubePlayer',
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