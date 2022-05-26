const gulp = require('gulp');
const fs = require('fs');
const cp = require('child_process');
const del = require('del');
const src = __dirname + '/src/';

function build() {
    const version = JSON.parse(fs.readFileSync(__dirname + '/package.json').toString('utf8')).version;
    const data    = JSON.parse(fs.readFileSync(src + 'package.json').toString('utf8'));

    data.version = version;

    fs.writeFileSync(src + 'package.json', JSON.stringify(data, null, 4));

    return new Promise((resolve, reject) => {
        const options = {
            stdio: 'pipe',
            cwd:   __dirname
        };

        console.log(options.cwd);

        let script = src + 'node_modules/vite/bin/vite.js';
        if (!fs.existsSync(script)) {
            script = __dirname + '/node_modules/vite/bin/vite.js';
        }
        if (!fs.existsSync(script)) {
            console.error('Cannot find execution file: ' + script);
            reject('Cannot find execution file: ' + script);
        } else {
            const child = cp.fork(script, ['build'], options);
            child.stdout.on('data', data => console.log(data.toString()));
            child.stderr.on('data', data => console.log(data.toString()));
            child.on('close', code => {
                console.log(`child process exited with code ${code}`);
                code ? reject('Exit code: ' + code) : resolve();
            });
        }
    });
}

gulp.task('0-clean', () => del(['build/**/*', 'dist/**/*']));

gulp.task('1-compile', async () => build());

gulp.task('2-copy', () => Promise.all([
    gulp.src(['dist/assets/*.js', '!dist/assets/__federation_shared_*.js', '!dist/assets/__federation_lib_semver.js']).pipe(gulp.dest('build/admin/custom')),
    gulp.src(['dist/assets/*.map', '!dist/assets/__federation_shared_*.map', '!dist/assets/__federation_lib_semver.map']).pipe(gulp.dest('build/admin/custom')),
    gulp.src(['src/i18n/*.json']).pipe(gulp.dest('build/admin/custom/i18n')),
    gulp.src(['img/*']).pipe(gulp.dest('build/img')),
    gulp.src(['README.md', 'LICENSE']).pipe(gulp.dest('build')),
    gulp.src(['src/package.json']).pipe(gulp.dest('build')),
]));

gulp.task('build', gulp.series(['0-clean', '1-compile', '2-copy']));

gulp.task('default', gulp.series(['build']));