'use strict';

const fs = require('fs');
const path = require('path');

module.exports = {

    createPackageJson(directoryPath) {

        const packageJsonPath = path.join(directoryPath, 'package.json');
        const successStatus = { 'Status': 0, 'Message': 'package.json created.' };

        return new Promise((resolve, reject) => {

            fs.exists(packageJsonPath, (err) => {

                if (err) {

                    resolve(successStatus);
                } else {

                    const { showConfirmationPrompt } = require('./show-confirmation-prompt');

                    showConfirmationPrompt('Missing package.json file. Create?').then((confirmed) => {

                        if (confirmed) {

                            const { spawn } = require('child_process');
                            const isWindows = process.platform === 'win32';
                            const npmInit = spawn('npm', ['init'], { cwd: directoryPath, stdio: 'inherit', ...(isWindows && { shell: true }) });

                            npmInit.on('error', (error) => reject(error));

                            npmInit.on('exit', (code) => code === 0 ? resolve(successStatus) : reject({'Status': code, 'Message': 'Problem with npm initialization'}));

                        } else {

                            reject({ 'Status': 0, 'Message': 'package.json not created.' });
                        }
                    });
                }
            });
        });
    }
};
