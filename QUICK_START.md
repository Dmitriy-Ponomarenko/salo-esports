# 🚀 Quick Start - Система контроля качества

## Что произошло?

Ваш проект теперь имеет **production-ready систему контроля качества**, аналогичную системам в крупных tech компаниях (Google, Microsoft, Stripe). Все проверки **полностью автоматизированы**.

## ⚙️ Первый запуск

```bash
# 1. Установить зависимости (уже сделано, но на всякий)
npm install

# 2. Убедиться что Husky установлен
npx husky install

# 3. Проверить что все работает
npm run check-all
npm run test
```

## 📋 Что нового в `package.json`

Новые npm скрипты:
```bash
npm run lint          # Проверить ошибки (без исправления)
npm run lint:fix      # Автоматически исправить ошибки
npm run typecheck     # Проверить TypeScript типы
npm run format        # Форматировать код (Prettier)
npm run format:check  # Проверить форматирование
npm run check-all     # Все проверки сразу
npm run test          # Запустить тесты
npm run test:ui       # Тесты в UI
npm run test:coverage # Покрытие тестами
```

## 🛑 Git Hooks (автоматические проверки)

### При `git commit`:
```bash
git add .
git commit -m "My message"
```
Автоматически запустятся:
- ✅ ESLint (исправление и проверка)
- ✅ Prettier (форматирование)

### При `git push`:
```bash
git push origin my-branch
```
Автоматически запустятся:
- ✅ TypeScript проверка
- ✅ ESLint проверка
- ✅ Prettier проверка
- ✅ Все тесты

Если что-то не пройдет - push будет **заблокирован**!

## 🔍 Основные правила

### ❌ Запрещено:
```typescript
// ❌ NO: any тип
function process(data: any) { }

// ❌ NO: as any cast
const value = something as any

// ❌ NO: console.log в production
console.log('debug')

// ❌ NO: неиспользуемые переменные
const unused = 'value'

// ❌ NO: ts-ignore комментарий
// @ts-ignore - ERROR!

// ❌ NO: var переменная
var oldStyle = 'variable'

// ❌ NO: floating promise
myAsyncFunction() // без await/catch

// ❌ NO: неявные типы
const myFunc = (param) => {} // параметры без типов
```

### ✅ Требуется:
```typescript
// ✅ YES: явный тип
function process(data: MyType) { }

// ✅ YES: правильный type assertion
const value = (something as unknown) as MyType

// ✅ YES: warn/error/info в коде
console.error('error occurred')

// ✅ YES: обработка async
const result = await myAsyncFunction()

// ✅ YES: явный тип возврата
const myFunc = (param: string): number => {
  return param.length
}

// ✅ YES: @ts-expect-error с описанием
// @ts-expect-error cause is not available in older versions
const { cause } = error
```

## 👀 Что проверляется перед каждым commit?

### Инструмент | Проверяемое
--- | ---
**ESLint** | 50+ правил качества кода + типизация
**TypeScript** | Все ошибки типизации
**Prettier** | Единообразное форматирование
**Tests** | (при push) Все unit тесты

## 🚨 Что блокирует push?

```bash
git push          # Запускаются проверки:
                  # 1. npm run typecheck - ERROR?
                  # 2. npm run lint - ERROR?
                  # 3. npm run format:check - ERROR?
                  # 4. npm run test - FAILED?
                  # 
                  # Если ДА - push BLOCKED ❌
                  # Если НЕТ - push OK ✅
```

## 🔧 Распространенные проблемы

### Проблема: "ESLint error: @typescript-eslint/no-explicit-any"
```typescript
// ❌ Неправильно
const data: any = fetchData()

// ✅ Правильно
interface DataType {
  name: string
  age: number
}
const data: DataType = fetchData()
```

### Проблема: "ESLint error: no-console"  
```typescript
// ❌ Неправильно
console.log('debug')

// ✅ Правильно - в разработке используйте:
console.error('error')
console.warn('warning')
```

### Проблема: "no-floating-promises"
```typescript
// ❌ Неправильно
myAsyncFunction()

// ✅ Правильно
await myAsyncFunction()
// или
myAsyncFunction().catch(err => console.error(err))
```

### Проблема: Не могу закоммитить, lint выдает ошибки

```bash
# 1. Автоисправить что можно
npm run lint:fix

# 2. Отформатировать код
npm run format

# 3. Проверить типы
npm run typecheck

# 4. Закоммитить заново
git add .
git commit -m "message"
```

## 📊 GitHub Actions (CI/CD)

Когда вы делаете pull request на `main`:

```
Pull Request Created
        ↓
GitHub Actions запускается автоматически
        ↓
┌─────────────────────────────────────────┐
│ Job 1: Code Quality                     │
│  - TypeScript typecheck                 │
│  - ESLint check                         │
│  - Prettier check                       │
│  - npm audit (security)                 │
└─────────────────────────────────────────┘
        ↓
┌─────────────────────────────────────────┐
│ Job 2: Tests                            │
│  - npm run test (с coverage)            │
│  - Upload to Codecov                    │
└─────────────────────────────────────────┘
        ↓
┌─────────────────────────────────────────┐
│ Job 3: Build                            │
│  - Vite build                           │
│  - Wrangler build                       │
│  - Deploy (if main branch)              │
└─────────────────────────────────────────┘
        ↓
✅ All passed? → Можно merge
❌ Any failed? → Fix and push again
```

## 📚 Файлы конфигурации

| Файл | Назначение |
|------|-----------|
| `eslint.config.js` | 50+ правил ESLint (типизация, качество, security) |
| `tsconfig.json` | Строгие TypeScript параметры (strict: true и больше) |
| `.prettierrc` | Форматирование (80 chars, 2 spaces, single quotes) |
| `.lintstagedrc` | Какие файлы проверять перед commit |
| `.husky/pre-commit` | Команда для pre-commit hook |
| `.husky/pre-push` | Команда для pre-push hook |
| `.github/workflows/ci-cd.yml` | GitHub Actions pipeline |

## 🎯 Итог

Теперь у вас есть **профессиональная система жизненного цикла кода**:

- 🚶 **Разработка** → код должен пройти eslint/prettier
- 🚴 **Commit** → автоматическое форматирование + проверка
- 🏃 **Push** → полная проверка + тесты
- 🚗 **Pull Request** → GitHub Actions весь чек
- 🚀 **Merge on main** → автодеплой на production

**Невозможно положить ошибки в production!** ✅

---

Для вопросов см. `CODE_QUALITY_SETUP.md`
