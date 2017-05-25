'use strict';

const mongoose = require('mongoose'),
    config = require('../config'),
    Promise = require('bluebird'),
    path = require('path'),
    fs = Promise.promisifyAll(require('fs'));
mongoose.Promise = Promise;

const seedProcess = () => {
    const getFiles = (path) => {
            return fs.readdirAsync(path);
        },

        getContent = (filename) => {
            return fs.readFileAsync(filename, 'utf8');
        },

        dateProcessing = (processedData) => {
            const result = Object.assign(processedData);
            if (result.createDate) result.createDate = new Date();
            return result;
        },

        processFile = (fileName) => {
            return getContent(fileName)
                .then(content => {
                    if (content) {
                        const contentData = JSON.parse(content),
                            model = require(contentData.pathToModel),
                            processedContent = contentData.content.map(data => {
                                const processedData = Object.assign(data);
                                return dateProcessing(processedData);
                            });
                        const result = model.create(processedContent);
                        console.log(fileName, ' -> seeded');
                        return result;
                    }
                    return Promise.resolve(null);
                });
        },

        processDirectory = (filesPath) => {
            return getFiles(filesPath).map(fileName => {
                const fileFullPath = path.join(filesPath, fileName);
                return new Promise((res, rej) => {
                    fs.stat(fileFullPath, (err, stats) => {
                        if (err) {
                            return rej(err);
                        }

                        if (stats.isDirectory()) {
                            return res(processDirectory(fileFullPath));
                        } else if (stats.isFile() && path.extname(fileName) === '.json') {
                            return res(processFile(fileFullPath));
                        }

                        return res(null);
                    });
                });
            });
        };

    return processDirectory(__dirname);
}

mongoose.connect(config.mongodb);

mongoose.connection.on('error', err => {
    console.log('connection error:', err);
});

mongoose.connection.once('open', () => {
    console.log('We are connected to the MongoDB');
    console.log('------------------------------------------');
    mongoose.connection.db.dropDatabase(() => {
        seedProcess()
            .then(() => {
                console.log('------------------------------------------');
                console.log('Seeds generation complete');
            })
            .catch(err => console.log('Seeding error: ', err))
            .finally(() => process.exit(0));
    });
});