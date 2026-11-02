#!/usr/bin/env bash
# Bakes the intro's travel audio into public/intro/travel.mp3: the approved previz's four sound effects
# (SPEC.md "Pass 6", with Ajit's by-ear tuning of launch and dive) at their clock times, each with its
# volume and its HyperFrames volume lane evaluated exactly (a lane point's curve c bends the segment's
# progress x to x^(2^(2c))), then summed without normalising, as a HyperFrames render mixes them.
# The track's t = 0 is the first cue, AUDIO_START in src/lib/intro/audio.ts.
# Re-run after any retime (SPEC.md "Pass 6" RULE). Usage: scripts/bake-intro-audio.sh [previz folder]
set -euo pipefail
here="$(cd "$(dirname "$0")" && pwd)"
SFX="${1:-$here/../../My_Galaxy-intro-previz}/assets/sfx"
OUT="$here/../public/intro/travel.mp3"
R=48000
T0=4.18 # sfx-launch's start = AUDIO_START
at() { awk -v t="$1" -v t0="$T0" -v r="$R" 'BEGIN { printf "%dS", (t - t0) * r + 0.5 }'; }

# cue        file [part used]               start  vol    lane (clip time)
# launch     whoosh.mp3                     4.18   0.77   -
# dive       whoosh-cinematic.mp3 [0-3.36]  4.76   0.63   1 to 2.586, then 1 -> 0 by 3.311, curve -0.5
# approach   riser.mp3 [2.993-4.15]         8.61   0.345  0 to 0.05, then 0 -> 1 by 0.985, curve 0.5; 0.03 s fade-out
# eclipse    impact-bass-1.mp3 [0-2.05]     9.717  0.475  1 to 0.473, then 1 -> 0 by 2.05, curve -0.35
G="[0:a]aresample=$R,atrim=0:0.575,asetpts=PTS-STARTPTS,volume=0.77,adelay=$(at 4.18):all=1[launch];"
G+="[1:a]aresample=$R,atrim=0:3.36,asetpts=PTS-STARTPTS,aeval='val(ch)*0.63*if(lt(t,2.586),1,if(lt(t,3.311),1-pow((t-2.586)/0.725,0.5),0))':c=same,adelay=$(at 4.76):all=1[dive];"
G+="[2:a]aresample=$R,atrim=2.993:4.15,asetpts=PTS-STARTPTS,aeval='val(ch)*0.345*if(lt(t,0.05),0,if(lt(t,0.985),pow((t-0.05)/0.935,2),1))*max(0,min(1,(1.157-t)/0.03))':c=same,adelay=$(at 8.61):all=1[approach];"
G+="[3:a]aresample=$R,atrim=0:2.05,asetpts=PTS-STARTPTS,aeval='val(ch)*0.475*if(lt(t,0.473),1,if(lt(t,2.05),1-pow((t-0.473)/1.577,0.6155722),0))':c=same,adelay=$(at 9.717):all=1[eclipse];"
G+="[launch][dive][approach][eclipse]amix=inputs=4:duration=longest:dropout_transition=0:normalize=0"

ffmpeg -hide_banner -loglevel error -y \
  -i "$SFX/whoosh.mp3" -i "$SFX/whoosh-cinematic.mp3" -i "$SFX/riser.mp3" -i "$SFX/impact-bass-1.mp3" \
  -filter_complex "$G" -ar "$R" -ac 2 -c:a libmp3lame -q:a 3 "$OUT"
echo "wrote $OUT"
