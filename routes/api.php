<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\DocumentController;
use App\Http\Controllers\Api\UserController;

// Route::get('/user', function (Request $request) {
//     return $request->user();
// })->middleware('auth:sanctum');

Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:api')->group(function () {

    Route::post('/logout', [AuthController::class, 'logout']);

    Route::get('/me', [AuthController::class, 'me']);

    Route::get('/documents', [DocumentController::class, 'index']);

    Route::post('/documents', [DocumentController::class, 'store']);

    Route::get('/documents/{document}/download', [
        DocumentController::class,
        'download',
    ]);

    Route::delete('/documents/{document}', [
        DocumentController::class,
        'destroy',
    ]);
});

Route::middleware(['auth:api', 'admin'])->group(function () {

    Route::post('/users', [
        UserController::class,
        'store',
    ]);

});