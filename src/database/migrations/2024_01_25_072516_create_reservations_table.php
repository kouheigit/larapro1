<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateReservationsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('reservations', function (Blueprint $table) {
            $table->id();
            $table->int('hotel_id');
            $table->int('user_id');
            $table->int('owner_id');
            $table->int('invitation_id')->nullable('true');
            $table->bigIncrements('calendar_id')->nullable('true');
            $table->date('checkin_date');
            $table->date('checkout_date');
            $table->time('checkin_time')->nullable('true');
            $table->time('checkout_time')->nullable('true');
            $table->smallInteger('days');
            $table->string('name');
            $table->smallInteger('adult');
            $table->smallInteger('child');
            $table->smallInteger('dog');
            $table->string('note')->nullable('true');;
            $table->string('room_key')->nullable('true');;
            $table->smallInteger('payment');
            $table->smallInteger('status');
            $table->string('upload')->nullable('true');;
            $table->string('upload1')->nullable('true');;
            $table->string('upload2')->nullable('true');;
            $table->string('upload3')->nullable('true');;
            $table->timestamps('deleted_at')->nullable('true');
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
        Schema::dropIfExists('reservations');
    }
}
