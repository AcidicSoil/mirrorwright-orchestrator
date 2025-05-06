└── tools.json        # Optional: preloaded tool metadata (get_weather, etc.)
```

* * *

### `index.html`

```html
<!DOCTYPE html>
<html>
<head>
  <title>Mirrorwright LM Studio Tool Runner</title>
</head>
<body>
  <h2>Run LM Studio Tool</h2>

  <label for="tool">Tool Name:</label>
  <input id="tool" value="get_weather" />

  <br><br>
  <label for="input">Tool Parameters (JSON):</label><br>
  <textarea id="input" rows="5" cols="60">
{
  "location": "Houston"
}
  </textarea><br><br>

  <button onclick="callTool()">Run Tool</button>

  <h3>Output:</h3>
  <pre id="output"></pre>

  <script src="main.js"></script>
</body>
</html>
```

* * *

### `main.js`

```js
async function callTool() {
  const tool = document.getElementById("tool").value;
  const input = JSON.parse(document.getElementById("input").value);

  const response = await fetch("http://localhost:11434/tool-call", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      tool,
      parameters: input
    })
  });

  const result = await response.json();
  document.getElementById("output").textContent = JSON.stringify(result, null, 2);
}
```

* * *

### `tools.json` (optional, for future dropdown or pre-fill)

```json
[
  {
    "name": "get_weather",
    "description": "Returns current weather at a given location.",
    "example": {
      "location": "Houston"
    }
  }
]
```

* * *

### 🧭 Usage Instructions (add to `README.md`)

```md