/* ------------------------------
   DOM references
------------------------------ */
const categoryFilter = document.getElementById("categoryFilter");
const productsContainer = document.getElementById("productsContainer");
const chatForm = document.getElementById("chatForm");
const chatWindow = document.getElementById("chatWindow");
const selectedProductsList = document.getElementById("selectedProductsList");
const userInput = document.getElementById("userInput");
const siteTitle = document.getElementById("siteTitle");
const languageLabel = document.getElementById("languageLabel");
const languageSelector = document.getElementById("languageSelector");
const generateSkincareRoutineButton = document.getElementById(
  "generateSkincareRoutine",
);
const generateHaircareRoutineButton = document.getElementById(
  "generateHaircareRoutine",
);
const selectedProductsHeading = document.getElementById(
  "selectedProductsHeading",
);
const skincareRoutineText = document.getElementById("skincareRoutineText");
const haircareRoutineText = document.getElementById("haircareRoutineText");
const chatHeading = document.getElementById("chatHeading");
const clearConversationBtn = document.getElementById("clearConversationBtn");
const footerCopyright = document.getElementById("footerCopyright");
const privacyLink = document.getElementById("privacyLink");
const termsLink = document.getElementById("termsLink");
const contactLink = document.getElementById("contactLink");

const LANGUAGE_SELECTOR_LABELS = {
  en: "English",
  es: "Español",
  fr: "Français",
  pt: "Português",
  de: "Deutsch",
  it: "Italiano",
  ar: "العربية",
  he: "עברית",
  fa: "فارسی",
};

/* ------------------------------
   constants + state
------------------------------ */
const CLOUDFLARE_WORKER_URL =
  "https://prj-08-worker.myerswilliam04.workers.dev/";
const SELECTED_PRODUCTS_STORAGE_KEY = "selectedProducts";
const CONVERSATION_HISTORY_KEY = "conversationHistory";
const LANGUAGE_STORAGE_KEY = "selectedLanguage";
const BASE_SYSTEM_PROMPT =
  "You are a helpful beauty assistant for L'Oreal. Only answer skincare, haircare, or L'Oreal product questions. Keep answers short, beginner friendly, and organized as a routine when relevant. Use selected products as your main context. When applicable, mention exact product names from the available catalog instead of generic product types.";

let selectedProducts = new Map();
let productsCache = null;
let conversationHistory = [];
let currentLanguage = "en";

