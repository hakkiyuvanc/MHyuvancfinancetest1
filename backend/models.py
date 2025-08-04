class User:
    def __init__(self, email: str, password: str, role: str = "user"):
        self.email = email
        self.password = password
        self.role = role
