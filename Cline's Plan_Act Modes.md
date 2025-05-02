
# Guide to Using Cline's Plan/Act Modes in Mirrorwright Development

## How to Toggle Between Modes

1. **Using the UI Toggle:**
   - Look for the Plan/Act toggle in the Cline interface
   - Simply click between the tabs to switch modes

2. **Using Commands:**
   - Type `/plan` to switch to Plan mode
   - Type `/act` to switch to Act mode

3. **Context-Based Switching:**
   - Add "Let's plan..." at the start of your prompt to implicitly trigger Plan mode
   - Add "Let's implement..." to implicitly trigger Act mode

## When to Use Each Mode

### Use PLAN Mode When:

1. **Starting New Components**
   ```
   "Let's plan the structure for our Protocol validation module. What interfaces and classes will we need?"
   ```

2. **Making Architectural Decisions**
   ```
   "I need to choose between storing rituals as separate files or embedding them in the protocol definition. What's the best approach?"
   ```

3. **Designing Schemas**
   ```
   "Help me design the JSON schema for ritual steps, considering we need to support conditional execution."
   ```

4. **Evaluating Options**
   ```
   "What are the trade-offs between using YAML vs JSON for protocol definitions?"
   ```

5. **Complex Problem Decomposition**
   ```
   "Let's plan how to implement protocol inheritance, where one protocol can extend another."
   ```

### Use ACT Mode When:

1. **Writing Implementation Code**
   ```
   "Implement the validateProtocol function using Ajv based on our schema."
   ```

2. **Fixing Bugs**
   ```
   "Debug why this protocol validation is failing with error 'Invalid schema reference'."
   ```

3. **Creating Tests**
   ```
   "Write Jest tests for the RitualStep validator."
   ```

4. **Building CLI Commands**
   ```
   "Implement the 'validate' command for our CLI using Commander."
   ```

5. **Refactoring Existing Code**
   ```
   "Refactor this protocol parser to handle nested conditions more efficiently."
   ```

## Mode-Switching Workflow Examples

### Example 1: Protocol Schema Development

1. **Start in PLAN Mode**
   ```
   "Let's plan the structure of our protocol schema. What fields should be required vs optional?"
   ```

2. **Continue Planning the Implementation**
   ```
   "How should we structure the validation to provide helpful error messages?"
   ```

3. **Switch to ACT Mode**
   ```
   "/act Now let's implement the Protocol interface we just designed."
   ```

4. **Stay in ACT for Related Implementation**
   ```
   "Now create the JSON schema that corresponds to this TypeScript interface."
   ```

5. **Back to PLAN for Next Component**
   ```
   "/plan Now that we have the base Protocol schema, let's think about how Modes should be structured."
   ```

### Example 2: Ritual Execution Engine

1. **Start in PLAN Mode**
   ```
   "Let's plan the RitualExecutor class that will run ritual steps in sequence."
   ```

2. **Design the API**
   ```
   "What should the public methods of this executor be? How will it track state?"
   ```

3. **Switch to ACT Mode**
   ```
   "/act Implement the RitualExecutor class based on our design."
   ```

4. **Implement Unit Tests**
   ```
   "Write unit tests for the RitualExecutor to verify it handles conditional steps correctly."
   ```

## Pro Tips

1. **Use Plan Mode for Debugging Strategy**
   - When facing complex bugs, switch to Plan mode to strategize your debugging approach
   - Example: "Let's plan how to debug this ritual execution problem. What could be causing steps to be skipped?"

2. **Use Act Mode for Quick Fixes**
   - For simple fixes where the solution is clear, stay in Act mode
   - Example: "Fix the typo in the protocol interface where 'description' is misspelled."

3. **Mode-Specific Notes**
   - Keep a document with mode-specific prompts that work well
   - Record which tasks work best in which mode for your specific workflow

4. **Mixed-Mode Sessions**
   - For complex tasks, toggle multiple times during a single session
   - Example: Plan → Act → Plan to design, implement, then evaluate results

Remember that the different models powering each mode have distinct strengths. Plan mode (with models like Llama-4-Scout) excels at complex reasoning, while Act mode (with models like Deepcoder) excels at efficient code generation.
