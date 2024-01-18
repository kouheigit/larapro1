<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class KpgController extends Controller
{
    public function index(Request $request)
    {
        return view('kpg.index');
    }
}
