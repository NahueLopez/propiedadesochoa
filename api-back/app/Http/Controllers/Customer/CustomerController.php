<?php

namespace App\Http\Controllers\Customer;


use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Customer;

class CustomerController extends Controller
{
    // Display a listing of the resource.
    public function index()
    {
        $customers = Customer::all();
        return response()->json($customers);
    }

    // Store a newly created resource in storage.
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'lastname' => 'required|string|max:255',
            'phone' => 'required|string|unique:customers',
            'type' => 'required|string|max:50',
        ], [
            'phone.unique' => 'El número de teléfono ya está agregado.', // Mensaje personalizado
        ]);

        $customer = Customer::create($request->all());
        return response()->json($customer, 201);
    }

    // Display the specified resource.
    public function show($id)
    {
        $customer = Customer::findOrFail($id);
        return response()->json($customer);
    }

    // Update the specified resource in storage.
    public function update(Request $request, $id)
    {
        $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'lastname' => 'sometimes|required|string|max:255',
            'phone' => 'sometimes|required|string',
            'type' => 'sometimes|required|string|max:50',
        ]);

        $customer = Customer::findOrFail($id);
        $customer->update($request->all());
        return response()->json($customer);
    }

    // Remove the specified resource from storage.
    public function destroy($id)
    {
        $customer = Customer::findOrFail($id);
        $customer->delete();
        return response()->json(['message' => 'Cliente
        
        eliminada exitosamente']);
    }
}