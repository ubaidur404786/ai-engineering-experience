# Accuracy log

Every factual number or output shown in the book, where it came from, and how it was checked.

## Chapter: Tokenization (checked 2026-11-24)

| Claim on page | Source / check |
|---|---|
| GPT-2: "How do we make tea?" → `['How','Ġdo','Ġwe','Ġmake','Ġtea','?']`, IDs `[2437, 466, 356, 787, 8887, 30]` | Ran `transformers` `AutoTokenizer("gpt2")` and `tiktoken` gpt2 locally; identical to in-browser js-tiktoken. |
| `" Ubaid"` → `['ĠUb','aid']` | Same run. Matches presentation slide 5 note. |
| GPT-2 vocab size 50,257 | `tokenizer.vocab_size` output. |
| BERT WordPiece: `token`, `##ization`; `[CLS]`=101, `[SEP]`=102 | Ran `bert-base-uncased`. |
| T5 Unigram: `▁To`, `ken`, `ization` | Ran `t5-small`. |
| o200k_base IDs `[5299, 621, 581, 1520, 17966, 30]` | Ran `tiktoken` o200k_base. |
| ~4 characters per token for English | OpenAI's published rule of thumb (tokenizer help page); presented as approximate. |
| Embedding vector numbers on "Text → IDs → vectors" | **Illustrative**, labelled on page. GPT-2 small width 768 (GPT-2 paper / HF config). |
| Lab IDs | Computed live; nothing hardcoded. |

## From the presentation: items to re-check before reuse

- Slide 13 note cites a "Stack Overflow 2026" survey claim about LangChain: verify before quoting.
- Slide 20 MMLU-Pro leaderboard numbers come from a screenshot and will go stale: re-fetch from Artificial Analysis at publish time.
- Slides 47 and 50 (LoRA table, LLaMA-Factory memory estimates): quote with source and "estimate" label, as the notes say.
- Slides 52–53 carry correction notes on KV-cache figures: use the corrected values and show the formula.
