# README: Domain Checker Project

## Project Overview

The **Domain Checker** is a Laravel-based application designed to check the availability and pricing of domain names. It integrates with a WHOIS API for real-time domain status checks and displays domain suggestions.

---

## Prerequisites

* PHP >= 8.2
* Composer
* Node.js & npm
* MySQL or compatible database

---

## Installation Guide

### Step 1: Clone the Repository

```bash
git clone https://github.com/Alvalens/domain-checker-inertia.git
```

### Step 2: Install PHP Dependencies

Run the following command to install all PHP dependencies:

```bash
composer install
```

#### Troubleshooting Dependency Issues

If you encounter any dependency issues, run:

```bash
composer update
```

### Step 3: Set Up Environment

1. Copy the `.env.example` file to `.env`:

   ```bash
   cp .env.example .env
   ```
2. Update the `.env` file with your database credentials and other configuration values:

   ```bash
   DB_CONNECTION=mysql
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_DATABASE=domain_checker
   DB_USERNAME=your_username
   DB_PASSWORD=your_password
   ```
3. Setup Whois

   ```bash
   WHOIS_URL=
   WHOIS_KEY=
   ```

### Step 4: Generate Application Key

```bash
php artisan key:generate
```

### Step 5: Run Database Migrations

Set up the database schema by running:

```bash
php artisan migrate
```

### Step 6: Start the Application Server

Launch the local development server:

```bash
php artisan serve
```

---

## Frontend Setup

### Step 1: Install JavaScript Dependencies

```bash
npm install
```

### Step 2: Build Frontend Assets

For development:

```bash
npm run dev
```

For production (optional):

```bash
npm run build
```

---

## Usage

1. Access the application in your browser at `http://localhost:8000`.
2. Enter a keyword or domain name to check availability and pricing.

---

## Troubleshooting

* Ensure your `.env` file is properly configured for the database and API settings.
* Clear application cache if you face unexpected issues:

  ```bash
  php artisan cache:clear
  php artisan config:clear
  ```
