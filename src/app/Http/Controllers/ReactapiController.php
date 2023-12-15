<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class ReactapiController extends Controller
{
    public function insert(Request $request)
    {
        /*
        $insert = new Insert();
        $insert->name = $request->name;
        $insert->password = $request->password;
        $insert->save();
        return response()->json($insert,200);*/
        return response()->json(200);
    }
}
