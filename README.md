# Internal Document Portal

A full-stack internal document management portal built with **Laravel 13, React, MySQL, and JWT authentication**.

Admins can create team accounts. Authenticated team members can view, upload, download, and manage internal documents.

## Features

* JWT-based authentication
* Admin and Member roles
* Admin can create team accounts
* Protected document API
* All authenticated users can view/download all documents
* Users can upload documents
* Users can delete only their own documents
* 401 response for unauthenticated API requests
* Database migrations and seeders
* 1 Admin, 2 Members, and 5 sample documents

## Tech Stack

* PHP 8.3+
* Laravel 13
* React + Vite
* Axios
* MySQL
* JWT Authentication
* Eloquent ORM

## Project Structure

This project uses a **single repository** for both Laravel and React.

```text
Project Root
├── app/                 # Laravel application
├── database/            # Migrations and seeders
├── resources/js/        # React frontend
├── routes/              # API and web routes
├── storage/             # Uploaded files
├── package.json
├── composer.json
└── vite.config.js
```

## Setup

### 1. Clone the Repository

```bash
git clone <https://github.com/neylynn/intenal-document-portal>
cd <intenal-document-portal>
```

### 2. Install Dependencies

```bash
composer install
npm install
```

### 3. Configure Environment

```bash
cp .env.example .env
php artisan key:generate
```

On Windows CMD:

```cmd
copy .env.example .env
```

Configure your MySQL database in `.env`:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=document_portal
DB_USERNAME=root
DB_PASSWORD=
```

### 4. Run Database Migration and Seeder

```bash
php artisan migrate:fresh --seed
```

This creates:

* 1 Admin
* 2 Members
* 5 Sample Documents

### 5. Configure Storage

```bash
php artisan storage:link
```

### 6. Start the Application

Open two terminals in the project root.

**Terminal 1 - Laravel**

```bash
php artisan serve
```

**Terminal 2 - Vite**

```bash
npm run dev
```

Open:

```text
http://localhost:8000
```

No separate frontend server URL is required.

## Authentication Flow

```text
React Login
     |
     v
POST /api/login
     |
     v
Laravel validates credentials
     |
     v
JWT Token
     |
     v
React stores token
     |
     v
Axios sends Bearer Token
     |
     v
Protected API
```

Unauthenticated requests receive:

```text
401 Unauthorized
```

Logout clears the authentication state and token.

## Document Flow

```text
Authenticated User
        |
        +---- View all documents
        |
        +---- Upload document
        |
        +---- Download documents
        |
        +---- Delete own documents
```

All team members can access documents uploaded by other team members.

However:

```text
User A → Can delete User A's document
User A → Cannot delete User B's document
```

The ownership check is enforced by the Laravel backend.

## API Endpoints

### Authentication

```http
POST /api/login
POST /api/logout
```

### Documents

```http
GET    /api/documents
POST   /api/documents
GET    /api/documents/{id}/download
DELETE /api/documents/{id}
```

The document endpoints require authentication.

Upload uses:

```text
multipart/form-data

title
file
```

## Authorization

| Action                        | Guest | Member | Admin |
| ----------------------------- | ----: | -----: | ----: |
| Login                         |   Yes |    Yes |   Yes |
| View documents                |    No |    Yes |   Yes |
| Upload documents              |    No |    Yes |   Yes |
| Download documents            |    No |    Yes |   Yes |
| Delete own documents          |    No |    Yes |   Yes |
| Delete other users' documents |    No |     No |    No |
| Create team accounts          |    No |     No |   Yes |

## Test Credentials

### Admin

```text
Email: admin@workspace.com
Password: password
Role: admin
```

### Member 1

```text
Email: member1@workspace.com
Password: password
Role: member
```

### Member 2

```text
Email: member2@workspace.com
Password: password
Role: member
```

## Database

### Users

```text
id
name
email
password
role
created_at
updated_at
```

### Documents

```text
id
user_id
title
file_name
file_path
file_type
file_size
created_at
updated_at
```

Relationship:

```text
User 1 ---- * Documents
```

Each document belongs to the user who uploaded it.

## Testing

After running:

```bash
php artisan migrate:fresh --seed
```

verify:

1. Admin can log in.
2. Members can log in.
3. Five sample documents are displayed.
4. Authenticated users can upload documents.
5. All authenticated users can view/download documents.
6. Users can delete their own documents.
7. Users cannot delete another user's documents.
8. Logout clears authentication.
9. Unauthenticated document requests return `401 Unauthorized`.

## Security

* Authentication is required for document access.
* JWT is sent using the `Authorization: Bearer <TOKEN>` header.
* Document ownership is checked on the backend.
* `.env` should not be committed to GitHub.
* Test credentials are included only for project evaluation.

## GitHub Submission

Before pushing:

```bash
git status
git add .
git commit -m "Complete internal document portal"
git push origin main
```
