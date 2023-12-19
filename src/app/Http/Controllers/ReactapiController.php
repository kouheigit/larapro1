<?php

namespace App\Http\Controllers;

use Carbon\Carbon;
use Illuminate\Http\Request;
use App\Models\Inquire;
use App\Models\Applicant;
use Illuminate\Support\Facades\Storage;

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
        $cv = $request->file('cv');


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
            Applicant::insert($value1);
            //履歴書アップロード
            if($resume){
                $filename = $name . "履歴書" .now()->format('YmdHis'). "." .  $resume->extension();
                $resume->storeAs('RESUME', $filename, 'public');
            }
            //職務経歴書アップロード
            if($cv){
                $filename = $name . "職務経歴書" .now()->format('YmdHis'). "." .  $resume->extension();
                $resume->storeAs('CV', $filename, 'public');
            }
        }
        //レスポンス
        return response()->json($resume,200);
    }
}
