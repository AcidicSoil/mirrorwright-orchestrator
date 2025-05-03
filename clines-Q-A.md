**Created:** 5/3/2025 6:32  
**Updated:** 5/3/2025 6:33  
**Exported:** 5/3/2025 6:34  

## Prompt:
Cline has a question:
Are there any specific requirements or constraints for generating the TS interfaces and AJV-compatible JSON Schemas for Protocol, Mode, and Ritual definitions?

## Response:
Thought for 4 seconds

🤖 **Acknowledged, Cline.** When defining the TypeScript interfaces and AJV‑compatible JSON Schemas for **Protocol**, **Mode**, and **Ritual** definitions, keep the following strategic requirements and constraints in mind:

* * *

1\. Global Schema Constraints
-----------------------------

*   **JSON Schema Draft Version**  
    Use a single, stable draft across all schemas (e.g. Draft‑07 or Draft‑2019‑09) to ensure AJV compatibility and consistent tooling support.
    
*   **No Circular `$ref` Chains**  
    Design your schema structure so that `$ref` pointers form an acyclic graph. This prevents AJV bundle/resolution issues at compile‑time.
    
*   **Strict “`required`” vs. Optional Fields**  
    Clearly distinguish mandatory properties (e.g. `id`, `version`, `name`) from optional metadata (e.g. `description`, `tags`) in both the TS interfaces and the JSON schemas.
    
*   **YAML‐to‐JSON Fidelity**  
    Since protocol files are authored in YAML, avoid YAML‑only constructs (anchors, complex keys) that won’t translate cleanly to JSON. Stick to mappings, sequences, scalars.
    
*   **Consistent Naming & Paths**  
    Mirror your on‑disk layout in the schemas’ `$id` or `id` fields. For example:
    
    ```yaml
    protocols/{protocolName}/protocol.yaml ⇒ “$id”: “https://mirrorwright.io/schemas/protocol.yaml”
    ```
    

* * *

2\. Protocol Definition Requirements
------------------------------------

*   **Core Interface**
    
    ```ts
    interface Protocol {
      id: string;
      version: string;
      modes: Mode[];
      rituals: Ritual[];
      metadata?: Record<string, any>;
    }
    ```
    
*   **Key Schema Constraints**
    
    *   `modes` and `rituals` arrays must reference Mode and Ritual definitions by `$ref`.
        
    *   Enforce unique `id` within a protocol via `uniqueItems: true` and a custom AJV “`uniqueProtocolIds`” keyword if needed.
        
    *   Validate semantic version strings with a regex pattern:
        
        ```json
        "pattern": "^\\d+\\.\\d+\\.\\d+$"
        ```
        
*   **Model Recommendation**  
    For this central, high‑complexity schema, use **GPT‑4.5** to draft and iterate on the JSON Schema text before converting to TS. .cursorrules-quickrefmirrorwright-reference
    

* * *

3\. Mode Definition Requirements
--------------------------------

*   **Core Interface**
    
    ```ts
    interface Mode {
      id: string;
      description: string;
      entryHook?: string;
      exitHook?: string;
      parameters?: Record<string, any>;
    }
    ```
    
*   **Key Schema Constraints**
    
    *   Use `enum` for any fixed set of modes if you anticipate a closed set.
        
    *   Ensure `parameters` is a JSON object, not an arbitrary YAML node.
        
    *   If you support conditional activation, include a `condition` sub‑schema for AJV‑evaluated expressions.
        

* * *

4\. Ritual Definition Requirements
----------------------------------

*   **Core Interface**
    
    ```ts
    interface Ritual {
      id: string;
      steps: RitualStep[];
      onError?: “halt” | “continue”;
    }
    
    interface RitualStep {
      id: string;
      type: string;
      promptTemplate: string;
      nextStep?: string;
      meta?: Record<string, any>;
    }
    ```
    
*   **Key Schema Constraints**
    
    *   Enforce that each `steps[].id` is unique within the ritual (`uniqueItems`, custom keyword).
        
    *   Validate `type` against an `enum` of supported step types (e.g. `prompt`, `decision`, `apiCall`).
        
    *   Require `promptTemplate` as a non‑empty string.
        
    *   If you allow conditional branching, model `nextStep` as either a string or a mapping of conditions to step IDs.
        

* * *

5\. Tooling & Workflow Suggestions
----------------------------------

1.  **Schema‑First vs. Code‑First**
    
    *   **Schema‑First**: Write JSON Schemas, then generate TS types via tools like `quicktype` or `json-schema-to-typescript`.
        
    *   **Code‑First**: Define TS interfaces and derive JSON Schema using `typescript-json-schema` or `TypeBox`.
        
2.  **AJV Bundling**  
    After writing your schemas, bundle all `$ref`s into a single file for faster AJV compile times:
    
    ```bash
    ajv-cli bundle protocols/**/*.schema.json -o bundle.json
    ```
    
3.  **Validation Tests**
    
    *   Create example YAML/JSON fixtures for each definition.
        
    *   Automate validation in CI:
        
        ```bash
        npm run validate:protocols
        ```
        
4.  **Model Ensemble Cross‑Check**  
    Before finalizing, run your schema drafts through both **GPT‑4.5** (for expressiveness) and **o4-mini/GPT‑4o-mini** (for succinctness) to catch edge cases and ensure maintainability.
    

* * *

### Prompt for Cline

> **Prompt for Cline:**  
> “Generate TypeScript interfaces and AJV‑compatible JSON Schemas for the Protocol, Mode, and Ritual definitions following the above constraints. Bundle all schemas into a single AJV‑ready file, and scaffold example fixtures in YAML to validate against.”

Let me know if you’d like to iterate on any of these constraints or add support for advanced features (e.g., conditional keywords, plugin hooks).



---
Powered by [ChatGPT Exporter](https://www.chatgptexporter.com)