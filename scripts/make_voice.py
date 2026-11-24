"""
Pre-record every narration line with a neural voice, so all readers hear the same natural voice.

    pip install edge-tts
    python scripts/make_voice.py

Finds every `say: '...'` in src/**/*.tsx, and writes public/audio/<fnv1a-hash>.mp3 for lines
that don't have a file yet. The browser computes the same hash (src/scene/store.ts → voiceFile)
and plays the file; if a file is missing it falls back to the browser's built-in voice.
"""
import asyncio, pathlib, re, sys
import edge_tts

VOICE = "en-US-AndrewMultilingualNeural"   # warm, conversational (the Copilot voice)
RATE, PITCH = "+8%", "+3Hz"                # a little faster and brighter: an energetic young teacher

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
    return text.replace("Ubaid", "Oo-bayd").replace("bro", "bro").replace("U b, and a i d", "U B, and A I D")

async def main():
    OUT.mkdir(parents=True, exist_ok=True)
    lines = set()
    for f in (ROOT / "src").rglob("*.tsx"):
        lines.update(re.findall(r"say: '((?:[^'\\]|\\.)*)'", f.read_text(encoding="utf-8")))
    todo = [l for l in sorted(lines) if not (OUT / f"{fnv1a(l)}.mp3").exists()]
    print(f"{len(lines)} lines, {len(todo)} to record")
    sem = asyncio.Semaphore(8)  # record several lines at once
    async def one(l):
        async with sem:
            await edge_tts.Communicate(spoken(l), VOICE, rate=RATE, pitch=PITCH).save(str(OUT / f"{fnv1a(l)}.mp3"))
            print("  ok", fnv1a(l), l[:60], flush=True)
    await asyncio.gather(*(one(l) for l in todo))
    # remove clips whose line no longer exists in the book
    keep = {f"{fnv1a(l)}.mp3" for l in lines}
    for f in OUT.glob("*.mp3"):
        if f.name not in keep: f.unlink(); print("  removed", f.name)

if __name__ == "__main__":
    sys.exit(asyncio.run(main()))
