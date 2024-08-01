# Harvester

Harvester is a tool built out of spite.

It is, by it's nature, a tool for understanding fields in a database. There are many such tools on the market, so why
does this exist? The answer to that is relatively simple: None of the top commercial tools have all of these features.

* Indirect metadata scanning  
  The majority of these tools require direct network connection between their SaaS and your data.
* Indirect verification sampling  
  For those that do allow indirect metadata scanning via an agent they do not support data sampling for verification
  purposes.
* Unstructured data  
  Even basic unstructured data such as HSTORE isn't supported, much less a JSONB or an unstructured database.

The goal is to solve these three problems and the general problem of insight into enterprise data.

## Architecture

This is the simplest architecture humanly possible, the fact that pumping VC into "founders" isn't solving it this way
proves they are incompetent.

You have a main web service that can be run on a fridge, and you have an agent that runs in the accounts. The agents
are setup in one of two ways.

* JIT: The agent is executed on a schedule, it'll scan anything assigned to it and shut down.
* Lazy Looping: The agent runs in a loop with a delay. This delay kicks in once it's finished with the scheduled work.

For 99% of folks, just run the agent once a week on a cron and you'll be gucci. You only need the looping if you are
sampling which isn't needed the vast majority of the time since format preserving encryption exists.

The specific method that the agent communicates with the service is through a basic rest call.
