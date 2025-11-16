# React Knowledge Scope & Patterns Guide

## How to Use This Document with Code Generation Agents

This document is a **generic style & architecture guide** for small React + TypeScript applications.

When used as a prompt in tools (Codex CLI, Claude Code, etc.):

- Treat this file as a **pattern library and coding style guide**, not as a specification of a concrete "todo list" project.
- Always:
  - Choose a **domain, entities, UI and features** based on the current task or user request.
  - Apply the **same React + TypeScript patterns and architecture style** shown in this guide.
- Never:
  - Recreate the original educational app described in examples (todo list, same buttons, same filters, same entity names).
  - Copy the same domain objects (`Task`, `TodolistItem`, etc.) unless the user explicitly asks for a todo app.
- All code snippets below are **examples only**. When generating a new project, you must:
  - Use **different names, entities, and UI controls** suitable for the new subject area.
  - Keep only the **patterns and ideas** (state structure, handlers, immutable updates, etc.).

---

## About This Guide

This guide is based on an IT-INCUBATOR educational project and demonstrates fundamental React + TypeScript patterns.  
Use this as a **reference template** for building **any small React application** with consistent code style and architecture.

**Tech Stack (recommended baseline):**
- React 19.0.0 (Functional Components + Hooks)
- TypeScript 5.7.2
- Vite 6.0.6
- pnpm (package manager)

You may adjust versions and tooling when needed, but keep the patterns and simplicity level similar.

---

## Core React Knowledge Scope

### 1. State Management with useState

**Pattern: Multiple Independent State Variables**

Example from a simple list-based app (for a todo-like project):

```typescript
// Example: src/App.tsx
const [filter, setFilter] = useState<FilterValues>('all')
const [items, setItems] = useState<Item[]>([
  { id: v1(), title: 'HTML&CSS', isDone: true },
  { id: v1(), title: 'JS', isDone: true },
  { id: v1(), title: 'ReactJS', isDone: false },
])
````

When generating a new project:

* Replace `Item`, `FilterValues`, `isDone` with domain-specific names (e.g. `Product`, `CategoryFilter`, `isAvailable`), but keep:

    * `useState<...>` with explicit generics
    * separate state for independent concerns
    * array state for collections.

**Key Concepts:**

* Explicit TypeScript generics for type safety: `useState<FilterValues>`, `useState<Item[]>`
* Initial state with default values
* Separate state variables for independent concerns (e.g. filter vs data list)
* Array state for collections of data

**Pattern: Local Component State**

```typescript
// Example: src/ListWidget.tsx
const [itemTitle, setItemTitle] = useState('')
const [error, setError] = useState<string | null>(null)
```

**Key Concepts:**

* UI state managed in the component that owns it
* Nullable types for optional data: `string | null`
* String state for controlled input fields

---

### 2. TypeScript Type Definitions

**Pattern: Domain Types**

```typescript
// Example: src/App.tsx
export type Item = {
  id: string
  title: string
  isDone: boolean
}

export type FilterValues = 'all' | 'active' | 'completed'
```

When generating new apps, replace `Item` and `FilterValues` with appropriate names and literals, but keep:

* `type` for object shapes and unions
* exported types for sharing between components
* string literal unions for fixed sets of values.

**Key Concepts:**

* `type` keyword for object shapes and unions
* Export types that are shared across components
* String literal unions for fixed sets of values
* Descriptive property names (e.g. `isDone`, `isActive`, `isArchived`)

**Pattern: Component Props Interface**

```typescript
type Props = {
  title: string
  items: Item[]
  deleteItem: (itemId: string) => void
  changeFilter: (filter: FilterValues) => void
  createItem: (title: string) => void
  changeItemStatus: (itemId: string, isDone: boolean) => void
  filter: FilterValues
}
```

**Key Concepts:**

* Function types with explicit parameter names and `void` return type
* Group all props in a single `Props` type
* Reference domain types (Item, FilterValues)

---

### 3. Immutable State Updates

**Pattern: Array Filtering (Remove Item)**

```typescript
const deleteItem = (itemId: string) => {
  const filteredItems = items.filter(item => item.id !== itemId)
  setItems(filteredItems)
}
```

**Pattern: Array Prepending (Add Item)**

```typescript
const createItem = (title: string) => {
  const newItem = { id: v1(), title, isDone: false }
  const newItems = [newItem, ...items]
  setItems(newItems)
}
```

**Pattern: Array Mapping (Update Item)**

```typescript
const changeItemStatus = (itemId: string, isDone: boolean) => {
  const newState = items.map(item =>
    item.id === itemId ? { ...item, isDone } : item
  )
  setItems(newState)
}
```

**Key Concepts:**

* Never mutate state directly
* Use `.filter()` to remove items
* Use spread operator `[newItem, ...array]` to prepend
* Use `.map()` with object spread `{ ...item, isDone }` to update specific items
* Create new variables before calling `setState`

---

### 4. Event Handling Patterns

**Pattern: Callback Functions in Parent Component**

```typescript
const changeFilter = (filter: FilterValues) => {
  setFilter(filter)
}
```

**Pattern: Event Handlers Inside map() Loop**

```typescript
const deleteItemHandler = () => {
  deleteItem(item.id)
}

