<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Reservation extends Model
{
    use HasFactory;
    protected $table ='reservation';
    protected $fillable = [
        'hotel_id',
        'user_id',
        'owner_id',
        'invitation_id',
        'calendar_id',
        'checkin_date',
        'checkout_date',
        'checkin_time',
        'checkout_time',
        'days',
        'name',
        'adult',
        'child',
        'dog',
        'note',
        'room_key',
        'payment',
        'status',
        'upload',
        'upload1',
        'upload2',
        'upload3',
        'deleted_at',

    ];
}
