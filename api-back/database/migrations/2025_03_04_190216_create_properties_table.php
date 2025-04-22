<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreatePropertiesTable extends Migration
{
    public function up()
    {
        Schema::create('properties', function (Blueprint $table) {
            $table->id();
            $table->string('title', 255);
            $table->string('address', 255);
            $table->decimal('price', 10, 2); // Para precios como 250000.00
            $table->string('location', 255);
            $table->string('main_image')->nullable(); // URL o path de la imagen principal
            $table->string('status', 50); // Por ejemplo, "disponible", "vendida", "en alquiler"
            $table->unsignedBigInteger('category_id')->nullable(); // Relación con Category
            $table->timestamps();

            // Foreign keys (opcional, pero recomendado para integridad)
            $table->foreign('category_id')->references('id')->on('categories')->onDelete('set null');
            $table->foreign('customer_id')->references('id')->on('customers')->onDelete('set null');
        });
    }

    public function down()
    {
        Schema::dropIfExists('properties');
    }
}