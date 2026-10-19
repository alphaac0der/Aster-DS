# Aster Design System — Framework Integration Guidance

Aster is a browser-native design system built on standard HTML5 semantics, CSS custom properties, and vanilla ES modules. It does not ship proprietary React, Vue, or Svelte component wrappers; instead, it is designed for direct integration into any framework by leveraging standard DOM markup and event delegation.

> [!NOTE]
> Aster is available as the `aster-ds` package on npm. Examples below demonstrate how to integrate Aster using `aster-ds`, local workspace references (e.g. `file:../Aster-DS`), monorepo path aliases, or bundled static asset copies.

---

## 1. Architectural Model & Event Delegation

Aster behaviors (such as pointer-origin hover tracking on buttons, floating error labels on inputs, sort-cycling on tables, modal management, and keyboard tabs) are orchestrated via **event delegation** through the `initAsterComponents(root, options)` entry point:

- **Root Scoping:** By default, passing `document` attaches delegated listeners to the document root. You can also pass a specific DOM element (e.g. `containerRef.current`) to limit event listeners to a specific component subtree.
- **Idempotency:** Aster's initializers are idempotent. If called multiple times on the same root, duplicate listeners are guarded against.
- **Framework Reactivity:** Frameworks manage virtual DOM updates and state changes. Aster provides standard CSS classes (`.as-button`, `.as-input`, `.as-table`) that style native HTML elements without interfering with framework reactivity (`v-model`, `value`/`onChange`, `bind:value`).

---

## 2. Vanilla HTML & JavaScript Integration

### Quickstart

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Aster Vanilla Integration</title>

  <!-- 1. Load Aster All-in-One Stylesheet -->
  <link rel="stylesheet" href="/dist/css/aster.css">
</head>
<body>
  <main style="padding: 32px; max-width: 640px; margin: 0 auto;">
    <!-- Button with Shade-DS pointer-origin hover animation -->
    <button type="button" class="as-button as-button--primary" id="btn-deploy">
      <span class="as-button__label">Deploy Service</span>
    </button>

    <!-- Accessible Form Field -->
    <div class="as-form-field" style="margin-top: 24px;">
      <label class="as-label" for="txt-cluster">Cluster Identifier</label>
      <div class="as-input-box">
        <input type="text" class="as-input" id="txt-cluster" placeholder="acme-prod-01">
      </div>
    </div>
  </main>

  <!-- 2. Import and Initialize Aster Behaviors -->
  <script type="module">
    import { initAsterComponents, setButtonLoading } from '/dist/js/aster.js';

    // Initialize all 21 Aster component behaviors on document
    initAsterComponents(document);

    // Using programmatic helpers
    const btn = document.getElementById('btn-deploy');
    btn.addEventListener('click', () => {
      setButtonLoading(btn, true, 'Deploying...');
      setTimeout(() => {
        setButtonLoading(btn, false);
      }, 2000);
    });
  </script>
</body>
</html>
```

---

## 3. React Integration

*(Tested against React 18 / 19 patterns; illustrated for consumer projects)*

In React applications (Vite, Next.js, Create React App), Aster's CSS is imported globally, and `initAsterComponents` is invoked once upon application mount.

### Step 1: Global CSS Import
In your top-level layout or application root (`App.jsx`, `main.jsx`, or Next.js `app/layout.jsx`):

```jsx
// Import the all-in-one stylesheet or individual token/component bundles
import 'aster-ds/aster.css';
```

### Step 2: Top-Level Provider or Layout Initialization
Initialize Aster once in your root component:

```jsx
import React, { useEffect } from 'react';
import { initAsterComponents } from 'aster-ds';

export function AsterProvider({ children }) {
  useEffect(() => {
    // Attach delegated listeners to document root once on mount
    initAsterComponents(document);
  }, []);

  return <>{children}</>;
}
```

### Step 3: Composing React Components with Aster Classes
Use native HTML elements styled with Aster classes. Standard React event handlers (`onClick`, `onChange`) operate alongside Aster's CSS and micro-interactions:

```jsx
import React, { useState, useRef } from 'react';
import { setButtonLoading } from 'aster-ds';

