<?php

namespace App\Http\Controllers\Ubicacion;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Ubicacion;

class UbicacionController extends Controller
{
    public function index()
    {
        $ubicacions = Ubicacion::all();
        return response()->json($ubicacions);
    }

    public function show($id)
    {
        $ubicacion = Ubicacion::find($id);
        if (!$ubicacion) {
            return response()->json(['message' => 'Ubicación no encontrada'], 404);
        }
        return response()->json($ubicacion);
    }

    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
        ]);

        $ubicacion = Ubicacion::create($validatedData);
        return response()->json($ubicacion, 201);
    }

    public function update(Request $request, $id)
    {
        $ubicacion = Ubicacion::find($id);
        if (!$ubicacion) {
            return response()->json(['message' => 'Ubicación no encontrada'], 404);
        }

        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
        ]);

        $ubicacion->update($validatedData);
        return response()->json($ubicacion);
    }

    public function destroy($id)
    {
        $ubicacion = Ubicacion::find($id);
        if (!$ubicacion) {
            return response()->json(['message' => 'Ubicación no encontrada'], 404);
        }

        $ubicacion->delete();
        return response()->json(['message' => 'Ubicación eliminada exitosamente']);
    }

    public function ubicacionProperties()
    {
        // Solo devolver ubicaciones que tienen al menos una propiedad asociada
        $ubicacions = Ubicacion::has('properties')->get();
        return response()->json($ubicacions);
    }
}