const LANGUAGE_CONFIG = {
  en: {
    dir: "ltr",
    aiLanguage: "English",
    strings: {
      siteTitle: "Smart Routine & Product Advisor",
      languageLabel: "Language",
      categoryPlaceholder: "Choose a Category",
      selectedProductsHeading: "Selected Products",
      skincareRoutineText: "Skincare Routine",
      haircareRoutineText: "Haircare Routine",
      chatHeading: "Let's Build Your Routine",
      clearConversationTitle: "Clear conversation history",
      userInputPlaceholder: "Ask me about products or routines...",
      footerCopyright: "© 2025 L'Oréal. All rights reserved.",
      privacyLink: "Privacy Policy",
      termsLink: "Terms of Use",
      contactLink: "Contact",
      youLabel: "You",
      assistantLabel: "Assistant",
      thinking: "Thinking...",
      selectCategoryToView: "Select a category to view products",
      emptySelected:
        "No products selected yet. Click on a product to add it to your routine.",
      selectionCount: "You have selected {count} product(s)",
      removeAria: "Remove {product}",
      apiError: "Sorry, I could not reach the Cloudflare API.",
      categories: {
        cleanser: "Cleansers",
        moisturizer: "Moisturizers & Treatments",
        haircare: "Haircare",
        makeup: "Makeup",
        "hair color": "Hair Color",
        "hair styling": "Hair Styling",
        "men's grooming": "Men's Grooming",
        suncare: "Suncare",
        fragrance: "Fragrance",
      },
    },
  },
  es: {
    dir: "ltr",
    aiLanguage: "Spanish",
    strings: {
      siteTitle: "Asesor Inteligente de Rutinas y Productos",
      languageLabel: "Idioma",
      categoryPlaceholder: "Elige una categoria",
      selectedProductsHeading: "Productos Seleccionados",
      skincareRoutineText: "Rutina de Cuidado Facial",
      haircareRoutineText: "Rutina de Cuidado Capilar",
      chatHeading: "Construyamos Tu Rutina",
      clearConversationTitle: "Borrar historial de conversacion",
      userInputPlaceholder: "Preguntame sobre productos o rutinas...",
      footerCopyright: "© 2025 L'Oréal. Todos los derechos reservados.",
      privacyLink: "Politica de Privacidad",
      termsLink: "Terminos de Uso",
      contactLink: "Contacto",
      youLabel: "Tu",
      assistantLabel: "Asistente",
      thinking: "Pensando...",
      selectCategoryToView: "Selecciona una categoria para ver productos",
      emptySelected:
        "Aun no hay productos seleccionados. Haz clic en un producto para agregarlo a tu rutina.",
      selectionCount: "Has seleccionado {count} producto(s)",
      removeAria: "Eliminar {product}",
      apiError: "Lo siento, no pude conectar con la API de Cloudflare.",
      categories: {
        cleanser: "Limpiadores",
        moisturizer: "Hidratantes y Tratamientos",
        haircare: "Cuidado Capilar",
        makeup: "Maquillaje",
        "hair color": "Coloracion",
        "hair styling": "Peinado",
        "men's grooming": "Cuidado Masculino",
        suncare: "Proteccion Solar",
        fragrance: "Fragancias",
      },
    },
  },
  fr: {
    dir: "ltr",
    aiLanguage: "French",
    strings: {
      siteTitle: "Conseiller Intelligent Routine et Produits",
      languageLabel: "Langue",
      categoryPlaceholder: "Choisissez une categorie",
      selectedProductsHeading: "Produits Selectionnes",
      skincareRoutineText: "Routine Soin de la Peau",
      haircareRoutineText: "Routine Soin des Cheveux",
      chatHeading: "Construisons Votre Routine",
      clearConversationTitle: "Effacer l'historique de conversation",
      userInputPlaceholder:
        "Posez-moi des questions sur les produits ou les routines...",
      footerCopyright: "© 2025 L'Oréal. Tous droits reserves.",
      privacyLink: "Politique de Confidentialite",
      termsLink: "Conditions d'Utilisation",
      contactLink: "Contact",
      youLabel: "Vous",
      assistantLabel: "Assistant",
      thinking: "Je reflechis...",
      selectCategoryToView: "Selectionnez une categorie pour voir les produits",
      emptySelected:
        "Aucun produit selectionne pour le moment. Cliquez sur un produit pour l'ajouter a votre routine.",
      selectionCount: "Vous avez selectionne {count} produit(s)",
      removeAria: "Retirer {product}",
      apiError: "Desole, je n'ai pas pu joindre l'API Cloudflare.",
      categories: {
        cleanser: "Nettoyants",
        moisturizer: "Hydratants et Soins",
        haircare: "Soin des Cheveux",
        makeup: "Maquillage",
        "hair color": "Coloration",
        "hair styling": "Coiffage",
        "men's grooming": "Soin Homme",
        suncare: "Protection Solaire",
        fragrance: "Parfums",
      },
    },
  },
  pt: {
    dir: "ltr",
    aiLanguage: "Portuguese",
    strings: {
      siteTitle: "Consultor Inteligente de Rotina e Produtos",
      languageLabel: "Idioma",
      categoryPlaceholder: "Escolha uma categoria",
      selectedProductsHeading: "Produtos Selecionados",
      skincareRoutineText: "Rotina de Cuidados com a Pele",
      haircareRoutineText: "Rotina de Cuidados com o Cabelo",
      chatHeading: "Vamos Montar Sua Rotina",
      clearConversationTitle: "Limpar historico da conversa",
      userInputPlaceholder: "Pergunte sobre produtos ou rotinas...",
      footerCopyright: "© 2025 L'Oréal. Todos os direitos reservados.",
      privacyLink: "Politica de Privacidade",
      termsLink: "Termos de Uso",
      contactLink: "Contato",
      youLabel: "Voce",
      assistantLabel: "Assistente",
      thinking: "Pensando...",
      selectCategoryToView: "Selecione uma categoria para ver os produtos",
      emptySelected:
        "Nenhum produto selecionado ainda. Clique em um produto para adiciona-lo a sua rotina.",
      selectionCount: "Voce selecionou {count} produto(s)",
      removeAria: "Remover {product}",
      apiError: "Desculpe, nao consegui acessar a API Cloudflare.",
      categories: {
        cleanser: "Limpadores",
        moisturizer: "Hidratantes e Tratamentos",
        haircare: "Cuidados com o Cabelo",
        makeup: "Maquiagem",
        "hair color": "Coloracao",
        "hair styling": "Finalizacao",
        "men's grooming": "Cuidados Masculinos",
        suncare: "Protetor Solar",
        fragrance: "Fragrancias",
      },
    },
  },
  de: {
    dir: "ltr",
    aiLanguage: "German",
    strings: {
      siteTitle: "Intelligenter Routine- und Produktberater",
      languageLabel: "Sprache",
      categoryPlaceholder: "Kategorie auswahlen",
      selectedProductsHeading: "Ausgewahlte Produkte",
      skincareRoutineText: "Hautpflege-Routine",
      haircareRoutineText: "Haarpflege-Routine",
      chatHeading: "Lass uns deine Routine erstellen",
      clearConversationTitle: "Unterhaltungsverlauf loschen",
      userInputPlaceholder: "Frag mich nach Produkten oder Routinen...",
      footerCopyright: "© 2025 L'Oréal. Alle Rechte vorbehalten.",
      privacyLink: "Datenschutz",
      termsLink: "Nutzungsbedingungen",
      contactLink: "Kontakt",
      youLabel: "Du",
      assistantLabel: "Assistent",
      thinking: "Denke nach...",
      selectCategoryToView: "Wahle eine Kategorie, um Produkte zu sehen",
      emptySelected:
        "Noch keine Produkte ausgewahlt. Klicke auf ein Produkt, um es deiner Routine hinzuzufugen.",
      selectionCount: "Du hast {count} Produkt(e) ausgewahlt",
      removeAria: "{product} entfernen",
      apiError:
        "Entschuldigung, ich konnte die Cloudflare-API nicht erreichen.",
      categories: {
        cleanser: "Reiniger",
        moisturizer: "Feuchtigkeitspflege und Behandlungen",
        haircare: "Haarpflege",
        makeup: "Make-up",
        "hair color": "Haarfarbe",
        "hair styling": "Haarstyling",
        "men's grooming": "Herrenpflege",
        suncare: "Sonnenschutz",
        fragrance: "Dufte",
      },
    },
  },
  it: {
    dir: "ltr",
    aiLanguage: "Italian",
    strings: {
      siteTitle: "Consulente Intelligente Routine e Prodotti",
      languageLabel: "Lingua",
      categoryPlaceholder: "Scegli una categoria",
      selectedProductsHeading: "Prodotti Selezionati",
      skincareRoutineText: "Routine Cura della Pelle",
      haircareRoutineText: "Routine Cura dei Capelli",
      chatHeading: "Costruiamo La Tua Routine",
      clearConversationTitle: "Cancella cronologia conversazione",
      userInputPlaceholder: "Chiedimi di prodotti o routine...",
      footerCopyright: "© 2025 L'Oréal. Tutti i diritti riservati.",
      privacyLink: "Informativa sulla Privacy",
      termsLink: "Termini di Utilizzo",
      contactLink: "Contatti",
      youLabel: "Tu",
      assistantLabel: "Assistente",
      thinking: "Sto pensando...",
      selectCategoryToView: "Seleziona una categoria per vedere i prodotti",
      emptySelected:
        "Nessun prodotto selezionato. Fai clic su un prodotto per aggiungerlo alla tua routine.",
      selectionCount: "Hai selezionato {count} prodotto(i)",
      removeAria: "Rimuovi {product}",
      apiError:
        "Mi dispiace, non sono riuscito a raggiungere l'API Cloudflare.",
      categories: {
        cleanser: "Detergenti",
        moisturizer: "Idratanti e Trattamenti",
        haircare: "Cura dei Capelli",
        makeup: "Trucco",
        "hair color": "Colorazione Capelli",
        "hair styling": "Styling Capelli",
        "men's grooming": "Cura Uomo",
        suncare: "Protezione Solare",
        fragrance: "Fragranze",
      },
    },
  },
  ar: {
    dir: "rtl",
    aiLanguage: "Arabic",
    strings: {
      siteTitle: "مستشار الروتين والمنتجات الذكي",
      languageLabel: "اللغة",
      categoryPlaceholder: "اختر فئة",
      selectedProductsHeading: "المنتجات المختارة",
      skincareRoutineText: "روتين العناية بالبشرة",
      haircareRoutineText: "روتين العناية بالشعر",
      chatHeading: "لنصمم روتينك",
      clearConversationTitle: "مسح سجل المحادثة",
      userInputPlaceholder: "اسألني عن المنتجات أو الروتين...",
      footerCopyright: "© 2025 لوريال. جميع الحقوق محفوظة.",
      privacyLink: "سياسة الخصوصية",
      termsLink: "شروط الاستخدام",
      contactLink: "اتصل بنا",
      youLabel: "أنت",
      assistantLabel: "المساعد",
      thinking: "جارٍ التفكير...",
      selectCategoryToView: "اختر فئة لعرض المنتجات",
      emptySelected:
        "لا توجد منتجات مختارة بعد. انقر على منتج لإضافته إلى روتينك.",
      selectionCount: "لقد اخترت {count} منتج(ات)",
      removeAria: "إزالة {product}",
      apiError: "عذراً، تعذر الاتصال بواجهة Cloudflare.",
      categories: {
        cleanser: "منظفات",
        moisturizer: "مرطبات وعلاجات",
        haircare: "العناية بالشعر",
        makeup: "مكياج",
        "hair color": "صبغة شعر",
        "hair styling": "تصفيف الشعر",
        "men's grooming": "العناية الرجالية",
        suncare: "العناية من الشمس",
        fragrance: "عطور",
      },
    },
  },
  he: {
    dir: "rtl",
    aiLanguage: "Hebrew",
    strings: {
      siteTitle: "יועץ שגרה ומוצרים חכם",
      languageLabel: "שפה",
      categoryPlaceholder: "בחרו קטגוריה",
      selectedProductsHeading: "מוצרים שנבחרו",
      skincareRoutineText: "שגרת טיפוח עור",
      haircareRoutineText: "שגרת טיפוח שיער",
      chatHeading: "בואו נבנה את השגרה שלך",
      clearConversationTitle: "ניקוי היסטוריית שיחה",
      userInputPlaceholder: "שאלו אותי על מוצרים או שגרות...",
      footerCopyright: "© 2025 לוריאל. כל הזכויות שמורות.",
      privacyLink: "מדיניות פרטיות",
      termsLink: "תנאי שימוש",
      contactLink: "יצירת קשר",
      youLabel: "את/ה",
      assistantLabel: "העוזר",
      thinking: "חושב...",
      selectCategoryToView: "בחרו קטגוריה כדי לראות מוצרים",
      emptySelected:
        "עדיין לא נבחרו מוצרים. לחצו על מוצר כדי להוסיף אותו לשגרה.",
      selectionCount: "בחרת {count} מוצר(ים)",
      removeAria: "הסר/י את {product}",
      apiError: "מצטערים, לא ניתן היה להגיע ל-Cloudflare API.",
      categories: {
        cleanser: "תכשירי ניקוי",
        moisturizer: "לחות וטיפולים",
        haircare: "טיפוח שיער",
        makeup: "איפור",
        "hair color": "צבע לשיער",
        "hair styling": "עיצוב שיער",
        "men's grooming": "טיפוח גברי",
        suncare: "הגנה מהשמש",
        fragrance: "בשמים",
      },
    },
  },
  fa: {
    dir: "rtl",
    aiLanguage: "Persian",
    strings: {
      siteTitle: "مشاور هوشمند روتين و محصولات",
      languageLabel: "زبان",
      categoryPlaceholder: "يک دسته انتخاب کنيد",
      selectedProductsHeading: "محصولات انتخاب شده",
      skincareRoutineText: "روتين مراقبت از پوست",
      haircareRoutineText: "روتين مراقبت از مو",
      chatHeading: "بياييد روتين شما را بسازيم",
      clearConversationTitle: "پاک کردن تاريخچه گفتگو",
      userInputPlaceholder: "درباره محصولات يا روتين ها از من بپرسيد...",
      footerCopyright: "© 2025 لورآل. تمام حقوق محفوظ است.",
      privacyLink: "سياست حفظ حريم خصوصي",
      termsLink: "شرايط استفاده",
      contactLink: "تماس با ما",
      youLabel: "شما",
      assistantLabel: "دستيار",
      thinking: "در حال فکر کردن...",
      selectCategoryToView: "يک دسته انتخاب کنيد تا محصولات را ببينيد",
      emptySelected:
        "هنوز محصولي انتخاب نشده است. روي يک محصول کليک کنيد تا به روتين شما اضافه شود.",
      selectionCount: "شما {count} محصول انتخاب کرده ايد",
      removeAria: "حذف {product}",
      apiError: "متاسفيم، اتصال به API کلودفلر انجام نشد.",
      categories: {
        cleanser: "پاک کننده ها",
        moisturizer: "مرطوب کننده ها و درمان ها",
        haircare: "مراقبت از مو",
        makeup: "آرايش",
        "hair color": "رنگ مو",
        "hair styling": "حالت دادن مو",
        "men's grooming": "مراقبت مردانه",
        suncare: "مراقبت در برابر آفتاب",
        fragrance: "عطرها",
      },
    },
  },
};

