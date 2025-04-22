<?php

namespace App\Http\Controllers\Property;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Property;
use Illuminate\Support\Facades\Storage;
use Illuminate\Http\Response;

class PropertyController extends Controller
{
    public function index(Request $request)
    {
        $query = Property::query()
            ->when($request->title, function ($query, $title) {
                $query->where('title', 'like', "%{$title}%");
            })
            ->when($request->ubicacion, function ($query, $ubicacion) {
                $query->whereHas('ubicacion', function ($q) use ($ubicacion) {
                    $q->where('name', 'like', "%{$ubicacion}%");
                });
            })
            ->when($request->status, function ($query, $status) {
                $query->where('status', $status);
            })
            ->when($request->address, function ($query, $address) {
                $query->where('address', 'like', "%{$address}%");
            })
            // Filtrar por nombre de categoría
            ->when($request->categoria, function ($query, $categoria) {
                $query->whereHas('category', function ($q) use ($categoria) {
                    $q->where('name', $categoria);
                });
            })
            // Filtrar por nombre de tipo
            ->when($request->type, function ($query, $type) {
                $query->whereHas('type', function ($q) use ($type) {
                    $q->where('name', $type);
                });
            })
            // Filtrar por rango de precio
            ->when($request->precio, function ($query, $precio) {
                if ($precio === 'Menos de 25000') {
                    $query->where('price', '<', 25000);
                } elseif ($precio === 'Entre 25000 y 50000') {
                    $query->whereBetween('price', [25000, 50000]);
                } elseif ($precio === 'Más de 50000') {
                    $query->where('price', '>', 50000);
                }
            })
            // Filtrar por atributos
            ->when($request->atributos, function ($query, $atributos) {
                $atributosArray = is_array($atributos) ? $atributos : explode(',', $atributos);
                foreach ($atributosArray as $atributo) {
                    $query->whereHas('attributes', function ($q) use ($atributo) {
                        $q->where('name', $atributo);
                    });
                }
            });

        $properties = $query->with(['category', 'type', 'ubicacion', 'attributes', 'customers', 'images'])->get();
        return response()->json($properties);
    }

    public function show($id)
    {
        $property = Property::with(['images', 'customers', 'attributes', 'category', 'type', 'ubicacion'])->find($id);

        if (!$property) {
            return response()->json(['message' => 'Property not found'], 404);
        }

        return response()->json($property);
    }

