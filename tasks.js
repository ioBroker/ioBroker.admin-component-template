const { deleteFoldersRecursive, npmInstall, buildReact, copyFiles } = require('@iobroker/build-tools');
const src = `${__dirname}/src-admin/`;

function clean() {
    deleteFoldersRecursive(`${__dirname}/admin`, ['admin-component-template.png', 'jsonConfig.json']);
    deleteFoldersRecursive(`${src}build`);
}
function copyAllFiles() {
    copyFiles(['src-admin/build/static/js/*.js'], 'admin/custom/static/js');
    copyFiles(['src-admin/build/static/js/*.map'], 'admin/custom/static/js');
    copyFiles(['src-admin/build/customComponents.js'], 'admin/custom');
    copyFiles(['src-admin/build/customComponents.js.map'], 'admin/custom');
    copyFiles(['src-admin/src/i18n/*.json'], 'admin/custom/i18n');
}

if (process.argv.includes('--0-clean')) {
    clean();
} else if (process.argv.includes('--1-npm')) {
    npmInstall(src).catch(e => console.error(`Cannot install npm: ${e}`));
} else if (process.argv.includes('--2-build')) {
    buildReact(src, { craco: true }).catch(e => console.error(`Cannot build: ${e}`));
} else if (process.argv.includes('--3-copy')) {
    copyAllFiles();
} else {
    clean();
    npmInstall(src)
        .then(() => buildReact(src, { craco: true }))
        .then(() => copyAllFiles())
        .catch(e => {
            console.error(e);
            process.exit(2);
        });
}
