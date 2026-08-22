import { createContext, useContext, useEffect, useState, type ReactNode } from "react"

export type Lang = "es" | "en"

// Alcance: toda la app autenticada (/app/*). La Landing pública y el
// Login quedan fuera a propósito — son la puerta de entrada, sin
// preferencia de idioma todavía establecida para un visitante nuevo.
const dict = {
  // Sidebar
  "sidebar.inicio": { es: "Inicio", en: "Home" },
  "sidebar.dashboard": { es: "Dashboard", en: "Dashboard" },
  "sidebar.paginas": { es: "Páginas", en: "Pages" },
  "sidebar.crearProductPage": { es: "Crear Product Page", en: "Create Product Page" },
  "sidebar.landingImagenes": { es: "Landing con Imágenes", en: "Image Landing" },
  "sidebar.tusPaginas": { es: "Tus páginas", en: "Your pages" },
  "sidebar.imagenesGrupo": { es: "Imágenes", en: "Images" },
  "sidebar.imagenesIA": { es: "Imágenes IA", en: "AI Images" },
  "sidebar.soporte": { es: "Soporte", en: "Support" },
  "sidebar.centroAyuda": { es: "Centro de ayuda", en: "Help center" },
  "sidebar.cuenta": { es: "Cuenta", en: "Account" },
  "sidebar.integraciones": { es: "Integraciones", en: "Integrations" },
  "sidebar.configuracion": { es: "Configuración", en: "Settings" },
  "sidebar.creditos": { es: "créditos", en: "credits" },
  "sidebar.deEsteMes": { es: "de {total} este mes", en: "of {total} this month" },
  "sidebar.comprarCreditos": { es: "Comprar créditos", en: "Buy credits" },

  // Dashboard / PromptCard
  "dashboard.hola": { es: "Hola, {name} 👋", en: "Hi, {name} 👋" },
  "dashboard.bienvenidaDefault": { es: "¿Qué producto vamos a lanzar?", en: "What product are we launching?" },
  "dashboard.modoProductPage": { es: "Product Page", en: "Product Page" },
  "dashboard.modoImagen": { es: "Imagen", en: "Image" },
  "dashboard.modoLanding": { es: "Landing", en: "Landing" },
  "dashboard.promptPlaceholder": { es: "Describe lo que quieres crear…", en: "Describe what you want to create…" },
  "dashboard.subirImagen": { es: "Subir imagen", en: "Upload image" },
  "dashboard.seleccionarProducto": { es: "Seleccionar producto", en: "Select product" },

  // CreatePage
  "createPage.titulo": { es: "Crea tu Product Page", en: "Create your Product Page" },
  "createPage.subtitulo": { es: "Pega el link del producto y Rulay arma la página por ti.", en: "Paste the product link and Rulay builds the page for you." },
  "createPage.linkProducto": { es: "Link del producto", en: "Product link" },
  "createPage.fotoProducto": { es: "Foto de tu producto", en: "Your product photo" },
  "createPage.fotoOpcional": { es: "opcional, ayuda a la IA a acertar mejor", en: "optional, helps the AI get it right" },
  "createPage.subirFoto": { es: "Subir foto del producto", en: "Upload product photo" },
  "createPage.fotoCargada": { es: "Foto cargada", en: "Photo uploaded" },
  "createPage.fotoReferencia": { es: "Se usará como referencia para la IA", en: "Will be used as a reference for the AI" },
  "createPage.imagenesIA": { es: "Imágenes generadas con IA", en: "AI-generated images" },
  "createPage.generarPagina": { es: "Generar página", en: "Generate page" },
  "createPage.costoEstimado": { es: "Costo estimado", en: "Estimated cost" },
  "createPage.paginaConIA": { es: "Página con IA", en: "AI page" },
  "createPage.total": { es: "Total", en: "Total" },
  "createPage.teQuedaran": { es: "Te quedarán {n} créditos después de generar.", en: "You'll have {n} credits left after generating." },

  // CreateImages
  "createImages.titulo": { es: "Crear imágenes con IA", en: "Create AI images" },
  "createImages.promptPlaceholder": { es: "Menciona tu producto para colocarlo en la escena… (usa @)", en: "Mention your product to place it in the scene… (use @)" },
  "createImages.producto": { es: "Producto", en: "Product" },
  "createImages.conAvatar": { es: "Con avatar", en: "With avatar" },
  "createImages.crear": { es: "Crear", en: "Create" },
  "createImages.costoLinea": { es: "Esta imagen cuesta {n} créditos · te quedarán", en: "This image costs {n} credits · you'll have" },

  // CreateLanding
  "createLanding.titulo": { es: "Landing con Imágenes", en: "Image Landing" },
  "createLanding.subtitulo": { es: "Genera secciones de landing listas para pegar en tu página de Shopify.", en: "Generate landing sections ready to paste into your Shopify page." },
  "createLanding.fotosProducto": { es: "Fotos del producto", en: "Product photos" },
  "createLanding.obligatorio": { es: "1 a 3, obligatorio", en: "1 to 3, required" },
  "createLanding.nombreAngulo": { es: "Nombre del ángulo de venta", en: "Sales angle name" },
  "createLanding.describeProducto": { es: "Describe tu producto y el ángulo de venta", en: "Describe your product and sales angle" },
  "createLanding.iaEscribe": { es: "Que lo escriba la IA", en: "Let AI write it" },
  "createLanding.iaEscribeNota": { es: "La IA va a inferir el ángulo de venta a partir de las fotos del producto. No hace falta que escribas nada acá.", en: "The AI will infer the sales angle from the product photos. You don't need to write anything here." },
  "createLanding.detallesAvanzados": { es: "Detalles avanzados (opcional)", en: "Advanced details (optional)" },
  "createLanding.publicoObjetivo": { es: "Público objetivo", en: "Target audience" },
  "createLanding.precio": { es: "Precio", en: "Price" },
  "createLanding.pais": { es: "País", en: "Country" },
  "createLanding.idiomaSalida": { es: "Idioma de salida", en: "Output language" },
  "createLanding.seccionesGenerar": { es: "Secciones a generar", en: "Sections to generate" },
  "createLanding.eligeUnaOVarias": { es: "elige una o varias", en: "pick one or several" },
  "createLanding.paginaCompleta": { es: "Página completa", en: "Full page" },
  "createLanding.section.hero": { es: "Hero", en: "Hero" },
  "createLanding.section.oferta": { es: "Oferta", en: "Offer" },
  "createLanding.section.beneficios": { es: "Beneficios", en: "Benefits" },
  "createLanding.section.antesDespues": { es: "Antes / Después", en: "Before / After" },
  "createLanding.section.testimonios": { es: "Testimonios", en: "Testimonials" },
  "createLanding.section.logistica": { es: "Logística", en: "Shipping" },
  "createLanding.section.faq": { es: "FAQ", en: "FAQ" },
  "createLanding.ofertaNota": { es: "Sin la sección Oferta, tu página igual muestra el bloque real de precios/cantidad de tu tienda.", en: "Without the Offer section, your page still shows the real price/quantity block from your store." },
  "createLanding.referenciaVisual": { es: "Referencia visual", en: "Visual reference" },
  "createLanding.opcional": { es: "opcional", en: "optional" },
  "createLanding.referenciaNinguna": { es: "Ninguna · libre", en: "None · free" },
  "createLanding.miGaleria": { es: "Mi galería", en: "My gallery" },
  "createLanding.subirReferencia": { es: "Subir referencia", en: "Upload reference" },
  "createLanding.galeriaVacia": { es: "Todavía no tienes secciones generadas", en: "You don't have any generated sections yet" },
  "createLanding.formatoTitulo": { es: "Formato vertical · móvil", en: "Vertical format · mobile" },
  "createLanding.formatoNota": { es: "Rulay genera todas las secciones en formato celular. Así es como llega el 90%+ del tráfico de ads.", en: "Rulay generates every section in phone format. That's how 90%+ of ad traffic arrives." },
  "createLanding.fotoN": { es: "Imagen {n}", en: "Image {n}" },
  "createLanding.placeholderProducto": { es: "Ej. Suplemento de colágeno para mujeres de 35+ que quieren piel más firme sin procedimientos caros…", en: "E.g. Collagen supplement for women 35+ who want firmer skin without expensive procedures…" },
  "createLanding.placeholderAngulo": { es: "Ej. Dolor de espalda, Energía natural…", en: "E.g. Back pain, Natural energy…" },
  "createLanding.publicoPlaceholder": { es: "Ej. Mujeres 35-50 años, LATAM", en: "E.g. Women 35-50, LATAM" },
  "createLanding.idiomaAutoNota": { es: "Se precarga solo al elegir el país. Puedes cambiarlo aparte si hace falta.", en: "Preloaded only when you pick a country. You can still change it separately." },
  "createLanding.divisaIdiomaDetectados": { es: "Divisa e idioma detectados:", en: "Detected currency and language:" },
  "createLanding.referenciaCargada": { es: "Referencia cargada", en: "Reference uploaded" },
  "createLanding.iaIgualaEstilo": { es: "La IA va a igualar este estilo con tu producto.", en: "The AI will match this style with your product." },
  "createLanding.generarSeccion": { es: "Generar sección", en: "Generate section" },
  "createLanding.generarNSecciones": { es: "Generar {n} secciones", en: "Generate {n} sections" },
  "createLanding.generarPaginaCompleta": { es: "Generar página completa", en: "Generate full page" },
  "createLanding.paginaCompletaResumen": { es: "Página completa (7 secciones)", en: "Full page (7 sections)" },
  "createLanding.anguloConIA": { es: "Ángulo de venta con IA", en: "AI sales angle" },
  "createLanding.ahorras": { es: "Página completa: {full} créditos en vez de {sum}. Ahorras {savings} créditos generando todo junto.", en: "Full page: {full} credits instead of {sum}. You save {savings} credits by generating everything together." },

  // Pages
  "pages.titulo": { es: "Páginas", en: "Pages" },
  "pages.verTutorial": { es: "Ver tutorial", en: "Watch tutorial" },
  "pages.crearConIA": { es: "Crear página con IA", en: "Create page with AI" },
  "pages.buscar": { es: "Buscar páginas por nombre…", en: "Search pages by name…" },
  "pages.noEncontradas": { es: "No se encontraron páginas", en: "No pages found" },
  "pages.pruebaOtroNombre": { es: "Prueba con otro nombre o crea una página nueva.", en: "Try another name or create a new page." },
  "pages.empiezaAhora": { es: "Empieza ahora y descubre lo fácil que es generar tu primera página con IA.", en: "Start now and see how easy it is to generate your first page with AI." },
  "pages.crearPrimera": { es: "Crear primera página con IA", en: "Create first page with AI" },

  // Integraciones
  "integraciones.titulo": { es: "Integraciones", en: "Integrations" },
  "integraciones.subtitulo": { es: "Conecta tus herramientas para publicar y automatizar directo desde Rulay.", en: "Connect your tools to publish and automate directly from Rulay." },
  "integraciones.conectada": { es: "Conectada", en: "Connected" },
  "integraciones.conectar": { es: "Conectar Shopify", en: "Connect Shopify" },
  "integraciones.conectando": { es: "Conectando…", en: "Connecting…" },
  "integraciones.desconectar": { es: "Desconectar", en: "Disconnect" },
  "integraciones.unaTiendaNota": { es: "Por ahora puedes conectar una tienda a la vez. Si cambias de tienda, desconecta esta y conecta la nueva.", en: "For now you can connect one store at a time. To switch stores, disconnect this one and connect the new one." },
  "integraciones.proximamente": { es: "Próximamente", en: "Coming soon" },
  "integraciones.proximamente.whatsapp": { es: "Envía tus páginas generadas por chat automáticamente.", en: "Send your generated pages by chat automatically." },
  "integraciones.proximamente.sheets": { es: "Sincroniza tus productos y páginas con una hoja de cálculo.", en: "Sync your products and pages with a spreadsheet." },
  "integraciones.proximamente.zapier": { es: "Conecta Rulay con miles de apps sin código.", en: "Connect Rulay to thousands of apps with no code." },

  // Perfil
  "perfil.titulo": { es: "Tu perfil", en: "Your profile" },
  "perfil.subtitulo": { es: "Administra tu información básica de cuenta.", en: "Manage your basic account information." },
  "perfil.cambiarFoto": { es: "Cambiar foto", en: "Change photo" },
  "perfil.subiendo": { es: "Subiendo…", en: "Uploading…" },
  "perfil.formatoFoto": { es: "PNG o JPG, máx 2MB.", en: "PNG or JPG, max 2MB." },
  "perfil.nombreUsuario": { es: "Nombre de usuario", en: "Username" },
  "perfil.correo": { es: "Correo electrónico", en: "Email" },
  "perfil.guardarCambios": { es: "Guardar cambios", en: "Save changes" },
  "perfil.guardando": { es: "Guardando…", en: "Saving…" },
  "perfil.guardado": { es: "Guardado", en: "Saved" },
  "perfil.cerrarSesion": { es: "Cerrar sesión", en: "Sign out" },
  "perfil.cerrarSesionDesc": { es: "Sales de tu cuenta en este dispositivo.", en: "You'll be signed out on this device." },
  "perfil.salir": { es: "Salir", en: "Sign out" },

  // Configuración
  "config.titulo": { es: "Configuración", en: "Settings" },
  "config.subtitulo": { es: "Preferencias generales de tu cuenta.", en: "General preferences for your account." },
  "config.pais": { es: "País donde operas", en: "Country you operate from" },
  "config.paisDesc": { es: "Precarga el idioma y la moneda por defecto en tus páginas y landings.", en: "Preloads the default language and currency for your pages and landings." },
  "config.selecciona": { es: "Selecciona un país…", en: "Select a country…" },
  "config.moneda": { es: "Moneda", en: "Currency" },
  "config.idiomaContenido": { es: "Idioma de contenido", en: "Content language" },
  "config.mensajeBienvenida": { es: "Mensaje de bienvenida", en: "Welcome message" },
  "config.mensajeBienvenidaDesc": { es: "Reemplaza \"¿Qué producto vamos a lanzar?\" en tu Dashboard.", en: "Replaces \"What product are we launching?\" on your Dashboard." },
  "config.apariencia": { es: "Apariencia", en: "Appearance" },
  "config.apparienciaDesc": { es: "El sidebar siempre queda oscuro. Esto solo cambia el resto de la pantalla.", en: "The sidebar always stays dark. This only changes the rest of the screen." },
  "config.oscuro": { es: "Oscuro", en: "Dark" },
  "config.claro": { es: "Claro", en: "Light" },
  "config.creditos": { es: "Créditos", en: "Credits" },
  "config.avisarSaldoBajo": { es: "Avisarme cuando queden pocos créditos", en: "Notify me when I'm running low on credits" },
  "config.avisarSaldoBajoDesc": { es: "Te llega un correo cuando bajas del umbral.", en: "You get an email when you drop below the threshold." },
  "config.avisarMenosDe": { es: "Avisarme con menos de", en: "Notify me under" },
  "config.creditosPalabra": { es: "créditos", en: "credits" },
  "config.autoRecarga": { es: "Auto-recarga de créditos", en: "Auto credit reload" },
  "config.autoRecargaDesc": { es: "Se compra el paquete elegido apenas bajes del umbral.", en: "The chosen package is purchased as soon as you drop below the threshold." },
  "config.recargarCon": { es: "Recargar con menos de", en: "Reload under" },
  "config.comprando": { es: "créditos, comprando", en: "credits, buying" },
  "config.marcaAgua": { es: "Marca de agua en mis imágenes", en: "Watermark on my images" },
  "config.marcaAguaDesc": { es: "Sube tu propia marca (no la de Rulay). Se superpone sobre cada imagen generada antes de enviarla a Shopify, para que no te roben las fotos. Es un procesamiento de imagen aparte, no lo hace la IA.", en: "Upload your own mark (not Rulay's). It's overlaid on every generated image before sending it to Shopify, so your photos don't get stolen. It's a separate image process, not the AI." },
  "config.marcaCargada": { es: "Marca cargada", en: "Mark uploaded" },
  "config.marcaCargadaDesc": { es: "Se aplica a todas tus imágenes.", en: "Applied to all your images." },
  "config.subirMarca": { es: "Subir mi marca de agua", en: "Upload my watermark" },
  "config.idiomaInterfaz": { es: "Idioma de la interfaz", en: "Interface language" },
  "config.idiomaInterfazDesc": { es: "En qué idioma ves tú los botones y menús de Rulay. Distinto del idioma en el que se generan tus páginas.", en: "The language you see Rulay's buttons and menus in. Different from the language your pages are generated in." },
  "config.nombreAvatar": { es: "Nombre y avatar", en: "Name and avatar" },
  "config.nombreAvatarDesc": { es: "Se editan desde tu perfil, no acá.", en: "Edited from your profile, not here." },
  "config.irAPerfil": { es: "Ir a Perfil", en: "Go to Profile" },
  "config.guardarCambios": { es: "Guardar cambios", en: "Save changes" },
  "config.guardado": { es: "Guardado", en: "Saved" },
  "config.cambiosSinGuardar": { es: "Tienes cambios de apariencia sin guardar", en: "You have unsaved appearance changes" },

  // Guardia de cambios sin guardar (toast al intentar salir)
  "guard.cambiosSinGuardar": { es: "Tienes cambios sin guardar", en: "You have unsaved changes" },
  "guard.seguirEditando": { es: "Seguir editando", en: "Keep editing" },
  "guard.descartar": { es: "Descartar", en: "Discard" },
  "guard.guardarYSalir": { es: "Guardar y salir", en: "Save and leave" },
  "config.privacidad": { es: "Privacidad", en: "Privacy" },
  "config.exportarDatos": { es: "Exportar mis datos", en: "Export my data" },
  "config.borrarDatos": { es: "Borrar mis datos y cerrar cuenta", en: "Delete my data and close account" },
  "config.noTiendasConectadas": { es: "No tienes tiendas conectadas todavía", en: "You don't have any stores connected yet" },
  "config.conectaEnIntegraciones": { es: "conecta una en Integraciones", en: "connect one in Integrations" },

  // Stats / RecentPages
  "stats.paginasGeneradas": { es: "Páginas generadas", en: "Pages generated" },
  "stats.creditosUsados": { es: "Créditos usados", en: "Credits used" },
  "stats.conversionPromedio": { es: "Conversión promedio", en: "Average conversion" },
  "recent.titulo": { es: "Páginas recientes", en: "Recent pages" },
  "recent.verTodas": { es: "Ver todas", en: "View all" },
  "recent.vacioTitulo": { es: "Aún no has creado páginas", en: "You haven't created any pages yet" },
  "recent.vacioDesc": { es: "Crea tu primera página con IA y aparecerá aquí.", en: "Create your first page with AI and it'll show up here." },
  "recent.crearPrimera": { es: "Crear primera página con IA", en: "Create first page with AI" },

  // ConnectShopifyBanner
  "shopifyBanner.titulo": { es: "Conecta tu tienda Shopify", en: "Connect your Shopify store" },
  "shopifyBanner.desc": { es: "Publica tus páginas generadas directo a tu tienda en un clic.", en: "Publish your generated pages straight to your store in one click." },
  "shopifyBanner.verIntegraciones": { es: "Ver integraciones", en: "View integrations" },

  // Avatares
  "sidebar.avatares": { es: "Avatares", en: "Avatars" },
  "avatares.crearNuevo": { es: "Crear nuevo", en: "Create new" },
  "avatares.galeriaVacia": { es: "Aún no tienes avatares creados", en: "You don't have any avatars yet" },
  "avatares.vacioTitulo": { es: "Tu avatar vive aquí", en: "Your avatar lives here" },
  "avatares.vacioDesc": { es: "Diseña tu avatar desde cero, o súbele una foto de referencia.", en: "Design your avatar from scratch, or upload a reference photo." },
  "avatares.tipoPersonaje": { es: "Tipo de personaje", en: "Character type" },
  "avatares.origenFoto": { es: "Desde una foto", en: "From a photo" },
  "avatares.origenFotoDesc": { es: "Tuya, de un modelo que contrataste, o de un tercero autorizado.", en: "Yours, a model you hired, or an authorized third party." },
  "avatares.origenSintetico": { es: "100% sintético", en: "Fully synthetic" },
  "avatares.origenSinteticoDesc": { es: "Sin foto de partida. Rulay inventa a la persona desde cero.", en: "No starting photo. Rulay invents the person from scratch." },
  "avatares.subirFoto": { es: "Subir foto de referencia", en: "Upload reference photo" },
  "avatares.genero": { es: "Género", en: "Gender" },
  "avatares.genero.femenino": { es: "Femenino", en: "Female" },
  "avatares.genero.masculino": { es: "Masculino", en: "Male" },
  "avatares.estiloRenderizado": { es: "Estilo de renderizado", en: "Rendering style" },
  "avatares.estilo.hiperrealista": { es: "Hiperrealista", en: "Hyper-realistic" },
  "avatares.estilo.anime": { es: "Anime", en: "Anime" },
  "avatares.estilo.cartoon": { es: "Cartoon", en: "Cartoon" },
  "avatares.estilo.ilustracion2d": { es: "Ilustración 2D", en: "2D illustration" },
  "avatares.colorPiel": { es: "Color de piel", en: "Skin color" },
  "avatares.piel.muyOscuro": { es: "Muy oscuro", en: "Very deep" },
  "avatares.piel.oscuro": { es: "Oscuro", en: "Deep" },
  "avatares.piel.moreno": { es: "Moreno", en: "Brown" },
  "avatares.piel.trigueno": { es: "Trigueño", en: "Tan" },
  "avatares.piel.bronceado": { es: "Bronceado", en: "Bronze" },
  "avatares.piel.medio": { es: "Medio", en: "Medium" },
  "avatares.piel.claro": { es: "Claro", en: "Fair" },
  "avatares.piel.muyClaro": { es: "Muy claro", en: "Very fair" },
  "avatares.colorOjos": { es: "Color de ojos", en: "Eye color" },
  "avatares.ojos.negro": { es: "Negro", en: "Black" },
  "avatares.ojos.marron": { es: "Marrón", en: "Brown" },
  "avatares.ojos.marronOscuro": { es: "Marrón oscuro", en: "Deep brown" },
  "avatares.ojos.azul": { es: "Azul", en: "Blue" },
  "avatares.ojos.verde": { es: "Verde", en: "Green" },
  "avatares.ojos.ambar": { es: "Ámbar", en: "Amber" },
  "avatares.ojos.gris": { es: "Gris", en: "Grey" },
  "avatares.edad": { es: "Edad", en: "Age" },
  "avatares.edad.adulto": { es: "Adulto", en: "Adult" },
  "avatares.edad.maduro": { es: "Adulto maduro", en: "Mature" },
  "avatares.edad.mayor": { es: "Adulto mayor", en: "Senior" },
  "avatares.tipoCuerpo": { es: "Tipo de cuerpo", en: "Body type" },
  "avatares.cuerpo.delgada": { es: "Delgada", en: "Slim" },
  "avatares.cuerpo.esbelta": { es: "Esbelta", en: "Lean" },
  "avatares.cuerpo.atletica": { es: "Atlética", en: "Athletic" },
  "avatares.cuerpo.musculosa": { es: "Musculosa", en: "Muscular" },
  "avatares.cuerpo.curvy": { es: "Curvy", en: "Curvy" },
  "avatares.cuerpo.robusta": { es: "Robusta", en: "Heavy" },
  "avatares.cuerpo.muyDelgada": { es: "Muy delgada", en: "Skinny" },
  "avatares.detallesAdicionales": { es: "Detalles adicionales (opcional)", en: "Additional details (optional)" },
  "avatares.placeholderDetalles": { es: "Ej. Piel trigueña, cabello negro ondulado, estilo urbano latino, sonrisa cercana y de confianza…", en: "E.g. Tan skin, wavy dark hair, urban Latin style, warm and trustworthy smile…" },
  "avatares.generar": { es: "Generar avatar", en: "Generate avatar" },
  "avatares.costoLinea": { es: "Crear este avatar cuesta {n} créditos · te quedarán", en: "Creating this avatar costs {n} credits · you'll have" },
  "avatares.miGaleria": { es: "Mi galería de avatares", en: "My avatar gallery" },
  "avatares.buscarPlaceholder": { es: "Buscar avatar…", en: "Search avatar…" },
} as const

export type TranslationKey = keyof typeof dict

const LanguageContext = createContext<{
  lang: Lang
  setLang: (l: Lang) => void
  t: (key: TranslationKey, vars?: Record<string, string | number>) => string
} | null>(null)

function readStoredLang(): Lang {
  if (typeof window === "undefined") return "es"
  const raw = localStorage.getItem("rulay_ui_language")
  return raw === "English" ? "en" : "es"
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(readStoredLang)

  useEffect(() => {
    setLangState(readStoredLang())
  }, [])

  function setLang(l: Lang) {
    setLangState(l)
    localStorage.setItem("rulay_ui_language", l === "en" ? "English" : "Español")
  }

  function t(key: TranslationKey, vars?: Record<string, string | number>) {
    const entry = dict[key]
    let text: string = entry ? entry[lang] : key
    if (vars) {
      for (const [k, v] of Object.entries(vars)) {
        text = text.replace(`{${k}}`, String(v))
      }
    }
    return text
  }

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>{children}</LanguageContext.Provider>
  )
}

export function useLanguage() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error("useLanguage debe usarse dentro de <LanguageProvider>")
  return ctx
}
