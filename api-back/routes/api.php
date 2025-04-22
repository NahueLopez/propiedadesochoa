<?php
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\User\UserController;
use App\Http\Controllers\Category\CategoryController;
use App\Http\Controllers\Attribute\AttributeController;
use App\Http\Controllers\Customer\CustomerController;
use App\Http\Controllers\Property\PropertyController;
use App\Http\Controllers\Type\TypeController;
use App\Http\Controllers\Ubicacion\UbicacionController;

// Rutas no protegidas

//Rutas de autenticación
Route::post('/login', [AuthController::class, 'login']);
Route::post('/usuario', [UserController::class, 'store']);

// Rutas no protegidas de categorias
Route::get('/categorias', [CategoryController::class, 'index']);
Route::get('/categoria/{id}', [CategoryController::class, 'show']);
Route::get('/categorias_propiedades', [CategoryController::class, 'categoryProperties']);

// Rutas no protegidas de tipos
Route::get('/tipos', [TypeController::class, 'index']);
Route::get('/tipos/{id}', [TypeController::class, 'show']);
Route::get('/tipos_propiedades', [TypeController::class, 'typeProperties']);

// Rutas no protegidas de ubicaciones
Route::get('/ubicaciones', [UbicacionController::class, 'index']);
Route::get('/ubicacion/{id}', [UbicacionController::class, 'show']);
Route::get('/ubicaciones_propiedades', [UbicacionController::class, 'ubicacionProperties']);

// Rutas no protegidas de atributos
Route::get('/atributos', [AttributeController::class, 'index']);
Route::get('/atributo/{id}', [AttributeController::class, 'show']);
Route::get('/atributos_propiedades', [AttributeController::class, 'attributeProperties']);

// Rutas no protegidas de propiedades
Route::get('/propiedades', [PropertyController::class, 'index']);
Route::get('/propiedad/{id}', [PropertyController::class, 'show']);
Route::get('/ultimas_propiedades', [PropertyController::class, 'latest']);

// Rutas protegidas
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    // Rutas protegidas de users
    Route::get('/usuarios', [UserController::class, 'index']);
    Route::get('/usuario/{id}', [UserController::class, 'show']);
    Route::patch('/usuario/{id}', [UserController::class, 'update']);
    Route::delete('/usuario/{id}', [UserController::class, 'destroy']);

    // Rutas protegidas de categorias
    Route::post('/categoria', [CategoryController::class, 'store']);
    Route::patch('/categoria/{id}', [CategoryController::class, 'update']);
    Route::delete('/categoria/{id}', [CategoryController::class, 'destroy']);

    // Rutas protegidas de tipos
    Route::post('/tipos', [TypeController::class, 'store']);
    Route::patch('/tipos/{id}', [TypeController::class, 'update']);
    Route::delete('/tipos/{id}', [TypeController::class, 'destroy']);

    // Rutas protegidas de ubicaciones
    Route::post('/ubicacion', [UbicacionController::class, 'store']);
    Route::patch('/ubicacion/{id}', [UbicacionController::class, 'update']);
    Route::delete('/ubicacion/{id}', [UbicacionController::class, 'destroy']);

    // Rutas protegidas de atributos
    Route::post('/atributo', [AttributeController::class, 'store']);
    Route::patch('/atributo/{id}', [AttributeController::class, 'update']);
    Route::delete('/atributo/{id}', [AttributeController::class, 'destroy']);

    // Rutas protegidas de atributos
    Route::get('/clientes', [CustomerController::class, 'index']);
    Route::get('/cliente/{id}', [CustomerController::class, 'show']);
    Route::post('/cliente', [CustomerController::class, 'store']);
    Route::patch('/cliente/{id}', [CustomerController::class, 'update']);
    Route::delete('/cliente/{id}', [CustomerController::class, 'destroy']);

    // Rutas protegidas de propiedades
    Route::post('/propiedad', [PropertyController::class, 'store']);
    Route::post('/propiedad/{property}', [PropertyController::class, 'update']);
    Route::delete('/propiedad/{id}', [PropertyController::class, 'destroy']);

});


