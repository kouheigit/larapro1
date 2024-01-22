<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateNewusersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('newusers', function (Blueprint $table) {
            $table->id();
            $table->strig('member_id')->nullable(true);
            $table->string('name')->nullable(true);
            $table->string('email')->nullable(true);
            $table->timestamp('email_verified_at')->nullable(true);
            $table->string('password')->nullable(true);
            $table->string('remember_token')->nullable(true);
            $table->string('last_name');
            $table->string('first_name');
            $table->string('last_kana')->nullable(true);
            $table->string('first_kana')->nullable(true);
            $table->string('zip1')->nullable(true);
            $table->string('zip2')->nullable(true);
            $table->string('address1')->nullable(true);
            $table->string('address2')->nullable(true);
            $table->string('tel')->nullable(true);
            $table->string('company_name')->nullable(true);
            $table->string('company_kana')->nullable(true);
            $table->string('company_zip1')->nullable(true);
            $table->string('company_zip2')->nullable(true);
            $table->string('company_address1')->nullable(true);
            $table->string('company_address2')->nullable(true);
            $table->string('company_tel')->nullable(true);
            $table->string('company_fax')->nullable(true);
            $table->string('send_name')->nullable(true);
            $table->string('send_kana')->nullable(true);
            $table->string('send_zip1')->nullable(true);
            $table->string('send_zip2')->nullable(true);
            $table->string('send_tel')->nullable(true);
            $table->smallInteger('type')->nullable(true);
            $table->smallInteger('agree')->nullable(true);
            $table->smallInteger('status');
            $table->smallInteger('user_id');
            $table->timestamps('deleted_at')->nullable(true);
            $table->timestamps();













            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('newusers');
    }
}
