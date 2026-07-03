import pkg from "gulp";
import gulpIf from "gulp-if";
import gulpSass from "gulp-sass";
import dartSass from "sass";
import cleanCSS from "gulp-clean-css";
import uglify from "gulp-uglify";
import imagemin from "gulp-imagemin";
import concat from "gulp-concat";
import sourcemaps from "gulp-sourcemaps";
import replace from "gulp-replace";
import esbuild from "gulp-esbuild";
import sharp from "sharp";
import through2 from "through2";
import fancyLog from "fancy-log";
import path from "path";
import fs from "fs";

const { src, dest, parallel, series, watch } = pkg;
const sass = gulpSass(dartSass);
const isProd = process.env.NODE_ENV === "prod";

/**--------------------------------------------------------------------------------------------------------------
 * CONFIGURACIÓN
 *
 * estas variables son las que definen que hacer con cada
 * archivo JS, según el tratamiento que se necesite dar
 *
 --------------------------------------------------------------------------------------------------------------*/
/**
 * Archivos copiados individual y literalmente de vendors o módulos de Node.
 *
 */
const filesToVendors = [];

const filesToVendorsJs = [];

/**--------------------------------------------------------------------------------------------------------------
 *  FIN CONFIGURACIÓN
 --------------------------------------------------------------------------------------------------------------*/

/**
 * Copia literal de archivos que pertenecen a VENDORS.
 *
 * Tarea encargada de realizar copias exactas de archivos que pertenecen a módulos de NODE
 * o a VENDORS en general que no son instalables desde NODE
 */
function vendorsCopy() {
  if (filesToVendors.length > 0) {
    return src(filesToVendors).pipe(dest("assets/dist/vendors/"));
  }
  return src(".", { allowEmpty: true });
}

/**
 * Copia literal de archivos que pertenecen a VENDORS en carpeta JS/.
 *
 * Tarea encargada de realizar copias exactas de archivos que pertenecen a módulos de NODE
 * o a VENDORS en general que no son instalables desde NODE y se copian en JS/
 */
function vendorsCopyJs() {
  if (filesToVendorsJs.length > 0) {
    return src(filesToVendorsJs).pipe(dest("assets/dist/js/"));
  }
  return src(".", { allowEmpty: true });
}
/**
 * Minificación de archivos JS que están en la carpeta partials/.
 *
 * Tarea encargada de copiar los archivos JS de la carpeta partials a la carpeta distribuida
 * En caso de se producción minifica el archivo sin añadir extensión.
 */
function minJs() {
  return src("assets/js/partials/**.js").pipe(gulpIf(isProd, uglify())).pipe(dest("assets/dist/js/"));
}

function css() {
  return src("assets/sass/style.scss")
    .pipe(gulpIf(!isProd, sourcemaps.init()))
    .pipe(
      sass({
        includePaths: ["node_modules"],
        silenceDeprecations: ["import", "mixed-decls", "global-builtin", "color-functions"],
      }).on("error", sass.logError)
    )
    .pipe(concat("all.css"))
    .pipe(replace("../../../../", "../"))
    .pipe(replace("../../../", "../"))
    .pipe(replace("../../", "../"))
    .pipe(gulpIf(!isProd, sourcemaps.write()))
    .pipe(gulpIf(isProd, cleanCSS()))
    .pipe(dest("assets/dist/css/"));
}

function adminCss() {
  return src("assets/sass/admin.scss")
    .pipe(gulpIf(!isProd, sourcemaps.init()))
    .pipe(
      sass({
        includePaths: ["node_modules"],
        silenceDeprecations: ["import", "mixed-decls", "global-builtin", "color-functions"],
      }).on("error", sass.logError)
    )
    .pipe(concat("admin.css"))
    .pipe(replace("../../../../", "../"))
    .pipe(replace("../../../", "../"))
    .pipe(replace("../../", "../"))
    .pipe(gulpIf(!isProd, sourcemaps.write()))
    .pipe(gulpIf(isProd, cleanCSS()))
    .pipe(dest("assets/dist/css/"));
}

