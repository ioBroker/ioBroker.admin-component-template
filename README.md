# ioBroker template component for Admin
This component is used for admin setting.

## How to use
Build process creates files in directory build.

All files from `admin/custom` folder must be in adapter admin directory. 

To use this component in admin, add to `jsonConfig.json` file:
```json5
    "myCustomAttribute": {
      "type": "custom",
      "i18n": true,
      "url": "custom/customComponents.js",
      "name": "AdminComponentTemplateSet/Components/ExampleComponent",
      "guiApi": 2 // Built against @iobroker/gui-components (React 19 / MUI 9)
    }
```

Explanation: 
- `AdminComponentTemplateSet` - is unique name of this set of components (see in `src/vite.config.ts => name (line 12)`). It is suggested to use adapter name for it. 
- `Components` - file name where all components are (`src/Components.tsx`)
- `ExampleComponent` - name of component in `Components.tsx`which must be used.
- `i18n` - if set to `true`, so the admin will load language files from `i18n`directory (in the same directory, where `customComponents.js` is), if set to a language object, it will be used directly. Example: `{"easyconfig_text": {"en": "Text"}}`.
- `guiApi` - generation of the GUI API this component was built against.

### GUI API generation

The admin shares React, MUI and the ioBroker component libraries with every custom component as
module federation singletons, so there is exactly one version of each at runtime. A component built
against an older generation would therefore be handed APIs it was never compiled for.

`guiApi` declares which generation this component expects, so the admin can refuse to start an
incompatible one instead of crashing while rendering it:

| `guiApi`       | Component library                     | React / MUI      |
|----------------|---------------------------------------|------------------|
| `2`            | `@iobroker/gui-components`            | React 19 / MUI 9 |
| omitted or `1` | `@iobroker/adapter-react-v5` (legacy) | React 18 / MUI 6 |

This template is built against generation `2`. Keep `guiApi` in sync with the component library in
`src-admin/package.json` - see the migration guide below.

## Migrating a component from Admin 7 to Admin 8

Admin 8 replaces the component library and moves the whole GUI stack forward:

|                          | Admin 7                          | Admin 8                       |
|--------------------------|----------------------------------|-------------------------------|
| Component library        | `@iobroker/adapter-react-v5` ^7  | `@iobroker/gui-components` ^10 |
| React                    | 18                               | 19                            |
| MUI                      | 6                                | 9                             |
| `@iobroker/json-config`  | ^7                               | ^9                            |
| vite                     | 6                                | 8                             |
| `@module-federation/vite`| ^1.2                             | ^1.19                         |
| `guiApi`                 | omitted (= 1)                    | `2`                           |

There is no compatibility mode: admin shares React, MUI and the ioBroker libraries as federation
singletons, so a component built against generation 1 would be handed APIs it was never compiled
for. Admin 8 refuses to start it instead of crashing while rendering.

The steps below are exactly what this template went through - use its sources as the reference.

### 1. Update the dependencies

In `src-admin/package.json`:

```jsonc
{
    "devDependencies": {
        // replaced
        "@iobroker/gui-components": "^10.0.5",   // was @iobroker/adapter-react-v5 ^7.x
        "@iobroker/json-config": "^9.0.8",       // was ^7.x
        "@mui/material": "^9.2.0",               // was ^6.x
        "@mui/icons-material": "^9.2.0",         // was ^6.x
        "react": "^19.2.8",                      // was ^18.x
        "react-dom": "^19.2.8",                  // was ^18.x
        "@types/react": "^19.2.17",              // was ^18.x
        "@types/react-dom": "^19.2.3",           // was ^18.x
        "@module-federation/runtime": "^2.8.0",  // was ^0.11.x
        "@module-federation/vite": "^1.19.1",    // was ^1.2.x
        "@vitejs/plugin-react": "^6.0.4",        // was ^4.x
        "vite": "^8.1.5"                         // was 6.x
        // removed: "vite-tsconfig-paths" - vite 8 resolves tsconfig paths itself
    }
}
```

### 2. Rename the imports

Every `@iobroker/adapter-react-v5` import becomes `@iobroker/gui-components`. The exported names did
not change, so this is a pure find-and-replace:

```ts
// before
import { ColorPicker, GenericApp, Loader } from '@iobroker/adapter-react-v5';
// after
import { ColorPicker, GenericApp, Loader } from '@iobroker/gui-components';
```

### 3. Adjust `src-admin/vite.config.ts`

```diff
 import react from '@vitejs/plugin-react';
 import commonjs from 'vite-plugin-commonjs';
-import vitetsConfigPaths from 'vite-tsconfig-paths';
 import { federation } from '@module-federation/vite';
-import { moduleFederationShared } from '@iobroker/adapter-react-v5/modulefederation.admin.config';
+import { moduleFederationShared } from '@iobroker/gui-components/modulefederation.admin.config';

         react(),
-        vitetsConfigPaths(),
         commonjs(),
     ],
+    resolve: {
+        tsconfigPaths: true,
+    },
```

