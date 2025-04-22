<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreatePropertyAttributeTable extends Migration
{
    public function up()
    {
        Schema::create('property_attribute', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('property_id');
            $table->unsignedBigInteger('attribute_id');
            $table->timestamps();

            $table->foreign('property_id')->references('id')->on('properties')->onDelete('cascade');
            $table->foreign('attribute_id')->references('id')->on('attributes')->onDelete('cascade');

            // Evitar duplicados (única combinación de property_id y attribute_id)
            $table->unique(['property_id', 'attribute_id']);
        });
    }

    public function down()
    {
        Schema::dropIfExists('property_attribute');
    }
}