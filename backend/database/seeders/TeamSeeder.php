<?php

namespace Database\Seeders;

use App\Models\Media;
use App\Models\TeamMember;
use App\Observers\TeamMemberObserver;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

/**
 * Seeds the initial two Team Members from the two images provided in the
 * project's `team/` directory.
 *
 * The person's name and position are derived from the filename on purpose:
 *   SayeedNajmuldinSadatCeo.png        → Sayeed Najmuldin Sadat · CEO
 *   MosaBarekzaiDeveloper.jpeg         → Mosa Barekzai         · Developer
 *
 * The images are imported through the existing Media Library (media table)
 * so these members behave exactly like members created via the Admin Panel.
 */
class TeamSeeder extends Seeder
{
    public function run(): void
    {
        $files = array_filter([
            base_path('../team/SayeedNajmuldinSadatCeo.png'),
            base_path('../team/MosaBarekzaiDeveloper.jpeg'),
        ], 'is_file');

        $order = 1;

        foreach ($files as $file) {
            $filename = basename($file);
            [$name, $role] = $this->parseFilename(pathinfo($filename, PATHINFO_FILENAME));

            if (! $name) {
                continue;
            }

            $media = $this->importImage($file, $name);

            $member = TeamMember::updateOrCreate(
                ['name' => $name],
                [
                    'role' => $role ?? 'Team Member',
                    'department' => null,
                    'bio' => null,
                    'image_media_id' => $media?->id,
                    'socials' => [],
                    'portfolio_url' => null,
                    'status' => 'active',
                    'sort_order' => $order,
                ],
            );

            $this->command?->info("Team member seeded: {$member->name} ({$member->role})");
            $order++;
        }

        $this->cleanupDemoMembers();

        Cache::forget(TeamMemberObserver::CACHE_KEY);
    }

    /**
     * Placeholder/demo members seeded by an earlier version of ContentSeeder.
     * The initial Team section must only contain the two provided images, so
     * these are removed here (soft-deleted). Admin-created members are never
     * touched because they do not share these names.
     */
    protected function cleanupDemoMembers(): void
    {
        $demoNames = [
            'Ahmad Sadat', 'Sara Ahmadi', 'Bilal Khan',
            'Fatima Noor', 'Omar Farooq', 'Laila Rahimi',
        ];

        TeamMember::query()->whereIn('name', $demoNames)->delete();
    }

    /**
     * Copy an image from the `team/` directory into the public storage disk
     * and register it in the Media Library.
     */
    protected function importImage(string $file, string $personName): ?Media
    {
        $originalName = basename($file);
        $extension = strtolower(pathinfo($file, PATHINFO_EXTENSION) ?: 'png');
        $mime = match ($extension) {
            'png' => 'image/png',
            'jpg', 'jpeg' => 'image/jpeg',
            'webp' => 'image/webp',
            'gif' => 'image/gif',
            'svg' => 'image/svg+xml',
            default => function_exists('mime_content_type') ? (mime_content_type($file) ?: 'application/octet-stream') : 'application/octet-stream',
        };

        $filename = Str::slug($personName).'-'.Str::lower(Str::random(8)).'.'.$extension;
        $path = 'uploads/team/'.$filename;

        Storage::disk('public')->put($path, (string) file_get_contents($file));

        $size = function_exists('getimagesize') ? @getimagesize($file) : false;
        $width = $size ? $size[0] : null;
        $height = $size ? $size[1] : null;

        return Media::updateOrCreate(
            ['folder' => 'uploads/team', 'original_name' => $originalName],
            [
                'disk' => 'public',
                'path' => $path,
                'filename' => $filename,
                'original_name' => $originalName,
                'mime_type' => $mime,
                'extension' => $extension,
                'size' => filesize($file) ?: 0,
                'width' => $width,
                'height' => $height,
                'alt' => $personName,
                'title' => $personName,
            ],
        );
    }

    /**
     * Derive "First Last" from a camelCase filename and its trailing title.
     *
     * @return array{0: string, 1: ?string}
     */
    protected function parseFilename(string $base): array
    {
        $titles = [
            'Founder', 'CEO', 'CTO', 'CFO', 'COO', 'President', 'Director',
            'Developer', 'Designer', 'Engineer', 'Manager', 'Lead',
            'Specialist', 'Consultant', 'Strategist', 'Marketer', 'Writer',
        ];

        $role = null;
        foreach ($titles as $title) {
            $len = strlen($title);
            if ($len > 0 && strlen($base) > $len && strcasecmp(substr($base, -$len), $title) === 0) {
                $role = $this->canonicalTitle($title);
                $base = substr($base, 0, -$len);
                break;
            }
        }

        $name = preg_replace('/([a-z])([A-Z])/', '$1 $2', $base);
        $name = ucwords(trim((string) $name));

        return [$name, $role];
    }

    /**
     * Normalize a matched title to its canonical display form (e.g. "Ceo" → "CEO").
     */
    protected function canonicalTitle(string $title): string
    {
        $acronyms = ['CEO', 'CTO', 'CFO', 'COO'];

        if (in_array(strtoupper($title), $acronyms, true)) {
            return strtoupper($title);
        }

        return $title;
    }
}