    public function store(Request $request)
    {
        try {
            \Log::info('Datos recibidos en store:', $request->all());
            \Log::info('Archivos recibidos en store:', $request->file());
    
            $validated = $request->validate([
                'title' => 'required|string|max:255',
                'description' => 'nullable|string', // Añadir description
                'address' => 'required|string|max:255',
                'price' => 'required|numeric',
                'ubicacion_id' => 'required|exists:ubicacions,id',
                'status' => 'required|in:available,sold,reserved',
                'category_id' => 'nullable|exists:categories,id',
                'type_id' => 'nullable|exists:types,id',
                'main_image_file' => 'nullable|image|max:2048',
                'secondary_images' => 'nullable|array',
                'secondary_images.*' => 'image|max:2048',
                'existing_secondary_images' => 'nullable|array', // Añadir para consistencia
                'existing_secondary_images.*' => 'string',
                'atributos' => 'nullable|array',
                'atributos.*.id' => 'required|exists:attributes,id',
                'atributos.*.value' => 'required',
                'owners' => 'nullable|array',
                'owners.*' => 'exists:customers,id',
                'tenants' => 'nullable|array',
                'tenants.*' => 'exists:customers,id',
            ]);
    
            \Log::info('Datos validados en store:', $validated);
    
            $property = new Property();
            $property->title = $validated['title'];
            $property->description = $validated['description'] ?? null; // Guardar description
            $property->address = $validated['address'];
            $property->price = $validated['price'];
            $property->ubicacion_id = $validated['ubicacion_id'];
            $property->status = $validated['status'];
            $property->category_id = $validated['category_id'] ?? null;
            $property->type_id = $validated['type_id'] ?? null;
    
            if ($request->hasFile('main_image_file')) {
                \Log::info('Procesando main_image_file en store:', ['name' => $request->file('main_image_file')->getClientOriginalName()]);
                $path = $request->file('main_image_file')->store('properties/images', 'public');
                $property->main_image = Storage::url($path);
            }
    
            $property->save();
    
            if ($request->hasFile('secondary_images')) {
                \Log::info('Nuevas imágenes secundarias detectadas en store:', ['count' => count($request->file('secondary_images'))]);
                foreach ($request->file('secondary_images') as $image) {
                    $path = $image->store('properties/images', 'public');
                    $imageUrl = Storage::url($path);
                    $property->images()->create(['image_path' => $imageUrl]);
                }
            }
    
            // existingSecondaryImages no debería usarse en store, pero logueamos si llega
            if ($request->has('existing_secondary_images')) {
                \Log::warning('existing_secondary_images recibido en store (no esperado):', ['images' => $request->input('existing_secondary_images')]);
            }
    
            if ($request->has('atributos') && !empty($request->atributos)) {
                $atributosArray = $request->input('atributos');
                foreach ($atributosArray as $atributo) {
                    if (!isset($atributo['id']) || !isset($atributo['value'])) {
                        return response()->json(['error' => 'Cada atributo debe tener un id y un valor válidos.'], 422);
                    }
                }
                $atributosToSync = collect($atributosArray)
                    ->mapWithKeys(function ($atributo) {
                        return [$atributo['id'] => ['value' => $atributo['value']]];
                    })
                    ->toArray();
                if (!empty($atributosToSync)) {
                    $property->attributes()->sync($atributosToSync);
                }
            }
    
            if ($request->has('owners')) {
                $property->customers()->attach($request->owners, ['role' => 'owner']);
            }
            if ($request->has('tenants')) {
                $property->customers()->attach($request->tenants, ['role' => 'tenant']);
            }
    
            return response()->json($property->load('category', 'type', 'ubicacion', 'customers', 'images', 'attributes'), 201);
        } catch (\Illuminate\Validation\ValidationException $e) {
            \Log::error('Error de validación en store:', ['errors' => $e->errors(), 'input' => $request->all()]);
            return response()->json(['errors' => $e->errors()], 422);
        } catch (\Exception $e) {
            \Log::error('Error al crear inmueble:', ['message' => $e->getMessage(), 'input' => $request->all()]);
            return response()->json(['error' => 'Error al crear la propiedad. Revisa los datos e intenta de nuevo.'], 500);
        }
    }

    public function update(Request $request, $id)
{
    try {
        $property = Property::findOrFail($id);
        \Log::info('Datos recibidos (all):', $request->all());
        \Log::info('Archivos recibidos:', $request->file());
        \Log::info('¿main_image_file presente?:', ['hasFile' => $request->hasFile('main_image_file')]);
        \Log::info('Headers:', $request->headers->all());

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'address' => 'required|string|max:255',
            'price' => 'required|numeric',
            'ubicacion_id' => 'required|exists:ubicacions,id',
            'status' => 'required|in:available,sold,reserved',
            'category_id' => 'nullable|exists:categories,id',
            'type_id' => 'nullable|exists:types,id',
            'main_image_file' => 'nullable|image|max:2048',
            'secondary_images' => 'nullable|array',
            'secondary_images.*' => 'image|max:2048',
            'existing_secondary_images' => 'nullable|array',
            'existing_secondary_images.*' => 'string',
            'atributos' => 'nullable|array',
            'atributos.*.id' => 'required|exists:attributes,id',
            'atributos.*.value' => 'required',
            'owners' => 'nullable|array',
            'owners.*' => 'exists:customers,id',
            'tenants' => 'nullable|array',
            'tenants.*' => 'exists:customers,id',
        ]);

        \Log::info('Datos validados:', $validated);

        $property->title = $validated['title'];
        $property->description = $validated['description'] ?? null;
        $property->address = $validated['address'];
        $property->price = $validated['price'];
        $property->ubicacion_id = $validated['ubicacion_id'];
        $property->status = $validated['status'];
        $property->category_id = $validated['category_id'] ?? null;
        $property->type_id = $validated['type_id'] ?? null;

