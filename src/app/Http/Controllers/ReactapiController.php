<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Inquire;

class ReactapiController extends Controller
{
    public function insert(Request $request)
    {
        $name = $request->name;
        $kana = $request->kana;
        $email = $request->email;
        //type 0 type 1
        $type = $request->type;
        $previousCompany = $request->previousCompany;
        $previousTitle = $request->previousTitle;
        $social = $request->social;
        $entrytype = $request->entrytype;
        $jobType = $request->jobType;
        $contact =$request->contact;



            $value = [
                'name' => $name,
                'kana' => $kana,
                'email' => $email,
                'type' => $type,
                'previousTitle' => $previousTitle,
                'previousCompany' => $previousCompany,
                'social' => $social,
                'entrytype' => $entrytype,
                'jobType' => $jobType,
                'contact' => $contact,
            ];

        /*insert add */
        /*
        $insert = new Insert();
        $insert->name = $request->name;
        $insert->password = $request->password;
        $insert->save();
        return response()->json($insert,200);*/
        return response()->json(200);
    }
}
