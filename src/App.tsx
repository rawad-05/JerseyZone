import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Product, CartItem, Order, StoreSettings } from "./types";
import { DEFAULT_PRODUCTS, DEFAULT_SETTINGS } from "./defaultData";
import { parseHash, formatPrice } from "./utils";
import { 
  ShoppingBag, 
  Trash2, 
  Plus, 
  Minus, 
  Check, 
  ChevronRight, 
  ChevronLeft,
  Settings, 
  Package, 
  PlusCircle, 
  ListOrdered, 
  ArrowLeft, 
  ArrowRight,
  Edit, 
  Menu, 
  X,
  ExternalLink,
  ShieldAlert,
  Save,
  CheckCircle2,
  Lock,
  Filter,
  CheckSquare,
  Square
} from "lucide-react";

export default function App() {
  // --- LOCAL STORAGE PERSISTED STATE ---
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem("jz_products");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Error loading products", e);
      }
    }
    return DEFAULT_PRODUCTS;
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem("jz_orders");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Error loading orders", e);
      }
    }
    return [];
  });

  const [settings, setSettings] = useState<StoreSettings>(() => {
    const saved = localStorage.getItem("jz_settings");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Error loading settings", e);
      }
    }
    return DEFAULT_SETTINGS;
  });

  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem("jz_cart");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Error loading cart", e);
      }
    }
    return [];
  });

  // --- SYNC TO LOCAL STORAGE ---
  useEffect(() => {
    localStorage.setItem("jz_products", JSON.stringify(products));
  }, [products]);

  // Handle setting initial state for localized category
  const [selectedCategory, setSelectedCategory] = useState("الكل");

  useEffect(() => {
    localStorage.setItem("jz_orders", JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem("jz_settings", JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem("jz_cart", JSON.stringify(cart));
  }, [cart]);

  // --- ROUTING SYSTEM ---
  const [hash, setHash] = useState(window.location.hash || "#home");
  useEffect(() => {
    const handleHashChange = () => {
      setHash(window.location.hash || "#home");
      window.scrollTo(0, 0);
    };
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  const { path: routePath, query: routeQuery } = parseHash(hash);
  const navigate = (newHash: string) => {
    window.location.hash = newHash;
  };

  // --- MOBILE NAVIGATION STATE ---
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // --- TOAST SYSTEM STATE ---
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  // --- PRODUCT DETAIL STATE ---
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [currentThumbIndex, setCurrentThumbIndex] = useState(0);

  // --- DEVICE SECURITY STATE ---
  const [isDeviceAuthorized, setIsDeviceAuthorized] = useState<boolean>(() => {
    return localStorage.getItem("jz_device_authorized") === "true";
  });
  const [deviceRegCode, setDeviceRegCode] = useState("");
  const [deviceRegError, setDeviceRegError] = useState("");

  // --- ADMIN PORTAL STATE ---
  const [isAdminAuth, setIsAdminAuth] = useState(false);
  const [adminPassword, setAdminPassword] = useState("");
  const [adminError, setAdminError] = useState("");
  const [adminTab, setAdminTab] = useState<"products" | "orders" | "settings">("products");
  
  // Admin Editing Product State
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [formName, setFormName] = useState("");
  const [formCategory, setFormCategory] = useState("");
  const [formPrice, setFormPrice] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formImage, setFormImage] = useState("");
  const [formSupplementaryImages, setFormSupplementaryImages] = useState<string[]>([]);
  const [formSizes, setFormSizes] = useState<string[]>(["S", "M", "L", "XL"]);
  const [formColors, setFormColors] = useState("");
  const [formFeatured, setFormFeatured] = useState(false);
  const [formActive, setFormActive] = useState(true);

  // --- CHECKOUT FORM STATE ---
  const [checkoutName, setCheckoutName] = useState("");
  const [checkoutPhone, setCheckoutPhone] = useState("");
  const [checkoutWilaya, setCheckoutWilaya] = useState("");
  const [checkoutAddress, setCheckoutAddress] = useState("");
  const [checkoutNotes, setCheckoutNotes] = useState("");
  const [checkoutError, setCheckoutError] = useState("");

  // --- DERIVED CART QUANTITY ---
  const totalCartItems = cart.reduce((total, item) => total + item.quantity, 0);
  const cartSubtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);

  // --- HANDLERS ---
  const handleAddToCart = (product: Product) => {
    if (!selectedSize) {
      showToast("[ يرجى اختيار المقاس ]");
      return;
    }
    if (!selectedColor) {
      showToast("[ يرجى اختيار اللون ]");
      return;
    }

    const cartItemId = `${product.id}-${selectedSize}-${selectedColor}`;
    const existingIndex = cart.findIndex(item => item.id === cartItemId);

    if (existingIndex > -1) {
      const updatedCart = [...cart];
      updatedCart[existingIndex].quantity += 1;
      setCart(updatedCart);
    } else {
      const newCartItem: CartItem = {
        id: cartItemId,
        productId: product.id,
        name: product.name,
        size: selectedSize,
        color: selectedColor,
        price: product.price,
        quantity: 1,
        image: product.image
      };
      setCart([...cart, newCartItem]);
    }

    showToast(`[ تمت الإضافة إلى سلة المشتريات : ${product.name} (${selectedSize}) ]`);
  };

  const updateCartQty = (id: string, delta: number) => {
    const itemIndex = cart.findIndex(item => item.id === id);
    if (itemIndex > -1) {
      const updatedCart = [...cart];
      const newQty = updatedCart[itemIndex].quantity + delta;
      if (newQty <= 0) {
        updatedCart.splice(itemIndex, 1);
        showToast("[ تم إزالة القطعة من السلة ]");
      } else {
        updatedCart[itemIndex].quantity = newQty;
      }
      setCart(updatedCart);
    }
  };

  const removeCartItem = (id: string) => {
    setCart(cart.filter(item => item.id !== id));
    showToast("[ تم إزالة القطعة من السلة ]");
  };

  const handleRegisterDevice = (e: React.FormEvent) => {
    e.preventDefault();
    if (deviceRegCode === "rawad28112005") {
      localStorage.setItem("jz_device_authorized", "true");
      setIsDeviceAuthorized(true);
      setDeviceRegError("");
      setDeviceRegCode("");
      showToast("[ تم ترخيص هذا الجهاز بنجاح كمشرف معتمد ]");
    } else {
      setDeviceRegError("[ رمز تفويض الجهاز غير صحيح ]");
    }
  };

  const handleRevokeDeviceAuth = () => {
    if (window.confirm("هل أنت متأكد من إلغاء تفويض هذا الجهاز؟ سيتم إخفاء بوابة الأدمن تماماً عن هذا الجهاز.")) {
      localStorage.removeItem("jz_device_authorized");
      setIsDeviceAuthorized(false);
      setIsAdminAuth(false);
      setAdminPassword("");
      navigate("#home");
      showToast("[ تم إلغاء تفويض الجهاز وتسجيل الخروج بنجاح ]");
    }
  };

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPassword === "rawad28112005") {
      setIsAdminAuth(true);
      setAdminError("");
    } else {
      setAdminError("[ رمز الأمان المكتوب غير صحيح ]");
    }
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName || !formPrice || !formCategory || !formImage) {
      showToast("[ خطأ: يرجى ملء جميع الحقول الإلزامية ]");
      return;
    }

    const parsedPrice = parseFloat(formPrice);
    if (isNaN(parsedPrice)) {
      showToast("[ خطأ: يجب أن يكون السعر رقماً صحيحاً ]");
      return;
    }

    const colorsArray = formColors
      ? formColors.split(",").map(c => c.trim()).filter(c => c.length > 0)
      : ["Default"];

    // Filter out empty URLs from supplementary images
    const supplementaryImagesFiltered = formSupplementaryImages.map(img => img.trim()).filter(img => img.length > 0);

    if (editingProduct) {
      // Edit mode
      const updatedProducts = products.map(p => {
        if (p.id === editingProduct.id) {
          return {
            ...p,
            name: formName,
            price: parsedPrice,
            category: formCategory,
            description: formDescription,
            image: formImage,
            images: supplementaryImagesFiltered,
            sizes: formSizes,
            colors: colorsArray,
            featured: formFeatured,
            active: formActive
          };
        }
        return p;
      });
      setProducts(updatedProducts);
      showToast("[ تم تحديث المنتج بنجاح ]");
    } else {
      // Add mode
      const newId = formName.toLowerCase().replace(/[^a-z0-9\u0600-\u06FF]+/g, "-");
      const newProduct: Product = {
        id: newId || "new-kit-" + Math.floor(Math.random() * 1000),
        name: formName,
        price: parsedPrice,
        category: formCategory,
        description: formDescription || "قميص رياضي فاخر بجودة عالية من مستودعات JERSEY ZONE الرسمية.",
        image: formImage,
        images: supplementaryImagesFiltered,
        sizes: formSizes,
        colors: colorsArray,
        featured: formFeatured,
        active: formActive
      };
      setProducts([...products, newProduct]);
      showToast("[ تم تأمين المنتج الجديد في الكتالوج ]");
    }

    // Reset Form
    resetProductForm();
  };

  const resetProductForm = () => {
    setEditingProduct(null);
    setIsAddingProduct(false);
    setFormName("");
    setFormCategory("");
    setFormPrice("");
    setFormDescription("");
    setFormImage("");
    setFormSupplementaryImages([]);
    setFormSizes(["S", "M", "L", "XL"]);
    setFormColors("");
    setFormFeatured(false);
    setFormActive(true);
  };

  const handleEditProductClick = (product: Product) => {
    setEditingProduct(product);
    setIsAddingProduct(true);
    setFormName(product.name);
    setFormCategory(product.category);
    setFormPrice(product.price.toString());
    setFormDescription(product.description);
    setFormImage(product.image);
    setFormSupplementaryImages(product.images || []);
    setFormSizes(product.sizes);
    setFormColors(product.colors.join(", "));
    setFormFeatured(product.featured);
    setFormActive(product.active);
  };

  const handleDeleteProduct = (productId: string) => {
    if (window.confirm("هل أنت متأكد تماماً من رغبتك في حذف هذا المنتج؟")) {
      setProducts(products.filter(p => p.id !== productId));
      showToast("[ تم حذف المنتج من الأرشيف ]");
    }
  };

  const handleToggleSize = (size: string) => {
    if (formSizes.includes(size)) {
      setFormSizes(formSizes.filter(s => s !== size));
    } else {
      setFormSizes([...formSizes, size]);
    }
  };

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!checkoutName.trim() || !checkoutPhone.trim() || !checkoutWilaya.trim() || !checkoutAddress.trim()) {
      setCheckoutError("[ جميع الحقول المميزة بنجمة * مطلوبة تماماً ]");
      return;
    }

    setCheckoutError("");

    // Create the order object
    const newOrder: Order = {
      id: "JZ-" + Math.floor(100000 + Math.random() * 900000),
      date: new Date().toLocaleString("ar-LY"),
      customerName: checkoutName,
      phone: checkoutPhone,
      wilaya: checkoutWilaya,
      address: checkoutAddress,
      notes: checkoutNotes,
      items: [...cart],
      total: cartSubtotal,
      status: "Pending"
    };

    // Save order in orders array
    setOrders([newOrder, ...orders]);

    // Build Whatsapp text and open URL
    let msg = `⚡ *طلب جديد من JERSEY ZONE* ⚡\n\n`;
    msg += `*بيانات العميل:*\n`;
    msg += `👤 الاسم: ${newOrder.customerName}\n`;
    msg += `📞 الهاتف: ${newOrder.phone}\n`;
    msg += `📍 المدينة/الولاية: ${newOrder.wilaya}\n`;
    msg += `🏠 العنوان: ${newOrder.address}\n`;
    if (newOrder.notes) {
      msg += `📝 ملاحظات: ${newOrder.notes}\n`;
    }
    msg += `\n*المنتجات المطلوبة:*\n`;
    newOrder.items.forEach((item, index) => {
      msg += `${index + 1}. *${item.name}*\n`;
      msg += `   المقاس: [ ${item.size} ] | اللون: ${item.color}\n`;
      msg += `   الكمية: ${item.quantity} x ${formatPrice(item.price)} = ${formatPrice(item.price * item.quantity)}\n\n`;
    });
    msg += `*ملخص الطلب:*\n`;
    msg += `💰 المجموع الفرعي: ${formatPrice(newOrder.total)}\n`;
    msg += `🚚 الشحن: على حسب المنطقة\n`;
    msg += `🔥 *المجموع الإجمالي: ${formatPrice(newOrder.total)}*\n\n`;
    msg += `تم الإرسال عبر نظام التوزيع التلقائي JERSEY ZONE.`;

    const encodedMsg = encodeURIComponent(msg);
    const whatsappUrl = `https://wa.me/218919456949?text=${encodedMsg}`;

    // Clear checkout inputs
    setCheckoutName("");
    setCheckoutPhone("");
    setCheckoutWilaya("");
    setCheckoutAddress("");
    setCheckoutNotes("");

    // Open WhatsApp
    window.open(whatsappUrl, "_blank");

    // Redirect to Confirmation
    navigate("#confirmation");
  };

  const handleCompleteConfirmation = () => {
    // Clear cart upon arriving at/exiting the confirmation page
    setCart([]);
    navigate("#home");
  };

  // --- PRE-LOAD AND PREVENT MAINTENANCE MODE CONFLICT ---
  const isMaintenanceModeActive = settings.maintenanceMode && routePath !== "admin";

  return (
    <div className="min-h-screen flex flex-col bg-primary-bg text-text-primary selection:bg-accent-blue selection:text-primary-bg antialiased font-sans" dir="rtl">
      
      {/* MAINTENANCE MODE SHIELD */}
      {isMaintenanceModeActive ? (
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center bg-primary-bg min-h-screen">
          <div className="max-w-md border border-border-custom bg-secondary-bg/50 p-10 relative">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-accent-blue text-primary-bg font-mono text-xs px-4 py-1 uppercase tracking-widest font-bold">
              [ الأنظمة في وضع الاستعداد ]
            </div>
            <div className="flex justify-center mb-6 text-accent-blue">
              <ShieldAlert size={64} className="animate-pulse" />
            </div>
            <h1 className="font-display text-5xl md:text-6xl tracking-tight mb-4 uppercase">
              {settings.storeName}
            </h1>
            <p className="font-mono text-sm text-accent-blue mb-8 tracking-wider">
              [ تحديث الأنظمة / تشكيلة جديدة قادمة ]
            </p>
            <div className="text-text-secondary text-sm space-y-4 mb-8 leading-relaxed">
              <p>نقوم حالياً بتهيئة مستودعاتنا ومعايرة بروتوكولات الأمان. ستفتح البوابة قريباً.</p>
              <p className="text-xs text-text-muted italic">"الطقم. المهمة. المنطقة."</p>
            </div>
            <div className="border-t border-border-custom pt-6 font-mono text-[10px] text-text-muted flex justify-between">
              <span>المرجع: JERSEY_ZONE_SYSTEMS</span>
              <span>الحالة: وضع السكون</span>
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* TOAST NOTIFICATION */}
          <AnimatePresence>
            {toastMessage && (
              <motion.div
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -50 }}
                className="fixed top-24 left-1/2 -translate-x-1/2 z-50 bg-accent-blue text-primary-bg font-mono text-xs md:text-sm px-6 py-3 shadow-2xl tracking-widest uppercase font-bold border border-white/20"
              >
                {toastMessage}
              </motion.div>
            )}
          </AnimatePresence>

          {/* STICKY NAVBAR */}
          <header className="sticky top-0 z-40 bg-primary-bg/95 backdrop-blur-md border-b border-border-custom">
            <div className="max-w-7xl mx-auto px-4 md:px-8 h-20 flex items-center justify-between">
              
              {/* Brand Logo */}
              <a href="#home" className="flex items-center gap-2 group">
                <span className="font-display text-3xl md:text-4xl tracking-tight text-white group-hover:text-accent-blue transition-colors">
                  {settings.storeName}
                </span>
                <span className="font-mono text-[9px] px-1.5 py-0.5 border border-accent-blue text-accent-blue rounded-xs">
                  [المقر]
                </span>
              </a>

              {/* Central Nav Links (Bracketed, Minimal Style) */}
              <nav className="hidden md:flex items-center gap-1 lg:gap-4 font-mono text-xs tracking-wider text-text-secondary">
                <a href="#home" className="px-3 py-2 hover:text-white transition-colors relative group">
                  <span className="text-accent-blue ml-1 opacity-0 group-hover:opacity-100 transition-opacity">[</span>
                  الرئيسية
                  <span className="text-accent-blue mr-1 opacity-0 group-hover:opacity-100 transition-opacity">]</span>
                </a>
                <a href="#shop" className="px-3 py-2 hover:text-white transition-colors relative group">
                  <span className="text-accent-blue ml-1 opacity-0 group-hover:opacity-100 transition-opacity">[</span>
                  الأطقم
                  <span className="text-accent-blue mr-1 opacity-0 group-hover:opacity-100 transition-opacity">]</span>
                </a>
                {isDeviceAuthorized && (
                  <a href="#admin" className="px-3 py-2 hover:text-white transition-colors relative group">
                    <span className="text-accent-blue ml-1 opacity-0 group-hover:opacity-100 transition-opacity">[</span>
                    الأدمن
                    <span className="text-accent-blue mr-1 opacity-0 group-hover:opacity-100 transition-opacity">]</span>
                  </a>
                )}
              </nav>

              {/* Right Side Icons */}
              <div className="flex items-center gap-4">
                
                {/* Admin Quicklink */}
                {isDeviceAuthorized && (
                  <a 
                    href="#admin" 
                    title="واجهة الأدمن "
                    className="p-2 text-text-secondary hover:text-accent-blue transition-colors relative"
                  >
                    <Settings size={20} />
                  </a>
                )}

                {/* Cart Icon & Badge */}
                <a 
                  href="#cart" 
                  className="p-2 text-text-secondary hover:text-accent-blue transition-colors relative flex items-center"
                  aria-label="عرض السلة"
                >
                  <ShoppingBag size={20} />
                  {totalCartItems > 0 && (
                    <span className="absolute -top-1 -right-1 bg-white text-primary-bg text-[9px] font-mono font-extrabold w-5 h-5 rounded-none flex items-center justify-center shadow-lg border border-primary-bg">
                      {totalCartItems}
                    </span>
                  )}
                </a>

                {/* Mobile Menu Toggle */}
                <button 
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="md:hidden p-2 text-text-secondary hover:text-white focus:outline-hidden"
                  aria-label="تبديل القائمة"
                >
                  {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>

              </div>
            </div>

            {/* Mobile Drawer Navigation */}
            <AnimatePresence>
              {mobileMenuOpen && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="md:hidden border-t border-border-custom bg-secondary-bg overflow-hidden"
                >
                  <div className="px-6 py-6 flex flex-col gap-4 font-mono text-sm tracking-widest text-text-secondary">
                    <a 
                      href="#home" 
                      onClick={() => setMobileMenuOpen(false)}
                      className="py-2 hover:text-white border-b border-border-custom/50 flex justify-between"
                    >
                      <span>[ الرئيسية ]</span>
                      <ChevronLeft size={16} />
                    </a>
                    <a 
                      href="#shop" 
                      onClick={() => setMobileMenuOpen(false)}
                      className="py-2 hover:text-white border-b border-border-custom/50 flex justify-between"
                    >
                      <span>[ تصفح الكتالوج ]</span>
                      <ChevronLeft size={16} />
                    </a>
                    <a 
                      href="#cart" 
                      onClick={() => setMobileMenuOpen(false)}
                      className="py-2 hover:text-white border-b border-border-custom/50 flex justify-between"
                    >
                      <span>[  سلة المشتريات ({totalCartItems}) ]</span>
                      <ChevronLeft size={16} />
                    </a>
                    {isDeviceAuthorized && (
                      <a 
                        href="#admin" 
                        onClick={() => setMobileMenuOpen(false)}
                        className="py-2 hover:text-white flex justify-between text-accent-blue"
                      >
                        <span>[  واجهة الأدمن ]</span>
                        <ChevronLeft size={16} />
                      </a>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </header>

          {/* MAIN PAGE CONTAINER WITH TRANSITIONS */}
          <main className="flex-1 flex flex-col">
            <AnimatePresence mode="wait">
              
              {/* PAGE 1: HOME */}
              {routePath === "home" && (
                <motion.div
                  key="home"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                  className="flex-1 flex flex-col"
                >
                  {/* Hero Screen */}
                  <section className="relative min-h-[85vh] md:min-h-[90vh] flex flex-col justify-center bg-radial from-secondary-bg via-primary-bg to-primary-bg px-4 md:px-12 py-20 overflow-hidden">
                    
                    {/* Background Visual Gradients */}
                    <div className="absolute inset-0 bg-linear-to-b from-transparent to-primary-bg/90 z-0"></div>
                    <div className="absolute top-1/4 left-0 w-[40vw] h-[40vw] rounded-full bg-accent-blue/5 blur-[120px] pointer-events-none"></div>
                    <div className="absolute -bottom-10 -right-10 w-[50vw] h-[50vw] rounded-full bg-secondary-bg/20 blur-[150px] pointer-events-none"></div>

                    {/* Content Layer */}
                    <div className="max-w-7xl mx-auto w-full z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                      
                      <div className="lg:col-span-8 space-y-6 text-right">
                        <div className="inline-block font-mono text-xs uppercase tracking-[0.3em] text-accent-blue bg-secondary-bg/80 border border-border-custom px-4 py-1.5">
                          [ إصدارات الكتالوج: السلسلة 01 ]
                        </div>
                        <h1 className="font-display text-4xl sm:text-6xl md:text-8xl tracking-tight leading-tight text-white font-black max-w-4xl uppercase">
                          {settings.heroHeadline}
                        </h1>
                        <p className="text-text-secondary text-base md:text-xl tracking-wide max-w-xl font-light">
                          {settings.heroSubheadline}
                        </p>
                        
                        <div className="pt-6 flex flex-col sm:flex-row gap-4">
                          <button 
                            onClick={() => navigate("#shop")}
                            className="bg-white hover:bg-accent-blue text-primary-bg font-mono text-sm uppercase tracking-widest px-10 py-5 transition-all duration-300 font-bold border border-white hover:border-accent-blue cursor-pointer flex items-center justify-between group"
                          >
                            <span>عرض الأطقم كاملة</span>
                            <ChevronLeft size={18} className="mr-4 transform group-hover:-translate-x-1.5 transition-transform" />
                          </button>
                          <button 
                            onClick={() => {
                              const section = document.getElementById("new-drop");
                              section?.scrollIntoView({ behavior: "smooth" });
                            }}
                            className="border border-border-custom hover:border-white text-white font-mono text-sm uppercase tracking-widest px-8 py-5 transition-colors cursor-pointer"
                          >
                            [ تصفح الإصدارات الجديدة ]
                          </button>
                        </div>
                      </div>

                      {/* Side Decorative Widget */}
                      <div className="hidden lg:flex lg:col-span-4 flex-col items-start text-right space-y-10 border-r border-border-custom/50 pr-8 font-mono">
                        <div>
                          <p className="text-accent-blue text-xs uppercase tracking-widest font-bold mb-1">[ المواصفات ]</p>
                          <p className="text-white text-sm">قصّة عصرية للشارع / أداء رياضي</p>
                        </div>
                        <div>
                          <p className="text-accent-blue text-xs uppercase tracking-widest font-bold mb-1">[ الشحن ]</p>
                          <p className="text-white text-sm">توصيل لكافة المدن الليبية</p>
                        </div>
                        <div>
                          <p className="text-accent-blue text-xs uppercase tracking-widest font-bold mb-1">[ الفرع الرئيسي ]</p>
                          <p className="text-white text-sm">طرابلس، ليبيا</p>
                        </div>
                      </div>

                    </div>
                  </section>

                  {/* Teaser Section below fold */}
                  <section id="new-drop" className="py-24 bg-secondary-bg/25 border-y border-border-custom px-4 md:px-8">
                    <div className="max-w-7xl mx-auto">
                      <div className="flex flex-col md:flex-row justify-between items-baseline mb-12 gap-4">
                        <div>
                          <span className="font-mono text-xs uppercase tracking-widest text-accent-blue">[ أحدث المنتجات المضافة ]</span>
                          <h2 className="font-display text-4xl md:text-5xl tracking-tight text-white uppercase mt-1">إصدارات مميزة وحصرية</h2>
                        </div>
                        <a href="#shop" className="font-mono text-xs text-accent-blue hover:text-white uppercase tracking-wider transition-colors flex items-center gap-1">
                          <span>استكشف المخزن كاملاً</span>
                          <ChevronLeft size={14} />
                        </a>
                      </div>

                      {/* Teaser Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {products.filter(p => p.featured && p.active).slice(0, 4).map((product) => (
                          <div 
                            key={product.id} 
                            onClick={() => navigate(`#product?id=${product.id}`)}
                            className="group bg-card-bg/30 border border-border-custom hover:border-accent-blue transition-all duration-300 cursor-pointer overflow-hidden flex flex-col h-full"
                          >
                            <div className="aspect-3/4 bg-primary-bg/50 relative overflow-hidden flex items-center justify-center p-4">
                              <img 
                                src={product.image} 
                                alt={product.name}
                                referrerPolicy="no-referrer"
                                className="max-h-full max-w-full object-contain transform group-hover:scale-105 transition-transform duration-500"
                              />
                              <div className="absolute top-3 right-3 bg-primary-bg/80 text-accent-blue font-mono text-[9px] px-2 py-0.5 border border-border-custom uppercase">
                                [ {product.category} ]
                              </div>
                            </div>
                            <div className="p-5 flex flex-col justify-between flex-1 border-t border-border-custom/50">
                              <div>
                                <h3 className="font-sans font-bold text-sm tracking-wider text-white uppercase line-clamp-1 group-hover:text-accent-blue transition-colors">
                                  {product.name}
                                </h3>
                                <div className="flex gap-1.5 mt-2">
                                  {product.colors.map((color, i) => (
                                    <span 
                                      key={i} 
                                      className="text-[10px] font-mono text-text-secondary bg-primary-bg px-1.5 py-0.5 border border-border-custom/30"
                                    >
                                      {color}
                                    </span>
                                  ))}
                                </div>
                              </div>
                              <div className="flex justify-between items-baseline mt-4 border-t border-border-custom/20 pt-3">
                                <span className="font-mono text-xs text-text-secondary">السعر</span>
                                <span className="font-mono text-sm text-accent-blue font-bold">{formatPrice(product.price)}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </section>
                </motion.div>
              )}

              {/* PAGE 2: SHOP / CATALOG */}
              {routePath === "shop" && (
                <motion.div
                  key="shop"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="max-w-7xl mx-auto px-4 md:px-8 py-16 w-full flex-1 flex flex-col"
                >
                  {/* Shop Header */}
                  <div className="mb-12 border-b border-border-custom pb-8">
                    <span className="font-mono text-xs text-accent-blue uppercase tracking-widest">[ مستودع المنتجات ]</span>
                    <h1 className="font-display text-5xl md:text-7xl tracking-tighter text-white uppercase mt-2">
                      جيرسي زون — جميع الأطقم
                    </h1>
                    <div className="flex flex-wrap gap-2 mt-4 text-[11px] font-mono text-text-muted">
                      <span>[ تشكيلة جديدة ]</span>
                      <span>[ السلسلة 01 ]</span>
                      <span>[ متوفر الآن ]</span>
                    </div>
                  </div>

                  {/* Filter bar */}
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10 pb-6 border-b border-border-custom/30">
                    <div className="flex items-center gap-2 text-text-secondary font-mono text-xs">
                      <Filter size={14} className="text-accent-blue" />
                      <span>تصفية حسب الدوري:</span>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {["الكل", "الدوري الإنجليزي", "الدوري الإسباني", "الدوري الفرنسي", "الدوريات الأفريقية","الأطقم الكلاسيكية"].map((cat) => (
                        <button
                          key={cat}
                          onClick={() => setSelectedCategory(cat)}
                          className={`font-mono text-xs uppercase px-4 py-2 border transition-all cursor-pointer ${
                            selectedCategory === cat
                              ? "bg-white text-primary-bg border-white font-bold"
                              : "border-border-custom hover:border-white text-text-secondary hover:text-white"
                          }`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Product Grid */}
                  {products.filter(p => p.active && (selectedCategory === "الكل" || p.category === selectedCategory)).length === 0 ? (
                    <div className="py-24 text-center border border-dashed border-border-custom flex flex-col items-center justify-center">
                      <p className="font-mono text-text-secondary text-sm uppercase mb-4">[ قاعدة البيانات فارغة ]</p>
                      <h3 className="text-xl font-bold">لا توجد قمصان مسجلة تحت تصنيف "{selectedCategory.toUpperCase()}"</h3>
                      <button 
                        onClick={() => setSelectedCategory("الكل")}
                        className="mt-6 font-mono text-xs text-accent-blue underline hover:text-white uppercase"
                      >
                        العودة للمستودع الرئيسي
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                      {products
                        .filter(p => p.active && (selectedCategory === "الكل" || p.category === selectedCategory))
                        .map((product) => (
                          <div 
                            key={product.id} 
                            onClick={() => navigate(`#product?id=${product.id}`)}
                            className="group bg-card-bg/25 border border-border-custom hover:border-accent-blue transition-all duration-300 cursor-pointer overflow-hidden flex flex-col h-full"
                          >
                            <div className="aspect-3/4 bg-primary-bg/50 relative overflow-hidden flex items-center justify-center p-6">
                              <img 
                                src={product.image} 
                                alt={product.name}
                                referrerPolicy="no-referrer"
                                className="max-h-full max-w-full object-contain transform group-hover:scale-103 transition-transform duration-500"
                              />
                              <div className="absolute top-3 right-3 bg-primary-bg/85 text-accent-blue font-mono text-[9px] px-2 py-0.5 border border-border-custom uppercase">
                                [ {product.category} ]
                              </div>
                            </div>
                            <div className="p-5 flex flex-col justify-between flex-1 border-t border-border-custom/50">
                              <div>
                                <h2 className="font-sans font-bold text-sm tracking-wider text-white uppercase line-clamp-2 group-hover:text-accent-blue transition-colors">
                                  {product.name}
                                </h2>
                                <div className="flex flex-wrap gap-1 mt-2.5">
                                  {product.colors.map((color, i) => (
                                    <span 
                                      key={i} 
                                      className="text-[10px] font-mono text-text-secondary bg-primary-bg px-2 py-0.5 border border-border-custom/30"
                                    >
                                      {color}
                                    </span>
                                  ))}
                                </div>
                              </div>
                              <div className="flex justify-between items-baseline mt-5 border-t border-border-custom/20 pt-3">
                                <span className="font-mono text-xs text-text-secondary">الحالة</span>
                                <span className="font-mono text-sm text-accent-blue font-bold">{formatPrice(product.price)}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  )}
                </motion.div>
              )}

              {/* PAGE 3: PRODUCT DETAIL */}
              {routePath === "product" && (() => {
                const prodId = routeQuery.id;
                const product = products.find(p => p.id === prodId);

                if (!product) {
                  return (
                    <motion.div
                      key="product-not-found"
                      className="max-w-7xl mx-auto px-4 md:px-8 py-24 text-center w-full flex-1 flex flex-col justify-center items-center"
                    >
                      <ShieldAlert size={48} className="text-accent-blue mb-4" />
                      <h2 className="font-mono text-sm uppercase text-text-muted mb-2">[ عطل في بيانات المنتج ]</h2>
                      <h1 className="font-display text-4xl mb-6">الطقم المحدد غير متوفر حالياً</h1>
                      <button 
                        onClick={() => navigate("#shop")}
                        className="bg-white text-primary-bg font-mono text-xs uppercase tracking-widest px-6 py-3 font-bold"
                      >
                        العودة للكتالوج
                      </button>
                    </motion.div>
                  );
                }

                // Autoselect size and color if not selected yet
                if (!selectedSize && product.sizes.length > 0) {
                  setSelectedSize(product.sizes[0]);
                }
                if (!selectedColor && product.colors.length > 0) {
                  setSelectedColor(product.colors[0]);
                }

                // Use actual supplementary images if available, otherwise fallback to high quality mock details
                const cleanSuppImages = (product.images || []).filter(img => img && img.trim() !== "");
                const productImages = [
                  product.image,
                  ...(cleanSuppImages.length > 0 ? cleanSuppImages : [
                    `https://placehold.co/600x800/2B3A4A/FFFFFF?text=${encodeURIComponent(product.name.replace(/\s+/g, "+") + "+DETAIL")}`,
                    `https://placehold.co/600x800/3D5166/A8C4D8?text=GEAR+CLOSEUP`,
                    `https://placehold.co/600x800/4A6278/FFFFFF?text=ZONE+OFFICIAL`
                  ])
                ];
                
                const activeThumbIndex = currentThumbIndex >= productImages.length ? 0 : currentThumbIndex;

                return (
                  <motion.div
                    key="product-detail"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="max-w-7xl mx-auto px-4 md:px-8 py-12 w-full flex-1 flex flex-col"
                  >
                    {/* Back Navigator */}
                    <div className="mb-8">
                      <button 
                        onClick={() => navigate("#shop")}
                        className="group font-mono text-xs text-text-secondary hover:text-white uppercase tracking-widest flex items-center gap-2"
                      >
                        <ArrowRight size={14} className="transform group-hover:translate-x-1 transition-transform" />
                        <span>[ العودة إلى صفحة المنتجات ]</span>
                      </button>
                    </div>

                    {/* Desktop/Mobile Split Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
                      
                      {/* LEFT: Main Large Image & Thumbnails (lg:col-span-7) */}
                      <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-12 gap-4">
                        
                        {/* Secondary Thumbnails Strips */}
                        <div className="order-2 md:order-1 md:col-span-2 flex md:flex-col gap-3 justify-center md:justify-start">
                          {productImages.map((thumbUrl, idx) => (
                            <button
                              key={idx}
                              onClick={() => setCurrentThumbIndex(idx)}
                              className={`aspect-3/4 bg-secondary-bg/50 border overflow-hidden p-2 transition-all ${
                                activeThumbIndex === idx ? "border-accent-blue" : "border-border-custom hover:border-white/50"
                              }`}
                              style={{ maxHeight: "100px" }}
                            >
                              <img 
                                src={thumbUrl} 
                                alt={`${product.name} thumb ${idx}`}
                                referrerPolicy="no-referrer"
                                className="w-full h-full object-contain"
                              />
                            </button>
                          ))}
                        </div>

                        {/* Large Main View */}
                        <div className="order-1 md:order-2 md:col-span-10 aspect-3/4 bg-card-bg/20 border border-border-custom p-8 flex items-center justify-center relative overflow-hidden">
                          <img 
                            src={productImages[activeThumbIndex]} 
                            alt={product.name}
                            referrerPolicy="no-referrer"
                            className="max-h-[550px] max-w-full object-contain"
                          />
                          <div className="absolute bottom-4 left-4 font-mono text-[10px] text-text-muted uppercase">
                            [ معاينة الصورة {activeThumbIndex + 1}/{productImages.length} ]
                          </div>
                        </div>

                      </div>

                      {/* RIGHT: Text Control Panel (lg:col-span-5) */}
                      <div className="lg:col-span-5 space-y-8 border-t lg:border-t-0 lg:border-r border-border-custom pt-8 lg:pt-0 lg:pr-10">
                        
                        {/* Collection labels & category */}
                        <div className="flex flex-wrap gap-2 text-[10px] font-mono text-accent-blue">
                          <span>[ السلسلة: STASIS MK.1 ]</span>
                          <span>[ الدوري: {product.category.toUpperCase()} ]</span>
                        </div>

                        {/* Title and Price */}
                        <div>
                          <h1 className="font-display text-4xl md:text-5xl tracking-tight leading-normal text-white uppercase mb-4">
                            {product.name}
                          </h1>
                          <p className="font-mono text-3xl font-bold text-accent-blue mt-2">
                            {formatPrice(product.price)}
                          </p>
                        </div>

                        {/* Divider */}
                        <hr className="border-border-custom" />

                        {/* COLOR SELECTOR */}
                        <div>
                          <p className="font-mono text-xs uppercase tracking-widest text-text-secondary mb-3 flex justify-between">
                            <span>اختيار اللون</span>
                            <span className="text-white font-bold">{selectedColor || "لم يتم الاختيار"}</span>
                          </p>
                          <div className="flex items-center gap-3">
                            {product.colors.map((color) => {
                              // Basic color mappings
                              let bgClass = "bg-white";
                              if (color.toLowerCase().includes("black") || color.includes("أسود")) bgClass = "bg-black";
                              else if (color.toLowerCase().includes("red") || color.includes("أحمر")) bgClass = "bg-red-600";
                              else if (color.toLowerCase().includes("blue") || color.includes("أزرق")) bgClass = "bg-blue-600";
                              else if (color.toLowerCase().includes("sky blue") || color.includes("سماوي")) bgClass = "bg-sky-400";
                              else if (color.toLowerCase().includes("gold") || color.includes("ذهبي")) bgClass = "bg-amber-400";
                              else if (color.toLowerCase().includes("silver") || color.includes("فضي")) bgClass = "bg-slate-300";
                              else if (color.toLowerCase().includes("navy") || color.includes("كحلي") || color.includes("أزرق داكن")) bgClass = "bg-blue-950";

                              const isSelected = selectedColor === color;

                              return (
                                <button
                                  key={color}
                                  onClick={() => setSelectedColor(color)}
                                  className={`w-8 h-8 rounded-full border-2 transition-transform flex items-center justify-center ${
                                    isSelected ? "border-accent-blue scale-110" : "border-transparent hover:scale-105"
                                  }`}
                                  title={color}
                                >
                                  <span className={`w-5 h-5 rounded-full ${bgClass} border border-white/20`} />
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        {/* SIZE SELECTOR */}
                        <div>
                          <p className="font-mono text-xs uppercase tracking-widest text-text-secondary mb-3 flex justify-between">
                            <span>اختيار المقاس</span>
                            <span className="text-white font-bold">{selectedSize || "لم يتم الاختيار"}</span>
                          </p>
                          <div className="flex gap-2">
                            {product.sizes.map((size) => {
                              const isSelected = selectedSize === size;
                              return (
                                <button
                                  key={size}
                                  onClick={() => setSelectedSize(size)}
                                  className={`font-mono text-xs font-bold border px-4 py-3 min-w-[50px] transition-colors cursor-pointer ${
                                    isSelected 
                                      ? "bg-white text-primary-bg border-white" 
                                      : "border-border-custom hover:border-white text-text-secondary hover:text-white"
                                  }`}
                                >
                                  {size}
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        {/* SUBMIT BUTTON */}
                        <div>
                          <button
                            onClick={() => handleAddToCart(product)}
                            className="w-full bg-white hover:bg-accent-blue text-primary-bg font-mono text-sm uppercase tracking-widest py-5 font-bold transition-colors cursor-pointer flex items-center justify-center gap-3 clip-sharp"
                          >
                            <span>إضافة إلى السلة الأطقم</span>
                            <ChevronLeft size={18} />
                          </button>
                        </div>

                        {/* TECHNICAL STACKS (Description & Info) */}
                        <div className="space-y-4 pt-4 border-t border-border-custom">
                          <div className="space-y-2">
                            <span className="font-mono text-[10px] text-accent-blue uppercase">[ نظرة تقنية عامة ]</span>
                            <p className="text-text-secondary text-sm leading-relaxed font-sans">
                              {product.description}
                            </p>
                          </div>

                          <div className="grid grid-cols-2 gap-4 text-xs font-mono pt-2">
                            <div className="border border-border-custom/50 p-3">
                              <span className="text-text-muted block text-[9px] mb-1">[ المواد ]</span>
                              <span className="text-white text-[11px]">100% بوليستر معاد تدويره</span>
                            </div>
                            <div className="border border-border-custom/50 p-3">
                              <span className="text-text-muted block text-[9px] mb-1">[ إرشادات الغسيل ]</span>
                              <span className="text-white text-[11px]">غسيل آلي بماء بارد</span>
                            </div>
                          </div>

                          <p className="text-text-muted font-mono text-[10px] tracking-wide uppercase">
                            🚚 تم تسجيل توصيل وسريع لكافة أنحاء البلاد.
                          </p>
                        </div>

                      </div>

                    </div>
                  </motion.div>
                );
              })()}

              {/* PAGE 4: CART */}
              {routePath === "cart" && (
                <motion.div
                  key="cart"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="max-w-4xl mx-auto px-4 md:px-8 py-16 w-full flex-1 flex flex-col"
                >
                  <div className="mb-10 border-b border-border-custom pb-6 flex justify-between items-baseline">
                    <div>
                      <span className="font-mono text-xs text-accent-blue uppercase tracking-widest">[ القطع المحددة للطلب ]</span>
                      <h1 className="font-display text-5xl tracking-tight text-white uppercase mt-1">حقيبة التسوق الخاصة بك</h1>
                    </div>
                    <span className="font-mono text-xs text-text-secondary">[ تم تحميل {totalCartItems} قطع ]</span>
                  </div>

                  {cart.length === 0 ? (
                    <div className="py-20 text-center border border-dashed border-border-custom/50 flex flex-col items-center justify-center">
                      <p className="font-mono text-text-secondary text-sm uppercase mb-4">[ حقيبة التسوق فارغة ]</p>
                      <h3 className="text-xl font-bold uppercase mb-6">لا توجد قطع مضافة إلى حقيبتك حالياً</h3>
                      <button 
                        onClick={() => navigate("#shop")}
                        className="bg-white text-primary-bg hover:bg-accent-blue font-mono text-xs uppercase tracking-widest px-8 py-4 font-bold transition-colors cursor-pointer"
                      >
                        تصفح المنتجات المتوفرة
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-8">
                      {/* Cart Items List */}
                      <div className="space-y-4">
                        {cart.map((item) => (
                          <div 
                            key={item.id} 
                            className="bg-card-bg/20 border border-border-custom p-4 md:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6"
                          >
                            {/* Product Info */}
                            <div className="flex items-center gap-6">
                              <div className="w-16 h-20 bg-primary-bg/50 border border-border-custom p-1 flex items-center justify-center flex-shrink-0">
                                <img 
                                  src={item.image} 
                                  alt={item.name}
                                  referrerPolicy="no-referrer"
                                  className="max-h-full max-w-full object-contain"
                                />
                              </div>
                              <div>
                                <h3 className="font-sans font-bold text-sm text-white uppercase tracking-wider line-clamp-1">
                                  {item.name}
                                </h3>
                                <div className="flex flex-wrap gap-2 mt-1.5 font-mono text-[10px] text-text-secondary">
                                  <span className="bg-primary-bg px-2 py-0.5 border border-border-custom/30">[ المقاس: {item.size} ]</span>
                                  <span className="bg-primary-bg px-2 py-0.5 border border-border-custom/30">[ اللون: {item.color} ]</span>
                                </div>
                              </div>
                            </div>

                            {/* Controls and Price */}
                            <div className="flex items-center justify-between sm:justify-start gap-12 w-full sm:w-auto">
                              
                              {/* Quantity controls */}
                              <div className="flex items-center border border-border-custom">
                                <button 
                                  onClick={() => updateCartQty(item.id, -1)}
                                  className="px-3 py-1 text-text-secondary hover:text-white transition-colors"
                                  title="تقليل"
                                >
                                  <Minus size={12} />
                                </button>
                                <span className="px-3 font-mono text-xs font-bold text-white">
                                  {item.quantity}
                                </span>
                                <button 
                                  onClick={() => updateCartQty(item.id, 1)}
                                  className="px-3 py-1 text-text-secondary hover:text-white transition-colors"
                                  title="زيادة"
                                >
                                  <Plus size={12} />
                                </button>
                              </div>

                              {/* Price block */}
                              <div className="text-right flex items-center gap-6">
                                <p className="font-mono text-sm text-accent-blue font-bold">
                                  {formatPrice(item.price * item.quantity)}
                                </p>
                                <button
                                  onClick={() => removeCartItem(item.id)}
                                  className="text-text-muted hover:text-red-400 transition-colors"
                                  title="حذف القطعة"
                                >
                                  <Trash2 size={16} />
                                </button>
                              </div>

                            </div>

                          </div>
                        ))}
                      </div>

                      {/* Summary Block */}
                      <div className="bg-secondary-bg/30 border border-border-custom p-6 md:p-8 space-y-4">
                        <div className="flex justify-between font-mono text-xs text-text-secondary">
                          <span>الخدمات اللوجستية</span>
                          <span className="text-green-400 font-bold">توصيل مجاني</span>
                        </div>
                        <div className="flex justify-between font-mono text-xs text-text-secondary border-b border-border-custom/50 pb-4">
                          <span>المجموع الفرعي المؤمّن</span>
                          <span>{formatPrice(cartSubtotal)}</span>
                        </div>
                        <div className="flex justify-between items-baseline pt-2">
                          <span className="font-mono text-sm font-bold text-white">المجموع الإجمالي (د.ل)</span>
                          <span className="font-mono text-2xl font-bold text-accent-blue">
                            {formatPrice(cartSubtotal)}
                          </span>
                        </div>

                        <div className="pt-4 flex flex-col sm:flex-row gap-4">
                          <button 
                            onClick={() => navigate("#shop")}
                            className="w-full sm:w-1/2 border border-border-custom hover:border-white text-white font-mono text-xs uppercase tracking-widest py-4 transition-colors cursor-pointer text-center"
                          >
                            [ إضافة المزيد من المنتجات ]
                          </button>
                          <button 
                            onClick={() => navigate("#checkout")}
                            className="w-full sm:w-1/2 bg-white hover:bg-accent-blue text-primary-bg font-mono text-xs uppercase tracking-widest py-4 transition-colors font-bold cursor-pointer text-center flex items-center justify-center gap-2"
                          >
                            <span>متابعة إتمام الطلب</span>
                            <ChevronLeft size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </motion.div>
              )}

              {/* PAGE 5: CHECKOUT */}
              {routePath === "checkout" && (
                <motion.div
                  key="checkout"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="max-w-6xl mx-auto px-4 md:px-8 py-16 w-full flex-1 flex flex-col"
                >
                  <div className="mb-10 border-b border-border-custom pb-6">
                    <span className="font-mono text-xs text-accent-blue uppercase tracking-widest">[ تأمين تفاصيل الطلب ]</span>
                    <h1 className="font-display text-5xl tracking-tight text-white uppercase mt-1">تأكيد طلبك</h1>
                  </div>

                  {cart.length === 0 ? (
                    <div className="py-12 text-center flex flex-col items-center">
                      <p className="font-mono text-sm text-text-secondary mb-4">[ مستشعر السلة يشير إلى الصفر ]</p>
                      <button onClick={() => navigate("#shop")} className="bg-white text-primary-bg font-mono text-xs px-6 py-3 font-bold uppercase">
                        العودة للمتجر
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
                      
                      {/* LEFT: Order Summary (lg:col-span-5) */}
                      <div className="lg:col-span-5 bg-card-bg/10 border border-border-custom p-6 space-y-6 lg:order-2">
                        <h2 className="font-mono text-xs text-accent-blue uppercase tracking-widest border-b border-border-custom pb-3">
                          [ بيان الطلب ]
                        </h2>

                        <div className="space-y-4 max-h-[350px] overflow-y-auto pl-2">
                          {cart.map((item) => (
                            <div key={item.id} className="flex justify-between items-center text-xs">
                              <div>
                                <p className="font-bold text-white uppercase line-clamp-1">{item.name}</p>
                                <p className="font-mono text-text-muted mt-1">
                                  المقاس: {item.size} | الكمية: {item.quantity}
                                </p>
                              </div>
                              <span className="font-mono text-accent-blue">{formatPrice(item.price * item.quantity)}</span>
                            </div>
                          ))}
                        </div>

                        <div className="border-t border-border-custom pt-4 space-y-2 font-mono text-xs">
                          <div className="flex justify-between text-text-secondary">
                            <span>الشحن</span>
                            <span className="text-green-400 font-bold">توصيل </span>
                          </div>
                          <div className="flex justify-between text-text-secondary">
                            <span>المجموع الفرعي</span>
                            <span>{formatPrice(cartSubtotal)}</span>
                          </div>
                          <div className="flex justify-between text-white text-sm font-bold pt-2 border-t border-border-custom/30">
                            <span>المجموع الإجمالي</span>
                            <span className="text-accent-blue">{formatPrice(cartSubtotal)}</span>
                          </div>
                        </div>
                      </div>

                      {/* RIGHT: Customer Form (lg:col-span-7) */}
                      <form onSubmit={handleCheckoutSubmit} className="lg:col-span-7 space-y-6 lg:order-1">
                        
                        {checkoutError && (
                          <div className="bg-red-500/10 border border-red-500/30 text-red-400 font-mono text-xs p-4 uppercase tracking-wider">
                            {checkoutError}
                          </div>
                        )}

                        <div className="space-y-4 text-right">
                          
                          {/* Name Input */}
                          <div>
                            <label className="block font-display text-base tracking-widest text-white uppercase mb-2">
                              الاسم الكامل للمستلم *
                            </label>
                            <input 
                              type="text" 
                              required
                              value={checkoutName}
                              onChange={(e) => setCheckoutName(e.target.value)}
                              placeholder="مثال: عبد الله الهادي"
                              className="w-full bg-secondary-bg/50 border border-border-custom text-white px-4 py-3 text-sm focus:outline-hidden focus:border-white font-mono uppercase tracking-wider text-right"
                            />
                          </div>

                          {/* Phone Input */}
                          <div>
                            <label className="block font-display text-base tracking-widest text-white uppercase mb-2">
                              رقم هاتف المستلم *
                            </label>
                            <input 
                              type="tel" 
                              required
                              value={checkoutPhone}
                              onChange={(e) => setCheckoutPhone(e.target.value)}
                              placeholder="مثال: +218 91-XXXXXXX"
                              className="w-full bg-secondary-bg/50 border border-border-custom text-white px-4 py-3 text-sm focus:outline-hidden focus:border-white font-mono text-right"
                            />
                          </div>

                          {/* City/Wilaya Input */}
                          <div>
                            <label className="block font-display text-base tracking-widest text-white uppercase mb-2">
                              المدينة / المنطقة *
                            </label>
                            <input 
                              type="text" 
                              required
                              value={checkoutWilaya}
                              onChange={(e) => setCheckoutWilaya(e.target.value)}
                              placeholder="مثال: طرابلس / بنغازي"
                              className="w-full bg-secondary-bg/50 border border-border-custom text-white px-4 py-3 text-sm focus:outline-hidden focus:border-white font-mono uppercase tracking-wider text-right"
                            />
                          </div>

                          {/* Address Textarea */}
                          <div>
                            <label className="block font-display text-base tracking-widest text-white uppercase mb-2">
                              عنوان التوصيل بالتفصيل *
                            </label>
                            <textarea 
                              rows={3}
                              required
                              value={checkoutAddress}
                              onChange={(e) => setCheckoutAddress(e.target.value)}
                              placeholder="مثال: حي الأندلس، شارع رقم 4، بالقرب من المسجد الكبير"
                              className="w-full bg-secondary-bg/50 border border-border-custom text-white px-4 py-3 text-sm focus:outline-hidden focus:border-white font-mono uppercase tracking-wider text-right"
                            />
                          </div>

                          {/* Notes (Optional) */}
                          <div>
                            <label className="block font-display text-base tracking-widest text-text-secondary uppercase mb-2">
                              ملاحظات خاصة للتوصيل (اختياري)
                            </label>
                            <textarea 
                              rows={2}
                              value={checkoutNotes}
                              onChange={(e) => setCheckoutNotes(e.target.value)}
                              placeholder="مثال: يرجى تركه عند الباب في حال عدم الرد"
                              className="w-full bg-secondary-bg/50 border border-border-custom text-white px-4 py-3 text-sm focus:outline-hidden focus:border-white font-mono uppercase tracking-wider text-right"
                            />
                          </div>

                        </div>

                        {/* CTA ACTION */}
                        <div className="pt-4">
                          <button
                            type="submit"
                            className="w-full bg-green-500 hover:bg-green-400 text-black font-mono text-sm uppercase tracking-widest py-5 font-bold transition-colors cursor-pointer flex items-center justify-center gap-3 shadow-lg"
                          >
                            <span>تأكيد الطلب وإرساله عبر واتساب</span>
                            <ExternalLink size={16} />
                          </button>
                          <p className="text-text-muted font-mono text-[10px] text-center mt-3 uppercase tracking-wider">
                            🛡️ سيقوم النظام بإنشاء سجل آمن لتوجيه طلبك مباشرة إلى تطبيق واتساب لإتمام التفاصيل والشحن.
                          </p>
                        </div>

                      </form>
                    </div>
                  )}
                </motion.div>
              )}

              {/* PAGE 6: ORDER CONFIRMATION */}
              {routePath === "confirmation" && (
                <motion.div
                  key="confirmation"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="max-w-md mx-auto px-6 py-24 w-full flex-1 flex flex-col justify-center items-center text-center"
                >
                  <div className="w-16 h-16 rounded-full bg-green-500/10 border border-green-500/40 text-green-400 flex items-center justify-center mb-6">
                    <CheckCircle2 size={36} />
                  </div>

                  <span className="font-mono text-xs text-accent-blue uppercase tracking-widest mb-1">
                    [ تم إرسال البيانات بنجاح ]
                  </span>
                  <h1 className="font-display text-5xl tracking-tight text-white uppercase mb-4">
                    تم إرسال طلبك
                  </h1>
                  <p className="text-text-secondary text-sm leading-relaxed mb-10">
                    تم تجهيز تفاصيل طلبك بنجاح وتوجيهك إلى واتساب لمعالجة الشحن والتوصيل. سيتواصل معك قسم الشحن لتأكيد مواعيد التوصيل مباشرة.
                  </p>

                  <button
                    onClick={handleCompleteConfirmation}
                    className="bg-white hover:bg-accent-blue text-primary-bg font-mono text-xs uppercase tracking-widest px-8 py-4 font-bold transition-colors cursor-pointer"
                  >
                    العودة للرئيسية
                  </button>
                </motion.div>
              )}

              {/* PAGE 7: ADMIN PORTAL */}
              {routePath === "admin" && (
                <motion.div
                  key="admin"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="max-w-7xl mx-auto px-4 md:px-8 py-16 w-full flex-1 flex flex-col"
                >
                  {/* ADMIN DOUBLE-VERIFICATION CHALLENGE */}
                  {!isDeviceAuthorized ? (
                    <div className="max-w-md mx-auto w-full py-16">
                      <div className="border border-border-custom bg-secondary-bg/20 p-8 space-y-6 text-center">
                        <div className="flex justify-center text-accent-blue">
                          <ShieldAlert size={44} className="animate-pulse" />
                        </div>
                        <div>
                          <span className="font-mono text-[10px] text-accent-blue uppercase">[ نظام الأمان وتفويض الأجهزة ]</span>
                          <h1 className="font-display text-2xl tracking-tight text-white uppercase mt-1">
                            جهاز غير مصرح به
                          </h1>
                          <p className="text-xs text-text-secondary mt-3 leading-relaxed">
                            هذا الهاتف أو الكمبيوتر غير مسجل في قائمة الأجهزة المسموح لها بالوصول إلى لوحة الأدمن. يرجى إدخال الرمز السري لتفويض هذا الجهاز بشكل دائم.
                          </p>
                        </div>

                        {deviceRegError && (
                          <div className="bg-red-500/10 border border-red-500/30 text-red-400 font-mono text-[11px] py-2 uppercase">
                            {deviceRegError}
                          </div>
                        )}

                        <form onSubmit={handleRegisterDevice} className="space-y-4 text-right">
                          <div>
                            <label className="block font-mono text-[11px] text-text-secondary uppercase mb-2">
                              رمز تسجيل الجهاز المصرح به
                            </label>
                            <input 
                              type="password"
                              value={deviceRegCode}
                              onChange={(e) => setDeviceRegCode(e.target.value)}
                              placeholder="••••••••••••••"
                              className="w-full bg-primary-bg border border-border-custom text-white px-4 py-3 text-sm focus:outline-hidden focus:border-white font-mono text-center tracking-widest text-left"
                            />
                          </div>

                          <button
                            type="submit"
                            className="w-full bg-white hover:bg-accent-blue text-primary-bg font-mono text-xs uppercase tracking-widest py-3.5 font-bold transition-colors cursor-pointer"
                          >
                            ربط وترخيص هذا الجهاز
                          </button>
                        </form>
                      </div>
                    </div>
                  ) : !isAdminAuth ? (
                    <div className="max-w-md mx-auto w-full py-16">
                      <div className="border border-border-custom bg-secondary-bg/20 p-8 space-y-6 text-center">
                        <div className="flex justify-center text-accent-blue">
                          <Lock size={44} />
                        </div>
                        <div>
                          <span className="font-mono text-[10px] text-accent-blue uppercase">[ المقر الرئيسي لـ JERSEY ZONE ]</span>
                          <h1 className="font-display text-3xl tracking-tight text-white uppercase mt-1">
                            الوصول إلى بوابة التحكم
                          </h1>
                        </div>

                        {adminError && (
                          <div className="bg-red-500/10 border border-red-500/30 text-red-400 font-mono text-[11px] py-2 uppercase">
                            {adminError}
                          </div>
                        )}

                        <form onSubmit={handleAdminLogin} className="space-y-4 text-right">
                          <div>
                            <label className="block font-mono text-[11px] text-text-secondary uppercase mb-2">
                              رموز الأمان [ كلمة المرور ]
                            </label>
                            <input 
                              type="password"
                              value={adminPassword}
                              onChange={(e) => setAdminPassword(e.target.value)}
                              placeholder="••••••••••••••"
                              className="w-full bg-primary-bg border border-border-custom text-white px-4 py-3 text-sm focus:outline-hidden focus:border-white font-mono text-center tracking-widest text-left"
                            />
                          </div>

                          <button
                            type="submit"
                            className="w-full bg-white hover:bg-accent-blue text-primary-bg font-mono text-xs uppercase tracking-widest py-3.5 font-bold transition-colors cursor-pointer"
                          >
                            التحقق والولوج لوحة التحكم
                          </button>
                        </form>
                        
                        <p className="font-mono text-[9px] text-text-muted">
                          رمز المرور الافتراضي: "اكتب الرمز للدخول"
                        </p>
                      </div>
                    </div>
                  ) : (
                    /* ADMIN FULL PANEL */
                    <div className="space-y-8">
                      
                      {/* Dashboard Title & Tabs */}
                      <div className="border-b border-border-custom pb-6 flex flex-col md:flex-row justify-between items-start md:items-baseline gap-4">
                        <div>
                          <span className="font-mono text-xs text-accent-blue uppercase tracking-widest">[ بوابة التحكم للمسؤول ]</span>
                          <h1 className="font-display text-5xl tracking-tight text-white uppercase mt-1">لوحة التحكم والعمليات</h1>
                        </div>

                        {/* Admin Nav Tabs */}
                        <div className="flex gap-2 font-mono text-xs">
                          <button
                            onClick={() => { setAdminTab("products"); resetProductForm(); }}
                            className={`px-4 py-2 border transition-colors cursor-pointer flex items-center gap-2 ${
                              adminTab === "products" 
                                ? "bg-white text-primary-bg border-white font-bold" 
                                : "border-border-custom text-text-secondary hover:text-white hover:border-white/50"
                            }`}
                          >
                            <Package size={14} />
                            <span>المخزون والمنتجات</span>
                          </button>
                          <button
                            onClick={() => { setAdminTab("orders"); resetProductForm(); }}
                            className={`px-4 py-2 border transition-colors cursor-pointer flex items-center gap-2 ${
                              adminTab === "orders" 
                                ? "bg-white text-primary-bg border-white font-bold" 
                                : "border-border-custom text-text-secondary hover:text-white hover:border-white/50"
                            }`}
                          >
                            <ListOrdered size={14} />
                            <span>الطلبات ({orders.length})</span>
                          </button>
                          <button
                            onClick={() => { setAdminTab("settings"); resetProductForm(); }}
                            className={`px-4 py-2 border transition-colors cursor-pointer flex items-center gap-2 ${
                              adminTab === "settings" 
                                ? "bg-white text-primary-bg border-white font-bold" 
                                : "border-border-custom text-text-secondary hover:text-white hover:border-white/50"
                            }`}
                          >
                            <Settings size={14} />
                            <span>إعدادات المتجر</span>
                          </button>
                        </div>
                      </div>

                      {/* TAB 1: PRODUCT MANAGEMENT */}
                      {adminTab === "products" && (
                        <div className="space-y-6">
                          
                          {/* Top controls */}
                          <div className="flex justify-between items-center">
                            <h3 className="font-mono text-xs uppercase text-accent-blue tracking-widest">
                              [ المنتجات المسجلة في المخزن: {products.length} ]
                            </h3>
                            {!isAddingProduct && (
                              <button
                                onClick={() => { resetProductForm(); setIsAddingProduct(true); }}
                                className="bg-white hover:bg-accent-blue text-primary-bg font-mono text-xs uppercase tracking-widest px-4 py-2 font-bold flex items-center gap-2 transition-colors cursor-pointer"
                              >
                                <PlusCircle size={14} />
                                <span>إضافة قميص جديد</span>
                              </button>
                            )}
                          </div>

                          {/* Inline Form / Modal */}
                          {isAddingProduct && (
                            <div className="bg-secondary-bg/25 border border-white/20 p-6 md:p-8 space-y-6">
                              <div className="flex justify-between items-center border-b border-border-custom pb-4">
                                <h4 className="font-mono text-xs font-bold text-accent-blue uppercase">
                                  {editingProduct ? `[ تعديل بيانات المعرف: ${editingProduct.id} ]` : "[ إدخال طقم جديد للمخزن ]"}
                                </h4>
                                <button 
                                  onClick={resetProductForm}
                                  className="text-text-muted hover:text-white"
                                  title="إلغاء التعديل"
                                >
                                  <X size={18} />
                                </button>
                              </div>

                              <form onSubmit={handleSaveProduct} className="grid grid-cols-1 md:grid-cols-2 gap-6 text-right">
                                
                                {/* Product Name */}
                                <div>
                                  <label className="block font-mono text-[11px] text-text-secondary uppercase mb-1.5">
                                    اسم المنتج *
                                  </label>
                                  <input 
                                    type="text"
                                    required
                                    value={formName}
                                    onChange={(e) => setFormName(e.target.value)}
                                    placeholder="مثال: قميص ميلان الأساسي"
                                    className="w-full bg-primary-bg border border-border-custom text-white px-4 py-2.5 text-xs font-mono uppercase focus:outline-hidden focus:border-white text-right"
                                  />
                                </div>

                                {/* Category Dropdown */}
                                <div>
                                  <label className="block font-mono text-[11px] text-text-secondary uppercase mb-1.5">
                                    التصنيف / الدوري *
                                  </label>
                                  <select
                                    required
                                    value={formCategory}
                                    onChange={(e) => setFormCategory(e.target.value)}
                                    className="w-full bg-primary-bg border border-border-custom text-white px-4 py-2.5 text-xs font-mono focus:outline-hidden focus:border-white text-right"
                                  >
                                    <option value="">اختر التصنيف...</option>
                                    <option value="La Liga">الدوري الإسباني</option>
                                    <option value="Premier League">الدوري الإنجليزي</option>
                                    <option value="Ligue 1">الدوري الفرنسي</option>
                                    <option value="African Leagues">الدوريات الأفريقية</option>
                                    <option value="Classic jerseys">الأطقم الكلاسيكية</option>
                                  </select>
                                </div>

                                {/* Price */}
                                <div>
                                  <label className="block font-mono text-[11px] text-text-secondary uppercase mb-1.5">
                                    السعر (د.ل) *
                                  </label>
                                  <input 
                                    type="number"
                                    step="0.01"
                                    required
                                    value={formPrice}
                                    onChange={(e) => setFormPrice(e.target.value)}
                                    placeholder="89.99"
                                    className="w-full bg-primary-bg border border-border-custom text-white px-4 py-2.5 text-xs font-mono focus:outline-hidden focus:border-white text-right"
                                  />
                                </div>

                                {/* Image URL */}
                                <div>
                                  <label className="block font-mono text-[11px] text-text-secondary uppercase mb-1.5">
                                    رابط صورة المنتج الرئيسي *
                                  </label>
                                  <input 
                                    type="text"
                                    required
                                    value={formImage}
                                    onChange={(e) => setFormImage(e.target.value)}
                                    placeholder="https://images.unsplash.com/..."
                                    className="w-full bg-primary-bg border border-border-custom text-white px-4 py-2.5 text-xs font-mono focus:outline-hidden focus:border-white text-left"
                                  />
                                  <div className="flex gap-2 mt-1.5 font-mono text-[9px] text-text-muted">
                                    <span>رابط تجريبي مقترح:</span>
                                    <button 
                                      type="button" 
                                      className="underline hover:text-white"
                                      onClick={() => setFormImage("https://placehold.co/600x800/3D5166/FFFFFF?text=JERSEY")}
                                    >
                                      تعيين رابط تجريبي
                                    </button>
                                  </div>
                                </div>

                                {/* Supplementary Images URL Manager */}
                                <div className="md:col-span-2 border border-border-custom bg-secondary-bg/10 p-4 space-y-3 text-right">
                                  <label className="block font-mono text-[11px] text-accent-blue uppercase font-bold">
                                    صور إضافية للمنتج (اختياري - لمعاينة تفاصيل أخرى وزوايا مختلفة)
                                  </label>
                                  <p className="text-[10px] text-text-secondary leading-relaxed">
                                    يمكنك إضافة روابط لصور إضافية لتمكين الزبائن من تصفح صور متعددة لهذا الطقم في صفحة التفاصيل.
                                  </p>
                                  <div className="space-y-2">
                                    {formSupplementaryImages.map((imgUrl, index) => (
                                      <div key={index} className="flex gap-2 items-center">
                                        <span className="font-mono text-xs text-text-muted">#{index + 1}</span>
                                        <input 
                                          type="text"
                                          value={imgUrl}
                                          onChange={(e) => {
                                            const updated = [...formSupplementaryImages];
                                            updated[index] = e.target.value;
                                            setFormSupplementaryImages(updated);
                                          }}
                                          placeholder="https://images.unsplash.com/..."
                                          className="flex-1 bg-primary-bg border border-border-custom text-white px-3 py-2 text-xs font-mono focus:outline-hidden focus:border-white text-left"
                                        />
                                        <button 
                                          type="button" 
                                          onClick={() => {
                                            setFormSupplementaryImages(formSupplementaryImages.filter((_, idx) => idx !== index));
                                          }}
                                          className="p-2 border border-red-500/30 text-red-400 hover:bg-red-500 hover:text-black transition-all cursor-pointer flex items-center justify-center"
                                          title="حذف هذا الرابط"
                                        >
                                          <Trash2 size={14} />
                                        </button>
                                      </div>
                                    ))}
                                    
                                    <button
                                      type="button"
                                      onClick={() => setFormSupplementaryImages([...formSupplementaryImages, ""])}
                                      className="w-full border border-dashed border-border-custom/80 hover:border-accent-blue text-text-secondary hover:text-accent-blue py-2.5 text-xs font-mono transition-colors cursor-pointer flex items-center justify-center gap-2"
                                    >
                                      <Plus size={14} />
                                      <span>إضافة رابط صورة إضافية جديدة</span>
                                    </button>
                                  </div>
                                </div>

                                {/* Colors */}
                                <div>
                                  <label className="block font-mono text-[11px] text-text-secondary uppercase mb-1.5">
                                    الألوان المتوفرة (مفصولة بفاصلة)
                                  </label>
                                  <input 
                                    type="text"
                                    value={formColors}
                                    onChange={(e) => setFormColors(e.target.value)}
                                    placeholder="مثال: أحمر, أسود, أبيض"
                                    className="w-full bg-primary-bg border border-border-custom text-white px-4 py-2.5 text-xs font-mono focus:outline-hidden focus:border-white text-right"
                                  />
                                </div>

                                {/* Description */}
                                <div className="md:col-span-2">
                                  <label className="block font-mono text-[11px] text-text-secondary uppercase mb-1.5">
                                    التفاصيل والوصف الفني
                                  </label>
                                  <textarea 
                                    rows={3}
                                    value={formDescription}
                                    onChange={(e) => setFormDescription(e.target.value)}
                                    placeholder="اكتب تفاصيل القماش، الجودة، ملاءمة المقاس والإصدار..."
                                    className="w-full bg-primary-bg border border-border-custom text-white px-4 py-2.5 text-xs font-mono focus:outline-hidden focus:border-white text-right"
                                  />
                                </div>

                                {/* Sizes Selector */}
                                <div>
                                  <label className="block font-mono text-[11px] text-text-secondary uppercase mb-2">
                                    المقاسات المتاحة
                                  </label>
                                  <div className="flex gap-3">
                                    {["S", "M", "L", "XL"].map((size) => {
                                      const isChecked = formSizes.includes(size);
                                      return (
                                        <button
                                          type="button"
                                          key={size}
                                          onClick={() => handleToggleSize(size)}
                                          className={`flex items-center gap-1.5 px-3 py-1.5 border font-mono text-xs cursor-pointer ${
                                            isChecked 
                                              ? "bg-white text-primary-bg border-white" 
                                              : "border-border-custom text-text-secondary hover:border-white"
                                          }`}
                                        >
                                          {isChecked ? <Check size={12} /> : null}
                                          <span>{size}</span>
                                        </button>
                                      );
                                    })}
                                  </div>
                                </div>

                                {/* Toggles: Featured & Active */}
                                <div className="flex items-center gap-8 pt-4">
                                  <label className="flex items-center gap-2 font-mono text-xs text-text-secondary cursor-pointer select-none">
                                    <button
                                      type="button"
                                      onClick={() => setFormFeatured(!formFeatured)}
                                      className="text-accent-blue"
                                    >
                                      {formFeatured ? <CheckSquare size={18} /> : <Square size={18} />}
                                    </button>
                                    <span>عرض في المنتجات المميزة</span>
                                  </label>

                                  <label className="flex items-center gap-2 font-mono text-xs text-text-secondary cursor-pointer select-none">
                                    <button
                                      type="button"
                                      onClick={() => setFormActive(!formActive)}
                                      className="text-accent-blue"
                                    >
                                      {formActive ? <CheckSquare size={18} /> : <Square size={18} />}
                                    </button>
                                    <span>نشط ومتوفر في الكتالوج</span>
                                  </label>
                                </div>

                                {/* Buttons Row */}
                                <div className="md:col-span-2 pt-4 border-t border-border-custom/50 flex justify-end gap-3">
                                  <button
                                    type="button"
                                    onClick={resetProductForm}
                                    className="border border-border-custom text-text-secondary hover:text-white px-6 py-2.5 text-xs font-mono uppercase"
                                  >
                                    إلغاء التغييرات
                                  </button>
                                  <button
                                    type="submit"
                                    className="bg-white hover:bg-accent-blue text-primary-bg font-mono text-xs px-8 py-2.5 font-bold uppercase transition-colors cursor-pointer flex items-center gap-2"
                                  >
                                    <Save size={14} />
                                    <span>حفظ وتأمين المخزون</span>
                                  </button>
                                </div>

                              </form>
                            </div>
                          )}

                          {/* Stocks Table */}
                          <div className="border border-border-custom overflow-x-auto bg-card-bg/5">
                            <table className="w-full text-right border-collapse font-mono text-[11px] md:text-xs">
                              <thead>
                                <tr className="border-b border-border-custom bg-secondary-bg/30 text-accent-blue uppercase tracking-wider">
                                  <th className="p-4">[ المنتج ]</th>
                                  <th className="p-4">[ التصنيف ]</th>
                                  <th className="p-4">[ السعر ]</th>
                                  <th className="p-4">[ التفاصيل ]</th>
                                  <th className="p-4 text-center">[ الحالة ]</th>
                                  <th className="p-4 text-left">[ إجراءات ]</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-border-custom/40">
                                {products.map((product) => (
                                  <tr key={product.id} className="hover:bg-secondary-bg/10 text-white">
                                    <td className="p-4 flex items-center gap-3">
                                      <img 
                                        src={product.image} 
                                        alt={product.name}
                                        referrerPolicy="no-referrer"
                                        className="w-10 h-12 object-contain bg-primary-bg border border-border-custom p-0.5"
                                      />
                                      <span className="font-bold uppercase tracking-wider">{product.name}</span>
                                    </td>
                                    <td className="p-4 text-text-secondary">{product.category}</td>
                                    <td className="p-4 font-bold text-accent-blue">{formatPrice(product.price)}</td>
                                    <td className="p-4 text-[10px] text-text-secondary">
                                      المقاسات: {product.sizes.join(", ")} | الألوان: {product.colors.join(", ")}
                                    </td>
                                    <td className="p-4 text-center">
                                      <div className="flex flex-col gap-1 items-center">
                                        {product.featured && (
                                          <span className="bg-amber-400/10 border border-amber-400/30 text-amber-300 text-[9px] px-1.5 py-0.2 rounded-xs">
                                            مميز بالرئيسية
                                          </span>
                                        )}
                                        {product.active ? (
                                          <span className="bg-green-400/10 border border-green-400/30 text-green-300 text-[9px] px-1.5 py-0.2 rounded-xs">
                                            نشط بالكتالوج
                                          </span>
                                        ) : (
                                          <span className="bg-red-400/10 border border-red-400/30 text-red-300 text-[9px] px-1.5 py-0.2 rounded-xs">
                                            مخفي
                                          </span>
                                        )}
                                      </div>
                                    </td>
                                    <td className="p-4 text-left">
                                      <div className="flex justify-start gap-2">
                                        <button
                                          onClick={() => handleEditProductClick(product)}
                                          className="p-2 border border-border-custom text-text-secondary hover:text-white hover:border-white transition-all cursor-pointer"
                                          title="تعديل"
                                        >
                                          <Edit size={12} />
                                        </button>
                                        <button
                                          onClick={() => handleDeleteProduct(product.id)}
                                          className="p-2 border border-red-500/30 text-red-400 hover:bg-red-500 hover:text-black hover:border-red-500 transition-all cursor-pointer"
                                          title="حذف"
                                        >
                                          <Trash2 size={12} />
                                        </button>
                                      </div>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>

                        </div>
                      )}

                      {/* TAB 2: ORDERS MANAGEMENT */}
                      {adminTab === "orders" && (
                        <div className="space-y-6">
                          <h3 className="font-mono text-xs uppercase text-accent-blue tracking-widest">
                            [ سجل الطلبات الملتزم بها: {orders.length} ]
                          </h3>

                          {orders.length === 0 ? (
                            <div className="py-20 text-center border border-dashed border-border-custom/50">
                              <p className="font-mono text-text-secondary text-sm uppercase">[ سجل الطلبات فارغ تماماً ]</p>
                              <p className="text-text-muted text-xs mt-2 font-mono">لم يتم تسجيل أي معاملات شراء نشطة حتى الآن.</p>
                            </div>
                          ) : (
                            <div className="space-y-4">
                              {orders.map((order) => (
                                <div key={order.id} className="bg-card-bg/10 border border-border-custom p-6 space-y-4">
                                  
                                  {/* Header info */}
                                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-border-custom/30 pb-3">
                                    <div className="font-mono text-xs">
                                      <span className="text-accent-blue font-bold ml-3">[ {order.id} ]</span>
                                      <span className="text-text-muted">{order.date}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <span className="font-mono text-[10px] text-text-secondary">الحالة:</span>
                                      <select
                                        value={order.status}
                                        onChange={(e) => {
                                          const updatedOrders = orders.map(o => {
                                            if (o.id === order.id) {
                                              return { ...o, status: e.target.value as any };
                                            }
                                            return o;
                                          });
                                          setOrders(updatedOrders);
                                          showToast(`[ تم تحديث حالة الطلب ${order.id} بنجاح ]`);
                                        }}
                                        className="bg-primary-bg border border-border-custom text-white text-[10px] font-mono px-2 py-1 uppercase focus:outline-hidden focus:border-white text-right"
                                      >
                                        <option value="Pending">قيد الانتظار</option>
                                        <option value="Completed">مكتمل</option>
                                        <option value="Cancelled">ملغي</option>
                                      </select>
                                    </div>
                                  </div>

                                  {/* Customer details */}
                                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs text-text-secondary border-b border-border-custom/20 pb-4 text-right">
                                    <div>
                                      <span className="text-text-muted block text-[10px] mb-0.5">[ الاسم ]</span>
                                      <span className="text-white font-bold uppercase">{order.customerName}</span>
                                    </div>
                                    <div>
                                      <span className="text-text-muted block text-[10px] mb-0.5">[ رقم الهاتف ]</span>
                                      <span className="text-white font-bold">{order.phone}</span>
                                    </div>
                                    <div>
                                      <span className="text-text-muted block text-[10px] mb-0.5">[ عنوان التوصيل ]</span>
                                      <span className="text-white font-bold uppercase">{order.wilaya} — {order.address}</span>
                                    </div>
                                    {order.notes && (
                                      <div className="md:col-span-3">
                                        <span className="text-text-muted block text-[10px] mb-0.5">[ ملاحظات ]</span>
                                        <span className="text-text-secondary italic uppercase">"{order.notes}"</span>
                                      </div>
                                    )}
                                  </div>

                                  {/* Items list */}
                                  <div className="space-y-2 text-xs">
                                    <p className="font-mono text-[10px] text-accent-blue uppercase tracking-wider">[ تفاصيل المنتجات ]</p>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                      {order.items.map((item, idx) => (
                                        <div key={idx} className="flex items-center gap-3 bg-secondary-bg/20 p-2 border border-border-custom/50">
                                          <div className="w-8 h-10 bg-primary-bg p-0.5 flex items-center justify-center flex-shrink-0">
                                            <img src={item.image} alt="" className="max-h-full max-w-full object-contain" referrerPolicy="no-referrer" />
                                          </div>
                                          <div>
                                            <p className="font-bold text-white uppercase line-clamp-1 text-[11px]">{item.name}</p>
                                            <p className="font-mono text-[9px] text-text-muted">
                                              المقاس: {item.size} | الكمية: {item.quantity} | {item.color}
                                            </p>
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  </div>

                                  {/* Order Total */}
                                  <div className="flex justify-between items-baseline font-mono text-xs pt-2">
                                    <span className="text-text-muted">[ إجمالي القيمة المستحقة ]</span>
                                    <span className="text-accent-blue font-bold text-sm">{formatPrice(order.total)}</span>
                                  </div>

                                </div>
                              ))}
                            </div>
                          )}

                        </div>
                      )}

                      {/* TAB 3: STORE SETTINGS */}
                      {adminTab === "settings" && (
                        <div className="max-w-xl bg-card-bg/10 border border-border-custom p-6 space-y-6">
                          <h3 className="font-mono text-xs uppercase text-accent-blue tracking-widest border-b border-border-custom pb-3">
                            [ معايرة إعدادات المتجر ]
                          </h3>

                          <div className="space-y-4 text-right">
                            
                            {/* Store Name */}
                            <div>
                              <label className="block font-mono text-[11px] text-text-secondary uppercase mb-1.5">
                                اسم المتجر الرسمي
                              </label>
                              <input 
                                type="text"
                                value={settings.storeName}
                                onChange={(e) => setSettings({ ...settings, storeName: e.target.value.toUpperCase() })}
                                className="w-full bg-primary-bg border border-border-custom text-white px-4 py-2.5 text-xs font-mono uppercase focus:outline-hidden focus:border-white text-right"
                              />
                            </div>

                            {/* Hero Headline */}
                            <div>
                              <label className="block font-mono text-[11px] text-text-secondary uppercase mb-1.5">
                                العنوان الرئيسي للواجهة
                              </label>
                              <textarea 
                                rows={2}
                                value={settings.heroHeadline}
                                onChange={(e) => setSettings({ ...settings, heroHeadline: e.target.value })}
                                className="w-full bg-primary-bg border border-border-custom text-white px-4 py-2.5 text-xs font-mono focus:outline-hidden focus:border-white text-right"
                              />
                            </div>

                            {/* Hero Subheadline */}
                            <div>
                              <label className="block font-mono text-[11px] text-text-secondary uppercase mb-1.5">
                                العنوان الفرعي للواجهة
                              </label>
                              <textarea 
                                rows={2}
                                value={settings.heroSubheadline}
                                onChange={(e) => setSettings({ ...settings, heroSubheadline: e.target.value })}
                                className="w-full bg-primary-bg border border-border-custom text-white px-4 py-2.5 text-xs font-mono focus:outline-hidden focus:border-white text-right"
                              />
                            </div>

                            {/* Maintenance Toggle */}
                            <div className="pt-4 flex items-center justify-between border-t border-border-custom/50 gap-4">
                              <div>
                                <p className="font-mono text-xs font-bold text-white uppercase">[ وضع الصيانة والاستعداد ]</p>
                                <p className="text-[10px] font-mono text-text-muted mt-0.5">تفعيل شاشة الاستعداد المؤقتة لحجب المتجر أثناء التحديث.</p>
                              </div>
                              <button
                                onClick={() => setSettings({ ...settings, maintenanceMode: !settings.maintenanceMode })}
                                className={`px-4 py-1.5 border font-mono text-xs cursor-pointer ${
                                  settings.maintenanceMode 
                                    ? "bg-red-500/20 border-red-500 text-red-400 font-bold" 
                                    : "border-border-custom text-text-secondary hover:text-white"
                                }`}
                              >
                                {settings.maintenanceMode ? "[ الحالة: نشط ]" : "[ الحالة: غير نشط ]"}
                              </button>
                            </div>

                          </div>
                        </div>
                      )}

                    </div>
                  )}
                </motion.div>
              )}

            </AnimatePresence>
          </main>

          {/* FOOTER */}
          <footer className="bg-primary-bg border-t border-border-custom py-12 px-4 md:px-8 mt-auto">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
              
              {/* Brand and Copy */}
              <div className="space-y-2 text-center md:text-right">
                <span className="font-display text-2xl tracking-tight text-white block uppercase">
                  {settings.storeName}
                </span>
                <p className="font-mono text-[10px] text-text-muted uppercase">
                  © {new Date().getFullYear()} جميع الحقوق محفوظة لـ JERSEY ZONE.
                </p>
                <p className="font-mono text-[10px] text-text-muted uppercase">
                  الطقم. المهمة. المنطقة.
                </p>
              </div>

              {/* Decorative Barcode visual element requested */}
              <div className="flex flex-col items-center md:items-left space-y-2">
                <div className="h-10 flex items-end gap-0.5 opacity-40">
                  <span className="w-0.5 h-10 bg-white"></span>
                  <span className="w-1.5 h-10 bg-white"></span>
                  <span className="w-0.5 h-10 bg-white"></span>
                  <span className="w-0.5 h-10 bg-white"></span>
                  <span className="w-1 h-10 bg-white"></span>
                  <span className="w-0.5 h-10 bg-white"></span>
                  <span className="w-1.5 h-10 bg-white"></span>
                  <span className="w-0.5 h-10 bg-white"></span>
                  <span className="w-1 h-10 bg-white"></span>
                  <span className="w-0.5 h-10 bg-white"></span>
                  <span className="w-2 h-10 bg-white"></span>
                  <span className="w-0.5 h-10 bg-white"></span>
                </div>
                <span className="font-mono text-[9px] text-text-muted uppercase tracking-widest">
                  [ JZ_SERIES_001_HQ ]
                </span>
              </div>

            </div>
          </footer>
        </>
      )}

    </div>
  );
}