function js() {
  if (isProd) {
    // Evita un bundle.js.map obsoleto de un build de desarrollo anterior:
    // esbuild no lo genera en prod, pero tampoco borra uno ya existente.
    fs.rmSync("assets/dist/js/bundle.js.map", { force: true });
  }

  return src("assets/js/main.js") // Tu archivo principal con imports
    .pipe(esbuild({
      bundle: true,
      minify: isProd,
      sourcemap: !isProd,
      outfile: "bundle.js",
      target: ["es2015"],
    }))
    .pipe(dest("assets/dist/js"));
}



/**
 * Compresión de JPG/PNG/WEBP/AVIF con sharp (libvips vía binarios nativos
 * precompilados por plataforma, no CLIs externos como gulp-imagemin).
 *
 * gulp-imagemin usaba por defecto mozjpeg/optipng, cuyos binarios vendored
 * son x86_64-only y no ejecutan en Apple Silicon sin Rosetta instalada
 * (spawn "Unknown system error -86"). sharp evita ese problema por completo.
 */
function compressRaster() {
  return through2.obj(function (file, enc, cb) {
    if (file.isNull() || file.isStream()) {
      return cb(null, file);
    }

    const ext = path.extname(file.path).toLowerCase();
    const pipeline = sharp(file.contents);

    let output;
    if (ext === ".png") {
      output = pipeline.png({ quality: 82, compressionLevel: 9, palette: true });
    } else if (ext === ".webp") {
      output = pipeline.webp({ quality: 82 });
    } else if (ext === ".avif") {
      output = pipeline.avif({ quality: 60 });
    } else {
      output = pipeline.jpeg({ quality: 82, mozjpeg: true });
    }

    output
      .toBuffer()
      .then((buf) => {
        // Solo sustituye si de verdad hemos reducido el peso
        file.contents = buf.length < file.contents.length ? buf : file.contents;
        cb(null, file);
      })
      .catch((err) => {
        // Si sharp no puede procesar el archivo, lo dejamos pasar tal cual
        // en vez de romper todo el build por una imagen suelta.
        fancyLog(`[img] no se pudo comprimir ${file.relative}: ${err.message}`);
        cb(null, file);
      });
  });
}

function imgRaster() {
  return src("assets/img/**/*.{jpg,jpeg,png,webp,avif}")
    .pipe(gulpIf(isProd, compressRaster()))
    .pipe(dest("assets/dist/img/"));
}

function imgVector() {
  // SVG y GIF: svgo es JS puro y gifsicle sí trae binario universal
  // (arm64 + x86_64), así que estos dos plugins de gulp-imagemin son seguros.
  // mozjpeg/optipng quedan excluidos a propósito (ver compressRaster).
  return src(["assets/img/**/*", "!assets/img/**/*.{jpg,jpeg,png,webp,avif}"])
    .pipe(gulpIf(isProd, imagemin([imagemin.gifsicle(), imagemin.svgo()])))
    .pipe(dest("assets/dist/img/"));
}

const img = parallel(imgRaster, imgVector);

function models() {
  return src('assets/models/**/*').pipe(dest('assets/dist/models'));
}

function fonts() {
  return src("assets/fonts/**/*").pipe(dest("assets/dist/fonts/"));
}
function watchFiles() {
  watch("assets/**/*.scss", series(css));
  watch("assets/js/*.js", series(js));
  watch("assets/js/partials/*.js", series(minJs));
  watch("assets/img/**/*.*", series(img));
}

export { vendorsCopy, vendorsCopyJs, css, adminCss, js, img, minJs, models, fonts, watchFiles };
export let serve = parallel(vendorsCopy, vendorsCopyJs, css, adminCss, js, img, minJs, models, fonts, watchFiles);
export default series(vendorsCopy, vendorsCopyJs, css, adminCss, js, img, models, fonts, minJs);
