# ioBroker template component for Admin
This component is used for admin setting.

## How to use
Build process creates files in directory build.

All files from `admin/custom` folder must be in adapter admin directory. 

To use this component in admin, add to `jsonConfig.json` file:
```
    "myCustomAttribute": {
      "type": "custom",
      "i18n": true,
      "url": "custom/customComponents.js",
      "name": "AdminComponentTemplateSet/Components/ExampleComponent"
    }
```

Explanation: 
- `AdminComponentTemplateSet` - is unique name of this set of components (see in `src/modulefederation.config.js => name (line 14)`). It is suggested to use adapter name for it. 
- `Components` - file name where all components are (`src/Components.jsx`)
- `ExampleComponent` - name of component in `Components.js`which must be used.
- `i18n` - if set to `true`, so the admin will load language files from `i18n`directory (in the same directory, where `customComponents.js` is), if set to language object, it will be used directly. Example: `{"easyconfig_text": {"en": "Text"}}`.

## Development
Start in `src`:

`npm run start` 

<!--
	### **WORK IN PROGRESS**
-->
## Changelog
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

Copyright (c) 2022-2024 bluefox <dogafox@gmail.com>

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
