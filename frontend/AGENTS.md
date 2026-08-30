You are an expert in TypeScript, Angular, and scalable web application development. You write functional, maintainable, performant, and accessible code following Angular and TypeScript best practices.

## TypeScript Best Practices

- Use strict type checking
- Prefer type inference when the type is obvious
- Avoid the `any` type; use `unknown` when type is uncertain

## Angular Best Practices

- Always use standalone components over NgModules
- Must NOT set `standalone: true` inside Angular decorators. It's the default in Angular v20+.
- Do NOT set `changeDetection: ChangeDetectionStrategy.OnPush` explicitly. `OnPush` is the default in Angular v22+.
- Use signals for state management
- Implement lazy loading for feature routes
- Do NOT use the `@HostBinding` and `@HostListener` decorators. Put host bindings inside the `host` object of the `@Component` or `@Directive` decorator instead
- Use `NgOptimizedImage` for all static images.
  - `NgOptimizedImage` does not work for inline base64 images.

## Accessibility Requirements

- It MUST pass all AXE checks.
- It MUST follow all WCAG AA minimums, including focus management, color contrast, and ARIA attributes.

### Components

- Keep components small and focused on a single responsibility
- Use `input()` and `output()` functions instead of decorators
- Use `model()` for two-way bound properties with `[(prop)]` syntax instead of pairing `input()` with `output()`
- Use `computed()` for derived state
- Use `linkedSignal()` for state derived from multiple reactive sources that must stay synchronized
- Prefer inline templates for small components
- Prefer Signal Forms (`@angular/forms/signals`) for new forms. They are stable in Angular v22+ and provide signal-based state, type-safe field access, and schema-based validation
- When not using Signal Forms, prefer Reactive forms instead of Template-driven ones
- Do NOT use `ngClass`, use `class` bindings instead
- Do NOT use `ngStyle`, use `style` bindings instead
- When using external templates/styles, use paths relative to the component TS file.

## State Management

- Use signals for local component state
- Use `computed()` for derived state
- Keep state transformations pure and predictable
- Do NOT use `mutate` on signals, use `update` or `set` instead

## Templates

- Keep templates simple and avoid complex logic
- Use native control flow (`@if`, `@for`, `@switch`) instead of `*ngIf`, `*ngFor`, `*ngSwitch`
- Use the async pipe to handle observables
- Do not assume globals like (`new Date()`) are available.

## Services

- Design services around a single responsibility
- Use the `providedIn: 'root'` option for singleton services
- Prefer the `@Service` decorator over `@Injectable({providedIn: 'root'})` for new singleton services (Angular v22+)
- Use the `inject()` function instead of constructor injection

## Project Context & Styling Guidelines

- **Project Tech Stack:** Spring Boot (Backend), Angular Zoneless (Frontend), Tailwind CSS (Styling), PostgreSQL.
- **Styling Preference:**
  - Strictly use **Tailwind CSS** utility classes for all component styling.
  - Do NOT write custom CSS/SCSS files unless defining global CSS variables or complex animations in `src/styles.css`.
  - Do NOT use `@apply` directives inside individual component CSS; apply Tailwind classes directly in `template`.
  - Use `class` bindings for conditional classes (e.g., `[class.bg-blue-500]="isActive()"`).

## API & Backend Integration

- Base API URL is configured for Spring Boot (`http://localhost:8080/api`).
- Use `provideHttpClient()` in `app.config.ts` for HTTP operations.
- Always use Angular Signals for handling async HTTP responses directly inside services or components.
- Strongly type all API response interfaces inside feature-specific model files (e.g., `product.model.ts`).

## Zoneless & Architecture Rules

- The application runs in **Zoneless** mode using `provideZonelessChangeDetection()`.
- Do NOT rely on automatic zone-based change detection or `Zone.js`.
- Always trigger state updates via `signal.set()`, `signal.update()`, or `linkedSignal()`.
- Structure the project using **Feature-driven architecture**: Place components, services, and models inside `src/app/features/<feature-name>/`.