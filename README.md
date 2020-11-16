# morsecode-potato
A exercise on wrapping morsecode translations into React hooks. 

## UseMorsecode Hook

Parameters: 
- initial , value to start with
- shouldAbbreviate, flag whether you want hook to abbreviate phrases

Hook variables
- message, the current message (could be abbreviated)
- translated, the message in morse code
- setMessage, function to update the message

## UseAudioMorsecodePlayer Hook

Parameters: 
- initial, value to start with
- oscillatorType, (default "sine")
- frequency, (default "750") - Hz
- dotTiming, (default "0.08") -- computation T = 1.2s / 15 wpm(words per min)
> https://en.wikipedia.org/wiki/Morse_code#Representation,_timing,_and_speeds 

Hook variables
- play, play generated audio
- stop, stop generated audio
- suspend, pause generated audio
- isPlaying, flag when audio is playing
- isSuspended, flag when paused
- supportsAudio, this is set to TRUE if browser supports audio
- setMorsecode, function to set encoded message

## Todo
- ~~play to audio~~
- visualize message(lights)
- save to file
- gracefully notify user of demo site browser support

## Contributor
@codespud