function getActiveLanguageConfig() {
  return LANGUAGE_CONFIG[currentLanguage] || LANGUAGE_CONFIG.en;
}

function t(key, variables = {}) {
  const activeStrings = getActiveLanguageConfig().strings;
  const fallbackStrings = LANGUAGE_CONFIG.en.strings;
  const template = activeStrings[key] || fallbackStrings[key] || "";

  return Object.entries(variables).reduce(
    (result, [name, value]) => result.replace(`{${name}}`, value),
    template,
  );
}

function renderCategoryOptions() {
  const categoryOptions = Array.from(categoryFilter.options);
  const categoryLabels = getActiveLanguageConfig().strings.categories;

  categoryOptions.forEach((option) => {
    if (!option.value) {
      option.textContent = t("categoryPlaceholder");
      return;
    }

    option.textContent = categoryLabels[option.value] || option.textContent;
  });
}

function populateLanguageSelector() {
  languageSelector.innerHTML = Object.keys(LANGUAGE_CONFIG)
    .map((languageCode) => {
      const label = LANGUAGE_SELECTOR_LABELS[languageCode] || languageCode;
      return `<option value="${languageCode}">${label}</option>`;
    })
    .join("");
}

function getRoleLabel(role) {
  return role === "user" ? t("youLabel") : t("assistantLabel");
}

