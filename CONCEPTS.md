# React Knowledge Scope & Patterns Guide

## About This Project

This is an IT-INCUBATOR educational project demonstrating fundamental React + TypeScript patterns. Use this as a **reference template** for building similar applications with consistent code style and architecture.

**Tech Stack:**
- React 19.0.0 (Functional Components + Hooks)
- TypeScript 5.7.2
- Vite 6.0.6
- pnpm (package manager)

---

## Core React Knowledge Scope

### 1. State Management with useState

**Pattern: Multiple Independent State Variables**

```typescript
// src/App.tsx:15-21
const [filter, setFilter] = useState<FilterValues>('all')
const [tasks, setTasks] = useState<Task[]>([
  { id: v1(), title: 'HTML&CSS', isDone: true },
  { id: v1(), title: 'JS', isDone: true },
  { id: v1(), title: 'ReactJS', isDone: false },
])
```

**Key Concepts:**
- ✅ Explicit TypeScript generics for type safety: `useState<FilterValues>`, `useState<Task[]>`
- ✅ Initial state with default values
- ✅ Separate state variables for independent concerns (filter vs tasks)
- ✅ Array state for collections of data

**Pattern: Local Component State**

```typescript
// src/TodolistItem.tsx:26-27
const [taskTitle, setTaskTitle] = useState('')
const [error, setError] = useState<string | null>(null)
```

**Key Concepts:**
- ✅ UI state managed in the component that owns it
- ✅ Nullable types: `string | null` for optional error messages
- ✅ String state for controlled input fields

---

### 2. TypeScript Type Definitions

**Pattern: Domain Types**

```typescript
// src/App.tsx:6-12
export type Task = {
  id: string
  title: string
  isDone: boolean
}

export type FilterValues = 'all' | 'active' | 'completed'
```

**Key Concepts:**
- ✅ `type` keyword for object shapes and unions
- ✅ Export types that are shared across components
- ✅ String literal unions for fixed sets of values
- ✅ Descriptive property names (isDone, not just done)

**Pattern: Component Props Interface**

```typescript
// src/TodolistItem.tsx:5-13
type Props = {
  title: string
  tasks: Task[]
  deleteTask: (taskId: string) => void
  changeFilter: (filter: FilterValues) => void
  createTask: (title: string) => void
  changeTaskStatus: (taskId: string, isDone: boolean) => void
  filter: FilterValues
}
```

**Key Concepts:**
- ✅ Function types with explicit parameter names
- ✅ void return type for callbacks
- ✅ Group all props in a single `Props` type
- ✅ Reference domain types (Task, FilterValues)

---

### 3. Immutable State Updates

**Pattern: Array Filtering (Remove Item)**

```typescript
// src/App.tsx:23-28
const deleteTask = (taskId: string) => {
  const filteredTasks = tasks.filter(task => {
    return task.id !== taskId
  })
  setTasks(filteredTasks)
}
```

**Pattern: Array Prepending (Add Item)**

```typescript
// src/App.tsx:42-46
const createTask = (title: string) => {
  const newTask = {id: v1(), title, isDone: false}
  const newTasks = [newTask, ...tasks]
  setTasks(newTasks)
}
```

**Pattern: Array Mapping (Update Item)**

```typescript
// src/App.tsx:48-51
const changeTaskStatus = (taskId: string, isDone: boolean) => {
  const newState = tasks.map(task => task.id == taskId ? { ...task, isDone } : task)
  setTasks(newState)
}
```

**Key Concepts:**
- ✅ Never mutate state directly
- ✅ Use `.filter()` to remove items
- ✅ Use spread operator `[newItem, ...array]` to prepend
- ✅ Use `.map()` with object spread `{ ...task, isDone }` to update specific items
- ✅ Create new variables before calling setState

---

### 4. Event Handling Patterns

**Pattern: Callback Functions in Parent Component**

```typescript
// src/App.tsx:30-32
const changeFilter = (filter: FilterValues) => {
  setFilter(filter)
}
```

**Pattern: Event Handlers Inside map() Loop**

```typescript
// src/TodolistItem.tsx:66-73
const deleteTaskHandler = () => {
  deleteTask(task.id)
}

const changeTaskStatusHandler = (e: ChangeEvent<HTMLInputElement>) => {
  const newStatusValue = e.currentTarget.checked
  changeTaskStatus(task.id, newStatusValue)
}
```

