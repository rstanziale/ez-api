# ez-api

A robust API development toolkit powered by [TypeSpec](https://typespec.io/), enabling seamless API design and generation.

## Overview

`ez-api` leverages Microsoft's TypeSpec to define and maintain consistent APIs across projects. This toolkit streamlines the API development workflow with powerful developer experience (DX) features.

## Features

- **TypeSpec Integration**: First-class support for Microsoft's TypeSpec specification language
- **Project Generation**: Quick scaffolding with predefined archetypes
- **Import OpenAPI Specs**: Import existing OpenAPI specifications into TypeSpec projects
- **OpenAPI Compliance**: Automatic generation of OpenAPI 3.0 specifications
- **Developer Tools**: Enhanced DX with built-in utilities

## Getting Started

### Prerequisites

- Node.js (v22 or higher)
- pnpm package manager (via Corepack, or install it with `npm install -g pnpm`)
- TypeSpec CLI (`pnpm add -g @typespec/compiler`)
- Visual Studio Code as editor
- Official TypeSpec VS Code extension

### Installation

```bash
pnpm install
```

### Quick Start

1. Create your first API project:

```bash
pnpm run api:new my-awesome-api
```

or import an existing OpenAPI specification:

```bash
pnpm run api:import my-awesome-api path/to/openapi.yaml
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
pnpm run build:my-awesome-api
```

### Project Commands

- `api:import` to import existing OpenAPI specifications into a new TypeSpec project
- `api:new` to create a new API project using a predefined archetype
- `build:all` to compile all registered projects
- `build:<YOUR_PROJECT>` to compile a single project
- `watch:<YOUR_PROJECT>` to watch and recompile a single project

### Project Structure

```bash
ez-api/
├── dist/
│   └── api-<PROJECT>/
│       ├── api-<VERSION>.yaml     # OpenAPI spec (YAML)
│       └── api-<VERSION>.json     # OpenAPI spec (JSON)
├── doc/
│   └── api-<PROJECT>/
│       ├── api-<PROJECT>-x.y.z.yaml   # Development version (YAML)
│       └── api-<PROJECT>-x.y.z.json   # Development version (JSON)
├── ext/
│   └── <ext-name>.tsp             # TypeSpec extension file
├── projects/
│   └── <PROJECT>/
│       ├── model/                 # Model definitions
│       ├── routes/                # API routes
│       ├── config.json            # Project configuration
│       ├── main.tsp               # Main TypeSpec file
│       └── tspconfig.yaml         # TypeSpec configuration
├── tools/
│   ├── api-import.ts              # Custom project generator for importing OpenAPI specs
│   ├── api-new.ts                 # Custom project generator based on the archetype
│   ├── build.ts                   # Custom build script
│   └── runner.ts                  # Custom task runner for executing commands
└── package.json
```

### Development Workflow

1. Define your API using TypeSpec in the `projects/<YOUR_PROJECT>` directory
2. Use built-in TypeSpec decorators for API customization
3. Run the `build:<YOUR_PROJECT>` command to generate OpenAPI specifications
4. Validate generated specifications with your preferred OpenAPI tools

### Best Practices

1. Keep models and operations in separate directories
2. Use TypeSpec's built-in validation features
3. Maintain consistent naming conventions
4. Document your APIs thoroughly using TypeSpec comments

### Generated Artifacts

During development, TypeSpec emits files into `doc/api-<PROJECT>` using the placeholder pattern `api-<PROJECT>-x.y.z.yaml` and `api-<PROJECT>-x.y.z.json`.
After the post-build step, those files are copied into `dist/api-<PROJECT>` and renamed with the version from the project's configuration, for example `api-1.0.0-beta.1.yaml` and `api-1.0.0-beta.1.json`.

These files are fully compatible with any OpenAPI tooling and can be used for:

- API documentation
- API testing
