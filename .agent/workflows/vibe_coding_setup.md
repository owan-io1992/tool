---
description: Vibe Coding Setup and Rules
---

# Vibe Coding Rules & Setup

This project follows the "Vibe Coding" methodology.

## 1. Runtime & Monorepo Management
- **Runtime**: Managed by `mise`.
  - Configuration: `mise.toml`
  - Tools: `node`, `moonrepo`
- **Monorepo**: Managed by `moon`.
  - Configuration: `.moon/workspace.yml`, `.moon/toolchain.yml`

## 2. Project Structure
- `apps/action`: GitHub Action (TypeScript)
- `apps/web`: Web Application (React + TypeScript)

## 3. Development Guidelines
- **Aesthetics**: Prioritize rich aesthetics, modern typography, and dynamic animations.
- **Code Quality**: Use TypeScript for type safety.
- **Workflow**:
  1. Plan features.
  2. Build foundation (styles, tokens).
  3. Create components.
  4. Assemble pages.
  5. Polish (animations, transitions).

## 4. Setup Verification
To verify the setup:
1. Ensure `mise` is installed.
2. Run `mise install`.
3. Run `moon setup` or `moon ci` to verify toolchain.
4. Check `apps/web` and `apps/action` exist.