const changeItemStatusHandler = (e: ChangeEvent<HTMLInputElement>) => {
  const newStatusValue = e.currentTarget.checked
  changeItemStatus(item.id, newStatusValue)
}
```

**Pattern: Keyboard Event Handling**

```typescript
const createItemOnEnterHandler = (event: KeyboardEvent<HTMLInputElement>) => {
  if (event.key === 'Enter') {
    createItemHandler()
  }
}
```

**Key Concepts:**

* Define handlers inside component function
* Use specific event types: `ChangeEvent<HTMLInputElement>`, `KeyboardEvent<HTMLInputElement>`
* Create wrapper handlers inside `.map()` to capture loop variables
* Extract values before calling callbacks: `e.currentTarget.checked`
* Handler naming convention: `actionHandler` or `actionSubjectHandler`

---

### 5. Controlled Components

**Pattern: Input Field with Validation**

```typescript
const [itemTitle, setItemTitle] = useState('')
const [error, setError] = useState<string | null>(null)

const createItemHandler = () => {
  const trimmedTitle = itemTitle.trim()
  if (trimmedTitle !== '') {
    createItem(trimmedTitle)
    setItemTitle('')
  } else {
    setError('Title is required')
  }
}

const changeItemTitleHandler = (event: ChangeEvent<HTMLInputElement>) => {
  setItemTitle(event.currentTarget.value)
  setError(null)
}
```

**JSX:**

```tsx
<input
  className={error ? 'error' : ''}
  value={itemTitle}
  onChange={changeItemTitleHandler}
  onKeyDown={createItemOnEnterHandler}
/>
<Button title="+" onClick={createItemHandler} />
{error && <div className="error-message">{error}</div>}
```

**Key Concepts:**

* `value` prop bound to state
* `onChange` handler updates state
* Validation before submitting
* Clear input after successful submission
* Clear error on user input
* `.trim()` to prevent whitespace-only inputs

---

### 6. Conditional Rendering

**Pattern: Ternary Operator**

```tsx
<input className={error ? 'error' : ''} />
<li className={item.isDone ? 'is-done' : ''}>
```

**Pattern: Logical AND (&&)**

```tsx
{error && <div className="error-message">{error}</div>}
```

**Pattern: Conditional Content Blocks**

```tsx
{items.length === 0 ? (
  <p>No items</p>
) : (
  <ul>
    {items.map(item => {
      // ...
    })}
  </ul>
)}
```

**Key Concepts:**

* Ternary for className toggling: `condition ? 'class' : ''`
* `&&` for optional rendering
* Ternary for either/or rendering: `condition ? <A /> : <B />`
* Check array length before mapping

---

### 7. List Rendering

**Pattern: map() with Unique Keys**

```tsx
{items.map(item => {
  const deleteItemHandler = () => deleteItem(item.id)

  const changeItemStatusHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const newStatusValue = e.currentTarget.checked
    changeItemStatus(item.id, newStatusValue)
  }

  return (
    <li key={item.id} className={item.isDone ? 'is-done' : ''}>
      <input
        type="checkbox"
        checked={item.isDone}
        onChange={changeItemStatusHandler}
      />
      <span>{item.title}</span>
      <Button title="x" onClick={deleteItemHandler} />
    </li>
  )
})}
```

**Key Concepts:**

* Always provide `key` prop with a unique identifier
* Define handlers inside `.map()` to access current item
* Return JSX from `map` callback
* Use controlled checkbox: `checked={item.isDone}`
* Combine conditional styling with list items

---

### 8. Props Drilling Pattern

**Pattern: Pass State and Callbacks Down**

```tsx
return (
  <div className="app">
    <ListWidget
      title="Example list"
      items={filteredItems}
      deleteItem={deleteItem}
      changeFilter={changeFilter}
      createItem={createItem}
      changeItemStatus={changeItemStatus}
      filter={filter}
    />
  </div>
)
```

**Pattern: Props Destructuring**

```typescript
const {
  title,
  items,
  deleteItem,
  changeFilter,
  createItem,
  changeItemStatus,
  filter,
} = props
```

**Key Concepts:**

* Parent owns state, child receives via props
* Callbacks passed down for child-to-parent communication
* Destructure props for cleaner code
* Explicit prop passing (no prop spreading)

---

### 9. Computed Values (Derived State)

**Pattern: Filter Data Before Rendering**

```typescript
let filteredItems = items
if (filter === 'active') {
  filteredItems = items.filter(item => !item.isDone)
}
if (filter === 'completed') {
  filteredItems = items.filter(item => item.isDone)
}
```

**Key Concepts:**

* Compute derived data in component body (not in state)
* Use `let` for reassignable computed values
* Filter/transform before passing to child components
* Simple `if` statements for multiple conditions

---

### 10. Component Composition

**Pattern: Reusable UI Components**

```typescript
type ButtonProps = {
  title: string
  onClick?: () => void
  className?: string
}

