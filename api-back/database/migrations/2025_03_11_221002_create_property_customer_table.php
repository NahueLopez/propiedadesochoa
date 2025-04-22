<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreatePropertyCustomerTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('property_customer', function (Blueprint $table) {
            $table->id(); // ID único para la relación (opcional, pero útil para referencias)
            $table->foreignId('property_id')
                  ->constrained('properties')
                  ->onDelete('cascade'); // Clave foránea hacia properties
            $table->foreignId('customer_id')
                  ->constrained('customers')
                  ->onDelete('cascade'); // Clave foránea hacia customers
            $table->boolean('is_owner')->default(false); // Campo para marcar si el cliente es el dueño
            $table->timestamps(); // Campos created_at y updated_at
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('property_customer');
    }
}