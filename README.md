# Hashes
[![License](https://img.shields.io/github/license/shinycolors/hashes.svg?style=flat-square)](https://github.com/shinycolors/hashes)
[![TypeScript](https://img.shields.io/badge/TypeScript-v2.8-blue.svg?style=flat-square)](https://www.typescriptlang.org/)

> Check hashes and store for Something about Something.

## Check Results
Runs on daily at 3:00 UTC. (12:00 in GMT+9, JST) <br>
![Check Results](https://codebuild.ap-northeast-1.amazonaws.com/badges?uuid=eyJlbmNyeXB0ZWREYXRhIjoiWWp0WURSUVVIYVNVR0FXTFVDUVE3a1cxdEZRakgvemsvRE55WkpCYXErTDUvUFU0VGR5TGFYK3VOSlltN1FCZXB2b2hZNTIvMDc0aXlQSXJpVSszL3dVPSIsIml2UGFyYW1ldGVyU3BlYyI6ImVmY1RIK1V2aHpLN2sxZzAiLCJtYXRlcmlhbFNldFNlcmlhbCI6MX0%3D&branch=master)

Running on AWS NorthEast-1 CodeBuild nodes with `yarn test:check`

If you want to check logs, Please run this script on your local machine since AWS CodeBuild doesn't support share logs on public.

### Check Status
 - <span style="color:green">■</span> passing: No changes detected.
 - <span style="color:red">■</span> failing: Changes detected, or Something is blocking this script.
 - in_progress: Please wait.
 - unknown: Please wait. if it keeps 'unknown' tomorrow, please submit issue.

## How to run
```bash
# Install dependencies.
$ npm i # or `yarn install`

# Run.
$ npm run start # or `yarn start`

# Test.
# It will be panic when found changes.
$ npm run test:check
```
