---
name: ai-models-guide
title: AI Models Guide
description: A comprehensive list of local models used during the development of this project, and how each model was used.
---

# Local AI models — usage guide

Five models are available via llama-swap. All share the same 256K-class context window and run locally with no API costs. Parameters and commands live in `config.yaml`; this document covers when and why to use each one.

---

## Model roster

| Name | Claude Code Alias | Base Model | Quant | Architecture | Thinking |
| ---- | ----------------- | ---------- | ----- | ------------ | -------- |
|`Coder-Agent`|`cc-coder-agent`|Qwen3-Coder-Next|Q4_K_M|80B MoE · 3B active|None|
|`Precise-Coder`|`cc-precise-coder`|Qwen3.6-27B|Q4_K_M|27B dense|Off|
|`Deep-Reasoner`|`cc-deep-reasoner`|Qwen3.6-27B|Q4_K_M|27B dense|On|
|`Quick-Coder`|`cc-quick-coder`|Qwen3.6-35B-A3B|Q8_0|35B MoE · 3B active|Off|
|`Swift-Reasoner`|`cc-swift-reasoner`|Qwen3.6-35B-A3B|Q8_0|35B MoE · 3B active|On|

---

## Hardware reality on host machine

**RTX 5080 (16 GB VRAM) + 64 GB RAM = ~80 GB usable across GPU and CPU.**

All five models fit within that budget, but none fit entirely in VRAM, so each runs split across GPU and CPU. MoE models activate only ~3B parameters per token regardless of total size, which makes them faster than the token speed penalty from offloading would suggest.

Rough generation speeds at 32K context:

|Model|Est. speed|Bottleneck|
|-|-|-|
|`Coder-Agent`|~5–10 t/s|Largest file, most CPU offloading|
|`Precise-Coder`|~10–18 t/s|Dense — all 27B fire every token|
|`Deep-Reasoner`|Slower — thinking tokens add overhead|Same as above|
|`Quick-Coder`|~12–22 t/s|Best speed; MoE sparse compute|
|`Swift-Reasoner`|Moderate — thinking tokens, but MoE helps|Same base as Quick-Coder|

---

## The models

### `Coder-Agent`

**Qwen3-Coder-Next · Q4_K_M · no thinking**

Purpose-built for agentic workflows. Unlike the general 3.6 models, Coder-Next was trained specifically on 800K executable coding tasks with real environment feedback — tool calls, bash loops, file edits, and failure recovery. Nothing else in this lineup was trained the same way.

It has no thinking mode by design; it's optimized for decisive, low-latency tool actions rather than extended internal reasoning. In a Claude Code session you're waiting on tool execution more than token generation anyway, so the slower raw speed matters less.

**Use with:** Claude Code CLI (`claude` command).

**Reach for it when:**

* Starting any `claude` session
* Running multi-step agentic tasks (edit → test → fix loops)
* Working across multiple files or an entire repo
* Any workflow that relies on tool use and execution feedback

---

### `Precise-Coder`

**Qwen3.6-27B · Q4_K_M · thinking off**

The highest-quality coding model in the lineup. Dense architecture means every one of its 27B parameters fires on every token — no routing, no sparsity, just full model capacity. Q8_0 quantization is near-lossless, so what you get here is very close to the full model's ceiling.

Benchmarks back this up: 77.2% on SWE-bench Verified (within 3.7 points of Claude Opus 4.6), 59.3% on Terminal-Bench 2.0. Thinking is off, so responses are direct and fast relative to `Deep-Reasoner` — use this when you already know what you want and just need it done right.

**Use with:** Claude Code / Continue.dev

**Reach for it when:**

* Writing new features or functions from scratch
* Fixing a specific known bug
* Generating tests for existing code
* You want the best output quality and `Quick-Coder` isn't cutting it

---

### `Deep-Reasoner`

**Qwen3.6-27B · Q4_K_M · thinking on**

Same weights as `Precise-Coder`, different mode. Thinking enabled means the model works through the problem step-by-step inside `<think>` blocks before committing to a response. The 27B dense architecture gives it the most reasoning depth in the lineup — it will out-think both MoE models on hard problems. Worth the extra wait on genuinely difficult tasks.

