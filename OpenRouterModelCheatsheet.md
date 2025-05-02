# MIRRORWRIGHT ORCHESTRATOR MODEL SELECTION CHEATSHEET

## PLAN MODE MODELS
┌─────────────────────────┬───────────┬────────────────────────────────────┐
│ Model                   │ Context   │ Best For                           │
├─────────────────────────┼───────────┼────────────────────────────────────┤
│ meta-llama/llama-4-scout│ 512K      │ Complex schema design, architecture│
├─────────────────────────┼───────────┼────────────────────────────────────┤
│ qwen/qwen3-32b          │ 40K       │ General planning, medium complexity│
├─────────────────────────┼───────────┼────────────────────────────────────┤
│ deepseek/deepseek-r1    │ 163K      │ Validation logic, complex reasoning│
└─────────────────────────┴───────────┴────────────────────────────────────┘

## ACT MODE MODELS
┌─────────────────────────────────┬───────────┬────────────────────────────┐
│ Model                           │ Context   │ Best For                   │
├─────────────────────────────────┼───────────┼────────────────────────────┤
│ agentica-org/deepcoder-14b     │ 96K       │ Code generation, interfaces │
├─────────────────────────────────┼───────────┼────────────────────────────┤
│ qwen/qwen2.5-coder-32b-instruct │ 32K       │ TypeScript implementation   │
├─────────────────────────────────┼───────────┼────────────────────────────┤
│ qwen/qwen3-8b                   │ 40K       │ Quick implementations, CLI  │
└─────────────────────────────────┴───────────┴────────────────────────────┘

## TASK-SPECIFIC RECOMMENDATIONS
- Schema Design → llama-4-scout (512K ctx)
- TypeScript Interfaces → deepcoder-14b (96K ctx)
- Validation Logic → deepseek-r1 (163K ctx)
- CLI Implementation → qwen3-8b (40K ctx)
- Parser Development → qwen2.5-coder-32b (32K ctx)
- Test Generation → qwen2.5-coder-32b (32K ctx)

## MODEL FALLBACK STRATEGY
If primary model unavailable, fall back in this order:
1. Task-specific recommendation
2. Mode alternate models
3. qwen/qwen3-32b (40K) for most general tasks