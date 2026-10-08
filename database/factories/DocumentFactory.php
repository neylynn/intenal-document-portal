<?php

namespace Database\Factories;

use App\Models\Document;
use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\User;

/**
 * @extends Factory<Document>
 */
class DocumentFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'title' => fake()->sentence(3),
            'file_name' => fake()->word() . '.pdf',
            'file_path' => 'documents/sample.pdf',
            'file_type' => 'application/pdf',
            'file_size' => fake()->numberBetween(1000, 500000),
        ];
    }
}
