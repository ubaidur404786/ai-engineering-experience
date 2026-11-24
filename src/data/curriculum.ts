/**
 * The book's curriculum. Chapters group related topics from the original roadmap
 * (one chapter = one coherent question the reader can answer at the end).
 * Topic lists are kept so nothing from the roadmap is lost; see docs/CURRICULUM.md for the reasoning.
 * A chapter appears as "ready" in the Contents only when src/chapters/registry.ts has spreads for its id.
 */
export interface Chapter { id: string; title: string; question: string; topics: string[] }
export interface Part { id: string; num: number; title: string; chapters: Chapter[] }

export const CURRICULUM: Part[] = [
  { id: 'p0', num: 0, title: 'Enter the AI Engineering World', chapters: [
    { id: 'welcome', title: 'Welcome: how this book works', question: 'How do I read this book?', topics: ['Teaching model', 'Labs', 'Simulations vs real execution'] },
    { id: 'two-sides', title: 'The two sides of AI Engineering', question: 'What does an AI engineer actually do?', topics: ['Builder side vs user side', 'AI Engineer vs Data Scientist vs ML Engineer vs Software Engineer', 'The AI Engineering lifecycle'] },
    { id: 'what-is-ai', title: 'AI, ML, Deep Learning, Generative AI', question: 'How do these words relate?', topics: ['What is AI?', 'ML vs DL vs GenAI', 'Foundation models'] },
    { id: 'model-landscape', title: 'The model landscape', question: 'Which kinds of models exist and how do I get one?', topics: ['LLMs and SLMs', 'Open-weight vs closed models', 'From model to application'] },
  ]},
  { id: 'p1', num: 1, title: 'Understand the Foundations', chapters: [
    { id: 'data', title: 'Data: the raw material', question: 'What does a model learn from?', topics: ['Datasets', 'Collection and cleaning', 'Structured vs unstructured', 'Features and labels', 'Train / validation / test'] },
    { id: 'learning-types', title: 'Ways a machine learns', question: 'Where do the "answers" come from?', topics: ['Supervised', 'Unsupervised', 'Self-supervised'] },
    { id: 'neuron', title: 'One neuron, then a network', question: 'What is inside a neural network?', topics: ['Weights and biases', 'Activation functions', 'Forward propagation'] },
    { id: 'learning', title: 'How a network learns', question: 'How do weights get better?', topics: ['Loss functions', 'Gradient descent', 'Backpropagation'] },
    { id: 'fit', title: 'Is the model any good?', question: 'Did it learn or memorise?', topics: ['Overfitting and underfitting', 'Evaluation metrics'] },
  ]},
  { id: 'p2', num: 2, title: 'How LLMs Are Created', chapters: [
    { id: 'planning', title: 'Planning a foundation model', question: 'What do we decide before training?', topics: ['Choosing a domain', 'Pre-training overview'] },
    { id: 'pretraining-data', title: 'Pre-training data', question: 'Where does 15 trillion tokens of text come from?', topics: ['Collection', 'Cleaning and deduplication', 'Filtering and PII removal'] },
    { id: 'tokenization', title: 'Tokenization', question: 'What happens to my text after I press Enter?', topics: ['Tokens and vocabulary', 'Token IDs', 'Character / word / subword', 'BPE, WordPiece, Unigram', 'Byte-level BPE'] },
    { id: 'embeddings-in', title: 'From token IDs to vectors', question: 'How does a number become meaning?', topics: ['Embedding matrix', 'Positional information'] },
    { id: 'transformer', title: 'The Transformer', question: 'What is the machine that reads the vectors?', topics: ['Architecture overview', 'Encoder vs decoder', 'Decoder-only GPT models', 'MLP, residuals, layer norm'] },
    { id: 'attention', title: 'Self-attention', question: 'How does "bank" know if it means money or river?', topics: ['Query, Key, Value', 'Attention scores', 'Softmax', 'Causal masking', 'Multi-head attention'] },
    { id: 'training-loop', title: 'Training by next-token prediction', question: 'How does the model learn without labels?', topics: ['Training examples', 'Self-supervision', 'Loss', 'Backprop and updates', 'Iterations and checkpoints'] },
    { id: 'base-model', title: 'The base model and its limits', question: 'Why does it answer a question with more questions?', topics: ['Base model behaviour', 'Limitations'] },
  ]},
  { id: 'p3', num: 3, title: 'Post-Training and Model Adaptation', chapters: [
    { id: 'sft', title: 'Teaching a model to chat (SFT)', question: 'How does a text-continuer become an assistant?', topics: ['Why pre-training is not enough', 'SFT', 'Chat templates and special tokens', 'Instruction datasets'] },
    { id: 'preference', title: 'Learning from preferences', question: 'How do we teach "better" answers?', topics: ['Preference data', 'RLHF', 'PPO', 'DPO', 'GRPO', 'Alignment and safety'] },
    { id: 'peft', title: 'Fine-tuning efficiently: LoRA and QLoRA', question: 'How do I adapt a 7B model on one GPU?', topics: ['Full vs PEFT', 'LoRA and rank', 'QLoRA', 'Datasets and evaluation'] },
    { id: 'choose-adapt', title: 'Prompting, RAG or fine-tuning?', question: 'Which tool for which problem?', topics: ['Decision guide'] },
  ]},
  { id: 'p4', num: 4, title: 'Building LLM Applications', chapters: [
    { id: 'access', title: 'Ways to talk to a model', question: 'API, Hugging Face or my laptop?', topics: ['Model APIs', 'Hugging Face', 'Ollama', 'Cloud vs local'] },
    { id: 'prompting', title: 'Prompt engineering', question: 'What exactly does the model receive?', topics: ['System vs user prompts', 'Templates', 'Zero/few-shot', 'Context windows'] },
    { id: 'structured', title: 'Structured outputs and tool calling', question: 'How do I get JSON, not prose?', topics: ['JSON outputs', 'Function / tool calling'] },
    { id: 'first-app', title: 'Your first LLM application', question: 'How do frontend, backend and model connect?', topics: ['Direct SDK vs LangChain', 'Backend', 'Streaming'] },
  ]},
  { id: 'p5', num: 5, title: 'Embeddings and RAG', chapters: [
    { id: 'embeddings', title: 'Embeddings and similarity', question: 'How do we measure "similar meaning"?', topics: ['Text embeddings', 'Dimensions', 'Cosine similarity', 'Embedding models'] },
    { id: 'indexing', title: 'Preparing documents', question: 'How does a PDF become searchable?', topics: ['Loading', 'Splitting', 'Chunk size and overlap', 'Ingestion pipelines'] },
    { id: 'vector-search', title: 'Vector databases and search', question: 'How do we search 10,000 documents in milliseconds?', topics: ['FAISS', 'Chroma', 'Top-K', 'Metadata filters', 'Hybrid search', 'Reranking'] },
    { id: 'rag', title: 'Retrieval-Augmented Generation', question: 'How does the model answer from my documents?', topics: ['Pipeline', 'Prompt construction', 'Grounding', 'Citations', 'Wrong-chunk failures'] },
    { id: 'rag-advanced', title: 'Advanced RAG and its limits', question: 'What do I do when RAG fails?', topics: ['Query rewriting', 'Multi-query', 'Limitations', 'RAG vs fine-tuning'] },
  ]},
  { id: 'p6', num: 6, title: 'AI Agents and Tool Use', chapters: [
    { id: 'agents', title: 'From LLM to agent', question: 'When does a model start acting?', topics: ['Agent loop', 'Tool selection', 'Workflow vs agent'] },
    { id: 'agent-memory', title: 'Memory, state and humans', question: 'How does an agent remember and when should it ask?', topics: ['Short/long-term memory', 'State', 'Human-in-the-loop'] },
    { id: 'agent-systems', title: 'Agent systems in practice', question: 'SQL, RAG or a human?', topics: ['SQL and RAG agents', 'Orchestration', 'Multi-agent', 'Evaluation', 'Failure modes', 'Safety'] },
  ]},
  { id: 'p7', num: 7, title: 'Evaluation', chapters: [
    { id: 'model-evals', title: 'Evaluating the model', question: 'What does a benchmark score really tell me?', topics: ['Capabilities', 'MMLU, GSM8K, HumanEval, SWE-bench, IFEval, GPQA, MMLU-Pro, HLE, TruthfulQA, SimpleQA', 'Harnesses', 'Contamination, saturation, configuration', 'Leaderboards'] },
    { id: 'app-evals', title: 'Evaluating the application', question: 'Why can every part pass while the app fails?', topics: ['Component / pipeline / end-to-end', 'Golden sets', 'Offline vs online'] },
    { id: 'eval-methods', title: 'Metrics and judges', question: 'Code, humans or an LLM judge?', topics: ['Precision/recall/F1', 'Recall@K, MRR, NDCG', 'Faithfulness, relevance', 'LLM-as-a-judge, rubrics, calibration'] },
    { id: 'eval-pipeline', title: 'Build an evaluation pipeline', question: 'How do I gate releases on quality?', topics: ['DeepEval, RAGAS', 'Regression testing', 'CI/CD gates'] },
  ]},
  { id: 'p8', num: 8, title: 'LLMOps and Production Feedback', chapters: [
    { id: 'observability', title: 'Logging, tracing and metrics', question: 'What happened in that bad conversation?', topics: ['Logs, traces', 'LangSmith', 'Latency, tokens, cost', 'PII masking'] },
    { id: 'online-eval', title: 'Online evaluation and drift', question: 'Is my app still behaving normally?', topics: ['Captured vs computed signals', 'Sampling', 'Judges in production', 'Drift'] },
    { id: 'feedback-loop', title: 'The continuous improvement loop', question: 'How do failures become tests?', topics: ['Failure analysis', 'Golden set growth', 'Versioning'] },
  ]},
  { id: 'p9', num: 9, title: 'Inference and Optimization', chapters: [
    { id: 'generation', title: 'One token at a time', question: 'Why are 100 tokens 100 forward passes?', topics: ['Logits', 'Greedy, temperature, top-k, top-p', 'Repetition penalties'] },
    { id: 'prefill-decode', title: 'Prefill, decode and the KV cache', question: 'What does the model remember between tokens?', topics: ['TTFT, TPOT', 'KV cache', 'GQA', 'Memory calculation'] },
    { id: 'serving-math', title: 'Serving many users', question: 'Why is a GPU never "full" the way you think?', topics: ['PagedAttention', 'vLLM', 'Static vs continuous batching', 'Throughput vs latency'] },
  ]},
  { id: 'p10', num: 10, title: 'Quantization and Compression', chapters: [
    { id: 'numbers', title: 'How computers store numbers', question: 'What is inside FP32, FP16, BF16?', topics: ['Floating point', 'INT8, INT4'] },
    { id: 'quantization', title: 'Quantization', question: 'How does a 280 GB model fit in 35 GB?', topics: ['Scale and zero point', 'Symmetric vs asymmetric', 'Calibration', 'PTQ vs QAT', 'GPTQ, AWQ, GGUF', 'Trade-offs'] },
  ]},
  { id: 'p11', num: 11, title: 'Serving and Deployment', chapters: [
    { id: 'serving', title: 'Model serving architecture', question: 'What runs between the API call and the GPU?', topics: ['llama.cpp, Ollama, vLLM', 'FastAPI', 'Docker', 'CPU vs GPU', 'Queues and batching'] },
    { id: 'scaling', title: 'Scaling and reliability', question: 'What happens when 1,000 users arrive?', topics: ['Horizontal scaling', 'Load balancing', 'Autoscaling', 'Deployment strategies', 'Cost'] },
  ]},
  { id: 'p12', num: 12, title: 'Production AI Engineering', chapters: [
    { id: 'security', title: 'Security and guardrails', question: 'What if the document says "ignore your instructions"?', topics: ['Prompt injection', 'Jailbreaks', 'Privacy', 'Access control', 'Validation', 'Guardrails'] },
    { id: 'release', title: 'Shipping safely', question: 'How do I release a new prompt without fear?', topics: ['CI/CD', 'Eval before release', 'Rollbacks', 'Model, prompt and data versioning'] },
  ]},
  { id: 'p13', num: 13, title: 'Multimodal AI', chapters: [
    { id: 'vision', title: 'Models that see', question: 'How does an image become tokens?', topics: ['VLMs', 'Image embeddings'] },
    { id: 'audio', title: 'Models that hear and speak', question: 'How does speech become text and back?', topics: ['STT', 'TTS', 'Audio-language models', 'Video'] },
  ]},
  { id: 'p14', num: 14, title: 'Projects', chapters: [
    { id: 'projects', title: 'Build real systems', question: 'Can I put it all together?', topics: ['Basic LLM app', 'Document Q&A', 'YouTube transcript Q&A', 'SQL + RAG assistant', 'Eval framework', 'Fine-tuned SLM', 'Monitored assistant', 'Tool-using agent'] },
  ]},
];
