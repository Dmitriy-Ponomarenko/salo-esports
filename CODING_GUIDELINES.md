# 📖 Code Quality Best Practices для Junior разработчиков

Этот файл содержит примеры правильного кода в соответствии с новыми стандартами качества.

## Правило 1: Всегда типизируй функции

### ❌ До (будет ERROR)
```typescript
// Параметры без типов
const calculateSum = (a, b) => a + b

// Возвращаемый тип не явный
const getUserData = async (id) => {
  return fetch(`/api/users/${id}`)
}

// any тип
function processData(data: any) {
  return data.value
}
```

### ✅ После (правильно)
```typescript
// Явные типы параметров и возврата
const calculateSum = (a: number, b: number): number => a + b

// Явный возвращаемый тип для async
const getUserData = async (id: string): Promise<User> => {
  const response = await fetch(`/api/users/${id}`)
  return response.json()
}

// Правильно типизированный параметр
interface DataPayload {
  value: string
  metadata?: {
    createdAt: Date
    author: string
  }
}

function processData(data: DataPayload): string {
  return data.value.toUpperCase()
}
```

## Правило 2: Избегай `any` типов - используй Union types

### ❌ До
```typescript
const processValue = (value: any): any => {
  if (typeof value === 'string') {
    return value.toUpperCase()
  }
  return value
}
```

### ✅ После
```typescript
const processValue = (value: string | number | boolean): string | number | boolean => {
  if (typeof value === 'string') {
    return value.toUpperCase()
  }
  return value
}

// Или лучше - используй generic:
const processValue = <T extends string | number | boolean>(value: T): T => {
  if (typeof value === 'string') {
    return (value.toUpperCase() as T)
  }
  return value
}
```

## Правило 3: Явные типы для переменных

### ❌ До
```typescript
const user = getUserData()  // ESLint посчитает это any
const items = []            // Неизвестный тип массива
const config = {            // Неизвестная структура
  apiUrl: 'http://...'
}
```

### ✅ После
```typescript
const user: User = getUserData()
const items: string[] = []
// Или с автоинферентом:
const user = getUserData() as User  // явный as

interface Config {
  apiUrl: string
  timeout: number
  retries: number
}
const config: Config = {
  apiUrl: 'http://...',
  timeout: 5000,
  retries: 3,
}
```

## Правило 4: Обработай все Promise'ы

### ❌ До (ERROR: no-floating-promises)
```typescript
// Забыл await - Promise не обработан!
fetchUserData()

// Async функция без catch
myAsyncOperation()

// Promise chain без catch
fetch('/api/data').then(r => r.json())
```

### ✅ После
```typescript
// Явный await
const data = await fetchUserData()

// С обработкой ошибок
try {
  const result = await myAsyncOperation()
} catch (error) {
  console.error('Operation failed:', error)
}

// Promise chain с catch
const response = await fetch('/api/data')
  .then(r => {
    if (!r.ok) throw new Error(`HTTP ${r.status}`)
    return r.json()
  })
  .catch(err => {
    console.error('Fetch failed:', err)
    return null
  })

// Или useEffect в React
useEffect(() => {
  const load = async () => {
    try {
      const result = await fetchData()
      setData(result)
    } catch (err) {
      setError(err)
    }
  }
  
  load()
}, [])
```

## Правило 5: Используй const, избегай var

### ❌ До (ERROR)
```typescript
var userName = 'John'      // старый стиль
var count = 0
var items = []

userName = 'Jane'          // can be reassigned
```

### ✅ После
```typescript
const userName = 'John'    // не меняется
let count = 0              // может меняться

// Если нужна переменная:
let items: string[] = []
items.push('item1')

// Если не меняется - const:
const users: User[] = []
users.push(newUser)  // .push() меняет содержимое, но не саму переменную
```

## Правило 6: Нет console.log в продакшене

### ❌ До (ERROR)
```typescript
function processOrder(order: Order): void {
  console.log('Processing order:', order)     // ERROR!
  const total = calculateTotal(order.items)
  console.log('Total:', total)                // ERROR!
  submitOrder(order)
}
```

### ✅ После
```typescript
function processOrder(order: Order): void {
  // Для дебага в разработке используй:
  if (process.env.NODE_ENV === 'development') {
    console.warn('Processing order:', order)
  }
  
  const total = calculateTotal(order.items)
  
  try {
    submitOrder(order)
  } catch (error) {
    console.error('Failed to submit order:', error)  // OK - это error лог
  }
}
```

## Правило 7: Строгая проверка boolean выражений

### ❌ До (ERROR: strict-boolean-expressions)
```typescript
const isValid = (value: string | null): boolean => {
  if (value) {              // ERROR! value может быть пустой строкой!
    return true
  }
  return false
}

const isEmpty = (arr: unknown[]): boolean => {
  return arr                 // ERROR! нужна явная проверка
}
```

### ✅ После
```typescript
const isValid = (value: string | null): boolean => {
  if (value !== null && value !== '') {
    return true
  }
  return false
}

const isEmpty = (arr: unknown[]): boolean => {
  return arr.length === 0
}

// Даже лучше:
const isValid = (value: string | null): boolean => value !== null && value !== ''
const isEmpty = (arr: unknown[]): boolean => arr.length === 0
```

