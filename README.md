# Tool Monorepo

This is a monorepo for various tools, managed by [moon](https://moonrepo.dev/) and [mise](https://mise.jdx.dev/).

## Project Structure

- **`apps/action`**: GitHub Action (TypeScript)
- **`apps/web`**: Web Application (React + TypeScript)

## Getting Started

### Prerequisites

- [mise](https://mise.jdx.dev/) must be installed.

### Setup

1.  Install dependencies and tools:
    ```bash
    mise install
    ```

2.  Verify setup:
    ```bash
    moon setup
    ```

## Development Workflow

### Branching Strategy

**Strict Rule:** Direct commits to `main` are prohibited for features.

1.  **Create a Branch**: Always create a new branch for your task.
    ```bash
    git checkout -b feature/your-feature-name
    ```
2.  **Develop**: Make your changes and commit them.
3.  **Pull Request**: Push your branch and create a Pull Request (PR) for review.

### Running Projects

- **Web App**:
  ```bash
  moon run web:dev
  ```
- **Action**:
  ```bash
  moon run action:build
  ```