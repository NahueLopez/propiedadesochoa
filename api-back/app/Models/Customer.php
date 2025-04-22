<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Customer extends Model
{
    protected $fillable = ['name','lastname', 'email', 'phone'];

    public function properties()
    {
        return $this->belongsToMany(Property::class, 'property_customer')
                    ->withPivot('role')
                    ->withTimestamps();
    }
}