## Правило 8: Exhaustive deps в React Hooks

### ❌ До (ERROR: exhaustive-deps)
```typescript
function UserProfile({ userId }: Props) {
  const [user, setUser] = useState<User | null>(null)
  
  useEffect(() => {
    fetchUser(userId).then(setUser)
  }, [])  // WARNING! userId не в deps!
  
  return <div>{user?.name}</div>
}
```

### ✅ После
```typescript
function UserProfile({ userId }: Props) {
  const [user, setUser] = useState<User | null>(null)
  
  useEffect(() => {
    fetchUser(userId).then(setUser)
  }, [userId])  // userId добавлен в deps
  
  return <div>{user?.name}</div>
}

// Или если не нужны deps:
useEffect(() => {
  initializeApp()
}, [])  // пусто = запустится 1 раз
```

## Правило 9: Правильная обработка ошибок

### ❌ До
```typescript
const getUserData = async (id: string): Promise<User> => {
  const response = await fetch(`/api/users/${id}`)
  return response.json()  // что если error?
}

try {
  const user = await getUserData('123')
} catch (error) {
  console.log('Error:', error)  // что если error не Error?
}
```

### ✅ После
```typescript
const getUserData = async (id: string): Promise<User> => {
  const response = await fetch(`/api/users/${id}`)
  
  if (!response.ok) {
    throw new Error(`Failed to fetch user: ${response.statusText}`)
  }
  
  const data = await response.json()
  if (!isValidUser(data)) {
    throw new Error('Invalid user data')
  }
  
  return data as User
}

try {
  const user = await getUserData('123')
  console.log('User loaded:', user.name)
} catch (error) {
  const message = error instanceof Error 
    ? error.message 
    : 'Unknown error'
  console.error('Failed to load user:', message)
}
```

## Правило 10: Типизируй Props и State в React

### ❌ До
```typescript
function Button(props) {
  return <button onClick={props.onClick}>{props.children}</button>
}

function Counter() {
  const [count, setCount] = useState(0)
  return <div>{count}</div>
}
```

### ✅ После
```typescript
interface ButtonProps {
  onClick: () => void
  children: React.ReactNode
  disabled?: boolean
}

function Button({
  onClick,
  children,
  disabled = false,
}: ButtonProps): JSX.Element {
  return (
    <button onClick={onClick} disabled={disabled}>
      {children}
    </button>
  )
}

function Counter(): JSX.Element {
  const [count, setCount] = useState<number>(0)
  
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  )
}
```

## Правило 11: Используй Type Guards

### ❌ До
```typescript
const processData = (data: unknown): string => {
  return data.toString()  // может быть ошибка!
}
```

### ✅ После
```typescript
const isString = (value: unknown): value is string => {
  return typeof value === 'string'
}

const processData = (data: unknown): string => {
  if (isString(data)) {
    return data.toUpperCase()
  }
  throw new Error('Data is not a string')
}

// Или встроенный тип:
const processData = (data: unknown): string => {
  if (typeof data === 'string') {
    return data.toUpperCase()
  }
  if (typeof data === 'number') {
    return data.toString()
  }
  return 'unknown'
}
```

## Комплексный пример: правильная component

```typescript
// ✅ Все правила применены

import React, { useState, useEffect } from 'react'

interface User {
  id: string
  name: string
  email: string
  avatar?: string
}

interface UserCardProps {
  userId: string
  onSelect?: (user: User) => void
}

export const UserCard: React.FC<UserCardProps> = ({
  userId,
  onSelect,
}): JSX.Element => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadUser = async (): Promise<void> => {
      try {
        setLoading(true)
        setError(null)

        const response = await fetch(`/api/users/${userId}`)

        if (!response.ok) {
          throw new Error(`Failed to load user: ${response.statusText}`)
        }

        const data = await response.json()
        setUser(data as User)
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Unknown error'
        setError(message)
        console.error('Failed to load user:', message)
      } finally {
        setLoading(false)
      }
    }

    void loadUser()
  }, [userId])

  const handleClick = (): void => {
    if (user && onSelect) {
      onSelect(user)
    }
  }

  if (loading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div className="error">Error: {error}</div>
  }

  if (!user) {
    return <div>No user found</div>
  }

  return (
    <div className="user-card" onClick={handleClick}>
      {user.avatar && <img src={user.avatar} alt={user.name} />}
      <h3>{user.name}</h3>
      <p>{user.email}</p>
    </div>
  )
}
```

## Шпаргалка: Типичные ошибки

| Ошибка | Решение |
|--------|---------|
| `no-explicit-any` | Замени `any` на конкретный интерфейс |
| `@typescript-eslint/no-unsafe-*` | Используй type assertion или type guard |
| `no-floating-promises` | Добавь `await`, `.catch()` или `void` |
| `exhaustive-deps` | Добавь все переменные в зависимости |
| `no-console` | Используй `console.error/warn` вместо `console.log` |
| `strict-boolean-expressions` | Проверяй явно: `value !== null`, `arr.length > 0` |
| `no-var` | Замени на `const` или `let` |
| `prefer-const` | Если не переназначаешь - используй `const` |

---

Помни: **TypeScript и ESLint - твои друзья!** Они помогают находить ошибки ДО production. 🚀
