<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddRoleToPropertyCustomerTable extends Migration
{
    public function up()
    {
        Schema::table('property_customer', function (Blueprint $table) {
            // Agregar la columna 'role' con solo 'owner' y 'client'
            $table->enum('role', ['owner', 'client'])->default('client')->after('customer_id');
        });
    }

    public function down()
    {
        Schema::table('property_customer', function (Blueprint $table) {
            // Eliminar la columna 'role'
            $table->dropColumn('role');
        });
    }
}