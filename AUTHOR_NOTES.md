# Features

- Github action for unit testing
-

# What I wanted to do next

- Think through the error handling when a database query occurs but the database went down after the process restarted
- Build out integration tests, right now I only unit test the query parameter handling
- Debated doing the labor calculation within the query vs in the express api route code. Testing database logic is harder but given it's a report - it made the most sense to me to do it in the query for performance purposes.
- Making sure cache is invalidated in various conditions
- Seed the database more extensively for testing purposes
- Since we are using docker, I don't think I'd integrate PM2 or nodemon but instead use `--restart=always` flag.
- Would probably add a linting check to the github action so we could avoid merging code without standardized coding styles
