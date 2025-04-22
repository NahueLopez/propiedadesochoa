<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Image extends Model
{
    protected $table = 'images'; 

    protected $fillable = [
        'property_id',
        'image_path',
    ];

    // Relación con Property (una imagen pertenece a una propiedad)
    public function property(): BelongsTo
    {
        return $this->belongsTo(Property::class);
    }
}