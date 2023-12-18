<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Applicant extends Model
{
    use HasFactory;
    protected $table ='applicants';
    protected $fillable = [
        'name',
        'kana',
        'type',
        'entrytype',
        'jobType',
        'email',
        'previousCompany',
        'previousTitle',
        'social',
        'contact',
    ];
}
