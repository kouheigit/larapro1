<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Inquire extends Model
{
    use HasFactory;
    protected $table ='inquires';
    protected $fillable = [
        'name',
        'kane',
        'type',
        'email',
        'contact',
    ];
}

