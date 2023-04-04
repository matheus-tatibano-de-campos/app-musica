<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\File;

class AudioController extends Controller
{
    public function index()
    {
        $files = Storage::disk('public')->files('audio');
        $audioFiles = array_filter($files, function ($file) {
            return preg_match('/\.(mp3|wav|ogg)$/i', $file);
        });

        $audioFiles = array_map(function ($file) {
            return basename($file);
        }, $audioFiles);

        return response()->json($audioFiles);
    }

    public function play($filename)
    {
        $path = Storage::disk('public')->path('audio/' . $filename);

        if (!Storage::disk('public')->exists('audio/' . $filename)) {
            abort(404);
        }

        $file = Storage::disk('public')->get('audio/' . $filename);
        $mimeType = File::mimeType($path);

        return new Response($file, 200, [
            'Content-Type' => $mimeType,
        ]);
    }
}
