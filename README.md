# Serrana ⛰️

Turismo de naturaleza y aventura para las Sierras de Córdoba. Inspirado en la forma en que Airbnb conecta viajeros y anfitriones, Serrana conecta a los aventureros con **alojamientos, trekkings y experiencias** fuera de la ruta.

> 🌱 MVP frontend · versión 0.1.0 · Todos los datos son de demostración.

## Stack

| Capa        | Tecnología                                                       |
| ----------- | --------------------------------------------------------------- |
| Frontend    | React 18 · Vite · TypeScript · Tailwind CSS v4 · React Router 6 |
| Backend     | Java · Spring Boot · REST API · Spring Security (JWT/OAuth2)    |
| Datos       | PostgreSQL · JPA/Hibernate                                      |
| Mapas       | Mapbox / Google Maps                                            |
| Archivos    | S3 / R2 para imágenes y fotos de alojamientos                   |
| Arquitectura| Monolito modular                                                |

## Comenzar

```bash
npm install
npm run dev        # http://localhost:5173
npm run typecheck  # tsc --noEmit
npm run build      # produce dist/
```

## Diseño

- **Paleta**: Sierras de Córdoba — forest, olive, sand, earth, piedra, cielo.
- **Tipografía**: Fraunces (display) + Inter (body).
- **Mobile first**, animaciones *reveal on scroll* y parallax suave en el hero.
- Estética premium + aventurera, sin looks corporativos ni neón.

## Rutas

| Ruta                | Página                          |
| ------------------- | ------------------------------- |
| `/`                 | Landing                         |
| `/explore`          | Buscar (listado + mapa)         |
| `/property/:id`     | Detalle de alojamiento          |
| `/trail/:id`        | Detalle de trekking             |
| `/experience/:id`   | Detalle de experiencia          |
| `/favorites`        | Favoritos _(en construcción)_   |
| `/trips`            | Viajes _(en construcción)_      |
| `/profile`          | Perfil _(en construcción)_      |
| `/owner`            | Panel de propietarios _(próx.)_ |
| `/admin`            | Panel admin _(próx.)_           |

## CI/CD

`.github/workflows/ci.yml` typechequea y compila en cada push/PR y despliega a GitHub Pages
(con `VITE_BASE=/<repo>/`) al llegar a `main`.

## Roadmap

- [ ] Booking real (fechas, pago, confirmación)
- [ ] Favoritos y listas
- [ ] Backend Spring Boot + PostgreSQL
- [ ] Mapa real (Mapbox) con geocodificación
- [ ] Panel de propietarios (publicar, calendario, ingresos)
- [ ] Panel admin (moderación, reportes)
- [ ] Perfiles de guías y reviews verificadas