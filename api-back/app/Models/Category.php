<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    protected $table = 'categories';

    protected $fillable = [
        'name',
    ];

    public $timestamps = false;

    // Relación: Una categoría tiene muchas propiedades
    public function properties()
    {
        return $this->hasMany(Property::class, 'category_id');
    }
}