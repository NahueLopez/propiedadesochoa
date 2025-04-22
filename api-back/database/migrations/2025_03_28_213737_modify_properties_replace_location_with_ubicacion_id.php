<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class ModifyPropertiesReplaceLocationWithUbicacionId extends Migration
{
    public function up()
    {
        Schema::table('properties', function (Blueprint $table) {
            // Eliminar el campo location
            $table->dropColumn('location');

            // Añadir el campo ubicacion_id
            $table->unsignedBigInteger('ubicacion_id')->nullable()->after('type_id');
            $table->foreign('ubicacion_id')->references('id')->on('ubicacions')->onDelete('set null');
        });
    }

    public function down()
    {
        Schema::table('properties', function (Blueprint $table) {
            // Revertir: eliminar ubicacion_id y restaurar location
            $table->dropForeign(['ubicacion_id']);
            $table->dropColumn('ubicacion_id');

            $table->string('location')->nullable()->after('price');
        });
    }
}