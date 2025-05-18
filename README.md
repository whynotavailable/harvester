# Harvester

Harvester is a tool for scraping and understanding your data.

## Contributions

I'm not looking for them outside of those I have specifically reached out to. This will change once I get the version
version going.

The UI in particular will likely be troublesome cause OIDC.

## Important Future Architecture

The API is currently typescript w/express, this will be changed at a later time to go.

Every code file has the license block in it. Run `bun run license` to add it to new files or make updates.

## Auth

The current auth uses Auth0. It's set up in such a way to be semi-easily swappable with anything supporting contexts.