function getRoleClass(role) {
  return role === "user" ? "chat-message-user" : "chat-message-assistant";
}

function renderConversationWindow() {
  chatWindow.innerHTML = "";

  conversationHistory.forEach((message) => {
    const roleLabel = getRoleLabel(message.role);
    const roleClass = getRoleClass(message.role);

    const bubble = createChatBubble(roleLabel, roleClass, message.content);
    chatWindow.append(bubble);
  });

  chatWindow.scrollTop = chatWindow.scrollHeight;
}

function applyLanguage(languageCode) {
  const hasLanguage = Object.prototype.hasOwnProperty.call(
    LANGUAGE_CONFIG,
    languageCode,
  );

  currentLanguage = hasLanguage ? languageCode : "en";
  localStorage.setItem(LANGUAGE_STORAGE_KEY, currentLanguage);

  const activeConfig = getActiveLanguageConfig();
  document.documentElement.lang = currentLanguage;
  document.documentElement.dir = activeConfig.dir;

  siteTitle.textContent = t("siteTitle");
  languageLabel.textContent = t("languageLabel");
  selectedProductsHeading.textContent = t("selectedProductsHeading");
  skincareRoutineText.textContent = t("skincareRoutineText");
  haircareRoutineText.textContent = t("haircareRoutineText");
  chatHeading.textContent = t("chatHeading");
  clearConversationBtn.title = t("clearConversationTitle");
  clearConversationBtn.setAttribute("aria-label", t("clearConversationTitle"));
  userInput.placeholder = t("userInputPlaceholder");
  footerCopyright.textContent = t("footerCopyright");
  privacyLink.textContent = t("privacyLink");
  termsLink.textContent = t("termsLink");
  contactLink.textContent = t("contactLink");

  if (languageSelector.value !== currentLanguage) {
    languageSelector.value = currentLanguage;
  }

  renderCategoryOptions();
  updateSelectedProductsDisplay();
  renderConversationWindow();

  if (!productsContainer.querySelector(".product-card")) {
    showProductsPlaceholder();
  }
}

