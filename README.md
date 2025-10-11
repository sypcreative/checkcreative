# 🌀 CheckCreative — WordPress (MAMP)

Instalación de **WordPress** para el proyecto **CheckCreative**, pensada para entorno **local con MAMP** (sin Docker).  
Incluye guía rápida de arranque, estructura, buenas prácticas de versionado y comandos útiles.

---

## 📁 Estructura del proyecto

```bash
checkcreative/
├── wp-admin/                # Núcleo WP (no tocar)
├── wp-content/
│   ├── themes/              # Tus temas (p.ej. sypcreative-theme)
│   ├── plugins/             # Tus plugins
│   └── uploads/             # Subidas (no versionadas)
├── wp-includes/             # Núcleo WP (no tocar)
├── .gitignore
├── .htaccess
├── index.php
├── license.txt
├── readme.html
├── wp-activate.php
├── wp-blog-header.php
├── wp-comments-post.php
├── wp-config-sample.php
└── wp-config.php            # → se crea desde sample (no versionar)
```

## ⚙️ Requisitos

- **macOS** con **MAMP** instalado:
  - Apache en puerto `8888`
  - MySQL en puerto `8889`
  - phpMyAdmin incluido
- **PHP ≥ 8.0** (configurable desde Preferencias de MAMP)
- **Node.js** ≥ 16 _(solo si tu tema tiene assets compilados con npm)_
- **Git** configurado con tu clave SSH (recomendado para `sypcreative`)
- **Navegador web** para acceder al entorno local en `http://localhost:8888`

---

## 🚀 Arranque local con MAMP

1. **Clonar el repositorio:**
   ```bash
   git clone git@github-syp:sypcreative/checkcreative.git
   cd checkcreative
   ```
2. **Configurar MAMP:**

Abre MAMP → Preferences → Web Server
→ selecciona la carpeta del proyecto como Document Root.

- En **ports** asegúrate de tener
  - Apache → **8888**
  - MySQL → **8889**
- Inicia los servicios con **Start Servers**.

3. **Crear la base de datos:**

1. Abre [http://localhost:8888/phpMyAdmin](http://localhost:8888/phpMyAdmin)
2. Usuario: `root`
3. Contraseña: `root`
4. Crea una nueva base de datos llamada **checkcreative**.

### ⚙️ Crear y configurar `wp-config.php`

Duplica el archivo de ejemplo:

```bash
cp wp-config-sample.php wp-config.php

Edita con tus credenciales locales:

define( 'DB_NAME', 'checkcreative' );
define( 'DB_USER', 'root' );
define( 'DB_PASSWORD', 'root' );
define( 'DB_HOST', 'localhost:8889' );
````

## ✨ Autoría

**SYP Creative**  
Desarrollado por **Paula Sanz**  
🔗 [https://github.com/sypcreative](https://github.com/sypcreative)

Proyecto creado con 💡, WordPress, MAMP y cero cafeína real ☕  
— 2025 —
