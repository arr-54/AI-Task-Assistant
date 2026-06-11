# AI Task Assistant

Система управления задачами с авторизацией (JWT), автоматическим анализом текста через отдельный Python-сервис.  
Каждый пользователь видит только свои задачи. При создании задачи текст анализируется, и проставляются приоритет (high/medium/low) и категория (business/personal/general).

## Как запустить проект

1. **Установите зависимости**  
   - Backend: `cd backend && npm install`  
   - Frontend: `cd frontend && npm install`  
   - Python‑сервис: `cd python-service && pip install -r requirements.txt`

2. **Настройте базу данных**  
   - Убедитесь, что PostgreSQL запущен.  
   - Создайте базу `task_assistant` и выполните скрипт `database/init.sql` (он создаст таблицы `users` и `tasks`).

3. **Настройте переменные окружения**  
   - В папке `backend` скопируйте `.env.example` в `.env` и укажите свой пароль от PostgreSQL, а также любой секретный ключ для JWT.

4. **Запустите три сервиса в отдельных терминалах**  
   - Python: `cd python-service && python app.py` (порт 5001)  
   - Backend: `cd backend && npm run dev` (порт 5000)  
   - Frontend: `cd frontend && npm start` (порт 3000)

5. **Проверьте работу**  
   - Откройте http://localhost:3000  
   - Зарегистрируйтесь, войдите.  
   - Создайте задачу, например «Подготовить презентацию для клиента до пятницы».  
   - В таблице появятся автоматически проставленные приоритет (high) и категория (business).  
   - Измените статус задачи (New → In Progress → Done) или удалите её.

## Краткое описание всех файлов проекта

### Backend (папка `backend`)

- **server.js** – главный файл, запускает Express‑сервер на порту 5000, подключает CORS и JSON‑парсер, маршруты авторизации и задач.  
- **db.js** – настраивает пул соединений с PostgreSQL, используя переменные из `.env`.  
- **authMiddleware.js** – проверяет JWT‑токен в заголовке Authorization; если токен валидный, сохраняет `userId` в запросе.  
- **package.json** – содержит список зависимостей и скрипты (особенно `npm run dev` для запуска через nodemon).  
- **.env.example** – пример файла с настройками окружения. Скопируйте его в `.env` и пропишите реальные пароли.  
- **routes/auth.js** – обрабатывает POST `/auth/register` (хеширует пароль, создаёт пользователя) и POST `/auth/login` (проверяет пароль, возвращает JWT).  
- **routes/tasks.js** – все маршруты для задач: GET `/tasks` (только задачи текущего пользователя), POST `/tasks` (создаёт задачу, вызывает Python‑анализ), PUT `/tasks/:id` (обновляет статус), DELETE `/tasks/:id` (удаляет задачу).  
- **services/aiClient.js** – отправляет текст задачи на Python‑сервис (http://localhost:5001/analyze) и возвращает JSON с priority и category. При ошибке возвращает `{priority: "medium", category: "general"}`.

### Frontend (папка `frontend`)

- **public/index.html** – базовый HTML‑шаблон, в который React встраивает приложение.  
- **src/index.js** – точка входа React, рендерит компонент `App` в корневой DOM‑элемент.  
- **src/App.js** – настраивает маршрутизацию (react‑router‑dom): страницы `/login`, `/register`, `/dashboard`. Если токен отсутствует, перенаправляет на логин.  
- **src/api.js** – создаёт экземпляр axios с базовым URL `http://localhost:5000`. Автоматически добавляет JWT‑токен в заголовок Authorization при каждом запросе. Содержит функции `login`, `register`, `getTasks`, `createTask`, `updateTask`, `deleteTask`.  
- **src/components/Login.js** – форма входа (email, пароль). При успешном ответе сохраняет токен и перенаправляет на дашборд.  
- **src/components/Register.js** – форма регистрации (username, email, пароль). После успеха перенаправляет на страницу входа.  
- **src/components/Dashboard.js** – главная страница. Загружает задачи через `getTasks`, передаёт их в `TaskList`. Содержит обработчики создания, обновления статуса и удаления.  
- **src/components/TaskForm.js** – простой компонент с полями title и description, по нажатию кнопки вызывает переданный колбэк `onSubmit`.  
- **src/components/TaskList.js** – таблица задач. В каждой строке отображаются название, описание, статус (выпадающий список), приоритет, категория, дата создания и кнопка «Delete».  
- **src/styles/App.css** – стили для форм, таблицы, цветов приоритетов (high – красный, low – зелёный).  
- **package.json** – зависимости React, axios, react‑router‑dom и скрипт `npm start`.

### Python‑сервис (папка `python-service`)

- **app.py** – Flask‑приложение с единственным эндпоинтом `/analyze` (POST). Принимает JSON `{"text": "..."}`, вызывает функцию `analyze` из модуля `analyzer.py`, возвращает `{"priority": "...", "category": "..."}`.  
- **analyzer.py** – реализует анализ текста. Приводит текст к нижнему регистру, ищет ключевые слова.  
  - Слова «срочно», «важно», «дедлайн», «клиент» и т.п. → приоритет `high`.  
  - Слова «не срочно», «можно позже» → приоритет `low`.  
  - Иначе `medium`.  
  - Слова «презентация», «клиент», «отчёт», «бизнес» → категория `business`.  
  - Слова «купить», «семья», «ремонт», «спорт» → категория `personal`.  
  - Иначе `general`.  
- **requirements.txt** – перечень необходимых пакетов: `flask` и `flask-cors`.

### База данных (папка `database`)

- **init.sql** – SQL‑скрипт для создания базы `task_assistant` и двух таблиц:  
  - `users` (id, username, email, password_hash, created_at).  
  - `tasks` (id, user_id – внешний ключ к users, title, description, status, priority, category, created_at).

### Корневая папка

- **.gitignore** – исключает из Git папки `node_modules`, файлы `.env`, логи, временные файлы ОС.  
- **README.md** – этот файл с инструкцией по запуску и описанием файлов.

## Дополнительная информация

- Авторизация построена на JWT. Пароли хранятся в виде bcrypt‑хешей.  
- При недоступности Python‑сервиса бэкенд всё равно создаёт задачу со значениями priority=medium и category=general.
- Для проверки API можно использовать curl или Postman, но полный функционал доступен через веб‑интерфейс.