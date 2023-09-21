<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class ReactController extends Controller
{
    public function componentpage(Request $request)
    {
        return view('react.componentpage');
    }
    public function test(Request $request)
    {
        return view('react.test');
    }
    public function test1(Request $request)
    {
        return view('react.test1');
    }
    public function component(Request $request)
    {
        return view('react.component');
    }
}
