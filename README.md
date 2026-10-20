# ALP CI/CD Demo

A small slice of the AMWA Adult Literacy/ESL Program platform (students + attendance API), used to learn CI/CD with GitHub Actions and Docker.

## Run locally
    npm install
    npm test          # 5 tests
    npm start         # http://localhost:3000/health
    docker compose up --build

## 8-9 hour learning plan (log your real hours)
Only list a resource in your write-up if you actually used it.

| Hrs | Activity | Resource | Output |
|---|---|---|---|
| 1.0 | CI/CD concepts + workflow file. Watch 0:00-6:00 (concepts), 13:20-23:30 (writing the workflow), 23:30-26:30 (secrets), 31:00-38:00 (fixing red builds). Skip the AWS console setup (6:20-13:20); skim the rest. | "CI/CD Pipeline with GitHub Actions & Docker" (course list) | notes: CI vs CD, workflow/job/step, `needs` |
| 1.0 | Docker basics: VMs vs containers, Dockerfile -> image -> container. Then install Docker Desktop and run `docker compose up --build`. | "Containerization Explained" (8 min) | screenshot: /health in browser |
| 1.0 | Run this API, read the tests, add 1-2 tests of your own. Note which are unit vs integration. | "Software Testing Explained" (optional) | PR with new tests |
| 1.5 | Push repo to GitHub; get `ci.yml` green. Compare it with the workflow in the video. | GitHub Actions docs | screenshot 1: green run |
| 1.0 | Break a test on a branch, open a PR, watch it fail. Diagnose the failure step by step. | "Seven Steps of Debugging" (optional) | screenshot 2: red check on the PR |
| 1.0 | Turn on branch protection: require passing tests (and optionally one review) before merging into `main`. | Git course (pull requests, branching) / "Better Code Reviews" (optional) | screenshot of the rule |
| 1.0 | Docker job pushes image to GHCR on `main`; pull and run it. | GitHub Packages docs | screenshot 3: package + running container |
| 1.0 | Make it yours: add an instructors endpoint (or another capstone feature) with tests. Push and watch the pipeline test it. | - | unique work for the demo |
| 0.5 | Write-up | - | 2-page PDF |

## Screenshots for the write-up
1. Green Actions run (test matrix + docker job)
2. Failing PR blocked by CI
3. `docker run` / `docker compose up` showing /health

## Differences from the video (worth mentioning in your write-up)
- Video deploys to AWS ECS with pnpm; this project pushes to GitHub Container Registry with npm, which is free.
- Video uses `actions/checkout@v3`; this repo uses v4 and a Node 20/22 test matrix.
- Pipeline structure is the same: test job, then a dependent job (`needs`), triggered on push to `main`.

Keep the log honest: record what you actually did and how long it took.