export function DeploymentCard() {
  const [clusterName, setClusterName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const buttonRef = useRef(null);

  const handleDeploy = async () => {
    if (!buttonRef.current) return;
    setIsLoading(true);
    setButtonLoading(buttonRef.current, true, 'Provisioning...');

    try {
      // Perform deployment API call
      await new Promise((r) => setTimeout(r, 1500));
    } finally {
      setIsLoading(false);
      setButtonLoading(buttonRef.current, false);
    }
  };

  return (
    <div className="as-form-field" style={{ maxWidth: 400 }}>
      <label className="as-label" htmlFor="cluster-input">
        Cluster Name
      </label>
      <div className="as-input-box">
        <input
          id="cluster-input"
          className="as-input"
          type="text"
          value={clusterName}
          onChange={(e) => setClusterName(e.target.value)}
          placeholder="e.g. us-east-prod"
        />
      </div>

      <button
        ref={buttonRef}
        type="button"
        className="as-button as-button--primary"
        style={{ marginTop: 16 }}
        onClick={handleDeploy}
      >
        <span className="as-button__label">Deploy Cluster</span>
      </button>
    </div>
  );
}
```

> [!TIP]
> **Subtree Isolation in React:** If you prefer not to attach delegated listeners to `document`, you can pass a container ref:
> ```jsx
> const containerRef = useRef(null);
> useEffect(() => {
>   if (containerRef.current) {
>     initAsterComponents(containerRef.current);
>   }
> }, []);
> ```

---

## 4. Vue Integration

*(Tested against Vue 3 Composition API patterns; illustrated for consumer projects)*

### Step 1: Global CSS Import
In your `main.js` or `main.ts`:

```javascript
import { createApp } from 'vue';
import App from './App.vue';

// Import Aster styles
import 'aster-ds/aster.css';

const app = createApp(App);
app.mount('#app');
```

### Step 2: Component Implementation with Vue 3 `onMounted`

```vue
<script setup>
import { ref, onMounted } from 'vue';
import { initAsterComponents, setButtonLoading } from 'aster-ds';

const cluster = ref('eu-central-1');
const deployBtn = ref(null);
const dialogRef = ref(null);

onMounted(() => {
  // Initialize Aster delegated interactions once
  initAsterComponents(document);
});

function openConfirmation() {
  dialogRef.value?.showModal();
}

function closeConfirmation() {
  dialogRef.value?.close();
}

async function executeDeploy() {
  setButtonLoading(deployBtn.value, true, 'Deploying...');
  closeConfirmation();
  setTimeout(() => {
    setButtonLoading(deployBtn.value, false);
  }, 1800);
}
</script>

<template>
  <div style="padding: 24px; max-width: 500px;">
    <!-- Form Field with Vue v-model -->
    <div class="as-form-field">
      <label class="as-label" for="vue-cluster">Active Region</label>
      <div class="as-select-box">
        <select id="vue-cluster" class="as-select" v-model="cluster">
          <option value="us-east-1">us-east-1 (N. Virginia)</option>
          <option value="eu-central-1">eu-central-1 (Frankfurt)</option>
          <option value="ap-southeast-1">ap-southeast-1 (Singapore)</option>
        </select>
      </div>
    </div>

    <!-- Trigger Button -->
    <button
      ref="deployBtn"
      type="button"
      class="as-button as-button--primary"
      style="margin-top: 16px;"
      @click="openConfirmation"
    >
      <span class="as-button__label">Confirm Deployment</span>
    </button>

    <!-- Native Accessible Dialog -->
    <dialog ref="dialogRef" class="as-dialog" aria-labelledby="dlg-title">
      <div class="as-dialog__surface">
        <div class="as-dialog__header">
          <h3 id="dlg-title" class="as-dialog__title">Confirm Rollout</h3>
          <button type="button" class="as-dialog__close" aria-label="Close" @click="closeConfirmation">✕</button>
        </div>
        <div class="as-dialog__body">
          <p>Deploying workloads to region: <strong>{{ cluster }}</strong>.</p>
        </div>
        <div class="as-dialog__footer">
          <button type="button" class="as-button as-button--secondary" @click="closeConfirmation">Cancel</button>
          <button type="button" class="as-button as-button--primary" @click="executeDeploy">Proceed</button>
        </div>
      </div>
    </dialog>
  </div>
</template>
```

---

## 5. Svelte Integration

*(Tested against Svelte 4 / Svelte 5 patterns; illustrated for consumer projects)*

Svelte provides an idiomatic **action directive** pattern (`use:action`) that pairs cleanly with Aster's DOM initializers.

### Svelte Action Directive Pattern

```svelte
<script>
  import 'aster-ds/aster.css';
  import { initAsterComponents, setButtonLoading } from 'aster-ds';

  let selectedTab = 'metrics';
  let buttonEl;

  // Custom action that initializes Aster on the container node
  function aster(node) {
    initAsterComponents(node);
  }

  function handleSave() {
    setButtonLoading(buttonEl, true, 'Saving...');
    setTimeout(() => {
      setButtonLoading(buttonEl, false);
    }, 1500);
  }
</script>

<div use:aster style="padding: 24px; max-width: 600px;">
  <!-- Svelte Tabs Example -->
  <div class="as-tabs">
    <div class="as-tabs__list" role="tablist">
      <button
        type="button"
        class="as-tabs__tab"
        class:is-active={selectedTab === 'metrics'}
        role="tab"
        aria-selected={selectedTab === 'metrics'}
        on:click={() => selectedTab = 'metrics'}
      >
        Metrics
      </button>
      <button
        type="button"
        class="as-tabs__tab"
        class:is-active={selectedTab === 'logs'}
        role="tab"
        aria-selected={selectedTab === 'logs'}
        on:click={() => selectedTab = 'logs'}
      >
        Logs
      </button>
    </div>

    {#if selectedTab === 'metrics'}
      <div class="as-tabs__panel is-active" role="tabpanel">
        <p>Telemetry graphs and live load metrics.</p>
      </div>
    {:else}
      <div class="as-tabs__panel is-active" role="tabpanel">
        <p>Real-time audit log streaming.</p>
      </div>
    {/if}
  </div>

  <!-- Aster Button with Pointer Hover Tracking -->
  <button
    bind:this={buttonEl}
    type="button"
    class="as-button as-button--primary"
    style="margin-top: 16px;"
    on:click={handleSave}
  >
    <span class="as-button__label">Save Changes</span>
  </button>
</div>
```

---

## 6. Theme Switching Across Frameworks

Aster uses the `data-theme="dark"` HTML attribute on the root `<html>` or container element to switch between light and dark modes. Density is unified to a single standard scale across all devices to guarantee consistent touch ergonomics. Any framework state store (Redux, Zustand, Pinia, Svelte writable store) can manage the active theme via standard DOM attribute manipulation:

```javascript
// Toggle Dark Theme
function setTheme(isDark) {
  if (isDark) {
    document.documentElement.setAttribute('data-theme', 'dark');
  } else {
    document.documentElement.removeAttribute('data-theme');
  }
}
```

---

## 7. Framework Support Boundaries & Non-Goals

1. **No Proprietary Node Modules:** Aster does not distribute separate `@aster/react` or `@aster/vue` packages. This avoids maintenance overhead and framework version lock-in.
2. **Lifecycle Independence:** Because Aster uses standard browser APIs (`addEventListener`, `dataset`, `:focus-visible`), framework hydration mismatches and SSR hydration errors are avoided.
3. **Execution Disclaimer:** The code snippets in this guide demonstrate standard patterns for consuming Aster in consumer projects. Aster's own internal repository remains zero-dependency and does not bundle React, Vue, or Svelte toolchains.