**Pattern: Keyboard Event Handling**

```typescript
// src/TodolistItem.tsx:44-48
const createTaskOnEnterHandler = (event: KeyboardEvent<HTMLInputElement>) => {
  if (event.key === 'Enter') {
    createTaskHandler()
  }
}
```

**Key Concepts:**
- ✅ Define handlers inside component function
- ✅ Use specific event types: `ChangeEvent<HTMLInputElement>`, `KeyboardEvent<HTMLInputElement>`
- ✅ Create wrapper handlers inside `.map()` to capture loop variables (task.id)
- ✅ Extract values before calling callbacks: `e.currentTarget.checked`
- ✅ Handler naming convention: `actionHandler` or `actionSubjectHandler`

---

### 5. Controlled Components

**Pattern: Input Field with Validation**

```typescript
// src/TodolistItem.tsx:26-42
const [taskTitle, setTaskTitle] = useState('')
const [error, setError] = useState<string | null>(null)

const createTaskHandler = () => {
  const trimmedTitle = taskTitle.trim()
  if (trimmedTitle !== '') {
    createTask(trimmedTitle)
    setTaskTitle('')
  } else {
    setError('Title is required')
  }
}

const changeTaskTitleHandler = (event: ChangeEvent<HTMLInputElement>) => {
  setTaskTitle(event.currentTarget.value)
  setError(null)  // Clear error on user input
}
```

**JSX:**
```typescript
// src/TodolistItem.tsx:54-59
<input className={error ? 'error' : ''}
       value={taskTitle}
       onChange={changeTaskTitleHandler}
       onKeyDown={createTaskOnEnterHandler}/>
<Button title={'+'} onClick={createTaskHandler}/>
{error && <div className={'error-message'}>{error}</div>}
```

**Key Concepts:**
- ✅ `value` prop bound to state
- ✅ `onChange` handler updates state
- ✅ Validation before submitting
- ✅ Clear input after successful submission
- ✅ Clear error on user input for better UX
- ✅ `.trim()` to prevent whitespace-only inputs

---

### 6. Conditional Rendering

**Pattern: Ternary Operator**

```typescript
// src/TodolistItem.tsx:54
<input className={error ? 'error' : ''} />

// src/TodolistItem.tsx:76
<li className={task.isDone ? 'is-done' : ''}>
```

**Pattern: Logical AND (&&)**

```typescript
// src/TodolistItem.tsx:59
{error && <div className={'error-message'}>{error}</div>}
```

**Pattern: Conditional Content Blocks**

```typescript
// src/TodolistItem.tsx:61-85
{tasks.length === 0 ? (
  <p>Тасок нет</p>
) : (
  <ul>
    {tasks.map(task => { /* ... */ })}
  </ul>
)}
```

**Key Concepts:**
- ✅ Ternary for className toggling: `condition ? 'class' : ''`
- ✅ `&&` for optional rendering
- ✅ Ternary for either/or rendering: `condition ? <A /> : <B />`
- ✅ Check array length before mapping

---

### 7. List Rendering

**Pattern: map() with Unique Keys**

```typescript
// src/TodolistItem.tsx:65-83
{tasks.map(task => {
  const deleteTaskHandler = () => {
    deleteTask(task.id)
  }

  const changeTaskStatusHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const newStatusValue = e.currentTarget.checked
    changeTaskStatus(task.id, newStatusValue)
  }

  return (
    <li key={task.id} className={task.isDone ? 'is-done' : ''}>
      <input type="checkbox" checked={task.isDone}
             onChange={changeTaskStatusHandler}/>
      <span>{task.title}</span>
      <Button title={'x'} onClick={deleteTaskHandler}/>
    </li>
  )
})}
```

**Key Concepts:**
- ✅ Always provide `key` prop with unique identifier
- ✅ Define handlers inside `.map()` to access current item
- ✅ Return JSX from map callback
- ✅ Use controlled checkbox: `checked={task.isDone}`
- ✅ Combine conditional styling with list items

---

### 8. Props Drilling Pattern

**Pattern: Pass State and Callbacks Down**

