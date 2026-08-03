<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Member;
use Illuminate\Http\JsonResponse;

class MemberController extends Controller
{
    public function index(): JsonResponse
    {
        $members = Member::orderByDesc('is_leader')
            ->orderBy('sort_order')
            ->get();

        return response()->json($members);
    }
}
