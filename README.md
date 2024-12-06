# ez-api

A robust API development toolkit powered by [TypeSpec](https://typespec.io/), enabling seamless API design and generation.

## Overview

ez-api leverages Microsoft's TypeSpec to define and maintain consistent APIs across projects. This toolkit streamlines the API development workflow with powerful developer experience (DX) features.

## Features

- **TypeSpec Integration**: First-class support for Microsoft's TypeSpec specification language
- **Project Generation**: Quick scaffolding with predefined archetypes
- **OpenAPI Compliance**: Automatic generation of OpenAPI 3.0 specifications
- **Developer Tools**: Enhanced DX with built-in utilities

## Getting Started

### Prerequisites

- Node.js (v20 or higher)
- TypeSpec CLI (`npm install -g @typespec/compiler`)
- Visual Studio Code as editor
- Official TypeSpec VSCode extension
- Prettier extension for VSCode (optional)

### Installation

```bash
npm install
```

### Quick Start

1. In `package.json`, edit the `api:new` script by adding the name of your project (_my-awesome-api_), then run:

```bash
npm run api:new
```

2. Customize project settings in `config.json`:

```json
{
    "filename": "api-my-awesome-api",
    "version": "1.0.0-beta.1"
}
```

3. Build OpenAPI specifications:

```bash
npm run compile:my-awesome-api
```

### Project Commands

- `api-new` to creates a new API project using predefined archetypes
- `postbuild` to generates OpenAPI specification files in both YAML and JSON formats

### Project Structure

```bash
ez-api/
├── dist/
│   └── my-awesome-api/
│       ├── api-1.0.0-beta.1.yaml   # OpenAPI spec (YAML)
│       └── api-1.0.0-beta.1.json   # OpenAPI spec (JSON)
├── doc/
│   └── my-awesome-api/
│       ├── api-x.y.z.yaml          # Development version (YAML)
│       └── api-x.y.z.json          # Development version (JSON)
├── ext/
│   └── <ext-name>.tsp              # TypeSpec extension file
├── projects/
│   └── my-awesome-api/
│       ├── model/                  # Model definitions
│       ├── routes/                 # API routes
│       ├── config.json             # Project configuration
│       ├── main.tsp                # Main TypeSpec file
│       ├── tspconfig-json.yaml     # TypeSpec configuration for JSON
│       └── tspconfig-yaml.yaml     # TypeSpec configuration for YAML
├── tools/
│   ├── api-new.ts                  # Custom project generator according archetype
│   └── postbuild.ts                # Custom build script
└── package.json
```

### Development Workflow

1. Define your API using TypeSpec in the `projects/<YOUR_PROJECT>` directory
2. Use built-in TypeSpec decorators for API customization
3. Run the `compile:<YOUR_PROJECT>` command to generate OpenAPI specifications
4. Validate generated specifications with your preferred OpenAPI tools

### Best Practices

1. Keep models and operations in separate directories
2. Use TypeSpec's built-in validation features
3. Maintain consistent naming conventions
4. Document your APIs thoroughly using TypeSpec comments

### Generated Artifacts

After running the `compile:<YOUR_PROJECT>` command, you'll find:

- `api-<YOUR_PROJECT>-<VERSION>.yaml`: OpenAPI 3.0 specification in YAML format
- `api-<YOUR_PROJECT>-<VERSION>.json`: OpenAPI 3.0 specification in JSON format

These files are fully compatible with any OpenAPI tooling and can be used for:

- API documentation
- API testing