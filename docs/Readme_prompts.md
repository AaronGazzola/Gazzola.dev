# Readme prompts

## Beep.Buzz

### Description:

Beep.Buzz is a web app for live streamers to create interactive pages for polls, goals, donations and mini games.
Live streamers create an account and link a stripe express connect account.
Device fingerprinting is used to track anon users and prevent double voting.
The platform takes a fee from any donations recieved through the app.
Each user gets a unique subdomain to host their page (`[username].beep.buzz`).
The mvp allows only a single page, the user can drag, drop and resize components in a responsive grid.
The accounts are linked to Youtube (no other streaming API for the MVP) to get metadata (eg sub count) to display in the components.
Users can add components for polls, poll history, donation history/goals, and a mini game. They can also embed a youtube player to play their live stream or a VOD.
The MVP includes one minigame that can optionally be pay-to-play, the mini game will involve multiple audience members playing against the streamer in a asymmetrical game design.
