# Aster Design System — Core Design & Engineering Principles

Aster exists to make digital interface design and implementation coherent, accessible, understandable, and maintainable for both human teams and AI coding agents.

Aster is engineered around a foundational premise: **one authoritative source of truth with two complementary interfaces**:
1. **Human Interface:** Clear, interactive documentation for designers and developers that teaches how to use components, provides rationale, and details geometry.
2. **Agent Interface:** Structured, machine-readable token models and component contracts (`AGENTS.md`, `skills/`) that enable AI assistants to write valid, accessible code without inventing conventions.

---

## The Ten Core Principles

### 1. Understand Before Solving
Identify the user need, context, constraints, and success criteria before writing code or assembling components. Do not jump to implementation without understanding the interaction requirements.

### 2. Purpose Before Appearance
Visual and interaction design must serve function, convey hierarchy, and communicate state. Visual polish is not a substitute for clarity, usability, or accessibility.

### 3. Evidence Before Certainty
Distinguish verified facts from hypotheses. Never claim an accessibility standard is met or that a test passed without running the verification tools and observing the result.

### 4. Accessibility is Foundational
Accessibility is not a post-launch audit; it is a core constraint.
- Token pairings must achieve WCAG 2.2 AA mathematical contrast ratios (4.5:1 for body text, 3:1 for graphical UI elements).
- Controls must provide touch targets of at least 40px/44px, comfortably exceeding the 24×24px WCAG SC 2.5.8 minimum.
- All interactive elements must support keyboard navigation (`Tab`, `Space`, `Enter`, `Escape`, arrow keys) with clear `:focus-visible` styling.
- All dynamic motion must collapse under `@media (prefers-reduced-motion: reduce)`.

### 5. Consistency Enables Confidence
Reuse established design tokens and canonical components. Introduce new tokens or style overrides only when a clear, documented requirement justifies an exception.

### 6. Simplicity is Earned
Prefer the simplest solution that meets all requirements. Avoid unnecessary dependencies, wrappers, or runtime abstractions.

### 7. Explicit Decision Records
Document consequential architectural and design decisions. Maintain clear decision logs (ADRs) that explain what was chosen, why it was chosen, what alternatives were considered, and what trade-offs were made.

### 8. Respectful Synthesis & Clear Attribution
Learn from industry-leading design systems without copying their identity wholesale. When adopting external patterns, visual mechanics, or foundations (such as Shade-DS interaction kinetics or Phosphor iconography), obtain explicit permission and clearly document third-party attribution.

### 9. Continuous Quality Verification
A design system is only as good as its contracts. Continually validate design token outputs, component CSS/JS compilation, Figma variable schemas, documentation synchronization, and real-browser interactions.

### 10. Truthful Documentation
Never present an assumption as a verified fact. Disclose what has been tested and what requires contextual evaluation in consumer applications.
