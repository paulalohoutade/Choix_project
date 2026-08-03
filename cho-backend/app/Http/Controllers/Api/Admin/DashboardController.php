<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Album;
use App\Models\Contact;
use App\Models\Donation;
use App\Models\Event;
use App\Models\Post;
use App\Models\Track;
use Illuminate\Http\JsonResponse;

class DashboardController extends Controller
{
    public function stats(): JsonResponse
    {
        return response()->json([
            'albums'            => Album::count(),
            'tracks'            => Track::count(),
            'total_plays'       => Track::sum('play_count'),
            'events_upcoming'   => Event::where('status', 'upcoming')->count(),
            'posts_published'   => Post::where('status', 'published')->count(),
            'unread_contacts'   => Contact::where('is_read', false)->count(),
            'donations_total'   => Donation::where('status', 'completed')->sum('amount'),
            'donations_pending' => Donation::where('status', 'pending')->count(),
        ]);
    }
}
