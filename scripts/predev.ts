import fs from 'fs-extra';

// The `dev` script runs `constatic` inside the `playground` directory.
// We need to clean it up before running the tests.
fs.removeSync('./playground');
fs.ensureDirSync('./playground');
