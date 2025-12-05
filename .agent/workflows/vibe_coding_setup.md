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
  1. **Branching**: Create a new branch (`feature/xyz` or `fix/xyz`) - **NEVER commit to main directly**.
  2. Plan features.
  3. Build foundation (styles, tokens).
  4. Create components.
  5. Assemble pages.
  6. Polish (animations, transitions).
  7. **Finalize**: Commit changes and open a Pull Request (PR).

## 4. Setup Verification
To verify the setup:
1. Ensure `mise` is installed.
2. Run `mise install`.
3. Run `moon setup` or `moon ci` to verify toolchain.
4. Check `apps/web` and `apps/action` exist.
