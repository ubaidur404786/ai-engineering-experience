"""
Free, local, expressive narration with Chatterbox (open model, runs on the GPU).

    python -m venv .venv-tts
    .venv-tts/Scripts/python -m pip install chatterbox-tts
    .venv-tts/Scripts/python scripts/make_voice_local.py --sample   # a few test clips -> scratch/voice_sample/
    .venv-tts/Scripts/python scripts/make_voice_local.py            # every missing line -> public/audio/

Each line is split into sentences. Every sentence gets its own energy and pace
(jokes and hype: livelier and quicker; key ideas: calmer and slower), and the pause after it
depends on the punctuation. Same file names as make_voice.py, so the site needs no change.
"""
import pathlib, re, subprocess, sys
import torch, torchaudio
sys.path.insert(0, str(pathlib.Path(__file__).parent))
from make_voice import fnv1a, spoken, ROOT, OUT
from chatterbox.tts import ChatterboxTTS

REF = ROOT / "scripts" / "john_ref.wav"   # short clip of John's voice; Chatterbox copies its timbre

HYPE = re.compile(r"!|Code time|Quiz time|Welcome|Wow|Brilliant|Look at you|Perfect|Great job|Nice|Boom|Lucky|haunted|Awkward|snacks|wallet|pillow|jealous|hurt|bored|Sneaky|Hello")
KEY = re.compile(r"That’s it|secret|means|is called|called|the loss|the label|the goal|important|Never|Always|=")

def style(sent: str, kind: str):
    """(exaggeration, cfg_weight). Higher exaggeration = more emotion; lower cfg = quicker, livelier pace."""
    if kind == "outro" or HYPE.search(sent): return 1.15, 0.25
    if kind == "ask" or sent.endswith("?"):  return 1.0, 0.28
    if KEY.search(sent) or kind == "explain": return 0.8, 0.38
    return 0.95, 0.3

def pause(sent: str) -> float:
    return 0.38 if sent.endswith("?") else 0.28 if sent.endswith(("!", ":")) else 0.18

def sentences(text):
    return [s for s in re.split(r"(?<=[.!?:])\s+(?=[A-Z“0-9])", text) if s.strip()]

def collect():
    out = {}
    only = next((a.split("=",1)[1] for a in sys.argv if a.startswith("--only=")), "")
    for f in (ROOT / "src").rglob("*.tsx"):
        if only and only not in f.as_posix(): continue
        for kind, l in re.findall(r"\b(say|ask|explain|outro): '((?:[^'\\]|\\.)*)'", f.read_text(encoding="utf-8")):
            out.setdefault(l, kind)
    return out

def render(model, line, kind, dest):
    parts = []
    for s in sentences(spoken(line)):
        ex, cfg = style(s, kind)
        limit = len(s.split()) / 1.6 + 1.5          # seconds; longer means the model rambled
        best = None
        for tries in range(5):
            wav = model.generate(s, audio_prompt_path=str(REF), exaggeration=ex, cfg_weight=cfg)
            if best is None or wav.shape[1] < best.shape[1]: best = wav
            if wav.shape[1] / model.sr <= limit: break
            ex, cfg = max(0.5, ex - 0.15), min(0.5, cfg + 0.05)   # calm it a bit and retry
        wav = best
        if wav.shape[1] / model.sr > limit:                 # still rambling: cut the tail, fade out
            print("  trimmed:", s[:40], flush=True)
            n = int(limit * model.sr); wav = wav[:, :n].clone()
            f = int(0.08 * model.sr); wav[:, -f:] *= torch.linspace(1, 0, f)
        parts += [wav, torch.zeros(1, int(model.sr * pause(s)))]
    tmp = dest.with_suffix(".wav")
    torchaudio.save(str(tmp), torch.cat(parts[:-1], dim=1), model.sr)
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", str(tmp), "-ac", "1", "-b:a", "64k", str(dest)], check=True)
    tmp.unlink()
    print("  ok", dest.name, line[:50], flush=True)

def main():
    lines = collect()
    if "--sample" in sys.argv:
        d = ROOT / "scratch" / "voice_sample"; d.mkdir(parents=True, exist_ok=True)
        pat = r"^Hey! I’m John|^Be honest|^Imagine standing|^Precision:|^Quiz time, and I’m|^Part Zero, done"
        jobs = [(l, lines[l], d / f"{i+1}_{lines[l]}.mp3") for i, l in enumerate(l for l in lines if re.search(pat, l))]
        jobs = [j for j in jobs if not j[2].exists()]
    else:
        jobs = [(l, k, OUT / f"{fnv1a(l)}.mp3") for l, k in lines.items() if "--all" in sys.argv or not (OUT / f"{fnv1a(l)}.mp3").exists()]
    print(len(jobs), "to record", flush=True)
    model = ChatterboxTTS.from_pretrained(device="cuda" if torch.cuda.is_available() else "cpu")
    for j in jobs:
        try: render(model, *j)
        except Exception as e: print("  FAILED", j[0][:60], e, flush=True)

if __name__ == "__main__":
    main()
