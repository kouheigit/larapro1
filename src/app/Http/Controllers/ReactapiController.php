<?php

namespace App\Http\Controllers;

use Carbon\Carbon;
use Illuminate\Http\Request;
use App\Models\Inquire;
use App\Models\Applicant;

class ReactapiController extends Controller
{
    public function insert(Request $request)
    {
        //変数受け取り
        $name = $request->name;
        $kana = $request->kana;
        $email = $request->email;
        $message = $request->message;
        //type 0 type 1
        $type = $request->type;
        $previousCompany = $request->previousCompany;
        $previousTitle = $request->previousTitle;
        $social = $request->social;
        $entryType = $request->entryType;
        $jobType = $request->jobType;
        $resume = $request->file('resume');

        $filename = now()->format('YmdHis') . uniqid('', true) . "." .  $resume->extension();
        $path =  $resume->storeAs('FILE/', $filename, 'public');



        //配列出力
        $jobs = $jobType[0];
        $entryTypes = $entryType[0];


        if($type==0) {
            $value = [
                'name'=>$name,
                'kana'=>$kana,
                'email'=>$email,
                'type'=>$type,
                'contact'=>$message,
                'created_at'=>new Carbon('Asia/Tokyo'),
            ];
            Inquire::insert($value);
        }else{
            $value1 = [
                'name'=>$name,
                'kana'=>$kana,
                'email'=>$email,
                'type'=>$type,
                'previousTitle'=>$previousTitle,
                'previousCompany'=>$previousCompany,
                'social'=>$social,
                'entrytype'=>$entryTypes,
                'jobType'=>$jobs,
                'contact'=>$message,
                'created_at'=>new Carbon('Asia/Tokyo'),
            ];

            //Applicant::insert
            Applicant::insert($value1);
        }
        //return response()->json(['success' => true], 200);
        return response()->json($path,200);
    }
}