function buildSystemPrompt() {
  const aiLanguage = getActiveLanguageConfig().aiLanguage;
  return `${BASE_SYSTEM_PROMPT} Respond in ${aiLanguage}.`;
}

/* ------------------------------
   storage helpers
------------------------------ */
function saveSelectedProducts() {
  const productsArray = Array.from(selectedProducts.values());
  localStorage.setItem(
    SELECTED_PRODUCTS_STORAGE_KEY,
    JSON.stringify(productsArray),
  );
}

function loadSelectedProducts() {
  const saved = localStorage.getItem(SELECTED_PRODUCTS_STORAGE_KEY);

  if (saved) {
    const productsArray = JSON.parse(saved);
    selectedProducts = new Map(
      productsArray.map((product) => [product.id, product]),
    );
  }

  updateSelectedProductsDisplay();
}

function saveConversationHistory() {
  localStorage.setItem(
    CONVERSATION_HISTORY_KEY,
    JSON.stringify(conversationHistory),
  );
}

function loadConversationHistory() {
  const saved = localStorage.getItem(CONVERSATION_HISTORY_KEY);

  if (saved) {
    conversationHistory = JSON.parse(saved);
  } else {
    conversationHistory = [];
  }
}

function clearConversationHistory() {
  conversationHistory = [];
  localStorage.removeItem(CONVERSATION_HISTORY_KEY);
}