**Use with:** Claude Code / Continue.dev

**Reach for it when:**

* Debugging something subtle — race conditions, off-by-one errors, async timing issues
* Designing system architecture or weighing technical tradeoffs
* Tracing through unfamiliar or complex code to understand what it actually does
* Any task where `Precise-Coder` or `Quick-Coder` gave you a shallow or wrong answer

---

### `Quick-Coder`

**Qwen3.6-35B-A3B · Q8_0 · thinking off**

Your fastest model for everyday coding tasks. MoE architecture activates only ~3B parameters per token (~9 of 256 experts), which makes it 2–3x faster than the 27B dense models despite being a larger file. Quality is slightly below `Precise-Coder` on hard benchmarks (73.4% vs 77.2% SWE-bench Verified), but on everyday tasks the gap is small and the speed difference is noticeable. Also vision-capable — paste a screenshot or diagram and it can reason about it.

Good default for Continue.dev chat. Switch to `Precise-Coder` when quality starts to matter.

**Use with:** Claude Code / Continue.dev

**Reach for it when:**

* Explaining what a function or block of code does
* Writing boilerplate, stubs, or repetitive patterns
* Quick one-shot fixes where the problem is obvious
* Code review and light feedback
* You want a near-instant answer and aren't at the difficulty ceiling

---

### `Swift-Reasoner`

**Qwen3.6-35B-A3B · Q8_0 · thinking on**

Same weights as `Quick-Coder` with thinking enabled. MoE efficiency still applies to the non-reasoning parts, so thinking tokens are produced faster here than in `Deep-Reasoner`. The trade-off is shallower reasoning than the 27B dense model — the 27B leads by ~8 points on Terminal-Bench 2.0. Still a meaningful upgrade over `Quick-Coder` for anything that benefits from a deliberation pass.

Think of it as the middle option: more than `Quick-Coder`, less wait than `Deep-Reasoner`.

**Use with:** Claude Code / Continue.dev

**Reach for it when:**

* Moderate debugging — not trivial, but not a head-scratcher either
* Logic-heavy code generation where the structure needs thought
* `Quick-Coder` gave a wrong or shallow answer and you want a retry with reasoning
* You want some deliberation but `Deep-Reasoner` feels like overkill

---

## Benchmark reference

|Benchmark|`Coder-Agent`|`Precise-Coder` / `Deep-Reasoner`|`Quick-Coder` / `Swift-Reasoner`|
|-|-|-|-|
|SWE-bench Verified|~74%|**77.2%**|73.4%|
|SWE-bench Pro|~44%|**53.5%**|~48%|
|Terminal-Bench 2.0|~65%|**59.3%**|51.5%|
|Vision input|No|Yes|Yes|

Coder-Next leads on Terminal-Bench due to its agentic training focus. The 27B dense leads on SWE-bench. All figures are at full/high precision — Q4 quants see a small reduction.

---

## Comparison using same prompt in llama-swap

> Generate a Laravel migration. This migration should include both the `up()` and `down()` functions for rolling back if needed. This migration will create a new table called `users` in a database called `app`. The table will have the following columns:
> - id (primary key, auto generated)
> - first_name
> - last_name
> - email_address
> - phone_number

| Model          | Prompt (new prompt tokens processed) | Generated | Prompt Speed | Gen Speed | Duration |
| -------------- | ------------------------------------ | --------- | ------------ | --------- | -------- |
| Coder-Agent    | 83	                                |   467     | 57.07 t/s    | 46.60 t/s |  31.84s  | 
| Precise-Coder  | 92	                                |   455     | 82.01 t/s    |  8.04 t/s |  76.76s  | 
| Deep-Reasoner  | 90	                                | 2,333     | 84.37 t/s    |  7.36 t/s | 335.00s  | 
| Quick-Coder    | 89	                                |   191     | 30.93 t/s    | 49.30 t/s |  28.67s  | 
| Swift-Reasoner | 87	                                | 1,959     | 48.94 t/s    | 45.27 t/s |  63.35s  | 