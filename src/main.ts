import { Octokit } from "@octokit/rest";
import dotenv from "dotenv";
const yargs = require('yargs')

const main = async () => {
    dotenv.config();
    const { endpoint, token } = acceptCommandLineArgs();
    const octokit = new Octokit({
        auth: token,
        baseUrl: endpoint
    });
    const promises = Array.from({ length: 100 }, () => run(octokit));
    const results = await Promise.all(promises);
    console.log(results);
};

// The main entrypoint for the application
main();

async function run(octokit: Octokit) {
    const result = (await octokit.users.getAuthenticated()).data.login;
    return result;
}


export function acceptCommandLineArgs(): { endpoint: string, token: string } {
    const argv = yargs.default(process.argv.slice(2))
        .env('GITHUB')
        .option('endpoint', {
            alias: 'e',
            env: 'GITHUB_ENDPOINT',
            description: 'The api endpoint of the github instance (ex. api.github.com)',
            type: 'string',
            demandOption: true,
        })
        .option('token', {
            alias: 't',
            env: 'GITHUB_TOKEN',
            description: 'The personal access token for the GHES Migration API.',
            type: 'string',
            demandOption: true,
        }).argv;
    return { endpoint: argv.endpoint, token: argv.token };
}
