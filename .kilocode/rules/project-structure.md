# Project Structure

This project is a monorepo managed by [moonrepo](https://moonrepo.dev/).

## Directory Layout

- **apps/**: Contains application source code.
  - **web/**: A React application built with Vite and TypeScript.
  - **action/**: Reserved for action-related code (currently empty).

- **.moon/**: Configuration files for the moonrepo workspace manager.

- **.kilocode/**: Contains project-specific rules, settings, and documentation for the Kilo Code environment.
  - **rules/**: Markdown files defining project rules (branching, code style, structure).

- **.agent/**: Directory for agent-specific data or configuration.

## Key Files

- **.moon/workspace.yml**: Defines the workspace structure and projects.
- **apps/web/package.json**: Dependency and script definitions for the web application.
