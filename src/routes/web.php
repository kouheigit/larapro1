<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return view('welcome');
});

Route::get('/dashboard', function () {
    return view('dashboard');
})->middleware(['auth'])->name('dashboard');

require __DIR__.'/auth.php';
Route::get('kpg',[App\Http\Controllers\KpgController::class,'index'])->name('kpg');

Route::namespace('React')->prefix('react')->name('react.')->group(function(){
    Route::get('bloglink',[App\Http\Controllers\ReactController::class,'bloglink'])->name('bloglink');
    Route::get('blogblog',[App\Http\Controllers\ReactController::class,'blogblog'])->name('blogblog');
    Route::get('blogtest',[App\Http\Controllers\ReactController::class,'blogtest'])->name('blogtest');
    Route::get('test',[App\Http\Controllers\ReactController::class,'test'])->name('test');
    Route::get('test1',[App\Http\Controllers\ReactController::class,'test1'])->name('test1');
    Route::get('component',[App\Http\Controllers\ReactController::class,'component'])->name('component');
    Route::get('componentpage',[App\Http\Controllers\ReactController::class,'componentpage'])->name('componentpage');
    Route::get('blog',[App\Http\Controllers\ReactController::class,'blog'])->name('blog');
    Route::get('blogabout',[App\Http\Controllers\ReactController::class,'blogabout'])->name('blogabout');
});

