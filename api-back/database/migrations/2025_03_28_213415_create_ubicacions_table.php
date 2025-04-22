<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateUbicacionsTable extends Migration
{
    public function up()
    {
        Schema::create('ubicacions', function (Blueprint $table) {
            $table->id();
            $table->string('name'); // Nombre de la ubicación (por ejemplo, "Centro", "Norte")
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('ubicacions');
    }
}