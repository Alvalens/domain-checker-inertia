<?php

use App\Http\Controllers\HomeController;
use App\Http\Controllers\SearchController;
use Illuminate\Support\Facades\Route;

Route::get('/', [HomeController::class, 'show'])->name('home');
Route::post('/search', [SearchController::class, 'search'])->name('search');
Route::post('/check-whois', [SearchController::class, 'checkWhoIs'])->name('search.whois');