/* ------------------------------
   products data helpers
------------------------------ */
async function loadProducts() {
  if (productsCache) {
    return productsCache;
  }

  const response = await fetch("products.json");
  const data = await response.json();
  productsCache = data.products;

  return productsCache;
}

function getSelectedProductsTextForAI() {
  if (selectedProducts.size === 0) {
    return "No products have been selected yet.";
  }

  return Array.from(selectedProducts.values())
    .map(
      (product) =>
        `- ${product.name} (${product.brand}, ${product.category}): ${product.description}`,
    )
    .join("\n");
}

function getCatalogProductsTextForAI(products) {
  return products
    .map(
      (product) => `- ${product.name} (${product.brand}, ${product.category})`,
    )
    .join("\n");
}

/* ------------------------------
   selection helpers
------------------------------ */
function setProductSelected(product) {
  selectedProducts.set(product.id, product);
}

function removeSelectedProduct(productId) {
  selectedProducts.delete(productId);
}

function updateVisibleProductCardSelection(productId, isSelected) {
  const visibleProductCard = productsContainer.querySelector(
    `[data-product-id="${productId}"]`,
  );

  if (!visibleProductCard) {
    return;
  }

  visibleProductCard.classList.toggle("selected", isSelected);
}

function refreshVisibleProductCardSelections() {
  const visibleProductCards =
    productsContainer.querySelectorAll(".product-card");

  visibleProductCards.forEach((card) => {
    const productId = parseInt(card.dataset.productId, 10);
    card.classList.toggle("selected", selectedProducts.has(productId));
  });
}

