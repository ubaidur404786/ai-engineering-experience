"""
Pre-record every narration line with a neural voice, so all readers hear the same natural voice.

    pip install edge-tts
    python scripts/make_voice.py

Finds every `say: '...'` (and quiz `ask`/`explain`/`outro`) in src/**/*.tsx, and writes public/audio/<fnv1a-hash>.mp3 for lines
that don't have a file yet. The browser computes the same hash (src/scene/store.ts → voiceFile)
and plays the file; if a file is missing it falls back to the browser's built-in voice.
"""
import asyncio, pathlib, re, subprocess, sys
import edge_tts

VOICE = "en-US-BrianMultilingualNeural"    # young, casual, natural
RATE, PITCH = "+6%", "+0Hz"                # a touch quicker; natural pitch (shifting it sounds robotic)

ROOT = pathlib.Path(__file__).resolve().parent.parent
OUT = ROOT / "public" / "audio"

def fnv1a(text: str) -> str:
    h = 0x811C9DC5
    for b in text.encode("utf-8"):
        h ^= b
        h = (h * 0x01000193) & 0xFFFFFFFF
    return f"{h:08x}"

def spoken(text: str) -> str:
    # Pronunciation help for the TTS only; subtitles keep the original spelling.
    return text.replace("Ubaid", "Oo-bayd").replace("RAG", "rag").replace("ReLU", "ray-loo").replace("U b, and a i d", "U B, and A I D")

# ---- Energetic delivery: each sentence gets its own pace, pitch and loudness, then a fitting pause ----
ENERGY_FILES = ["welcomeScenes"]                  # chapters recorded with the energetic delivery (trial)
ENERGY_VOICE = "en-US-AndrewMultilingualNeural"
SR = 24000
HYPE = re.compile(r"!|Wow|Boom|Lucky|haunted|Awkward|snacks|wallet|pillow|jealous|hurt|Sneaky|Hello|brave|hype")
KEY = re.compile(r"That’s it|secret|means|is called|important|Never|Always")

def style(sent):
    """(rate, pitch, volume) for one sentence."""
    if HYPE.search(sent):        return "+18%", "+6Hz", "+10%"   # jokes and hype: quick, bright, louder
    if sent.endswith("?"):       return "+10%", "+8Hz", "+5%"    # questions: curious, lifted
    if KEY.search(sent):         return "+0%", "+0Hz", "+0%"     # the key idea: slower, steady
    if len(sent.split()) <= 4:   return "+8%", "+4Hz", "+5%"     # short punchy bits
    return "+12%", "+3Hz", "+0%"

def pause(sent, nxt):
    ms = 380 if sent.endswith("?") else 280 if sent.endswith(("!", ":")) else 200
    if nxt and len(nxt.split()) <= 3: ms += 150                     # beat before a punchline
    return ms

def sentences(text):
    return [x for x in re.split(r"(?<=[.!?:])\s+(?=[A-Z“0-9])", text) if x.strip()]

def pcm(mp3: bytes) -> bytes:
    return subprocess.run(["ffmpeg", "-loglevel", "error", "-i", "pipe:0", "-f", "s16le", "-ac", "1", "-ar", str(SR), "pipe:1"],
                          input=mp3, capture_output=True, check=True).stdout

async def say_bytes(text, voice, rate, pitch, volume="+0%"):
    out = b""
    async for c in edge_tts.Communicate(text, voice, rate=rate, pitch=pitch, volume=volume).stream():
        if c["type"] == "audio": out += c["data"]
    return out

async def energetic(line, dest):
    ss = sentences(spoken(line)); raw = b""
    for i, sent in enumerate(ss):
        raw += pcm(await say_bytes(sent, ENERGY_VOICE, *style(sent)))
        if i < len(ss) - 1: raw += bytes(2) * int(SR * pause(sent, ss[i + 1]) / 1000)
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-f", "s16le", "-ac", "1", "-ar", str(SR), "-i", "pipe:0", "-b:a", "48k", str(dest)],
                   input=raw, check=True)

async def main():
    OUT.mkdir(parents=True, exist_ok=True)
    lines = {}
    for f in (ROOT / "src").rglob("*.tsx"):
        hot = any(e in f.as_posix() for e in ENERGY_FILES)
        for l in re.findall(r"\b(?:say|ask|explain|outro): '((?:[^'\\]|\\.)*)'", f.read_text(encoding="utf-8")):
            lines[l] = lines.get(l, False) or hot
    redo = "--redo-energy" in sys.argv
    todo = [l for l in sorted(lines) if not (OUT / f"{fnv1a(l)}.mp3").exists() or (redo and lines[l])]
    print(f"{len(lines)} lines, {len(todo)} to record")
    sem = asyncio.Semaphore(8)  # record several lines at once
    async def one(l):
        async with sem:
            dest = OUT / f"{fnv1a(l)}.mp3"
            if lines[l]: await energetic(l, dest)
            else: await edge_tts.Communicate(spoken(l), VOICE, rate=RATE, pitch=PITCH).save(str(dest))
            print("  ok", fnv1a(l), l[:60], flush=True)
    await asyncio.gather(*(one(l) for l in todo))
    # remove clips whose line no longer exists in the book
    keep = {f"{fnv1a(l)}.mp3" for l in lines}
    for f in OUT.glob("*.mp3"):
        if f.name not in keep: f.unlink(); print("  removed", f.name)

if __name__ == "__main__":
    sys.exit(asyncio.run(main()))