export const Button = ({ title, onClick, className }: ButtonProps) => {
  return (
    <button className={className} onClick={onClick}>
      {title}
    </button>
  )
}
```

**Pattern: Using Reusable Components**

```tsx
<Button title="+" onClick={createItemHandler} />

<Button
  className={filter === 'all' ? 'active-filter' : ''}
  title="All"
  onClick={() => changeFilter('all')}
/>
```

**Key Concepts:**

* Optional props with `?`
* Destructure props in function parameters
* Single-responsibility components
* Inline arrow functions for callbacks with arguments

---

## Naming Conventions

### Functions

* State setters: `setItemTitle`, `setError`, `setFilter`
* Event handlers: `createItemHandler`, `changeItemTitleHandler`, `deleteItemHandler`
* Business logic: `deleteItem`, `createItem`, `changeItemStatus`, `changeFilter`

### Components

* PascalCase: `App`, `ListWidget`, `Button`
* Named exports: `export const ComponentName`

### Variables

* camelCase: `itemTitle`, `filteredItems`, `newItem`
* Descriptive names: `trimmedTitle`, `newStatusValue`

---

## File Structure Pattern

Recommended minimal structure for small apps following this guide:

```text
src/
├── App.tsx          # Container/root component (state + logic)
├── ListWidget.tsx   # Presentational component (UI + local state)
├── Button.tsx       # Reusable UI component
├── App.css          # Component-specific styles
└── index.css        # Global styles
```

**Organization Principles:**

* One component per file
* Matching filename and component name
* Types defined in the same file where component is, or exported from a small domain file
* Shared domain types exported and reused

---

## Development Setup (Example)

```bash
# Install dependencies
pnpm i

# Start development server (http://localhost:3000)
pnpm dev

# Build for production
pnpm build

# Run tests
pnpm test
```

You can adapt tooling/commands for other environments (Create React App, Next.js, etc.) while keeping the same React patterns.

---

## Apply These Patterns to New Projects

Use this guide as a template when building:

* Todo apps, note-taking apps, task managers
* CRUD applications with lists
* Apps with filtering/searching functionality
* Forms with validation
* Any app with array-based state

When generating a new project in another domain:

* Keep the patterns (state shape, handlers, immutability, controlled components, composition).
* Change:

    * Subject area (e.g. books, movies, products, students, tasks, tickets, etc.).
    * Entity names and fields.
    * Button labels, filters, and UI specifics.

---

## Common Variations to Practice

You can extend a simple list-based app to practice:

* Edit item functionality (more input state management)
* LocalStorage persistence (add `useEffect`)
* Multiple lists (nested state arrays)
* Drag-and-drop reordering (advanced event handling)
* Categories/tags (more complex filtering)
* Due dates or time-based fields (Date objects)
* Search functionality (additional derived state)

The key goal:
**For any new project, keep the React + TypeScript patterns from this guide, but design a fresh domain model and UI every time.**


DOn't run project for verification that it's ok. but u can "run pnpm build" for verify 
