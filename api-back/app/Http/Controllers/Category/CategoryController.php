<?php

namespace App\Http\Controllers\Category;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Category;

class CategoryController extends Controller
{
    public function index()
    {
        $categorys = Category::all();
        return response()->json($categorys);
    }

    public function show($id)
    {
        $Category = Category::find($id);
        if (!$Category) {
            return response()->json(['message' => 'Categoría no encontrada'], 404);
        }
        return response()->json($Category);
    }

    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
        ]);

        $Category = Category::create($validatedData);
        return response()->json($Category, 201);
    }

    public function update(Request $request, $id)
    {
        $Category = Category::find($id);
        if (!$Category) {
            return response()->json(['message' => 'Categoría no encontrada'], 404);
        }

        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
        ]);

        $Category->update($validatedData);
        return response()->json($Category);
    }

    public function destroy($id)
    {
        $Category = Category::find($id);
        if (!$Category) {
            return response()->json(['message' => 'Categoría no encontrada'], 404);
        }

        $Category->delete();
        return response()->json(['message' => 'Categoría eliminada exitosamente']);
    }

    public function categoryProperties()
    {
        // Solo devolver categorías que tienen al menos una propiedad asociada
        $categories = Category::has('properties')->get();
        return response()->json($categories);
    }

}
