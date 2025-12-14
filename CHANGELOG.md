# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Changed
- Standardized page title styling across all tools (Home, Epoch Converter, CIDR Calculator, Password Generator) for consistency (left-aligned, default Mantine styling).
- Refactored `PasswordGenerator` layout to use standard Mantine components (`Grid`, `Paper`) to fix dark mode background issues and improve responsiveness.
- Enhanced "Current Unix Time" display in `EpochConverter` to be larger and bolder for better readability.

### Removed
- Removed the "Password Leak" page and associated routes to streamline the password tools.

### Fixed
- Fixed layout issues in Password Generator where title was centered and background was white in dark mode.
- Fixed missing component imports in Password Generator.
