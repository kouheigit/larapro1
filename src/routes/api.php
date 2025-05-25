<?php

use App\Http\Controllers\ReactapiController;
use App\Http\Controllers\TodoController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;


/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});
Route::group(['middleware' => 'api'], function () {
    Route::match(['post', 'get'], 'Reactapi', [ReactapiController::class, 'insert']);
});

Route::get('/todos',[TodoController::class,'index']);
Route::post('/todos', [TodoController::class, 'store']);
Route::delete('/todos/{id}', [TodoController::class, 'destroy']);
Route::patch('/todos/{id}', [TodoController::class, 'update']);




