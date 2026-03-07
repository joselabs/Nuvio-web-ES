# LaMovie Provider para Nuvio

Provider que obtiene streams de LaMovie con resolvers para GoodStream, StreamWish, VOE y Filemoon.

## Setup

```bash
npm install
node build.js
```

## Probar localmente

```bash
# Primero construye
node build.js

# Luego prueba (Fight Club)
node test.js 550 movie

# Serie (Breaking Bad S1E1)
node test.js 1396 tv 1 1
```

## Cargar en Nuvio (modo desarrollo)

1. Ejecuta `npm start` en este directorio
2. En Nuvio app (build de desarrollo) → Settings → Developer → Plugin Tester
3. Carga: `http://TU_IP:3000/providers/lamovie.js`

## Resolvers incluidos

| Servidor | Estado |
|---|---|
| GoodStream | ✅ Estable |
| StreamWish / HLSWish | ✅ Funcional |
| VOE | ✅ ~70% de casos |
| Filemoon | ⚠️ Requiere test en Hermes (usa AES-256-GCM con crypto-js) |
| vimeos.net | ⏭ Ignorado (Cloudflare anti-bot) |

## ⚠️ Nota sobre Filemoon

Filemoon usa AES-256-GCM. La implementación usa `crypto-js` con emulación de CTR (núcleo de GCM).
Funciona en Node.js. **Necesita test en el Plugin Tester de Nuvio** para confirmar compatibilidad con Hermes.

Si falla en Hermes, los otros 3 resolvers (GoodStream, StreamWish, VOE) siguen funcionando.
