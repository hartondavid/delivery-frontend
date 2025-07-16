# AWS Setup pentru Autentificare

## Problema
Aplicația funcționează local dar nu în AWS din cauza variabilelor de mediu.

## Soluție

### 1. Configurare AWS Amplify

1. **Mergi la AWS Amplify Console**
2. **Selectează aplicația ta**
3. **Mergi la "Environment variables"**
4. **Adaugă variabila:**

```
REACT_APP_API_URL = https://your-aws-api-gateway-url.amazonaws.com
```

### 2. Verificare

După ce adaugi variabila:
1. **Redeployează aplicația**
2. **Verifică build logs** - ar trebui să vezi:
   ```
   API URL: https://your-aws-api-gateway-url.amazonaws.com
   ```

### 3. Testare

1. **Accesează aplicația live**
2. **Încearcă să te autentifici**
3. **Verifică console-ul browser** pentru erori

## Cauzele problemei "Invalid token" în AWS:

1. **Variabila `REACT_APP_API_URL` nu este setată**
2. **URL-ul API Gateway este greșit**
3. **CORS nu este configurat în API Gateway**

## Pași de verificare:

- [ ] Variabila `REACT_APP_API_URL` este setată în AWS Amplify
- [ ] URL-ul API Gateway este corect
- [ ] Aplicația este redeployată
- [ ] Build logs arată URL-ul corect 