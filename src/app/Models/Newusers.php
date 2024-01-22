<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Newusers extends Model
{
    use HasFactory;
    protected $table ='newusers';
    protected $fillable = [
        'id',
        'member_id',
        'name',
        'email',
        'email_verified_at',
        'password',
        'remember_token',
        'last_name',
first_name
last_kana
first_kana
zip1
zip2
address1
address2
tel
company_name
company_kana
company_zip1
company_zip2
company_address1
company_address2
company_tel
company_fax
send_name
send_kana
send_zip1
send_zip2
send_address1
send_address2
send_tel
type
agree
status
user_id
deleted_at

    ];
}
