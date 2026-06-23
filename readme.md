# LaraEventTickets

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Laravel Version](https://img.shields.io/badge/Laravel-5.4-red.svg)](https://laravel.com)

A Laravel 5.4 based system for event organizers to manage and sell tickets.

## Features

- Event Management
- Sell Tickets Online
- User Authentication & Admin Panel

## Quick Start

### Default Credentials
- **Email:** `admin@admin.com`
- **Password:** `password`

### Installation Instructions

1. **Clone the repository:**
   ```bash
   git clone https://github.com/vijaymahes9080/LaraEventTickets-QuickAdminPanel_php.git
   ```
2. **Setup environment configuration:**
   Copy `.env.example` file to `.env` and configure your database and other settings:
   ```bash
   cp .env.example .env
   ```
3. **Install PHP dependencies:**
   ```bash
   composer install
   ```
4. **Generate Application Key:**
   ```bash
   php artisan key:generate
   ```
5. **Run migrations and seed the database:**
   ```bash
   php artisan migrate --seed
   ```
6. **Launch the application:**
   Serve the application using your preferred web server or:
   ```bash
   php artisan serve
   ```
   You can log in at `/login` with the default credentials above.

## License

This project is open-source software licensed under the [MIT License](LICENSE).
