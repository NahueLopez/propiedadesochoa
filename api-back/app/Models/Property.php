<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Property extends Model
{
    protected $fillable = [
        'title',
        'description',
        'address',
        'price',
        'ubicacion_id',
        'main_image',
        'status',
        'category_id',
        'type_id',
        'habitaciones',
        'banos',
    ];

    public function customers()
    {
        return $this->belongsToMany(Customer::class, 'property_customer')
                    ->withPivot('role')
                    ->withTimestamps();
    }

    public function owners()
    {
        return $this->customers()->wherePivot('role', 'owner');
    }

    public function clients()
    {
        return $this->customers()->wherePivot('role', 'client');
    }

    public function tenants()
    {
        return $this->customers()->wherePivot('role', 'tenant');
    }

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function type()
    {
        return $this->belongsTo(Type::class);
    }

    public function ubicacion()
    {
        return $this->belongsTo(Ubicacion::class);
    }

    public function attributes()
    {
        return $this->belongsToMany(Attribute::class, 'property_attribute', 'property_id', 'attribute_id')
                    ->withPivot('value')
                    ->withTimestamps();
    }

    public function images()
    {
        return $this->hasMany(Image::class);
    }
}