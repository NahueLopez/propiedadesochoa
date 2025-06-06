<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Attribute extends Model
{

    protected $table = 'attributes';

    protected $fillable = [
        'name',
    ];

    public $timestamps = false;

    public function properties()
    {
        return $this->belongsToMany(Property::class, 'property_attribute', 'attribute_id', 'property_id');
    }
}