# API Token Format Standard

## Format Standard pentru Toate Endpoint-urile

### 🔑 Formatul Token-ului
Toate cererile API autentificate folosesc formatul:
```
Authorization: Bearer <jwt_token>
```

### 📋 Headers Standard
```javascript
{
  'Content-Type': 'application/json',
  'Authorization': 'Bearer <jwt_token>'
}
```

### 🛠️ Implementare

#### Funcția Centralizată
```javascript
import { getApiHeaders } from '../utils/utilFunctions';

// Pentru endpoint-uri autentificate
const headers = getApiHeaders(true);

// Pentru endpoint-uri publice
const headers = getApiHeaders(false);
```

#### Exemplu de Utilizare
```javascript
const response = await fetch(`${apiUrl}/api/endpoint`, {
    method: 'GET',
    headers: getApiHeaders(true)
});
```

### 📍 Endpoint-uri Care Folosesc Token-ul

1. **Autentificare**
   - `GET /api/users/checkLogin` - verifică dacă utilizatorul este autentificat

2. **Drepturi Utilizator**
   - `GET /api/rights/getUserRights` - obține drepturile utilizatorului

3. **Utilizatori**
   - Toate endpoint-urile din `src/api/user.ts`

4. **Rute**
   - Toate endpoint-urile din `src/api/routes.ts`

5. **Comenzi**
   - Toate endpoint-urile din `src/api/orders.ts`

6. **Probleme**
   - Toate endpoint-urile din `src/api/issues.ts`

7. **Livrări**
   - Toate endpoint-urile din `src/api/deliveries.ts`

### 🔍 Verificare Backend

Backend-ul așteaptă token-ul în formatul:
```javascript
const authHeader = req.headers['authorization'];
const token = authHeader && authHeader.split(' ')[1]; // Extrage token-ul după "Bearer "
```

### ✅ Beneficii

1. **Consistență** - toate endpoint-urile folosesc același format
2. **Mentenabilitate** - o singură funcție pentru toate headers-urile
3. **Debugging** - logging centralizat pentru token-uri
4. **Securitate** - format standard pentru autentificare

### 🚨 Important

- Token-ul trebuie să fie JWT valid
- Token-ul trebuie să nu fie expirat
- Token-ul trebuie să fie generat de backend-ul corect
- Formatul trebuie să fie exact: `Bearer <token>` (cu spațiu după Bearer) 