function normalizeText(value) {
  return value.toLowerCase().replace(/[^a-z0-9\s'-]/g, " ");
}

async function getProductsMentionedInText(text) {
  const allProducts = await loadProducts();
  const normalizedText = normalizeText(text);
  const paddedText = ` ${normalizedText} `;

  return allProducts.filter((product) => {
    const productName = normalizeText(product.name);

    if (!productName) {
      return false;
    }

    // Match only full product names mentioned in assistant responses.
    const paddedProductName = ` ${productName} `;
    return paddedText.includes(paddedProductName);
  });
}

async function selectProductsMentionedInText(text) {
  const matchedProducts = await getProductsMentionedInText(text);
  const matchedProductIds = new Set(
    matchedProducts.map((product) => product.id),
  );

  // Remove products no longer recommended in the latest assistant response.
  Array.from(selectedProducts.keys()).forEach((productId) => {
    if (!matchedProductIds.has(productId)) {
      removeSelectedProduct(productId);
    }
  });

  // Add products newly recommended in the latest assistant response.
  matchedProducts.forEach((product) => {
    if (!selectedProducts.has(product.id)) {
      setProductSelected(product);
    }
  });

  saveSelectedProducts();
  updateSelectedProductsDisplay();
  refreshVisibleProductCardSelections();
}

/* ------------------------------
   UI rendering
------------------------------ */
function renderSelectedProductItem(product) {
  return `
    <li data-id="${product.id}">
      <div>
        <strong>${product.name}</strong> - ${product.brand}
      </div>
      <button type="button" class="remove-selected-btn" data-product-id="${product.id}" aria-label="${t("removeAria", { product: product.name })}">
        X
      </button>
    </li>
  `;
}

function updateSelectedProductsDisplay() {
  if (selectedProducts.size === 0) {
    selectedProductsList.innerHTML = `<p class="empty-message">${t("emptySelected")}</p>`;
    return;
  }

  selectedProductsList.innerHTML = `
    <p class="selection-count">${t("selectionCount", { count: selectedProducts.size })}</p>
    <ul class="selected-items">
      ${Array.from(selectedProducts.values()).map(renderSelectedProductItem).join("")}
    </ul>
  `;
}

function createChatBubble(roleLabel, roleClass, message, extraClass = "") {
  const bubble = document.createElement("div");
  bubble.className = `chat-message ${roleClass} ${extraClass}`.trim();
  bubble.innerHTML = `<span class="chat-message-label"></span><p class="chat-message-text"></p>`;
  bubble.querySelector(".chat-message-label").textContent = roleLabel;
  bubble.querySelector(".chat-message-text").textContent = message;
  return bubble;
}

function renderChatMessages(userMessage, assistantMessage) {
  // Add user message to history
  conversationHistory.push({
    role: "user",
    content: userMessage,
  });

  // Add assistant message to history
  conversationHistory.push({
    role: "assistant",
    content: assistantMessage,
  });

  // Save conversation to localStorage
  saveConversationHistory();

  renderConversationWindow();
}

function renderThinkingMessage(userMessage) {
  chatWindow.innerHTML = "";

  const userBubble = createChatBubble(
    getRoleLabel("user"),
    getRoleClass("user"),
    userMessage,
  );
  const thinkingBubble = createChatBubble(
    getRoleLabel("assistant"),
    getRoleClass("assistant"),
    t("thinking"),
    "chat-message-thinking",
  );

  chatWindow.append(userBubble, thinkingBubble);
  chatWindow.scrollTop = chatWindow.scrollHeight;
}

function showProductsPlaceholder() {
  productsContainer.innerHTML = `
    <div class="placeholder-message">
      ${t("selectCategoryToView")}
    </div>
  `;
}

function displayProducts(products) {
  productsContainer.innerHTML = products
    .map(
      (product) => `
        <div class="product-card ${selectedProducts.has(product.id) ? "selected" : ""}" data-product-id="${product.id}">
          <img src="${product.image}" alt="${product.name}">
          <div class="product-info">
            <h3>${product.name}</h3>
            <p>${product.brand}</p>
          </div>
          <div class="product-description-popup">
            ${product.description}
          </div>
        </div>
      `,
    )
    .join("");
}

/* ------------------------------
   prompts + API calls
------------------------------ */
function buildRoutinePrompt(routineType) {
  const hasSelections = selectedProducts.size > 0;

  if (routineType === "skincare") {
    return hasSelections
      ? "Using my selected products, build a simple skincare routine in the best order and explain how to apply each step."
      : "Build a simple skincare routine using suitable products from the available catalog, and explain how to apply each step.";
  }

  return hasSelections
    ? "Using my selected products, build a simple haircare routine in the best order and explain how to apply each step."
    : "Build a simple haircare routine using suitable products from the available catalog, and explain how to apply each step.";
}

function buildMessagesForAPI(prompt, allProducts) {
  const selectedProductsContext = getSelectedProductsTextForAI();
  const catalogProductsContext = getCatalogProductsTextForAI(allProducts);

  // Start with system prompt
  const messages = [
    {
      role: "system",
      content: buildSystemPrompt(),
    },
  ];

  // Add product context only once (at the beginning)
  if (conversationHistory.length === 0) {
    messages.push({
      role: "user",
      content: `Available catalog products:\n${catalogProductsContext}`,
    });
    messages.push({
      role: "user",
      content: `Selected products:\n${selectedProductsContext}`,
    });
  }

  // Add full conversation history
  messages.push(...conversationHistory);

  // Add the current user message
  messages.push({
    role: "user",
    content: prompt,
  });

  return messages;
}

async function sendPrompt(prompt, clearInput = false) {
  renderThinkingMessage(prompt);

  try {
    const allProducts = await loadProducts();
    const messages = buildMessagesForAPI(prompt, allProducts);

    const response = await fetch(CLOUDFLARE_WORKER_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ messages }),
    });

    const data = await response.json();
    const botReply = data.choices[0].message.content;

    await selectProductsMentionedInText(botReply);
    renderChatMessages(prompt, botReply);

    if (clearInput) {
      userInput.value = "";
    }
  } catch (error) {
    renderChatMessages(prompt, t("apiError"));
    console.error("Cloudflare request error:", error);
  }
}

