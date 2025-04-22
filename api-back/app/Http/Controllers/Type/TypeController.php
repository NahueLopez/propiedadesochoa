<?php

namespace App\Http\Controllers\Type;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Type;

class TypeController extends Controller
{
    public function index()
    {
        $types = Type::all();
        return response()->json($types);
    }

    public function show($id)
    {
        $type = Type::find($id);
        if (!$type) {
            return response()->json(['message' => 'Tipo no encontrado'], 404);
        }
        return response()->json($type);
    }

    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
        ]);

        $type = Type::create($validatedData);
        return response()->json($type, 201);
    }

    public function update(Request $request, $id)
    {
        $type = Type::find($id);
        if (!$type) {
            return response()->json(['message' => 'Tipo no encontrado'], 404);
        }

        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
        ]);

        $type->update($validatedData);
        return response()->json($type);
    }

    public function destroy($id)
    {
        $type = Type::find($id);
        if (!$type) {
            return response()->json(['message' => 'Tipo no encontrado'], 404);
        }

        $type->delete();
        return response()->json(['message' => 'Tipo eliminado exitosamente']);
    }

    public function typeProperties()
    {
        // Solo devolver tipos que tienen al menos una propiedad asociada
        $types = Type::has('properties')->get();
        return response()->json($types);
    }
}