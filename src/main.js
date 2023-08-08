#!/usr/bin/env node

import {glob} from 'glob';
import {dirname, join, normalize} from 'path';
import {fileURLToPath} from 'url';
import {availableParallelism, DynamicThreadPool} from 'poolifier';

const workerPath = normalize(join(dirname(fileURLToPath(import.meta.url)), 'worker.js'));
const pool = new DynamicThreadPool(Math.floor(availableParallelism() / 2), availableParallelism(), workerPath, {
    errorHandler: error => console.error('worker has error', error),
});

const targetDir = process.argv[2] ?? '.';

const files = await glob(`${targetDir}/**/*.{ts,js}`);
const poolRequests = files.map(path => pool.execute(join(process.cwd(), path)));
Promise.all(poolRequests)
    .then(data => JSON.stringify(data, undefined, 2))
    .then(data => {
        console.log(data);
        process.exit(0);
    })
    .catch(error => {
        console.error(error);
        process.exit(1);
    });
