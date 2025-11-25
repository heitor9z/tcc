<?php
class Usuario {
    private $id;
    private $displayName;
    private $email;
    private $password;
    
    // Getters e Setters
    public function getId() { return $this->id; }
    public function setId($id) { $this->id = $id; }

    public function getEmail() { return $this->email; }
    public function setEmail($email) { $this->email = $email; }

    public function getPassword() { return $this->password; }
    public function setPassword($password) { $this->password = $password; }
    
    public function getDisplayName() { return $this->displayName; }
    public function setDisplayName($name) { $this->displayName = $name; }
}
?>