While you are in this file, make sure `federation({ name: ... })` is **unique for your component**
and matches the first segment of `name` in `jsonConfig.json`. Two components sharing a federation
name collide at runtime.

### 4. Adjust `admin/jsonConfig.json`

```diff
     "myCustomAttribute": {
       "type": "custom",
       "i18n": true,
       "url": "custom/customComponents.js",
       "name": "MyComponentSet/Components/ExampleComponent",
-      "bundlerType": "module"
+      "guiApi": 2
     }
```

`bundlerType` is deprecated and ignored - generation 2 components are always ES modules. Leaving it
in place does no harm.

### 5. Adjust `src-admin/tsconfig.json`

Vite 8 resolves through the `exports` map, so the TypeScript settings have to match:

```jsonc
{
    "compilerOptions": {
        "module": "ESNext",
        "moduleResolution": "Bundler",
        "jsx": "react-jsx"
    }
}
```

`module` and `moduleResolution` must be changed together - `Bundler` resolution is only valid with
an ESM module kind.

### 6. Delete `src-admin/localSharedImportMap.js`

Older templates carried a checked-in shared import map. The current federation plugin generates it,
so delete the file if your component still has one.

### 7. Fix the code-level breaking changes

**`ConfigGeneric.componentDidMount` is async now.** If you override it, await the base class:

```diff
-    componentDidMount(): void {
-        super.componentDidMount();
+    async componentDidMount(): Promise<void> {
+        await super.componentDidMount();
```

**MUI 9 has only one `Grid`.** `Grid2` is gone (it was renamed to `Grid`), and the legacy `Grid` API
was removed without a `GridLegacy` fallback:

```diff
-import { Grid2 as Grid } from '@mui/material';
+import { Grid } from '@mui/material';

-<Grid item xs={12} md={6}>
+<Grid size={{ xs: 12, md: 6 }}>
```

Some layout props moved into `sx` on `Grid` and `Stack`:

```diff
-<Stack spacing={1} alignItems="center">
+<Stack spacing={1} sx={{ alignItems: 'center' }}>
```

**React 19 changed the ref typings.** `useRef<T>(null)` now returns `RefObject<T | null>`, and
`LegacyRef` no longer exists. Where a MUI component wants `RefObject<T>`, either widen the ref type
or pass a callback ref. Class components are unaffected.

**If your component has its own entry point** (`src-admin/src/index.tsx` for the standalone dev app),
React 19 removed `ReactDOM.render`:

```diff
-ReactDOM.render(<App />, document.getElementById('root'));
+createRoot(document.getElementById('root')).render(<App />);
```

### 8. Expect new lint errors

`@iobroker/eslint-config` now ships `eslint-plugin-react-hooks` v7 with the React Compiler rules.
Three of them regularly fire on code that was fine before, and they flag genuine problems:

- `react-hooks/immutability` - mutating props or an outer variable while rendering. Build a new
  object instead of patching the one you were given.
- `react-hooks/set-state-in-effect` - an effect that only derives state from props. Compute the
  value while rendering (`useMemo`) or move it into the event handler that causes the change.
- `react-hooks/refs` - touching a ref during render. Typical case is react-dnd; move the connector
  calls into a `useEffect`.

### 9. Rebuild - and rebuild again after every library update

A custom component bundles its own copy of `@iobroker/gui-components` as a fallback, so **a stale
build keeps using stale library code even though admin provides a newer one**. The most visible
symptom is untranslated labels: the component renders raw keys such as `custom_easy_Instance`
instead of the text, because its bundled copy carries an empty translation dictionary.

Always rebuild the component against the `@iobroker/gui-components` version the target admin ships,
and release it together with the library update.

### 10. Verify

```bash
cd src-admin && npm i && npm run build
```

Then open the instance configuration in admin and check that

- the component renders at all (if not, the GUI API gate logs why in the browser console),
- its labels are translated,
- the browser console shows no `Translate: <key>` warnings for your keys.

## Development
Start in `src`:

`npm run start` 

<!--
	### **WORK IN PROGRESS**
-->
## Changelog
### 3.0.5 (2026-07-27)
* (bluefox) Breaking: React19 + MUI 9
* (bluefox) Breaking: guiApi = 2

### 2.0.0 (2025-03-19)
* (bluefox) Rewritten in TypeScript with vite

### 1.0.2 (2025-01-21)
* (bluefox) Updated example and packages

### 1.0.1 (2024-07-14)
* (bluefox) Changed for Admin 7

### 0.1.6 (2023-05-17)
* (bluefox) Updated packages

### 0.1.5 (2022-12-23)
* (bluefox) Corrected issue with the version of common packages
* (bluefox) Updated packages

### 0.1.0 (2022-05-26)
* (bluefox) Added map files

### 0.0.2 (2022-05-26)
* (bluefox) Added i18n

## License
The MIT License (MIT)

Copyright (c) 2022-2026 bluefox <dogafox@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
