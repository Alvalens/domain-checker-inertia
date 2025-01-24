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

    public function search(Request $request)
    {
        $data = $this->loadData();
        $extensions = $data['extensions'];
        $spotlightExtensions = $data['config']['SEARCH_DOMAIN_SPOTLIGHT'];

        $page = $request->input('page', 1);
        $input = $request->input('keyword', '');
        $category = $request->input('category', '');
        $inputDomainParts = explode('.', $input);
        $keyword = $inputDomainParts[0];
        $hasExtension = count($inputDomainParts) > 1;

        $spotlightDomain = null;

        if ($hasExtension) {
            $domain = $input;
            $inputExtension = end($inputDomainParts);
            $extensionExists = $this->getExtension($extensions, $inputExtension);

            if ($extensionExists) {
                $status = $this->checkDomainStatus($domain);
                $spotlightDomain = [
                    'domain' => $domain,
                    'gimmick_price' => $extensionExists['gimmick_price'] ?? null,
                    'price' => $extensionExists['register'] ?? null,
                    'status' => $status['meta']['success']
                        ? ($status['data']['is_available'] ? 'available' : 'not_available')
                        : 'error',
                    'hasExtension' => true,
                ];
            }
        }

        if (!$spotlightDomain || $spotlightDomain['status'] === 'not_available') {
            foreach ($spotlightExtensions as $ext) {
                $domain = $keyword . $ext;
                $extensionExists = $this->getExtension($extensions, ltrim($ext, '.'));
                if ($extensionExists) {
                    $status = $this->checkDomainStatus($domain);
                    if ($status['meta']['success'] && $status['data']['is_available']) {
                        $spotlightDomain = [
                            'domain' => $domain,
                            'gimmick_price' => $extensionExists['gimmick_price'] ?? null,
                            'price' => $extensionExists['register'] ?? null,
                            'status' => 'available',
                            'hasExtension' => $hasExtension,
                            'desiredDomain' => $hasExtension ? $input : null,
                        ];
                        break;
                    }
                }
            }
        }

        $suggestions = $this->generateDomain($keyword, $extensions, $page, $category);

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

    private function generateDomain($keyword, $extensions, $page = 1, $category = '', $perPage = 15)
    {
        $filteredExtensions = $category
            ? array_filter($extensions, function ($extension) use ($category) {
                return in_array($category, $extension['categories']);
            })
            : $extensions;

        $allDomains = array_map(function ($extension) use ($keyword) {
            return [
                'domain' => $keyword . '.' . $extension['extension'],
                'gimmick_price' => $extension['gimmick_price'] ?? null,
                'price' => $extension['register'] ?? null,
            ];
        }, $filteredExtensions);

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

    private function getExtension($extensions, $extensionName)
    {
        foreach ($extensions as $ext) {
            if ($ext['extension'] === $extensionName) {
                return $ext;
            }
        }
        return null;
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


}
