<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Storage;
use App\Models\Document;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        // User::factory()->create([
        //     'name' => 'Test User',
        //     'email' => 'test@example.com',
        // ]);

        Storage::disk('public')->makeDirectory('documents');

        $admin = User::create([
            'name' => 'Admin',
            'email' => 'admin@workspace.com',
            'password' => 'password',
            'role' => 'admin',
        ]);

        $member1 = User::create([
            'name' => 'Member One',
            'email' => 'member1@workspace.com',
            'password' => 'password',
            'role' => 'member',
        ]);

        $member2 = User::create([
            'name' => 'Member Two',
            'email' => 'member2@workspace.com',
            'password' => 'password',
            'role' => 'member',
        ]);

        $users = [
            $admin,
            $member1,
            $member2,
        ];

        for ($i = 1; $i <= 5; $i++) {
            $user = $users[($i - 1) % count($users)];

            $fileName = "sample-document-{$i}.txt";
            $filePath = "documents/{$fileName}";

            Storage::disk('public')->put(
                $filePath,
                "This is sample internal document {$i}."
            );

            Document::create([
                'user_id' => $user->id,
                'title' => "Sample Document {$i}",
                'file_name' => $fileName,
                'file_path' => $filePath,
                'file_type' => 'text/plain',
                'file_size' => Storage::disk('public')->size($filePath),
            ]);
        }
    }
}
