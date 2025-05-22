# ZenithHR Backend API

This backend service provides authentication and other APIs for the ZenithHR application.

## Setup

1. Create a virtual environment (optional but recommended):
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Run the server:
```bash
python run.py
```

The server will be available at http://localhost:8000.

## API Documentation

After starting the server, you can visit http://localhost:8000/docs for Swagger UI documentation.

## Authentication

The following test accounts are available:

- **Admin User**:
  - Email: admin@example.com
  - Password: admin123

- **Regular User**:
  - Email: user@example.com
  - Password: user123

## Endpoints

- `POST /auth/login` - Login with email and password
- `POST /auth/token` - OAuth2 token endpoint (for form submissions) 