<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Storage;

class SearchController extends Controller
{

    private $whoisurl = 'https://dev-whois.jagoanhosting.com/api/v2/whois';
    private $whoiskey = 'UAyP7POCcVJ8Pq9Pt1v987';

    public function search(Request $request) {
        $data = $this->loadData();

        $extensions = $data['extensions'];
        $spotlight = $data['config']['SEARCH_DOMAIN_SPOTLIGHT'];
        $category = $data['categories'];


        $input = $request->input('keyword', '');
        $domains = $this->generateDomain($input, $extensions);

        return response()->json([
            'spotlight' => $spotlight,
            'categories' => $category,
            'suggestion' => $domains
        ]);

    }

    public function checkWhoIs(Request $request){
        try{
            $domain = $request->input('domain', '');
            $response = Http::withHeaders([
                'X-WHOIS-AUTH' => $this->whoiskey,
                'Content-Type: application/json'
            ])->post($this->whoisurl, ['domain' => $domain]);

            $result = $response->json();
            dd($result);

        } catch (\Exception $e) {
            dd($e);
        }
    }

    private function generateDomain($keyword, $extensions){
        $domains = [];
        foreach($extensions as $e) {
            $domain = $keyword . '.' . $e['extension'];
            $domains[] = [
                'domain' => $domain,
                'price' => $e['register']];
        }
        return $domains;
    }

    private function loadData() {
        $data = Storage::disk('public')->get('domains.json');
        $data = json_decode($data, true);
        return $data['data'];
    }
}
