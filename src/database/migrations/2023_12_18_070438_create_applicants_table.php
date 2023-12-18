<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateApplicantsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('applicants', function (Blueprint $table) {
            $table->id();
            $table->string('name',255);
            $table->string('kana',255);
            $table->smallInteger('type');
            $table->smallInteger('entrytype');
            $table->smallInteger('jobType');
            $table->string('email',255);
            $table->string('previousCompany',255);
            $table->string('previousTitle',255);
            $table->string('social',255);
            $table->string('contact',1500);
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
        Schema::dropIfExists('applicants');
    }
}
