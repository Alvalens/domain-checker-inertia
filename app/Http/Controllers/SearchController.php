<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class SearchController extends Controller
{
    private $whoisurl = 'https://dev-whois.jagoanhosting.com/api/v2/whois';
    private $whoiskey = 'UAyP7POCcVJ8Pq9Pt1v987';

    public function index()
    {
        $data = $this->loadData();

        return Inertia::render('SearchDomain', [
            'spotlight' => $data['config']['SEARCH_DOMAIN_SPOTLIGHT'],
            'categories' => $data['categories'],
        ]);
    }

    public function search(Request $request)
    {
        $data = $this->loadData();
        $extensions = $data['extensions'];
        $spotlightExtensions = $data['config']['SEARCH_DOMAIN_SPOTLIGHT'];
        $page = $request->input('page', 1);

        $input = $request->input('keyword', '');
        $inputDomainParts = explode('.', $input);
        $keyword = $inputDomainParts[0];
        $hasExtension = count($inputDomainParts) > 1;

        $spotlightDomain = null;
        $suggestions = [];

        if ($hasExtension) {
            $domain = $input;
            $inputExtension = end($inputDomainParts);
            $extensionExists = false;
            foreach ($extensions as $ext) {
                if ($ext['extension'] === $inputExtension) {
                    $extensionExists = true;
                    break;
                }
            }

            if ($extensionExists) {
                $status = $this->checkDomainStatus($domain);
                $spotlightDomain = [
                    'domain' => $domain,
                    'price' => null,
                    'status' => $status['meta']['success']
                    ? ($status['data']['is_available'] ? 'available' : 'not_available')
                    : 'error'
                ];
            }
        }

        if (!$spotlightDomain || $spotlightDomain['status'] === 'not_available') {
            foreach ($spotlightExtensions as $ext) {
                $domain = $keyword . $ext;
                $status = $this->checkDomainStatus($domain);
                if ($status['meta']['success'] && $status['data']['is_available']) {
                    $spotlightDomain = [
                        'domain' => $domain,
                        'price' => null,
                        'status' => 'available',
                        'desiredDomain' => $input,
                    ];
                    break;
                }
            }
        }

        $suggestions = $this->generateDomain($keyword, $extensions, $page);

        return response()->json([
            'spotlight' => $spotlightDomain,
            'suggestions' => $suggestions['domains'],
            'hasMore' => $suggestions['hasMore'],
            'categories' => $data['categories'],
        ]);
    }

    private function checkDomainStatus($domain)
    {
        try {
            $response = Http::withHeaders([
                'X-WHOIS-AUTH' => $this->whoiskey,
                'Content-Type' => 'application/json',
            ])->post($this->whoisurl, ['domain' => $domain]);

            $data = $response->json();

            return [
                'meta' => [
                    'success' => $response->successful(),
                ],
                'data' => [
                    'is_available' => $data['data']['is_available'] ?? false,
                ]
            ];
        } catch (\Exception $e) {
            return [
                'meta' => ['success' => false],
                'data' => ['is_available' => false]
            ];
        }
    }


    public function checkWhoIs(Request $request)
    {
        try {
            $domain = $request->input('domain', '');
            $response = Http::withHeaders([
                'X-WHOIS-AUTH' => $this->whoiskey,
                'Content-Type' => 'application/json',
            ])->post($this->whoisurl, ['domain' => $domain]);

            return response()->json($response->json());
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'An error occurred while fetching WHOIS data.',
                'details' => $e->getMessage(),
            ], 500);
        }
    }

    private function generateDomain($keyword, $extensions, $page = 1, $perPage = 15)
    {
        $allDomains = array_map(function ($extension) use ($keyword) {
            return [
                'domain' => $keyword . '.' . $extension['extension'],
                'price' => $extension['register'],
            ];
        }, $extensions);

        $offset = ($page - 1) * $perPage;
        return [
            'domains' => array_slice($allDomains, $offset, $perPage),
            'hasMore' => count($allDomains) > ($offset + $perPage)
        ];
    }

    private function loadData()
    {
        $data = Storage::disk('public')->get('domains.json');
        return json_decode($data, true)['data'];
    }
}
