# Guía: dominio propio `vantardynamics.com`

Decisión 2026-09-29: el dominio es **`vantardynamics.com`** (sin guion). Al 2026-09-27 figuraba libre
(también `vantardynamics.com.ar`). Nadie lo reserva por vos: hasta que lo compres,
cualquiera puede registrarlo.

Son 3 etapas. La **1** conviene hacerla ya (es barata y asegura el nombre). La **2** y la **3** recién
cuando se lance el sitio.

---

## Etapa 1 — Comprar el dominio (15 minutos, vos)

Recomendado: **Cloudflare Registrar** (cobra el precio de costo, sin recargos al renovar, e incluye DNS
y reenvío de email gratis). Alternativa: Namecheap o Porkbun.

1. Crear cuenta en https://dash.cloudflare.com/sign-up (con tu mail).
2. Menú **Domain Registration → Register Domains** → buscar `vantardynamics.com`.
3. Comprar por 1 año (o más), con **renovación automática activada**.
   Precio orientativo de un `.com`: alrededor de USD 10–12 por año (confirmalo en pantalla).
4. Dejar activada la **privacidad WHOIS** (viene por defecto: oculta tus datos personales).

> **Si lo comprás en GoDaddy por la promo del primer año** (USD 0,01–0,99): mirá el total del
> carrito antes de pagar. A veces la promo obliga a comprar varios años, y la renovación ronda
> USD 20–23 por año. Sacá los extras (email, hosting, "protección"). A los 60 días podés transferir
> el dominio a Cloudflare: la transferencia cobra 1 año al precio de costo y desde ahí renueva barato.
> Si tenés la renovación automática activada en GoDaddy, desactivala después de la transferencia.

> Opcional: `.com.ar` se compra en https://nic.ar con clave fiscal (AFIP/ARCA). Sirve para que nadie
> lo use en Argentina y redirigirlo al `.com`. No es imprescindible.

## Etapa 2 — Email con tu dominio, gratis (10 minutos, vos)

Para tener `contacto@vantardynamics.com` sin pagar una casilla:

1. En Cloudflare → tu dominio → **Email → Email Routing** → activar.
2. Crear la dirección `contacto@vantardynamics.com` → reenviar a tu Gmail.
3. Para **responder** desde esa dirección en Gmail: *Configuración → Cuentas → Enviar como* (se puede
   hacer más adelante; lo vemos juntos cuando llegue el momento).

## Etapa 3 — Conectar el sitio (el día del lanzamiento)

El sitio está en GitHub Pages y usa rutas relativas, así que funciona con dominio propio sin cambios
de código.

**En GitHub** (repo `vantar-dynamics` → *Settings → Pages*):
1. *Custom domain*: `vantardynamics.com` → Save (GitHub crea un archivo `CNAME` en el repo).
2. Cuando el DNS propague (minutos a pocas horas): tildar **Enforce HTTPS**. Los sensores del
   toolbox necesitan HTTPS.
3. Recomendado: en tu **perfil** de GitHub → *Settings → Pages → Verified domains* → verificar el
   dominio (evita que otro lo use en GitHub Pages).

**En Cloudflare** (tu dominio → *DNS → Records*), con el proxy (nubecita) en **gris / DNS only**:

| Tipo | Nombre | Valor |
|---|---|---|
| A | `@` | `185.199.108.153` |
| A | `@` | `185.199.109.153` |
| A | `@` | `185.199.110.153` |
| A | `@` | `185.199.111.153` |
| AAAA | `@` | `2606:50c0:8000::153` |
| AAAA | `@` | `2606:50c0:8001::153` |
| AAAA | `@` | `2606:50c0:8002::153` |
| AAAA | `@` | `2606:50c0:8003::153` |
| CNAME | `www` | `aggassmann.github.io` |

Verificar: abrir `https://vantardynamics.com` y `https://www.vantardynamics.com`.

> Las IPs son las oficiales de GitHub Pages; revisalas el día que lo hagas en
> https://docs.github.com/pages/configuring-a-custom-domain-for-your-github-pages-site