/* ------------------------------
   event handlers
------------------------------ */
selectedProductsList.addEventListener("click", (event) => {
  const removeButton = event.target.closest(".remove-selected-btn");

  if (!removeButton) {
    return;
  }

  const productId = parseInt(removeButton.dataset.productId, 10);

  if (!selectedProducts.has(productId)) {
    return;
  }

  removeSelectedProduct(productId);
  saveSelectedProducts();
  updateSelectedProductsDisplay();
  updateVisibleProductCardSelection(productId, false);
});

productsContainer.addEventListener("click", async (event) => {
  const productCard = event.target.closest(".product-card");

  if (!productCard) {
    return;
  }

  const productId = parseInt(productCard.dataset.productId, 10);

  if (selectedProducts.has(productId)) {
    removeSelectedProduct(productId);
    productCard.classList.remove("selected");
  } else {
    const allProducts = await loadProducts();
    const productToAdd = allProducts.find(
      (product) => product.id === productId,
    );

    if (productToAdd) {
      setProductSelected(productToAdd);
      productCard.classList.add("selected");
    }
  }

  saveSelectedProducts();
  updateSelectedProductsDisplay();
});

categoryFilter.addEventListener("change", async (event) => {
  const allProducts = await loadProducts();
  const selectedCategory = event.target.value;
  const filteredProducts = allProducts.filter(
    (product) => product.category === selectedCategory,
  );

  displayProducts(filteredProducts);
});

languageSelector.addEventListener("change", (event) => {
  applyLanguage(event.target.value);
});

generateSkincareRoutineButton.addEventListener("click", () => {
  const prompt = buildRoutinePrompt("skincare");
  sendPrompt(prompt);
});

generateHaircareRoutineButton.addEventListener("click", () => {
  const prompt = buildRoutinePrompt("haircare");
  sendPrompt(prompt);
});

chatForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const prompt = userInput.value.trim();

  if (!prompt) {
    return;
  }

  await sendPrompt(prompt, true);
});

clearConversationBtn.addEventListener("click", () => {
  clearConversationHistory();
  chatWindow.innerHTML = "";
  userInput.focus();
});

/* ------------------------------
   initial page setup
------------------------------ */
const savedLanguage = localStorage.getItem(LANGUAGE_STORAGE_KEY) || "en";
loadConversationHistory();
populateLanguageSelector();
applyLanguage(savedLanguage);

showProductsPlaceholder();
loadSelectedProducts();

// Display conversation history on page load
if (conversationHistory.length > 0) {
  renderConversationWindow();
}
