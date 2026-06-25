# Audio

Drop a track here named **`track.mp3`** to auto-connect the Audio-Reactive system.

The path is configured in `src/constants/index.ts` as `DEFAULT_TRACK`.
No code change is needed — the `<audio>` element in `AudioReactive.tsx`
points at this file and the AudioEngine wires it into the analyser on Play.
