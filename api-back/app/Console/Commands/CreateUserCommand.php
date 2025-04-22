<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class CreateUserCommand extends Command
{
    protected $signature = 'user:create {name} {email} {password}';
    protected $description = 'Crea un nuevo usuario desde la terminal';

    public function __construct()
    {
        parent::__construct();
    }

    public function handle()
    {
        $name = $this->argument('name');
        $email = $this->argument('email');
        $password = $this->argument('password');

        // Validar que el email no exista
        if (User::where('email', $email)->exists()) {
            $this->error('El email ya está registrado.');
            return 1;
        }

        // Crear el usuario
        $user = User::create([
            'name' => $name,
            'email' => $email,
            'password' => bcrypt($password),
            'email_verified_at' => now(),
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        if ($user) {
            $this->info('Usuario creado exitosamente:');
            $this->info("Name: {$user->name}");
            $this->info("Email: {$user->email}");
            $this->info("Password (hashed): {$user->password}");
            return 0;
        }

        $this->error('Error al crear el usuario.');
        return 1;
    }
}