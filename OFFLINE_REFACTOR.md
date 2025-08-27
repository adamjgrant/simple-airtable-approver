Currently the app loads up a lot of tweets and allows us to go through one by one approving, rejecting, setting different responses. But these latter actions require an internet connection because the app expects to be able to save to Airtable when it does this. The app currently does also not remember the previous state on reload. It will always try to load in new data.

The purpose of this rewrite is to allow the app to be loaded online once, then continue to work offline, even when reloaded and even when taking actions on tweets.

If the app is online again at any point, actions taken when offline will execute in timed batches so as not to overwhelm the server and reloads will prioritize pulling in new data.

When the app is offline, the body will have a class "offline". When online, it will not have this class.