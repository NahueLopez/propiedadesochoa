<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddValueColumnToPropertyAttributeTable extends Migration
{
    public function up()
    {
        Schema::table('property_attribute', function (Blueprint $table) {
            $table->string('value')->nullable()->after('attribute_id');
        });
    }

    public function down()
    {
        Schema::table('property_attribute', function (Blueprint $table) {
            $table->dropColumn('value');
        });
    }
}