<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class ReactController extends Controller
{
    public function pokemon(Request $reqeust)
    {
        return view('react.pokemon');
    }
    public function bloglink(Request $request)
    {
        return view('react.bloglink');
    }
    public function blogtest(Request $request)
    {
        return view('react.blogtest');
    }
    public function blogblog(Request $request)
    {
        return view('react.blogblog');
    }
    public function blogabout(Request $request)
    {
        return view('react.blogabout');
    }
    public function blog(Request $request)
    {
        return view('react.blog');
    }
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
    public function reactdivision(Request $request)
    {
        return view('react.division');
    }
    public function reactrouting(Request $request)
    {
        return view('react.reactrouting');
    }

}
