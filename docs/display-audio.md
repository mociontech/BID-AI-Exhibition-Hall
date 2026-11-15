# Sound on exhibition displays

Audio belongs to the TV browser. Tablet taps cannot grant permission in a different browser or device.

## Prepare a display session

Open the TV link from `sesiones.html`. Click **Enable sound for all projects** on the TV page once during setup. A brief tone confirms activation when no video is open. On browsers configured to allow autoplay, this tone plays automatically and the setup panel hides. If a video is already playing silently, the same button enables its sound without restarting it.

The display retains the same media element across AquaData, Vuce 3.0, Guatiguará, RegLAC and Teachy, including returns to Home. The setup panel disappears after successful playback with sound. If playback is blocked later, it appears again; the video remains usable without sound. No permission is assumed from saved browser storage. A page reload or browser restart can require activation again.

## Unattended Windows installation (Chrome / Edge)

For installations that must recover after a reload or restart without an operator, download the repository to each display computer. Close any previous exhibition window using this launcher's dedicated profile, then run:

```powershell
powershell.exe -NoProfile -File .\scripts\open-display-with-audio.ps1 -DisplayUrl "PASTE_THE_COMPLETE_TV_LINK_FROM_SESIONES_HERE"
```

For Edge, append `-Browser Edge`. Keep the original `station` and `room` parameters. This opens a dedicated exhibition browser profile with `--autoplay-policy=no-user-gesture-required`; videos can start with sound across projects and reloads. Run the same command after restarting the computer, or have the installation technician add it to Windows startup. Launching an ordinary browser shortcut does not apply this setting. The launcher changes no registry settings or global browser permissions.

During mounting, test video sound, Home, a second project, refresh, and relaunch with the exact final hardware. Check the computer's output device, HDMI/TV volume and mute settings. The site's code cannot authorize browser autoplay or configure the TV speakers by itself.

On managed Chrome installations, administrators can instead allow the exhibition origin through `AutoplayAllowlist`, a policy intended for kiosks and unattended systems. Configure it on each display computer; publishing to Netlify does not apply device policies.

Chrome documents the launch flag and enterprise policies: https://developer.chrome.com/blog/autoplay/
