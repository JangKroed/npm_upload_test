# excel-validator

excel-validator is a Node.js library for processing Excel files and validating their contents based on a provided schema.

## Installation

```bash
npm install excel-validator
```

## Usage

```javascript

const { processExcel } = require('excel-validator');
const schema = require('./schema.json');

const file = 'path/to/uploaded/excel/file.xlsx';

const result = processExcel(file, schema);
console.log(result);

```

## Schema Definition
```json
{
  "name": {
    "type": "string",
    "required": true
  },
  "age": {
    "type": "number",
    "integer": true,
    "required": true
  },
  "email": {
    "type": "string",
    "email": true,
    "required": true
  }
}
```

## License
```
This project is licensed under the MIT License - see the LICENSE file for details.
```
