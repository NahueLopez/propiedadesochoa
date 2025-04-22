<?php

namespace App\Http\Controllers\Attribute;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Attribute;

class AttributeController extends Controller
{
    public function index()
    {
        $attributes = Attribute::all();
        return response()->json($attributes);
    }

    public function show($id)
    {
        $attribute = Attribute::find($id);
        if (!$attribute) {
            return response()->json(['message' => 'Atributo no encontrado'], 404);
        }
        return response()->json($attribute);
    }

    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
        ]);

        $attribute = Attribute::create($validatedData);
        return response()->json($attribute, 201);
    }

    public function update(Request $request, $id)
    {
        $attribute = Attribute::find($id);
        if (!$attribute) {
            return response()->json(['message' => 'Atributo no encontrado'], 404);
        }

        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
        ]);

        $attribute->update($validatedData);
        return response()->json($attribute);
    }

    public function destroy($id)
    {
        $attribute = Attribute::find($id);
        if (!$attribute) {
            return response()->json(['message' => 'Atributo no encontrado'], 404);
        }

        $attribute->delete();
        return response()->json(['message' => 'Atributo eliminado exitosamente']);
    }

    public function attributeProperties()
    {
        // Solo devolver atributos que tienen al menos una propiedad asociada
        $attributes = Attribute::has('properties')->get();
        return response()->json($attributes);
    }
}