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
            $table->string('name',255)->nullable(true);
            $table->string('kana',255)->nullable(true);
            $table->smallInteger('type')->nullable(true);
            $table->smallInteger('entrytype')->nullable(true);
            $table->smallInteger('jobType')->nullable(true);
            $table->string('email',255)->nullable(true);
            $table->string('previousCompany',255)->nullable(true);
            $table->string('previousTitle',255)->nullable(true);
            $table->string('social',255)->nullable(true);
            $table->string('contact',1500)->nullable(true);
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