        if ($request->hasFile('main_image_file')) {
            \Log::info('Procesando main_image_file:', ['name' => $request->file('main_image_file')->getClientOriginalName()]);
            if ($property->main_image) {
                \Log::info('Eliminando imagen anterior:', ['path' => $property->main_image]);
                Storage::disk('public')->delete(str_replace('/storage/', '', $property->main_image));
            }
            $path = $request->file('main_image_file')->store('properties/images', 'public');
            \Log::info('Nueva imagen guardada:', ['path' => $path]);
            $property->main_image = Storage::url($path);
        }

        $property->save();

        if ($request->hasFile('secondary_images')) {
            \Log::info('Nuevas imágenes secundarias detectadas:', ['count' => count($request->file('secondary_images'))]);
            foreach ($request->file('secondary_images') as $image) {
                $path = $image->store('properties/images', 'public');
                $imageUrl = Storage::url($path);
                $property->images()->create(['image_path' => $imageUrl]);
            }
        }

        // Manejar imágenes secundarias existentes
        if ($request->has('existing_secondary_images') && !empty($request->input('existing_secondary_images'))) {
            $existingImages = $request->input('existing_secondary_images', []);
            // Eliminar las imágenes que no están en la lista de imágenes existentes
            $property->images()->whereNotIn('image_path', $existingImages)->delete();
        } else {
            \Log::info('No se eliminaron imágenes secundarias porque existing_secondary_images está vacío o no se envió');
        }


        if ($request->has('atributos') && !empty($request->atributos)) {
            $atributosArray = $request->input('atributos');
            foreach ($atributosArray as $atributo) {
                if (!isset($atributo['id']) || !isset($atributo['value'])) {
                    return response()->json(['error' => 'Cada atributo debe tener un id y un valor válidos.'], 422);
                }
            }
            $atributosToSync = collect($atributosArray)
                ->mapWithKeys(function ($atributo) {
                    return [$atributo['id'] => ['value' => $atributo['value']]];
                })
                ->toArray();
            if (!empty($atributosToSync)) {
                $property->attributes()->sync($atributosToSync);
            }
        }

        if ($request->has('owners')) {
            $property->customers()->wherePivot('role', 'owner')->detach();
            $property->customers()->attach($request->owners, ['role' => 'owner']);
        }
        if ($request->has('tenants')) {
            $property->customers()->wherePivot('role', 'tenant')->detach();
            $property->customers()->attach($request->tenants, ['role' => 'tenant']);
        }

        return response()->json($property->load('category', 'type', 'ubicacion', 'customers', 'images', 'attributes'), 200);
    } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
        \Log::error('Inmueble no encontrado:', ['id' => $id]);
        return response()->json(['error' => "El inmueble con ID {$id} no existe."], 404);
    } catch (\Illuminate\Validation\ValidationException $e) {
        \Log::error('Error de validación:', ['errors' => $e->errors(), 'input' => $request->all()]);
        return response()->json(['errors' => $e->errors()], 422);
    } catch (\Exception $e) {
        \Log::error('Error al actualizar inmueble:', ['message' => $e->getMessage(), 'input' => $request->all()]);
        return response()->json(['error' => 'Error al actualizar la propiedad.'], 500);
    }
}

    
    

    public function destroy($id)
    {
        $property = Property::find($id);
        if (!$property) {
            return response()->json(['message' => 'Property not found'], 404);
        }

        if ($property->main_image) {
            Storage::delete(str_replace('/storage/', '', $property->main_image));
        }

        foreach ($property->images as $image) {
            Storage::delete(str_replace('/storage/', '', $image->image_path));
        }

        $property->delete();

        return response()->json(['message' => 'Property deleted successfully']);
    }

    public function latest()
    {
        $properties = Property::query()
            ->orderBy('created_at', 'desc')
            ->take(10)
            ->with(['category', 'type', 'ubicacion', 'attributes', 'customers', 'images'])
            ->get();

        return response()->json($properties);
    }
}