```typescript
// src/App.tsx:53-61
return (
  <div className="app">
    <TodolistItem
      title="What to learn"
      tasks={filteredTasks}
      deleteTask={deleteTask}
      changeFilter={changeFilter}
      createTask={createTask}
      changeTaskStatus={changeTaskStatus}
      filter={filter}
    />
  </div>
)
```

**Pattern: Props Destructuring**

```typescript
// src/TodolistItem.tsx:16-24
const {
  title,
  tasks,
  deleteTask,
  changeFilter,
  createTask,
  changeTaskStatus,
  filter,
} = props
```

**Key Concepts:**
- ✅ Parent owns state, child receives via props
- ✅ Callbacks passed down for child-to-parent communication
- ✅ Destructure props for cleaner code
- ✅ Explicit prop passing (no prop spreading)

---

### 9. Computed Values (Derived State)

**Pattern: Filter Data Before Rendering**

```typescript
// src/App.tsx:34-40
let filteredTasks = tasks
if (filter === 'active') {
  filteredTasks = tasks.filter(task => !task.isDone)
}
if (filter === 'completed') {
  filteredTasks = tasks.filter(task => task.isDone)
}
```

**Key Concepts:**
- ✅ Compute derived data in component body (not in state)
- ✅ Use `let` for reassignable computed values
- ✅ Filter/transform before passing to child components
- ✅ Simple if statements for multiple conditions

---

### 10. Component Composition

**Pattern: Reusable UI Components**

```typescript
// src/Button.tsx:1-9
type Props = {
  title: string
  onClick?: () => void
  className?: string
}

export const Button = ({ title, onClick, className }: Props) => {
  return <button className={className} onClick={onClick}>{title}</button>
}
```

**Pattern: Using Reusable Components**

```typescript
// src/TodolistItem.tsx:58
<Button title={'+'} onClick={createTaskHandler}/>

// src/TodolistItem.tsx:87-95
<Button className={filter === 'all' ? 'active-filter' : ''}
        title={'All'}
        onClick={() => changeFilter('all')}/>
```

**Key Concepts:**
- ✅ Optional props with `?`
- ✅ Destructure props in function parameters
- ✅ Single responsibility components
- ✅ Inline arrow functions for callbacks with arguments: `() => changeFilter('all')`

---

## Naming Conventions

### Functions
- **State setters:** `setTaskTitle`, `setError`, `setFilter`
- **Event handlers:** `createTaskHandler`, `changeTaskTitleHandler`, `deleteTaskHandler`
- **Business logic:** `deleteTask`, `createTask`, `changeTaskStatus`, `changeFilter`

### Components
- **PascalCase:** `App`, `TodolistItem`, `Button`
- **Named exports:** `export const ComponentName`

### Variables
- **camelCase:** `taskTitle`, `filteredTasks`, `newTask`
- **Descriptive names:** `trimmedTitle`, `newStatusValue`

---

## File Structure Pattern

```
src/
├── App.tsx              # Container component (state + logic)
├── TodolistItem.tsx     # Presentational component (UI + local state)
├── Button.tsx           # Reusable UI component
├── App.css             # Component-specific styles
└── index.css           # Global styles
```

**Organization Principles:**
- ✅ One component per file
- ✅ Matching filename and component name
- ✅ Types defined in same file where component is
- ✅ Export shared types from domain file (App.tsx)

---

## Development Setup

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

---

## Apply These Patterns to New Projects

Use this project as a template when building:
- Todo apps, note-taking apps, task managers
- CRUD applications with lists
- Apps with filtering/searching functionality
- Forms with validation
- Any app with array-based state

**Key Patterns to Reuse:**
1. useState for state management
2. TypeScript types for props and domain models
3. Immutable state updates (map, filter, spread)
4. Event handler naming and structure
5. Controlled components pattern
6. Conditional rendering techniques
7. List rendering with keys
8. Props drilling for component communication
9. Computed/derived values from state
10. Component composition with reusable UI elements

---

## Common Variations to Practice

Try modifying this project to practice:
- Add "Edit task" functionality (adds input state management)
- Add localStorage persistence (useEffect hook)
- Add multiple todolists (nested state arrays)
- Add drag-and-drop reordering (event handling)
- Add task categories/tags (complex filtering)
- Add due dates (working with Date objects)
- Add search functionality (more derived state)

Each variation teaches additional React patterns while building on this foundation.
