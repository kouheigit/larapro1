<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Freeday extends Model
{
    use HasFactory;
    protected $table ='freedays';
    protected $fillable = [
        'id',
        'user_id',
        'freedays',
        'max_freedays',
        'start_date',
        'end_date',
    ];
}
