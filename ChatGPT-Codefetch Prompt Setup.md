# Codefetch Prompt Setup

**User:** Clayton Bivens (claytonbivens1@gmail.com)  
**Created:** 5/1/2025 22:12  
**Updated:** 5/1/2025 22:12  
**Exported:** 5/1/2025 22:13  

## Prompt:
The error you're seeing:

Error: ENOENT: no such file or directory, open
C:/Users/comfy/Projects/mirrorwright-orchestrator/codefetch/prompts/default.md

means that npx codefetch is expecting a prompt file at:

codefetch/prompts/default.md

but it doesn't exist in your project directory.

### Fix It:

You can fix this by either:

---

**✅ Option 1: Create the missing file**

bash
mkdir -p codefetch/prompts
touch codefetch/prompts/default.md

Then add a basic prompt inside default.md, for example:

markdown
# default.md
Generate code for a basic Express.js server with a single GET endpoint at `/health`.

---

**✅ Option 2: Specify a prompt manually (if supported by codefetch)**

Check if codefetch allows inline prompts or specifying another path. Try:

bash
npx codefetch --prompt "Generate a basic Python Flask API with one route"

Or:

bash
npx codefetch --prompt-file path/to/your/custom-prompt.md

(Replace with correct flag syntax if needed — check the codefetch docs or npx codefetch --help)

---

Let me know if you want help writing a useful default.md prompt for your project.

## Response:
That’s a solid diagnosis and fix. If `codefetch` is part of your workflow and you're using it repeatedly for similar tasks, creating a reusable `default.md` is the more efficient route.

Here’s a **starter `default.md`** prompt you can customize based on your project:

```markdown
# default.md
Generate TypeScript code for a modular backend microservice. The service should use Express.js, support dependency injection, include a health check route (`/health`), and be structured for easy testing with Jest. Include types and basic error handling.
```

Or for Python:

```markdown
# default.md
Generate a Flask-based REST API with a `/health` endpoint, logging setup, environment variable handling using `python-dotenv`, and a modular structure with Blueprints for future routes.
```

Let me know what stack or use case you’re building for, and I’ll tailor it further. What's your current project about?



---
Powered by [ChatGPT Exporter](https://www.chatgptexporter.com)