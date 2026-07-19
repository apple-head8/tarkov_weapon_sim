<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Routing\Controller as BaseController;

class FirearmsController extends BaseController
{
    public function getFormattedFirearms(Request $request)
    {
        $gun_name = $request->query('gun_name', ''); // 'query'パラメータを取得、なければ'default_value'
        if ($gun_name === '') {
            response()->json([]);
        }

        $response = Http::withHeaders([
            'Content-Type' => 'application/json',
            'AUTH-Token' => env("TARKOV_API_AUTH_KEY"),
        ])->get('https://api.tarkov-changes.com/v1/firearms', [
            'query' => $gun_name,
        ]);

        // $response_HIGE = Http::withHeaders([
        //     'Content-Type' => 'application/json',
        //     'AUTH-Token' => env("TARKOV_API_AUTH_KEY"),
        // ])->get('https://api.tarkov-changes.com/v1/mods');
        // logger($response_HIGE);

        if ($response->ok()) {
            $data = $response->json();
            // ここでデータの整形を行います。例えば、特定のフィールドを取り出すなど。
            $formattedData = collect($data)->map(function ($item) {
                return [
                    'Item Weight' => $item['Item Weight'],
                    'Ergonomics' => $item['Ergonomics'],
                    // 他の必要なフィールドもここで指定
                ];
            });

            return response()->json($formattedData);
        } else {
            // エラーハンドリング
            return response()->json(['error' => 'Failed to fetch data from API'], $response->status());
        }
    }
}
