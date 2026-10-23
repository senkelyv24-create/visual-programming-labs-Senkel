# HTTP API лабораторной №2

Студент: Сенкель. Базовый адрес: `http://localhost:1880`.

Текстовые ответы идут как `text/plain`. Объекты Node-RED отдаёт как JSON.

## GET /api/text

Простой текст, без параметров.

```bash
curl http://localhost:1880/api/text
```

Ответ `200`:

```text
Сенкель: лабораторная работа 2, Node-RED
```

## GET /api/info

JSON с двумя полями, без параметров.

```bash
curl http://localhost:1880/api/info
```

Ответ `200`:

```json
{
  "student": "Сенкель",
  "tool": "Node-RED"
}
```

## GET /api/items/:id

Один учебный элемент потока. `id` — путь, `status` — необязательный query-параметр (`active` или `draft`).

| id | name | status |
| --- | --- | --- |
| 1 | inject-debug | active |
| 2 | mqtt | active |
| 3 | dashboard | draft |

Успех:

```bash
curl "http://localhost:1880/api/items/1?status=active"
```

```json
{
  "id": 1,
  "name": "inject-debug",
  "owner": "Сенкель",
  "status": "active"
}
```

Нечисловой или неположительный `id` — `400`:

```bash
curl http://localhost:1880/api/items/abc
```

```json
{
  "error": "Некорректный id",
  "student": "Сенкель"
}
```

Неизвестный `status` — `400`:

```bash
curl "http://localhost:1880/api/items/1?status=nope"
```

```json
{
  "error": "Недопустимый status",
  "allowed": ["active", "draft"]
}
```

Нет такого элемента или статус не совпал — `404`:

```bash
curl http://localhost:1880/api/items/99
```

```json
{
  "error": "Элемент не найден",
  "id": 99
}
```

## Дополнительно: заметки, полный CRUD

Это не отдельная обязательная ачивка: на этой машине нет Docker, поэтому засчитанная ачивка — установка Node-RED через npm. CRUD оставлен как запасной полный пример REST.

Сущность `note`: поля `id`, `title`, `author`. Хранение — flow context потока `13 crud notes`. Контекст выбран потому, что список должен жить между запросами, а код без файла проще разобрать на защите. Контекст пишется на диск (`localfilesystem` в `settings.js`), поэтому список не пропадает после перезапуска Node-RED.

Стартовая запись появляется при первом `GET /api/notes`: `{ "id": 1, "title": "Стартовая заметка", "author": "Сенкель" }`.

### GET /api/notes

```bash
curl http://localhost:1880/api/notes
```

`200` — массив заметок.

### GET /api/notes/:id

```bash
curl http://localhost:1880/api/notes/1
```

`200` — объект заметки. Некорректный `id` — `400`. Нет заметки — `404`.

### POST /api/notes

```bash
curl -X POST http://localhost:1880/api/notes ^
  -H "Content-Type: application/json" ^
  -d "{\"title\":\"MQTT разобран\",\"author\":\"Сенкель\"}"
```

`201` — созданная заметка с новым `id`. Пустые `title` или `author` — `400`.

### PATCH /api/notes/:id

```bash
curl -X PATCH http://localhost:1880/api/notes/1 ^
  -H "Content-Type: application/json" ^
  -d "{\"title\":\"Стартовая заметка, правка\"}"
```

`200` — обновлённая заметка. Нет полей для правки или пустая строка — `400`. Нет заметки — `404`.

### DELETE /api/notes/:id

```bash
curl -X DELETE http://localhost:1880/api/notes/1
```

`200`:

```json
{
  "deleted": {
    "id": 1,
    "title": "Стартовая заметка",
    "author": "Сенкель"
  }
}
```

Некорректный `id` — `400`. Нет заметки — `404`.
