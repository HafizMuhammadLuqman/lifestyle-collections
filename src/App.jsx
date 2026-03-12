import { useState, useEffect, useRef } from "react";
import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, onValue, update } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyCD3m3g0gVDaxe-czVsrtQfT2aYam674cw",
  authDomain: "lifestyle-collections.firebaseapp.com",
  projectId: "lifestyle-collections",
  storageBucket: "lifestyle-collections.firebasestorage.app",
  messagingSenderId: "465147301674",
  appId: "1:465147301674:web:aeccc0018a973405fed853",
  measurementId: "G-X4TC7BJEPM",
  databaseURL: "https://lifestyle-collections-default-rtdb.firebaseio.com"
};

const firebaseApp = initializeApp(firebaseConfig);
const db = getDatabase(firebaseApp);

const DEFAULT_STORE = {
  name: "Lifestyle Collections",
  tagline: "Pakistan's Premium Shopping Destination",
  phone: "+923707274881",
  whatsapp: "923707274881",
  displayPhone: "+92 370 7274881",
  address: "Bahawalpur, Punjab, Pakistan",
  delivery: 250,
  jazz: "+92 370 7274881",
  easypaisa: "+92 370 7274881",
  banners: [
    { title: "BIG FASHION SALE", sub: "Up to 70% OFF on clothing!", bg: "linear-gradient(135deg,#FF6B35,#F7931E)", emoji: "👗" },
    { title: "ELECTRONICS DEALS", sub: "Mobile & Gadgets at best prices!", bg: "linear-gradient(135deg,#1565C0,#0097A7)", emoji: "📱" },
    { title: "HOME & KITCHEN", sub: "Make your home beautiful!", bg: "linear-gradient(135deg,#2E7D32,#66BB6A)", emoji: "🏠" },
  ]
};

const ADMIN_CREDS = { name: "Hafiz Muhammad Luqman", password: "LuqmanMughal@123" };

const DEFAULT_CATEGORIES = [
  { name: "Men's Fashion", icon: "👔", color: "#2196F3" },
  { name: "Women's Fashion", icon: "👗", color: "#E91E8C" },
  { name: "Electronics", icon: "📱", color: "#FF6B35" },
  { name: "Home & Kitchen", icon: "🏠", color: "#4CAF50" },
  { name: "Beauty & Health", icon: "💄", color: "#9C27B0" },
  { name: "Sports & Fitness", icon: "⚽", color: "#FF9800" },
  { name: "Kids & Toys", icon: "🧸", color: "#F44336" },
  { name: "Books", icon: "📚", color: "#795548" },
  { name: "Grocery", icon: "🛒", color: "#009688" },
];

const SEED_PRODUCTS = [
  {id:1,name:"Men's Polo Shirt White",price:1200,oldPrice:1800,image:"👕",category:"Men's Fashion",rating:4.5,sold:980,badge:"HOT",desc:"Premium quality cotton polo shirt, perfect for casual wear."},
  {id:2,name:"Men's Slim Fit Jeans Blue",price:2500,oldPrice:3500,image:"👖",category:"Men's Fashion",rating:4.3,sold:760,badge:"SALE",desc:"Stylish slim fit denim jeans for modern men."},
  {id:3,name:"Men's Formal Shirt Sky Blue",price:1800,oldPrice:2500,image:"👔",category:"Men's Fashion",rating:4.4,sold:540,badge:"",desc:"Office-ready formal shirt with wrinkle-free fabric."},
  {id:4,name:"Men's Leather Belt Brown",price:800,oldPrice:1200,image:"🪢",category:"Men's Fashion",rating:4.2,sold:1200,badge:"HOT",desc:"Genuine leather belt with premium buckle."},
  {id:5,name:"Men's Sports Sneakers White",price:3500,oldPrice:5000,image:"👟",category:"Men's Fashion",rating:4.6,sold:430,badge:"NEW",desc:"Comfortable running sneakers with foam sole."},
  {id:6,name:"Men's Kurta Shalwar White",price:2200,oldPrice:3000,image:"🥻",category:"Men's Fashion",rating:4.7,sold:890,badge:"HOT",desc:"Traditional Pakistani kurta shalwar in pure cotton."},
  {id:7,name:"Men's Waistcoat Black",price:1500,oldPrice:2200,image:"🧥",category:"Men's Fashion",rating:4.3,sold:320,badge:"",desc:"Elegant waistcoat for formal occasions."},
  {id:8,name:"Men's Cap Black",price:450,oldPrice:700,image:"🧢",category:"Men's Fashion",rating:4.1,sold:1500,badge:"SALE",desc:"Adjustable snapback cap with embroidery."},
  {id:9,name:"Men's Wallet Leather",price:900,oldPrice:1400,image:"👜",category:"Men's Fashion",rating:4.5,sold:670,badge:"",desc:"Slim leather bifold wallet with card slots."},
  {id:10,name:"Men's Casual Shoes Brown",price:3200,oldPrice:4500,image:"👞",category:"Men's Fashion",rating:4.4,sold:290,badge:"NEW",desc:"Premium leather casual shoes for everyday use."},
  {id:23,name:"Women's Embroidered Suit",price:4500,oldPrice:6500,image:"👗",category:"Women's Fashion",rating:4.8,sold:890,badge:"HOT",desc:"Beautiful 3-piece embroidered lawn suit."},
  {id:24,name:"Women's Sandals Heels",price:2500,oldPrice:3500,image:"👠",category:"Women's Fashion",rating:4.4,sold:560,badge:"SALE",desc:"Stylish block heels for formal occasions."},
  {id:45,name:"Samsung Galaxy A55 5G",price:89999,oldPrice:109999,image:"📱",category:"Electronics",rating:4.6,sold:430,badge:"HOT",desc:"6.6-inch AMOLED display, 50MP camera, 5000mAh battery."},
  {id:46,name:"Xiaomi Redmi Note 13",price:52999,oldPrice:65000,image:"📱",category:"Electronics",rating:4.5,sold:780,badge:"SALE",desc:"120Hz display, 108MP camera, fast charging."},
  {id:70,name:"Air Fryer 4.5L Digital",price:7500,oldPrice:10000,image:"🍳",category:"Home & Kitchen",rating:4.7,sold:560,badge:"HOT",desc:"Oil-free cooking, 8 preset modes, digital display."},
  {id:92,name:"Fair & Lovely Cream 50g",price:350,oldPrice:500,image:"💆",category:"Beauty & Health",rating:4.3,sold:3200,badge:"HOT",desc:"Skin brightening cream with vitamin B3."},
  {id:114,name:"Yoga Mat Non-Slip 6mm",price:2500,oldPrice:3500,image:"🧘",category:"Sports & Fitness",rating:4.6,sold:780,badge:"HOT",desc:"Eco-friendly non-slip yoga mat."},
  {id:136,name:"Remote Control Car",price:3500,oldPrice:5000,image:"🚗",category:"Kids & Toys",rating:4.6,sold:780,badge:"HOT",desc:"RC car with 2.4GHz remote, rechargeable."},
  {id:156,name:"Urdu Novel Aangan",price:600,oldPrice:900,image:"📗",category:"Books",rating:4.8,sold:1200,badge:"HOT",desc:"Classic Urdu novel by Khadija Mastoor."},
  {id:176,name:"Basmati Rice 5kg Premium",price:2500,oldPrice:3200,image:"🍚",category:"Grocery",rating:4.7,sold:1800,badge:"HOT",desc:"Long grain premium basmati rice."},
];

const formatPrice = (n) => `Rs. ${Number(n).toLocaleString()}`;
const discount = (p, o) => o > 0 ? Math.round((1 - p / o) * 100) : 0;

function Stars({ r }) {
  return (
    <span style={{ display: "inline-flex", gap: 1 }}>
      {[1,2,3,4,5].map(i => (
        <span key={i} style={{ color: i <= Math.round(r) ? "#FFB800" : "#ddd", fontSize: 11 }}>★</span>
      ))}
      <span style={{ fontSize: 11, color: "#999", marginLeft: 3 }}>{r}</span>
    </span>
  );
}

function Toast({ msg }) {
  if (!msg) return null;
  return (
    <div style={{position:"fixed",top:20,right:20,background:"#222",color:"#fff",padding:"12px 20px",borderRadius:10,zIndex:99999,fontSize:14,boxShadow:"0 4px 24px rgba(0,0,0,.35)",animation:"toastIn .3s ease"}}>{msg}</div>
  );
}

function useFirebaseData() {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [storeConfig, setStoreConfig] = useState(DEFAULT_STORE);
  const [categories, setCategories] = useState(DEFAULT_CATEGORIES);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const prodRef = ref(db, "products");
    const unsubProd = onValue(prodRef, (snap) => {
      if (snap.exists()) {
        const data = snap.val();
        const arr = Object.entries(data).map(([k, v]) => ({ ...v, fbKey: k }));
        setProducts(arr);
      } else {
        const seedObj = {};
        SEED_PRODUCTS.forEach(p => { seedObj[`prod_${p.id}`] = p; });
        set(ref(db, "products"), seedObj);
      }
      setLoading(false);
    }, (err) => { console.error(err); setProducts(SEED_PRODUCTS); setLoading(false); });

    const ordRef = ref(db, "orders");
    const unsubOrd = onValue(ordRef, (snap) => {
      if (snap.exists()) {
        const arr = Object.entries(snap.val()).map(([k, v]) => ({ ...v, fbKey: k }));
        setOrders(arr.sort((a,b) => b.timestamp - a.timestamp));
      } else setOrders([]);
    }, () => setOrders([]));

    const cfgRef = ref(db, "storeConfig");
    const unsubCfg = onValue(cfgRef, (snap) => {
      if (snap.exists()) setStoreConfig({ ...DEFAULT_STORE, ...snap.val() });
    }, () => {});

    const catRef = ref(db, "categories");
    const unsubCat = onValue(catRef, (snap) => {
      if (snap.exists()) setCategories(snap.val());
      else set(ref(db, "categories"), DEFAULT_CATEGORIES);
    }, () => {});

    return () => { unsubProd(); unsubOrd(); unsubCfg(); unsubCat(); };
  }, []);

  const saveProduct = async (product, fbKey = null) => {
    if (fbKey) await update(ref(db, `products/${fbKey}`), product);
    else await set(ref(db, `products/prod_${Date.now()}`), { ...product, id: Date.now() });
  };
  const deleteProduct = async (fbKey) => await set(ref(db, `products/${fbKey}`), null);
  const saveOrder = async (order) => { await set(ref(db, `orders/order_${Date.now()}`), { ...order, timestamp: Date.now() }); return order; };
  const updateOrderStatus = async (fbKey, status) => await update(ref(db, `orders/${fbKey}`), { status });
  const saveStoreConfig = async (config) => await set(ref(db, "storeConfig"), config);
  const saveCategories = async (cats) => await set(ref(db, "categories"), cats);

  return { products, orders, storeConfig, categories, loading, saveProduct, deleteProduct, saveOrder, updateOrderStatus, saveStoreConfig, saveCategories };
}

export default function App() {
  const { products, orders, storeConfig, categories, loading, saveProduct, deleteProduct, saveOrder, updateOrderStatus, saveStoreConfig, saveCategories } = useFirebaseData();
  const STORE = storeConfig;
  const [page, setPage] = useState("home");
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [selProduct, setSelProduct] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);
  const [adminIn, setAdminIn] = useState(false);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [bannerIdx, setBannerIdx] = useState(0);
  const [toast, setToast] = useState("");
  const [lastOrder, setLastOrder] = useState(null);

  useEffect(() => {
    const t = setInterval(() => setBannerIdx(i => (i+1) % (STORE.banners?.length || 3)), 4000);
    return () => clearInterval(t);
  }, [STORE.banners]);

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(""), 2800); };
  const addCart = (p, qty=1) => {
    setCart(prev => { const ex = prev.find(i => i.id === p.id); return ex ? prev.map(i => i.id===p.id ? {...i,qty:i.qty+qty} : i) : [...prev, {...p,qty}]; });
    showToast(`✅ ${p.name} added to cart!`);
  };
  const removeCart = (id) => setCart(prev => prev.filter(i => i.id!==id));
  const updateQty = (id,d) => setCart(prev => prev.map(i => i.id===id ? {...i,qty:Math.max(1,i.qty+d)} : i));
  const toggleWish = (id) => setWishlist(prev => prev.includes(id) ? prev.filter(x=>x!==id) : [...prev,id]);
  const cartTotal = cart.reduce((s,i) => s + i.price*i.qty, 0);
  const cartCount = cart.reduce((s,i) => s + i.qty, 0);

  const filteredProds = products.filter(p => {
    const mc = activeCategory==="All" || p.category===activeCategory;
    const ms = p.name.toLowerCase().includes(search.toLowerCase());
    return mc && ms;
  });

  const go = (pg, extra={}) => {
    if (extra.product) setSelProduct(extra.product);
    if (extra.editProduct !== undefined) setEditingProduct(extra.editProduct);
    setPage(pg);
    window.scrollTo(0,0);
  };

  if (loading) return (
    <div style={{display:"flex",alignItems:"center",justifyContent:"center",minHeight:"100vh",background:"#fff8f5"}}>
      <div style={{textAlign:"center"}}>
        <div style={{fontSize:48,marginBottom:16}}>🛍️</div>
        <div style={{fontSize:18,fontWeight:700,color:"#FF6B35"}}>{DEFAULT_STORE.name}</div>
        <div style={{marginTop:16,width:40,height:40,border:"4px solid #FF6B35",borderTopColor:"transparent",borderRadius:"50%",animation:"spin 1s linear infinite",margin:"16px auto"}} />
      </div>
    </div>
  );

  if (page==="admin") return <AdminLogin onLogin={()=>{setAdminIn(true);go("adminDash");}} />;
  if (adminIn && page.startsWith("admin")) return (
    <AdminPanel page={page} go={go} products={products} orders={orders} storeConfig={STORE} categories={categories}
      saveProduct={saveProduct} deleteProduct={deleteProduct} updateOrderStatus={updateOrderStatus}
      saveStoreConfig={saveStoreConfig} saveCategories={saveCategories}
      editingProduct={editingProduct} showToast={showToast} onLogout={()=>{setAdminIn(false);go("home");}} />
  );
  if (page==="checkout") return (
    <CheckoutPage cart={cart} cartTotal={cartTotal} STORE={STORE} onBack={()=>go("home")} updateQty={updateQty} removeCart={removeCart}
      onSuccess={async (order) => { await saveOrder(order); setCart([]); setLastOrder(order); go("success"); }} />
  );
  if (page==="success") return <SuccessPage order={lastOrder} STORE={STORE} onHome={()=>go("home")} />;
  if (page==="detail" && selProduct) return (
    <ProductDetail product={selProduct} STORE={STORE} onBack={()=>go("home")}
      onAddCart={addCart} isWishlisted={wishlist.includes(selProduct.id)} onWishlist={toggleWish} />
  );
  if (page==="categoryPage" && activeCategory!=="All") return (
    <CategoryPage category={activeCategory} categories={categories}
      products={products.filter(p => p.category===activeCategory)}
      onBack={()=>{setActiveCategory("All");setPage("home");window.scrollTo(0,0);}}
      onAdd={addCart} onDetail={(p)=>go("detail",{product:p})}
      wishlist={wishlist} onWishlist={toggleWish} cartCount={cartCount} onCart={()=>go("checkout")} STORE={STORE} />
  );

  const banners = STORE.banners || DEFAULT_STORE.banners;
  const bn = banners[bannerIdx % banners.length];

  return (
    <div style={{fontFamily:"'Segoe UI',Tahoma,sans-serif",background:"#F5F5F5",minHeight:"100vh"}}>
      <Toast msg={toast} />
      <header style={{background:"#FF6B35",position:"sticky",top:0,zIndex:200,boxShadow:"0 2px 12px rgba(0,0,0,.2)"}}>
        <div style={{background:"#E85520",padding:"4px 16px",display:"flex",justifyContent:"space-between",fontSize:12,color:"rgba(255,255,255,.9)",flexWrap:"wrap",gap:4}}>
          <span>🚚 Delivery: Rs. {STORE.delivery} all over Pakistan</span>
          <span>📞 {STORE.displayPhone}</span>
        </div>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"8px 16px",maxWidth:1300,margin:"0 auto",width:"100%",boxSizing:"border-box"}}>
          <div onClick={()=>{setActiveCategory("All");setPage("home");}} style={{cursor:"pointer",flexShrink:0}}>
            <div style={{background:"#fff",borderRadius:8,padding:"5px 10px",display:"inline-block"}}>
              <span style={{fontSize:15,fontWeight:900,color:"#FF6B35"}}>{STORE.name.split(" ")[0]}</span>
              <span style={{fontSize:15,fontWeight:900,color:"#222"}}> {STORE.name.split(" ").slice(1).join(" ")}</span>
            </div>
          </div>
          <div style={{display:"flex",gap:6,flexShrink:0}}>
            <a href={`https://wa.me/${STORE.whatsapp}`} target="_blank" rel="noopener noreferrer"
              style={{background:"#25D366",border:"none",borderRadius:8,padding:"7px 10px",color:"#fff",cursor:"pointer",fontSize:12,fontWeight:600,textDecoration:"none",display:"flex",alignItems:"center",gap:4}}>
              💬 <span>WhatsApp</span>
            </a>
            <button onClick={()=>go("admin")} style={{background:"rgba(255,255,255,.2)",border:"none",borderRadius:8,padding:"7px 10px",color:"#fff",cursor:"pointer",fontSize:12,fontWeight:600}}>🔒 Admin</button>
            <button onClick={()=>go("checkout")} style={{background:"#fff",border:"none",borderRadius:8,padding:"7px 10px",color:"#FF6B35",cursor:"pointer",fontSize:12,fontWeight:700,display:"flex",alignItems:"center",gap:4}}>
              🛒 {cartCount>0 && <span style={{background:"#FF6B35",color:"#fff",borderRadius:"50%",width:18,height:18,fontSize:10,display:"flex",alignItems:"center",justifyContent:"center"}}>{cartCount}</span>} Cart
            </button>
          </div>
        </div>
        <div style={{padding:"0 16px 8px",maxWidth:1300,margin:"0 auto",width:"100%",boxSizing:"border-box"}}>
          <div style={{display:"flex"}}>
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search products..."
              style={{width:"100%",padding:"9px 12px",borderRadius:"8px 0 0 8px",border:"none",fontSize:14,outline:"none"}} />
            <button style={{background:"#FFB800",border:"none",padding:"9px 14px",borderRadius:"0 8px 8px 0",cursor:"pointer",fontSize:16,flexShrink:0}}>🔍</button>
          </div>
        </div>
        <div style={{background:"#E85520",display:"flex",overflowX:"auto",padding:"0 8px",WebkitOverflowScrolling:"touch",scrollbarWidth:"none"}}>
          {["All",...categories.map(c=>c.name)].map(cat=>(
            <button key={cat} onClick={()=>{setActiveCategory(cat);setSearch("");if(cat!=="All"){setPage("categoryPage");}else{setPage("home");}}}
              style={{background:activeCategory===cat?"rgba(255,255,255,.2)":"transparent",border:"none",color:"#fff",padding:"8px 12px",cursor:"pointer",fontSize:12,whiteSpace:"nowrap",borderBottom:activeCategory===cat?"2px solid #fff":"2px solid transparent",fontWeight:activeCategory===cat?600:400,flexShrink:0}}>
              {cat}
            </button>
          ))}
        </div>
      </header>

      <div style={{maxWidth:1300,margin:"0 auto",padding:"0 10px"}}>
        {/* Banner */}
        <div style={{margin:"12px 0",borderRadius:14,overflow:"hidden",cursor:"pointer",position:"relative"}}>
          <div style={{background:bn.bg,padding:"28px 28px",display:"flex",justifyContent:"space-between",alignItems:"center",minHeight:140,transition:"background .5s"}}>
            <div>
              <div style={{fontSize:10,color:"rgba(255,255,255,.8)",letterSpacing:3,marginBottom:4}}>{STORE.name.toUpperCase()}</div>
              <div style={{fontSize:24,fontWeight:900,color:"#fff",lineHeight:1.1}}>{bn.title}</div>
              <div style={{fontSize:13,color:"rgba(255,255,255,.9)",marginTop:6}}>{bn.sub}</div>
              <button style={{marginTop:12,background:"#fff",border:"none",padding:"8px 20px",borderRadius:25,fontWeight:700,cursor:"pointer",fontSize:12,color:"#FF6B35"}}>Shop Now →</button>
            </div>
            <div style={{fontSize:70}}>{bn.emoji}</div>
          </div>
          <div style={{position:"absolute",bottom:8,left:"50%",transform:"translateX(-50%)",display:"flex",gap:6}}>
            {banners.map((_, i) => (
              <div key={i} onClick={()=>setBannerIdx(i)} style={{width:i===bannerIdx%banners.length?20:7,height:7,borderRadius:4,background:i===bannerIdx%banners.length?"#fff":"rgba(255,255,255,.5)",cursor:"pointer",transition:"all .3s"}} />
            ))}
          </div>
        </div>

        {/* Categories */}
        <div style={{background:"#fff",borderRadius:14,padding:16,marginBottom:12}}>
          <h3 style={{margin:"0 0 12px",fontSize:16,color:"#222"}}>🗂️ Shop by Category</h3>
          <div style={{display:"flex",overflowX:"auto",gap:10,paddingBottom:4,WebkitOverflowScrolling:"touch",scrollbarWidth:"none"}}>
            {categories.map(cat=>(
              <div key={cat.name} onClick={()=>{setActiveCategory(cat.name);setPage("categoryPage");window.scrollTo(0,0);}}
                style={{textAlign:"center",cursor:"pointer",padding:"12px 14px",borderRadius:14,background:"#fafafa",border:`2px solid ${cat.color}22`,transition:"all .2s",flexShrink:0,minWidth:80,boxShadow:"0 2px 8px rgba(0,0,0,.06)"}}>
                <div style={{fontSize:30}}>{cat.icon}</div>
                <div style={{fontSize:10,marginTop:5,fontWeight:700,color:"#333",lineHeight:1.3}}>{cat.name}</div>
                <div style={{fontSize:9,color:"#aaa",marginTop:2}}>{products.filter(p=>p.category===cat.name).length} items</div>
              </div>
            ))}
          </div>
        </div>

        {/* All Products */}
        <div style={{background:"#fff",borderRadius:14,padding:16,marginBottom:12}}>
          <h3 style={{margin:0,fontSize:17,fontWeight:800,marginBottom:14}}>
            ⚡ All Products
            <span style={{fontSize:12,color:"#999",fontWeight:400,marginLeft:6}}>({filteredProds.length} items)</span>
          </h3>
          {filteredProds.length===0 ? (
            <div style={{textAlign:"center",padding:50,color:"#aaa"}}><div style={{fontSize:48}}>🔍</div><p>No products found</p></div>
          ) : (
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(160px,1fr))",gap:12}}>
              {filteredProds.map(p=>(
                <ProductCard key={p.fbKey||p.id} product={p} onAdd={addCart} onDetail={()=>go("detail",{product:p})}
                  isWishlisted={wishlist.includes(p.id)} onWishlist={toggleWish} />
              ))}
            </div>
          )}
        </div>

        {/* Payment info */}
        <div style={{background:"#fff",borderRadius:14,padding:20,marginBottom:12,display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))",gap:12}}>
          {[
            {icon:"📱",title:"JazzCash",desc:STORE.jazz,note:"Transfer after order",bg:"#FFF5F0"},
            {icon:"💜",title:"EasyPaisa",desc:STORE.easypaisa,note:"Transfer after order",bg:"#F3E5F5"},
            {icon:"💵",title:"Cash on Delivery",desc:"All over Pakistan",note:"Pay on delivery",bg:"#E8F5E9"},
            {icon:"🚚",title:"Delivery Charges",desc:`Rs. ${STORE.delivery}`,note:"All over Pakistan",bg:"#E3F2FD"},
          ].map(item=>(
            <div key={item.title} style={{textAlign:"center",padding:14,background:item.bg,borderRadius:12}}>
              <div style={{fontSize:28,marginBottom:6}}>{item.icon}</div>
              <div style={{fontWeight:700,color:"#222",marginBottom:3,fontSize:14}}>{item.title}</div>
              <div style={{fontSize:13,color:"#555"}}>{item.desc}</div>
              <div style={{fontSize:11,color:"#888",marginTop:3}}>{item.note}</div>
            </div>
          ))}
        </div>

        <footer style={{background:"#1A1A1A",borderRadius:14,padding:24,color:"#bbb",marginBottom:12}}>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(160px,1fr))",gap:16,marginBottom:16}}>
            <div>
              <div style={{color:"#fff",fontWeight:900,fontSize:18,marginBottom:8}}>{STORE.name}</div>
              <p style={{fontSize:12,lineHeight:1.7,color:"#888"}}>{STORE.tagline}</p>
              <a href={`https://wa.me/${STORE.whatsapp}`} target="_blank" rel="noopener noreferrer"
                style={{display:"inline-flex",alignItems:"center",gap:6,background:"#25D366",color:"#fff",padding:"8px 14px",borderRadius:8,fontSize:12,fontWeight:600,textDecoration:"none",marginTop:8}}>
                💬 {STORE.displayPhone}
              </a>
            </div>
            <div>
              <div style={{color:"#fff",fontWeight:600,marginBottom:8,fontSize:13}}>Categories</div>
              {categories.slice(0,5).map(c=>(
                <div key={c.name} onClick={()=>{setActiveCategory(c.name);setPage("categoryPage");window.scrollTo(0,0);}}
                  style={{fontSize:12,marginBottom:5,cursor:"pointer",color:"#aaa"}}>{c.icon} {c.name}</div>
              ))}
            </div>
            <div>
              <div style={{color:"#fff",fontWeight:600,marginBottom:8,fontSize:13}}>Contact Us</div>
              <div style={{fontSize:12,marginBottom:5}}>📞 {STORE.displayPhone}</div>
              <div style={{fontSize:12,marginBottom:5}}>💬 WhatsApp: {STORE.displayPhone}</div>
              <div style={{fontSize:12,marginBottom:5}}>📍 {STORE.address}</div>
            </div>
            <div>
              <div style={{color:"#fff",fontWeight:600,marginBottom:8,fontSize:13}}>Payment Methods</div>
              {["💳 JazzCash","💜 EasyPaisa","💵 Cash on Delivery"].map(m=>(
                <div key={m} style={{background:"#333",padding:"5px 10px",borderRadius:6,fontSize:12,marginBottom:5}}>{m}</div>
              ))}
            </div>
          </div>
          <div style={{borderTop:"1px solid #333",paddingTop:12,textAlign:"center",fontSize:12,color:"#666"}}>
            © 2025 {STORE.name} — {STORE.address} 🇵🇰 | All rights reserved
          </div>
        </footer>
      </div>

      <style>{`
        @keyframes toastIn { from{transform:translateX(100px);opacity:0} to{transform:translateX(0);opacity:1} }
        @keyframes spin { to{transform:rotate(360deg)} }
        *{box-sizing:border-box}
        ::-webkit-scrollbar{width:4px;height:4px}
        ::-webkit-scrollbar-thumb{background:#FF6B35;border-radius:3px}
      `}</style>
    </div>
  );
}

function CategoryPage({ category, categories, products, onBack, onAdd, onDetail, wishlist, onWishlist, cartCount, onCart, STORE }) {
  const catObj = categories.find(c=>c.name===category) || { icon:"📦", color:"#FF6B35" };
  const [search, setSearch] = useState("");
  const filtered = products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));
  return (
    <div style={{fontFamily:"'Segoe UI',sans-serif",background:"#F5F5F5",minHeight:"100vh"}}>
      <div style={{background:"#FF6B35",padding:"12px 16px",display:"flex",alignItems:"center",justifyContent:"space-between",position:"sticky",top:0,zIndex:100,boxShadow:"0 2px 12px rgba(0,0,0,.2)"}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <button onClick={onBack} style={{background:"rgba(255,255,255,.2)",border:"none",color:"#fff",padding:"7px 12px",borderRadius:8,cursor:"pointer",fontSize:13,fontWeight:600}}>← Back</button>
          <div style={{fontSize:22}}>{catObj.icon}</div>
          <div style={{color:"#fff",fontWeight:800,fontSize:17}}>{category}</div>
        </div>
        <button onClick={onCart} style={{background:"#fff",border:"none",borderRadius:8,padding:"7px 10px",color:"#FF6B35",cursor:"pointer",fontSize:12,fontWeight:700,display:"flex",alignItems:"center",gap:4}}>
          🛒 {cartCount>0 && <span style={{background:"#FF6B35",color:"#fff",borderRadius:"50%",width:18,height:18,fontSize:10,display:"flex",alignItems:"center",justifyContent:"center"}}>{cartCount}</span>} Cart
        </button>
      </div>
      <div style={{maxWidth:1300,margin:"0 auto",padding:"12px 10px"}}>
        <div style={{background:`linear-gradient(135deg, ${catObj.color}, ${catObj.color}99)`,borderRadius:14,padding:"20px 24px",marginBottom:14,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div>
            <div style={{fontSize:28,fontWeight:900,color:"#fff"}}>{catObj.icon} {category}</div>
            <div style={{fontSize:13,color:"rgba(255,255,255,.9)",marginTop:4}}>{products.length} products available</div>
          </div>
          <div style={{fontSize:60}}>{catObj.icon}</div>
        </div>
        <div style={{background:"#fff",borderRadius:12,padding:"10px 14px",marginBottom:14,display:"flex",gap:8}}>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder={`Search in ${category}...`}
            style={{flex:1,border:"1px solid #e0e0e0",borderRadius:8,padding:"8px 12px",fontSize:13,outline:"none"}} />
          <button style={{background:"#FFB800",border:"none",padding:"8px 14px",borderRadius:8,cursor:"pointer",fontSize:16}}>🔍</button>
        </div>
        <div style={{background:"#fff",borderRadius:14,padding:16}}>
          <h3 style={{margin:"0 0 14px",fontSize:16,fontWeight:800}}>
            {catObj.icon} {category}
            <span style={{fontSize:12,color:"#999",fontWeight:400,marginLeft:6}}>({filtered.length} items)</span>
          </h3>
          {filtered.length===0 ? (
            <div style={{textAlign:"center",padding:50,color:"#aaa"}}><div style={{fontSize:48}}>🔍</div><p>No products found</p></div>
          ) : (
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(160px,1fr))",gap:12}}>
              {filtered.map(p=>(
                <ProductCard key={p.fbKey||p.id} product={p} onAdd={onAdd} onDetail={()=>onDetail(p)}
                  isWishlisted={wishlist.includes(p.id)} onWishlist={onWishlist} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ProductCard({ product:p, onAdd, onDetail, isWishlisted, onWishlist }) {
  const [hov, setHov] = useState(false);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const pct = discount(p.price, p.oldPrice);
  const handleAdd = (e) => { e.stopPropagation(); onAdd(p, qty); setAdded(true); setTimeout(() => setAdded(false), 1500); };
  return (
    <div onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
      style={{background:"#fff",borderRadius:14,overflow:"hidden",cursor:"pointer",border:"1px solid #f0f0f0",boxShadow:hov?"0 8px 28px rgba(0,0,0,.12)":"0 2px 6px rgba(0,0,0,.05)",transform:hov?"translateY(-3px)":"none",transition:"all .25s",position:"relative",display:"flex",flexDirection:"column"}}>
      {p.badge && <div style={{position:"absolute",top:8,left:8,background:p.badge==="HOT"?"#FF6B35":p.badge==="NEW"?"#4CAF50":"#E91E8C",color:"#fff",fontSize:9,fontWeight:700,padding:"2px 7px",borderRadius:4,zIndex:2}}>{p.badge}</div>}
      <button onClick={e=>{e.stopPropagation();onWishlist(p.id);}} style={{position:"absolute",top:6,right:6,background:"rgba(255,255,255,.9)",border:"none",borderRadius:"50%",width:28,height:28,cursor:"pointer",fontSize:14,zIndex:2}}>
        {isWishlisted?"❤️":"🤍"}
      </button>
      <div onClick={onDetail} style={{padding:"18px 14px",textAlign:"center",fontSize:50,background:"#FFF5F0",minHeight:95,display:"flex",alignItems:"center",justifyContent:"center"}}>
        {p.image && p.image.startsWith("data:") ? <img src={p.image} alt={p.name} style={{width:75,height:75,objectFit:"contain"}} /> : <span>{p.image}</span>}
      </div>
      <div style={{padding:"8px 10px",flex:1}} onClick={onDetail}>
        <div style={{fontSize:12,fontWeight:600,color:"#222",marginBottom:3,height:30,overflow:"hidden",lineHeight:1.4}}>{p.name}</div>
        <Stars r={p.rating} />
        <div style={{fontSize:10,color:"#bbb",margin:"2px 0 4px"}}>{p.sold?.toLocaleString()} sold</div>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <div>
            <div style={{fontSize:14,fontWeight:800,color:"#FF6B35"}}>{formatPrice(p.price)}</div>
            <div style={{fontSize:10,color:"#ccc",textDecoration:"line-through"}}>{formatPrice(p.oldPrice)}</div>
          </div>
          <span style={{background:"#FFF5F0",color:"#FF6B35",fontSize:10,fontWeight:700,padding:"2px 6px",borderRadius:5}}>-{pct}%</span>
        </div>
      </div>
      <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:6,padding:"6px 10px",background:"#fafafa",borderTop:"1px solid #f0f0f0"}} onClick={e=>e.stopPropagation()}>
        <button onClick={e=>{e.stopPropagation();setQty(q=>Math.max(1,q-1));}} style={{width:26,height:26,borderRadius:"50%",border:"1px solid #ddd",background:"#fff",cursor:"pointer",fontSize:14,fontWeight:700,color:"#FF6B35",display:"flex",alignItems:"center",justifyContent:"center"}}>−</button>
        <span style={{fontSize:13,fontWeight:700,minWidth:20,textAlign:"center"}}>{qty}</span>
        <button onClick={e=>{e.stopPropagation();setQty(q=>q+1);}} style={{width:26,height:26,borderRadius:"50%",border:"1px solid #ddd",background:"#fff",cursor:"pointer",fontSize:14,fontWeight:700,color:"#FF6B35",display:"flex",alignItems:"center",justifyContent:"center"}}>+</button>
      </div>
      <button onClick={handleAdd} style={{width:"100%",background:added?"#4CAF50":"#FF6B35",border:"none",color:"#fff",padding:"9px",fontSize:12,fontWeight:600,cursor:"pointer",transition:"background .3s"}}>
        {added ? "✅ Added!" : `+ Add to Cart`}
      </button>
    </div>
  );
}

function ProductDetail({ product:p, STORE, onBack, onAddCart, isWishlisted, onWishlist }) {
  const [qty, setQty] = useState(1);
  const pct = discount(p.price, p.oldPrice);
  return (
    <div style={{fontFamily:"'Segoe UI',sans-serif",background:"#F5F5F5",minHeight:"100vh",padding:12}}>
      <div style={{maxWidth:900,margin:"0 auto"}}>
        <button onClick={onBack} style={{background:"none",border:"none",color:"#FF6B35",cursor:"pointer",fontSize:14,marginBottom:12}}>← Go Back</button>
        <div style={{background:"#fff",borderRadius:14,padding:20,display:"flex",gap:24,flexWrap:"wrap"}}>
          <div style={{background:"#FFF5F0",borderRadius:12,padding:24,minWidth:180,textAlign:"center",fontSize:90,flex:"0 0 200px",display:"flex",alignItems:"center",justifyContent:"center"}}>
            {p.image && p.image.startsWith("data:") ? <img src={p.image} alt={p.name} style={{width:150,height:150,objectFit:"contain"}} /> : <span>{p.image}</span>}
          </div>
          <div style={{flex:1,minWidth:220}}>
            <div style={{fontSize:11,color:"#888",marginBottom:5}}>{p.category}</div>
            <h2 style={{margin:"0 0 8px",fontSize:20,color:"#222"}}>{p.name}</h2>
            <Stars r={p.rating} />
            <div style={{fontSize:12,color:"#aaa",margin:"5px 0 14px"}}>{p.sold?.toLocaleString()} items sold</div>
            <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:16}}>
              <span style={{fontSize:26,fontWeight:900,color:"#FF6B35"}}>{formatPrice(p.price)}</span>
              <span style={{fontSize:14,color:"#bbb",textDecoration:"line-through"}}>{formatPrice(p.oldPrice)}</span>
              <span style={{background:"#FF6B35",color:"#fff",padding:"2px 8px",borderRadius:20,fontSize:12,fontWeight:700}}>-{pct}%</span>
            </div>
            {p.desc && <p style={{color:"#555",fontSize:13,lineHeight:1.7,marginBottom:16}}>{p.desc}</p>}
            <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:16}}>
              <span style={{fontSize:13,fontWeight:600,color:"#555"}}>Quantity:</span>
              <div style={{display:"flex",alignItems:"center",gap:8,background:"#f5f5f5",borderRadius:8,padding:"4px 8px"}}>
                <button onClick={()=>setQty(q=>Math.max(1,q-1))} style={{width:28,height:28,borderRadius:6,border:"1px solid #ddd",background:"#fff",cursor:"pointer",fontSize:16,fontWeight:700,color:"#FF6B35"}}>−</button>
                <span style={{fontSize:15,fontWeight:700,minWidth:24,textAlign:"center"}}>{qty}</span>
                <button onClick={()=>setQty(q=>q+1)} style={{width:28,height:28,borderRadius:6,border:"1px solid #ddd",background:"#fff",cursor:"pointer",fontSize:16,fontWeight:700,color:"#FF6B35"}}>+</button>
              </div>
            </div>
            <div style={{display:"flex",gap:10,marginBottom:16}}>
              <button onClick={()=>onAddCart(p,qty)} style={{flex:1,background:"#FF6B35",border:"none",color:"#fff",padding:"12px 16px",borderRadius:10,fontSize:14,fontWeight:700,cursor:"pointer"}}>🛒 Add to Cart ({qty})</button>
              <button onClick={()=>onWishlist(p.id)} style={{background:isWishlisted?"#FFE8E0":"#f5f5f5",border:"none",color:isWishlisted?"#FF6B35":"#888",padding:"12px 16px",borderRadius:10,fontSize:18,cursor:"pointer"}}>
                {isWishlisted?"❤️":"🤍"}
              </button>
            </div>
            <div style={{background:"#FFF5F0",borderRadius:10,padding:12,fontSize:12,color:"#555",lineHeight:2}}>
              🚚 Delivery: Rs. {STORE.delivery} all over Pakistan<br/>🔄 7-day easy returns<br/>✅ Authentic product guarantee<br/>💵 Cash on Delivery available<br/>
              💬 WhatsApp: <a href={`https://wa.me/${STORE.whatsapp}`} style={{color:"#25D366",fontWeight:600}}>{STORE.displayPhone}</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function CheckoutPage({ cart, cartTotal, STORE, onBack, onSuccess, updateQty, removeCart }) {
  const [form, setForm] = useState({ name:"",phone:"",email:"",house:"",area:"",city:"",postal:"",landmark:"",payMethod:"COD",transId:"",screenshot:null });
  const [errors, setErrors] = useState({});
  const [step, setStep] = useState(1);
  const [placing, setPlacing] = useState(false);
  const fileRef = useRef();
  const total = cartTotal + STORE.delivery;
  const set = (k,v) => setForm(f=>({...f,[k]:v}));

  const placeOrder = async () => {
    const e = {};
    if (!form.name.trim()) e.name = "Enter your name";
    if (!form.phone.trim()) e.phone = "Enter phone number";
    if (!form.house.trim()) e.house = "Enter address";
    if (!form.area.trim()) e.area = "Enter area";
    if (!form.city.trim()) e.city = "Enter city";
    if (form.payMethod!=="COD" && !form.transId.trim()) e.transId = "Enter Transaction ID";
    setErrors(e);
    if (Object.keys(e).length > 0) return;
    setPlacing(true);
    const order = { id: "LC-" + Date.now(), date: new Date().toLocaleString("en-PK"), customer: form, items: cart, subtotal: cartTotal, delivery: STORE.delivery, total, status: "Pending" };
    await onSuccess(order);
    setPlacing(false);
  };

  if (cart.length===0) return (
    <div style={{fontFamily:"'Segoe UI',sans-serif",minHeight:"100vh",background:"#F5F5F5",display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column",gap:14}}>
      <div style={{fontSize:60}}>🛒</div>
      <div style={{fontSize:18,fontWeight:600,color:"#555"}}>Your cart is empty!</div>
      <button onClick={onBack} style={{background:"#FF6B35",border:"none",color:"#fff",padding:"12px 28px",borderRadius:10,cursor:"pointer",fontWeight:600,fontSize:14}}>Continue Shopping</button>
    </div>
  );

  return (
    <div style={{fontFamily:"'Segoe UI',sans-serif",background:"#F5F5F5",minHeight:"100vh",padding:12}}>
      <div style={{maxWidth:900,margin:"0 auto"}}>
        <div style={{background:"#FF6B35",borderRadius:12,padding:"14px 20px",marginBottom:16,display:"flex",alignItems:"center",gap:10}}>
          <button onClick={onBack} style={{background:"rgba(255,255,255,.2)",border:"none",color:"#fff",padding:"6px 12px",borderRadius:8,cursor:"pointer",fontSize:13}}>← Back</button>
          <span style={{color:"#fff",fontWeight:700,fontSize:17}}>🛒 Place Your Order</span>
        </div>
        <div style={{display:"flex",gap:6,marginBottom:16}}>
          {[{n:1,l:"Cart"},{n:2,l:"Info"},{n:3,l:"Payment"}].map(s=>(
            <div key={s.n} style={{flex:1,padding:"9px",borderRadius:10,textAlign:"center",background:step===s.n?"#FF6B35":step>s.n?"#4CAF50":"#fff",color:step>=s.n?"#fff":"#aaa",fontWeight:600,fontSize:13,border:`1px solid ${step===s.n?"#FF6B35":step>s.n?"#4CAF50":"#e0e0e0"}`}}>
              {step>s.n?"✓ ":""}{s.n}. {s.l}
            </div>
          ))}
        </div>
        {step===1 && (
          <div style={{background:"#fff",borderRadius:12,padding:16}}>
            <h3 style={{margin:"0 0 14px",fontSize:16}}>📦 Your Cart</h3>
            {cart.map(item=>(
              <div key={item.id} style={{display:"flex",gap:12,padding:"12px 0",borderBottom:"1px solid #f5f5f5",alignItems:"center"}}>
                <div style={{fontSize:36,background:"#FFF5F0",borderRadius:8,width:54,height:54,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                  {item.image&&item.image.startsWith("data:")? <img src={item.image} alt="" style={{width:46,height:46,objectFit:"contain"}} /> : item.image}
                </div>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontSize:13,fontWeight:600,color:"#222",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{item.name}</div>
                  <div style={{fontSize:13,color:"#FF6B35",fontWeight:700}}>{formatPrice(item.price)}</div>
                </div>
                <div style={{display:"flex",alignItems:"center",gap:6,flexShrink:0}}>
                  <button onClick={()=>updateQty(item.id,-1)} style={{width:24,height:24,borderRadius:6,border:"1px solid #ddd",background:"#fff",cursor:"pointer",fontSize:14,fontWeight:700,color:"#FF6B35"}}>−</button>
                  <span style={{fontSize:13,fontWeight:700,minWidth:20,textAlign:"center"}}>{item.qty}</span>
                  <button onClick={()=>updateQty(item.id,1)} style={{width:24,height:24,borderRadius:6,border:"1px solid #ddd",background:"#fff",cursor:"pointer",fontSize:14,fontWeight:700,color:"#FF6B35"}}>+</button>
                </div>
                <div style={{fontSize:13,fontWeight:700,color:"#222",flexShrink:0,minWidth:70,textAlign:"right"}}>{formatPrice(item.price*item.qty)}</div>
                <button onClick={()=>removeCart(item.id)} style={{background:"#FFEBEE",border:"none",color:"#C62828",width:26,height:26,borderRadius:6,cursor:"pointer",fontSize:12,flexShrink:0}}>✕</button>
              </div>
            ))}
            <div style={{background:"#FFF5F0",borderRadius:10,padding:12,marginTop:10,fontSize:12,color:"#555"}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:3}}><span>Subtotal</span><span>{formatPrice(cartTotal)}</span></div>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:3}}><span>Delivery</span><span style={{color:"#FF6B35",fontWeight:600}}>Rs. {STORE.delivery}</span></div>
              <div style={{display:"flex",justifyContent:"space-between",fontWeight:800,fontSize:14,color:"#FF6B35"}}><span>Total</span><span>{formatPrice(total)}</span></div>
            </div>
            <button onClick={()=>setStep(2)} style={{width:"100%",background:"#FF6B35",border:"none",color:"#fff",padding:"13px",borderRadius:10,fontSize:14,fontWeight:700,cursor:"pointer",marginTop:14}}>Continue →</button>
          </div>
        )}
        {step===2 && (
          <div style={{background:"#fff",borderRadius:12,padding:16}}>
            <h3 style={{margin:"0 0 14px",fontSize:16}}>👤 Your Details</h3>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
              <Field label="Full Name *" val={form.name} onChange={v=>set("name",v)} err={errors.name} placeholder="Your full name" />
              <Field label="Phone Number *" val={form.phone} onChange={v=>set("phone",v)} err={errors.phone} placeholder="+92 3XX XXXXXXX" />
            </div>
            <Field label="Email Address" val={form.email} onChange={v=>set("email",v)} placeholder="email@example.com" />
            <h4 style={{margin:"14px 0 10px",color:"#555",fontSize:13}}>🏠 Delivery Address</h4>
            <Field label="House/Flat & Street *" val={form.house} onChange={v=>set("house",v)} err={errors.house} placeholder="House No., Street" />
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
              <Field label="Area / Mohalla *" val={form.area} onChange={v=>set("area",v)} err={errors.area} placeholder="Your area" />
              <Field label="City *" val={form.city} onChange={v=>set("city",v)} err={errors.city} placeholder="Your city" />
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
              <Field label="Postal Code" val={form.postal} onChange={v=>set("postal",v)} placeholder="XXXXX" />
              <Field label="Landmark" val={form.landmark} onChange={v=>set("landmark",v)} placeholder="Mosque, School, etc." />
            </div>
            <div style={{display:"flex",gap:8,marginTop:14}}>
              <button onClick={()=>setStep(1)} style={{flex:1,background:"#f5f5f5",border:"none",color:"#555",padding:"12px",borderRadius:10,cursor:"pointer",fontWeight:600}}>← Back</button>
              <button onClick={()=>{const e={};if(!form.name.trim())e.name="Required";if(!form.phone.trim())e.phone="Required";if(!form.house.trim())e.house="Required";if(!form.area.trim())e.area="Required";if(!form.city.trim())e.city="Required";setErrors(e);if(Object.keys(e).length===0)setStep(3);}}
                style={{flex:2,background:"#FF6B35",border:"none",color:"#fff",padding:"12px",borderRadius:10,fontSize:14,fontWeight:700,cursor:"pointer"}}>Payment →</button>
            </div>
          </div>
        )}
        {step===3 && (
          <div style={{background:"#fff",borderRadius:12,padding:16}}>
            <h3 style={{margin:"0 0 14px",fontSize:16}}>💳 Payment Method</h3>
            {[{v:"COD",icon:"💵",label:"Cash on Delivery",desc:"Pay when delivered"},{v:"jazz",icon:"📱",label:"JazzCash",desc:`Transfer to: ${STORE.jazz}`},{v:"easypaisa",icon:"💜",label:"EasyPaisa",desc:`Transfer to: ${STORE.easypaisa}`}].map(pm=>(
              <div key={pm.v} onClick={()=>set("payMethod",pm.v)}
                style={{display:"flex",alignItems:"center",gap:12,padding:12,borderRadius:12,border:`2px solid ${form.payMethod===pm.v?"#FF6B35":"#e0e0e0"}`,marginBottom:8,cursor:"pointer",background:form.payMethod===pm.v?"#FFF5F0":"#fff"}}>
                <span style={{fontSize:26}}>{pm.icon}</span>
                <div style={{flex:1}}>
                  <div style={{fontWeight:600,color:"#222",fontSize:14}}>{pm.label}</div>
                  <div style={{fontSize:12,color:"#888"}}>{pm.desc}</div>
                </div>
                <div style={{width:18,height:18,borderRadius:"50%",border:`2px solid ${form.payMethod===pm.v?"#FF6B35":"#ccc"}`,background:form.payMethod===pm.v?"#FF6B35":"transparent",display:"flex",alignItems:"center",justifyContent:"center"}}>
                  {form.payMethod===pm.v && <div style={{width:7,height:7,background:"#fff",borderRadius:"50%"}} />}
                </div>
              </div>
            ))}
            {form.payMethod!=="COD" && (
              <div style={{background:"#FFF5F0",borderRadius:10,padding:14,marginTop:4}}>
                <div style={{fontWeight:600,marginBottom:6,fontSize:13}}>📲 Payment Instructions:</div>
                <div style={{fontSize:12,color:"#555",lineHeight:1.8}}>
                  1. Transfer <strong>Rs. {total.toLocaleString()}</strong> to {form.payMethod==="jazz"?STORE.jazz:STORE.easypaisa}<br/>
                  2. Enter Transaction ID below<br/>
                  3. Send screenshot to WhatsApp: <a href={`https://wa.me/${STORE.whatsapp}`} style={{color:"#25D366"}}>{STORE.displayPhone}</a>
                </div>
                <Field label="Transaction ID *" val={form.transId} onChange={v=>set("transId",v)} err={errors.transId} placeholder="Enter Transaction ID" />
                <div style={{marginTop:8}}>
                  <label style={{fontSize:12,fontWeight:600,color:"#555",marginBottom:5,display:"block"}}>Upload Screenshot (optional)</label>
                  <input ref={fileRef} type="file" accept="image/*" onChange={e=>{const f=e.target.files[0];if(f){const r=new FileReader();r.onload=ev=>set("screenshot",ev.target.result);r.readAsDataURL(f);}}} style={{fontSize:12,color:"#555"}} />
                  {form.screenshot && <img src={form.screenshot} alt="receipt" style={{width:110,height:90,objectFit:"cover",borderRadius:8,marginTop:6,border:"1px solid #e0e0e0"}} />}
                </div>
              </div>
            )}
            <div style={{display:"flex",gap:8,marginTop:14}}>
              <button onClick={()=>setStep(2)} style={{flex:1,background:"#f5f5f5",border:"none",color:"#555",padding:"12px",borderRadius:10,cursor:"pointer",fontWeight:600}}>← Back</button>
              <button onClick={placeOrder} disabled={placing} style={{flex:2,background:placing?"#aaa":"#FF6B35",border:"none",color:"#fff",padding:"12px",borderRadius:10,fontSize:14,fontWeight:700,cursor:placing?"not-allowed":"pointer"}}>
                {placing ? "⏳ Placing Order..." : "✅ Place Order"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Field({ label, val, onChange, err, placeholder, type="text" }) {
  return (
    <div style={{marginBottom:10}}>
      <label style={{fontSize:12,fontWeight:600,color:"#555",marginBottom:3,display:"block"}}>{label}</label>
      <input value={val} type={type} onChange={e=>onChange(e.target.value)} placeholder={placeholder}
        style={{width:"100%",padding:"9px 11px",border:`1px solid ${err?"#f44336":"#e0e0e0"}`,borderRadius:8,fontSize:13,outline:"none",background:"#fafafa"}} />
      {err && <div style={{fontSize:11,color:"#f44336",marginTop:2}}>⚠️ {err}</div>}
    </div>
  );
}

function SuccessPage({ order, STORE, onHome }) {
  return (
    <div style={{fontFamily:"'Segoe UI',sans-serif",minHeight:"100vh",background:"#F5F5F5",display:"flex",alignItems:"center",justifyContent:"center",padding:14}}>
      <div style={{background:"#fff",borderRadius:18,padding:32,maxWidth:480,width:"100%",textAlign:"center",boxShadow:"0 8px 40px rgba(0,0,0,.1)"}}>
        <div style={{fontSize:64,marginBottom:14}}>🎉</div>
        <h2 style={{color:"#4CAF50",margin:"0 0 6px",fontSize:22}}>Order Placed Successfully!</h2>
        <div style={{fontSize:13,color:"#888",marginBottom:18}}>Order ID: <strong style={{color:"#FF6B35"}}>{order?.id}</strong></div>
        <div style={{background:"#F5F5F5",borderRadius:10,padding:14,textAlign:"left",marginBottom:18}}>
          <div style={{fontSize:13,color:"#555",lineHeight:2}}>
            <b>Customer:</b> {order?.customer?.name}<br/><b>Phone:</b> {order?.customer?.phone}<br/><b>City:</b> {order?.customer?.city}<br/>
            <b>Payment:</b> {order?.customer?.payMethod==="COD"?"Cash on Delivery":order?.customer?.payMethod==="jazz"?"JazzCash":"EasyPaisa"}<br/>
            <b>Total:</b> <span style={{color:"#FF6B35",fontWeight:700}}>{formatPrice(order?.total)}</span>
          </div>
        </div>
        {order?.customer?.payMethod!=="COD" && (
          <div style={{background:"#FFF5F0",borderRadius:10,padding:10,marginBottom:14,fontSize:12,color:"#555"}}>
            ⚠️ Please send payment screenshot to WhatsApp:<br/>
            <a href={`https://wa.me/${STORE.whatsapp}`} style={{color:"#25D366",fontWeight:700}}>{STORE.displayPhone}</a>
          </div>
        )}
        <a href={`https://wa.me/${STORE.whatsapp}?text=Order ID: ${order?.id}. Name: ${order?.customer?.name}, Phone: ${order?.customer?.phone}, Total: Rs.${order?.total}`}
          target="_blank" rel="noopener noreferrer"
          style={{display:"block",background:"#25D366",color:"#fff",padding:"12px",borderRadius:10,fontWeight:700,fontSize:13,textDecoration:"none",marginBottom:8}}>
          💬 Confirm on WhatsApp
        </a>
        <button onClick={onHome} style={{width:"100%",background:"#FF6B35",border:"none",color:"#fff",padding:"12px",borderRadius:10,fontSize:13,fontWeight:700,cursor:"pointer"}}>🏠 Back to Home</button>
      </div>
    </div>
  );
}

function AdminLogin({ onLogin }) {
  const [user, setUser] = useState(""); const [pass, setPass] = useState(""); const [err, setErr] = useState("");
  const login = () => { if (user===ADMIN_CREDS.name && pass===ADMIN_CREDS.password) onLogin(); else setErr("Wrong username or password!"); };
  return (
    <div style={{fontFamily:"'Segoe UI',sans-serif",minHeight:"100vh",background:"linear-gradient(135deg,#FF6B35,#E85520)",display:"flex",alignItems:"center",justifyContent:"center",padding:14}}>
      <div style={{background:"#fff",borderRadius:18,padding:36,maxWidth:380,width:"100%",boxShadow:"0 20px 60px rgba(0,0,0,.2)"}}>
        <div style={{textAlign:"center",marginBottom:24}}>
          <div style={{fontSize:44}}>🔒</div>
          <h2 style={{margin:"6px 0 3px",color:"#222"}}>Admin Login</h2>
          <div style={{fontSize:12,color:"#888"}}>Lifestyle Collections</div>
        </div>
        <Field label="Admin Name" val={user} onChange={setUser} placeholder="Admin name" />
        <Field label="Password" val={pass} onChange={setPass} placeholder="Password" type="password" />
        {err && <div style={{color:"#f44336",fontSize:13,marginBottom:10,background:"#ffebee",padding:"8px 12px",borderRadius:8}}>⚠️ {err}</div>}
        <button onClick={login} style={{width:"100%",background:"#FF6B35",border:"none",color:"#fff",padding:"13px",borderRadius:10,fontSize:14,fontWeight:700,cursor:"pointer"}}>Login</button>
      </div>
    </div>
  );
}

function AdminPanel({ page, go, products, orders, storeConfig, categories, saveProduct, deleteProduct, updateOrderStatus, saveStoreConfig, saveCategories, editingProduct, showToast, onLogout }) {
  const totalRevenue = orders.reduce((s,o)=>s+(o.total||0),0);
  const pendingOrders = orders.filter(o=>o.status==="Pending").length;
  return (
    <div style={{fontFamily:"'Segoe UI',sans-serif",display:"flex",minHeight:"100vh",background:"#F0F2F5"}}>
      <div style={{width:200,background:"#1A1A2E",color:"#fff",padding:"18px 0",flexShrink:0,display:"flex",flexDirection:"column"}}>
        <div style={{padding:"0 16px 16px",borderBottom:"1px solid #2d2d4e"}}>
          <div style={{fontSize:13,fontWeight:800,color:"#FF6B35"}}>Lifestyle Collections</div>
          <div style={{fontSize:10,color:"#888",marginTop:2}}>Admin Panel</div>
          <div style={{fontSize:9,color:"#4CAF50",marginTop:2}}>🟢 Firebase Connected</div>
        </div>
        <nav style={{flex:1,padding:"10px 0"}}>
          {[
            {id:"adminDash",icon:"📊",label:"Dashboard"},
            {id:"adminProds",icon:"📦",label:"Products"},
            {id:"adminOrders",icon:"📋",label:"Orders"},
            {id:"adminCats",icon:"🗂️",label:"Categories"},
            {id:"adminStore",icon:"⚙️",label:"Store Settings"},
            {id:"adminBanners",icon:"🖼️",label:"Banners"},
          ].map(item=>(
            <button key={item.id} onClick={()=>go(item.id)}
              style={{width:"100%",display:"flex",alignItems:"center",gap:10,padding:"11px 16px",background:page===item.id?"rgba(255,107,53,.2)":"transparent",border:"none",color:page===item.id?"#FF6B35":"#ccc",cursor:"pointer",fontSize:13,borderLeft:page===item.id?"3px solid #FF6B35":"3px solid transparent",textAlign:"left"}}>
              <span>{item.icon}</span> {item.label}
            </button>
          ))}
        </nav>
        <button onClick={onLogout} style={{margin:"0 12px 12px",background:"rgba(255,255,255,.1)",border:"none",color:"#ccc",padding:"9px",borderRadius:8,cursor:"pointer",fontSize:12}}>🚪 Logout</button>
      </div>
      <div style={{flex:1,padding:20,overflowY:"auto"}}>
        {page==="adminDash" && (
          <div>
            <h2 style={{margin:"0 0 18px",fontSize:20,color:"#222"}}>📊 Dashboard</h2>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(160px,1fr))",gap:14,marginBottom:20}}>
              {[{icon:"📦",label:"Total Products",val:products.length,color:"#FF6B35"},{icon:"📋",label:"Total Orders",val:orders.length,color:"#2196F3"},{icon:"⏳",label:"Pending Orders",val:pendingOrders,color:"#FF9800"},{icon:"💰",label:"Total Revenue",val:formatPrice(totalRevenue),color:"#4CAF50"}].map(s=>(
                <div key={s.label} style={{background:"#fff",borderRadius:12,padding:18,boxShadow:"0 2px 8px rgba(0,0,0,.06)"}}>
                  <div style={{fontSize:28,marginBottom:6}}>{s.icon}</div>
                  <div style={{fontSize:20,fontWeight:800,color:s.color}}>{s.val}</div>
                  <div style={{fontSize:11,color:"#888",marginTop:3}}>{s.label}</div>
                </div>
              ))}
            </div>
            <div style={{background:"#fff",borderRadius:12,padding:18}}>
              <h3 style={{margin:"0 0 12px",fontSize:15}}>⚡ Quick Actions</h3>
              <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
                <button onClick={()=>go("adminAddProd",{editProduct:null})} style={{background:"#FF6B35",border:"none",color:"#fff",padding:"11px 18px",borderRadius:10,cursor:"pointer",fontWeight:600,fontSize:13}}>+ New Product</button>
                <button onClick={()=>go("adminOrders")} style={{background:"#2196F3",border:"none",color:"#fff",padding:"11px 18px",borderRadius:10,cursor:"pointer",fontWeight:600,fontSize:13}}>📋 Orders</button>
                <button onClick={()=>go("adminCats")} style={{background:"#4CAF50",border:"none",color:"#fff",padding:"11px 18px",borderRadius:10,cursor:"pointer",fontWeight:600,fontSize:13}}>🗂️ Categories</button>
                <button onClick={()=>go("adminStore")} style={{background:"#9C27B0",border:"none",color:"#fff",padding:"11px 18px",borderRadius:10,cursor:"pointer",fontWeight:600,fontSize:13}}>⚙️ Settings</button>
              </div>
            </div>
          </div>
        )}
        {page==="adminProds" && (
          <div>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:18}}>
              <h2 style={{margin:0,fontSize:20,color:"#222"}}>📦 Products ({products.length})</h2>
              <button onClick={()=>go("adminAddProd",{editProduct:null})} style={{background:"#FF6B35",border:"none",color:"#fff",padding:"9px 18px",borderRadius:10,cursor:"pointer",fontWeight:600,fontSize:13}}>+ New Product</button>
            </div>
            <div style={{background:"#fff",borderRadius:12,overflow:"hidden"}}>
              <div style={{display:"grid",gridTemplateColumns:"54px 1fr 90px 90px 90px 110px",padding:"10px 14px",fontWeight:600,fontSize:11,color:"#555",background:"#F5F5F5"}}>
                <span>Img</span><span>Product</span><span>Category</span><span>Price</span><span>Sold</span><span>Actions</span>
              </div>
              {products.map((p,idx)=>(
                <div key={p.fbKey||p.id} style={{display:"grid",gridTemplateColumns:"54px 1fr 90px 90px 90px 110px",padding:"10px 14px",borderBottom:"1px solid #f5f5f5",alignItems:"center",background:idx%2===0?"#fff":"#fafafa"}}>
                  <div style={{width:40,height:40,background:"#FFF5F0",borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22}}>
                    {p.image&&p.image.startsWith("data:")? <img src={p.image} alt="" style={{width:34,height:34,objectFit:"contain"}} /> : p.image}
                  </div>
                  <div>
                    <div style={{fontSize:12,fontWeight:600,color:"#222",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{p.name}</div>
                    {p.badge && <span style={{background:"#FFF5F0",color:"#FF6B35",padding:"1px 5px",borderRadius:4,fontSize:9,fontWeight:700}}>{p.badge}</span>}
                  </div>
                  <div style={{fontSize:11,color:"#555",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{p.category}</div>
                  <div style={{fontSize:12,fontWeight:700,color:"#FF6B35"}}>{formatPrice(p.price)}</div>
                  <div style={{fontSize:11,color:"#888"}}>{p.sold||0}</div>
                  <div style={{display:"flex",gap:4}}>
                    <button onClick={()=>go("adminAddProd",{editProduct:p})} style={{background:"#E3F2FD",border:"none",color:"#1565C0",padding:"4px 8px",borderRadius:6,cursor:"pointer",fontSize:11,fontWeight:600}}>Edit</button>
                    <button onClick={async()=>{if(window.confirm(`Delete "${p.name}"?`)){await deleteProduct(p.fbKey);showToast("Deleted!");}}} style={{background:"#FFEBEE",border:"none",color:"#C62828",padding:"4px 8px",borderRadius:6,cursor:"pointer",fontSize:11,fontWeight:600}}>Del</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        {page==="adminAddProd" && (
          <AddProductForm editingProduct={editingProduct} showToast={showToast} categories={categories}
            onSave={async (productData, fbKey) => { await saveProduct(productData, fbKey); showToast(fbKey ? "✅ Updated!" : "✅ Added!"); go("adminProds"); }}
            onDone={()=>go("adminProds")} />
        )}
        {page==="adminOrders" && (
          <div>
            <h2 style={{margin:"0 0 18px",fontSize:20,color:"#222"}}>📋 Orders ({orders.length})</h2>
            {orders.length===0 ? (
              <div style={{background:"#fff",borderRadius:12,padding:40,textAlign:"center",color:"#aaa"}}><div style={{fontSize:46}}>📭</div><p>No orders yet</p></div>
            ) : orders.map(order=>(
              <div key={order.fbKey||order.id} style={{background:"#fff",borderRadius:12,padding:18,marginBottom:12,boxShadow:"0 2px 8px rgba(0,0,0,.06)"}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"start",marginBottom:12,flexWrap:"wrap",gap:8}}>
                  <div><div style={{fontSize:14,fontWeight:700,color:"#222"}}>#{order.id}</div><div style={{fontSize:11,color:"#888"}}>{order.date}</div></div>
                  <div style={{textAlign:"right"}}>
                    <div style={{fontSize:17,fontWeight:800,color:"#FF6B35"}}>{formatPrice(order.total)}</div>
                    <select value={order.status} onChange={async e=>{await updateOrderStatus(order.fbKey,e.target.value);showToast("Status updated!");}}
                      style={{fontSize:12,padding:"4px 7px",borderRadius:6,border:"1px solid #e0e0e0",cursor:"pointer"}}>
                      {["Pending","Confirmed","Shipped","Delivered","Cancelled"].map(s=><option key={s}>{s}</option>)}
                    </select>
                  </div>
                </div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,fontSize:12}}>
                  <div style={{background:"#F5F5F5",borderRadius:8,padding:10}}>
                    <div style={{fontWeight:600,marginBottom:5,color:"#555"}}>👤 Customer</div>
                    <div style={{color:"#555",lineHeight:1.9}}><b>Name:</b> {order.customer?.name}<br/><b>Phone:</b> {order.customer?.phone}<br/><b>Address:</b> {order.customer?.house}, {order.customer?.area}, {order.customer?.city}</div>
                  </div>
                  <div style={{background:"#F5F5F5",borderRadius:8,padding:10}}>
                    <div style={{fontWeight:600,marginBottom:5,color:"#555"}}>💳 Payment</div>
                    <div style={{color:"#555",lineHeight:1.9}}><b>Method:</b> {order.customer?.payMethod==="COD"?"Cash on Delivery":order.customer?.payMethod==="jazz"?"JazzCash":"EasyPaisa"}<br/>{order.customer?.transId && <><b>Trans ID:</b> {order.customer.transId}<br/></>}<b>Total:</b> <span style={{color:"#FF6B35",fontWeight:700}}>{formatPrice(order.total)}</span></div>
                  </div>
                </div>
                <div style={{marginTop:10}}>
                  <div style={{fontWeight:600,fontSize:12,color:"#555",marginBottom:6}}>📦 Items:</div>
                  <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
                    {order.items?.map((item,i)=>(<div key={i} style={{background:"#FFF5F0",padding:"5px 10px",borderRadius:7,fontSize:11,color:"#555"}}>{item.name} ×{item.qty} = {formatPrice(item.price*item.qty)}</div>))}
                  </div>
                </div>
                <a href={`https://wa.me/${order.customer?.phone?.replace(/[^0-9]/g,"")}?text=Assalam o Alaikum ${order.customer?.name}! Your order #${order.id} is ${order.status}. Lifestyle Collections`}
                  target="_blank" rel="noopener noreferrer"
                  style={{display:"inline-flex",alignItems:"center",gap:5,background:"#25D366",color:"#fff",padding:"7px 12px",borderRadius:7,fontSize:11,fontWeight:600,textDecoration:"none",marginTop:8}}>
                  💬 WhatsApp Customer
                </a>
              </div>
            ))}
          </div>
        )}
        {page==="adminCats" && <CategoriesManager categories={categories} saveCategories={saveCategories} showToast={showToast} products={products} />}
        {page==="adminStore" && <StoreSettings storeConfig={storeConfig} saveStoreConfig={saveStoreConfig} showToast={showToast} />}
        {page==="adminBanners" && <BannerManager storeConfig={storeConfig} saveStoreConfig={saveStoreConfig} showToast={showToast} />}
      </div>
    </div>
  );
}

function CategoriesManager({ categories, saveCategories, showToast, products }) {
  const [cats, setCats] = useState(categories);
  const [saving, setSaving] = useState(false);
  const [editIdx, setEditIdx] = useState(null);
  const [editName, setEditName] = useState("");
  const [editIcon, setEditIcon] = useState("");
  const [editColor, setEditColor] = useState("");

  const startEdit = (idx) => { setEditIdx(idx); setEditName(cats[idx].name); setEditIcon(cats[idx].icon); setEditColor(cats[idx].color); };
  const saveEdit = () => {
    if (!editName.trim()) { showToast("⚠️ Name khali nahi ho sakta!"); return; }
    setCats(prev => prev.map((c,i) => i===editIdx ? {...c, name: editName.trim(), icon: editIcon, color: editColor} : c));
    setEditIdx(null);
  };
  const saveAll = async () => { setSaving(true); await saveCategories(cats); showToast("✅ Categories save ho gayi!"); setSaving(false); };
  const addCategory = () => { setCats(prev => [...prev, { name: "New Category", icon: "📦", color: "#FF6B35" }]); setEditIdx(cats.length); setEditName("New Category"); setEditIcon("📦"); setEditColor("#FF6B35"); };
  const deleteCategory = (idx) => {
    if (cats.length <= 1) { showToast("⚠️ Kam se kam 1 category zaroor honi chahiye!"); return; }
    if (window.confirm(`"${cats[idx].name}" delete karein?`)) { setCats(prev => prev.filter((_,i) => i!==idx)); setEditIdx(null); }
  };
  const colorOptions = ["#2196F3","#E91E8C","#FF6B35","#4CAF50","#9C27B0","#FF9800","#F44336","#795548","#009688","#607D8B","#E91E63","#00BCD4"];

  return (
    <div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:18}}>
        <h2 style={{margin:0,fontSize:20,color:"#222"}}>🗂️ Categories Manager</h2>
        <div style={{display:"flex",gap:8}}>
          <button onClick={addCategory} style={{background:"#4CAF50",border:"none",color:"#fff",padding:"9px 16px",borderRadius:10,cursor:"pointer",fontWeight:600,fontSize:13}}>+ Add</button>
          <button onClick={saveAll} disabled={saving} style={{background:saving?"#aaa":"#FF6B35",border:"none",color:"#fff",padding:"9px 16px",borderRadius:10,cursor:saving?"not-allowed":"pointer",fontWeight:600,fontSize:13}}>
            {saving?"⏳ Saving...":"💾 Save All"}
          </button>
        </div>
      </div>
      <div style={{display:"grid",gap:12}}>
        {cats.map((cat, idx) => (
          <div key={idx} style={{background:"#fff",borderRadius:12,overflow:"hidden",boxShadow:"0 2px 8px rgba(0,0,0,.06)"}}>
            <div style={{display:"flex",alignItems:"center",gap:12,padding:"14px 18px"}}>
              <div style={{width:48,height:48,borderRadius:12,background:`${cat.color}22`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:26,flexShrink:0}}>{cat.icon}</div>
              <div style={{flex:1}}>
                <div style={{fontSize:15,fontWeight:700,color:"#222"}}>{cat.name}</div>
                <div style={{fontSize:11,color:"#888",marginTop:2}}>{products.filter(p=>p.category===cat.name).length} products</div>
              </div>
              <div style={{display:"flex",gap:6}}>
                <button onClick={()=>startEdit(idx)} style={{background:"#E3F2FD",border:"none",color:"#1565C0",padding:"6px 14px",borderRadius:8,cursor:"pointer",fontSize:12,fontWeight:600}}>✏️ Edit</button>
                <button onClick={()=>deleteCategory(idx)} style={{background:"#FFEBEE",border:"none",color:"#C62828",padding:"6px 14px",borderRadius:8,cursor:"pointer",fontSize:12,fontWeight:600}}>🗑️ Del</button>
              </div>
            </div>
            {editIdx===idx && (
              <div style={{background:"#FFF5F0",borderRadius:"0 0 12px 12px",padding:"16px 18px",borderTop:"2px solid #FF6B35"}}>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:12}}>
                  <div>
                    <label style={{fontSize:12,fontWeight:600,color:"#555",marginBottom:4,display:"block"}}>Category Name</label>
                    <input value={editName} onChange={e=>setEditName(e.target.value)}
                      style={{width:"100%",padding:"9px 12px",border:"2px solid #FF6B35",borderRadius:8,fontSize:14,outline:"none",fontWeight:600}} />
                  </div>
                  <div>
                    <label style={{fontSize:12,fontWeight:600,color:"#555",marginBottom:4,display:"block"}}>Icon (Emoji)</label>
                    <input value={editIcon} onChange={e=>setEditIcon(e.target.value)}
                      style={{width:"100%",padding:"9px 12px",border:"1px solid #e0e0e0",borderRadius:8,fontSize:22,outline:"none",textAlign:"center"}} />
                  </div>
                </div>
                <div style={{marginBottom:12}}>
                  <label style={{fontSize:12,fontWeight:600,color:"#555",marginBottom:6,display:"block"}}>Color</label>
                  <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                    {colorOptions.map(c=>(
                      <div key={c} onClick={()=>setEditColor(c)} style={{width:32,height:32,borderRadius:8,background:c,cursor:"pointer",border:editColor===c?"3px solid #222":"2px solid transparent",transition:"all .2s"}} />
                    ))}
                  </div>
                </div>
                <div style={{display:"flex",gap:8}}>
                  <button onClick={saveEdit} style={{flex:1,background:"#FF6B35",border:"none",color:"#fff",padding:"10px",borderRadius:8,cursor:"pointer",fontWeight:700,fontSize:13}}>✅ Save Changes</button>
                  <button onClick={()=>setEditIdx(null)} style={{background:"#f5f5f5",border:"none",color:"#555",padding:"10px 16px",borderRadius:8,cursor:"pointer",fontWeight:600,fontSize:13}}>Cancel</button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      <div style={{background:"#E8F5E9",borderRadius:12,padding:14,marginTop:16,fontSize:13,color:"#2E7D32"}}>
        ℹ️ <strong>Note:</strong> Changes ke baad "Save All" zaroor dabayein — Firebase pe save ho jayega!
      </div>
    </div>
  );
}

function AddProductForm({ editingProduct, showToast, onSave, onDone, categories }) {
  const isEdit = !!editingProduct;
  const [form, setForm] = useState({
    name: editingProduct?.name||"", category: editingProduct?.category||categories[0]?.name||"",
    price: editingProduct?.price||"", oldPrice: editingProduct?.oldPrice||"",
    desc: editingProduct?.desc||"", badge: editingProduct?.badge||"",
    image: editingProduct?.image||"", rating: editingProduct?.rating||4.5, sold: editingProduct?.sold||0,
  });
  const [errors, setErrors] = useState({});
  const [imgPreview, setImgPreview] = useState(editingProduct?.image||"");
  const [saving, setSaving] = useState(false);
  const fileRef = useRef();
  const set = (k,v) => setForm(f=>({...f,[k]:v}));
  const handleImg = (e) => {
    const file = e.target.files[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => { set("image", ev.target.result); setImgPreview(ev.target.result); };
    reader.readAsDataURL(file);
  };
  const submit = async () => {
    const e = {};
    if (!form.name.trim()) e.name = "Enter product name";
    if (!form.price || isNaN(form.price)) e.price = "Enter valid price";
    if (!form.oldPrice || isNaN(form.oldPrice)) e.oldPrice = "Enter old price";
    setErrors(e); if (Object.keys(e).length > 0) return;
    setSaving(true);
    const catObj = categories.find(c=>c.name===form.category);
    const productData = { ...form, id: editingProduct?.id||Date.now(), price: Number(form.price), oldPrice: Number(form.oldPrice), rating: Number(form.rating), sold: Number(form.sold)||0, image: form.image||(catObj?.icon||"📦") };
    await onSave(productData, editingProduct?.fbKey||null);
    setSaving(false);
  };
  return (
    <div>
      <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:18}}>
        <button onClick={onDone} style={{background:"none",border:"none",color:"#FF6B35",cursor:"pointer",fontSize:13}}>← Back</button>
        <h2 style={{margin:0,fontSize:20,color:"#222"}}>{isEdit?"✏️ Edit Product":"➕ Add New Product"}</h2>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 300px",gap:18,alignItems:"start"}}>
        <div style={{background:"#fff",borderRadius:12,padding:20}}>
          <div style={{marginBottom:18}}>
            <label style={{fontSize:13,fontWeight:700,color:"#333",marginBottom:8,display:"block"}}>📷 Product Image</label>
            <div style={{border:"2px dashed #FF6B35",borderRadius:12,padding:20,textAlign:"center",cursor:"pointer",background:"#FFF5F0"}} onClick={()=>fileRef.current.click()}>
              {imgPreview ? (imgPreview.startsWith("data:") ? <img src={imgPreview} alt="preview" style={{width:130,height:130,objectFit:"contain",borderRadius:8}} /> : <div style={{fontSize:72}}>{imgPreview}</div>) : (
                <div><div style={{fontSize:42,marginBottom:6}}>📸</div><div style={{color:"#FF6B35",fontWeight:600,fontSize:13}}>Click to upload</div></div>
              )}
              <input ref={fileRef} type="file" accept="image/*" onChange={handleImg} style={{display:"none"}} />
            </div>
            {imgPreview && <button onClick={()=>{setImgPreview("");set("image","");}} style={{marginTop:7,background:"#FFEBEE",border:"none",color:"#C62828",padding:"5px 12px",borderRadius:7,cursor:"pointer",fontSize:11}}>🗑️ Remove</button>}
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
            <div style={{gridColumn:"1/-1"}}>
              <label style={{fontSize:12,fontWeight:600,color:"#555",marginBottom:3,display:"block"}}>Product Name *</label>
              <input value={form.name} onChange={e=>set("name",e.target.value)} placeholder="Product ka naam"
                style={{width:"100%",padding:"10px 12px",border:`1px solid ${errors.name?"#f44336":"#e0e0e0"}`,borderRadius:9,fontSize:13,outline:"none"}} />
              {errors.name && <div style={{fontSize:11,color:"#f44336",marginTop:2}}>⚠️ {errors.name}</div>}
            </div>
            <div>
              <label style={{fontSize:12,fontWeight:600,color:"#555",marginBottom:3,display:"block"}}>Category</label>
              <select value={form.category} onChange={e=>set("category",e.target.value)} style={{width:"100%",padding:"10px 12px",border:"1px solid #e0e0e0",borderRadius:9,fontSize:13,outline:"none",background:"#fff"}}>
                {categories.map(c=><option key={c.name}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label style={{fontSize:12,fontWeight:600,color:"#555",marginBottom:3,display:"block"}}>Badge</label>
              <select value={form.badge} onChange={e=>set("badge",e.target.value)} style={{width:"100%",padding:"10px 12px",border:"1px solid #e0e0e0",borderRadius:9,fontSize:13,outline:"none",background:"#fff"}}>
                <option value="">None</option><option>HOT</option><option>NEW</option><option>SALE</option>
              </select>
            </div>
            <div>
              <label style={{fontSize:12,fontWeight:600,color:"#555",marginBottom:3,display:"block"}}>Sale Price (Rs.) *</label>
              <input value={form.price} onChange={e=>set("price",e.target.value)} placeholder="2500" type="number"
                style={{width:"100%",padding:"10px 12px",border:`1px solid ${errors.price?"#f44336":"#e0e0e0"}`,borderRadius:9,fontSize:13,outline:"none"}} />
              {errors.price && <div style={{fontSize:11,color:"#f44336",marginTop:2}}>⚠️ {errors.price}</div>}
            </div>
            <div>
              <label style={{fontSize:12,fontWeight:600,color:"#555",marginBottom:3,display:"block"}}>Original Price (Rs.) *</label>
              <input value={form.oldPrice} onChange={e=>set("oldPrice",e.target.value)} placeholder="3500" type="number"
                style={{width:"100%",padding:"10px 12px",border:`1px solid ${errors.oldPrice?"#f44336":"#e0e0e0"}`,borderRadius:9,fontSize:13,outline:"none"}} />
              {errors.oldPrice && <div style={{fontSize:11,color:"#f44336",marginTop:2}}>⚠️ {errors.oldPrice}</div>}
            </div>
            <div>
              <label style={{fontSize:12,fontWeight:600,color:"#555",marginBottom:3,display:"block"}}>Rating (1-5)</label>
              <input value={form.rating} onChange={e=>set("rating",e.target.value)} type="number" min="1" max="5" step="0.1"
                style={{width:"100%",padding:"10px 12px",border:"1px solid #e0e0e0",borderRadius:9,fontSize:13,outline:"none"}} />
            </div>
            <div style={{gridColumn:"1/-1"}}>
              <label style={{fontSize:12,fontWeight:600,color:"#555",marginBottom:3,display:"block"}}>Description</label>
              <textarea value={form.desc} onChange={e=>set("desc",e.target.value)} rows={3} placeholder="Product ki description..."
                style={{width:"100%",padding:"10px 12px",border:"1px solid #e0e0e0",borderRadius:9,fontSize:13,outline:"none",resize:"vertical"}} />
            </div>
          </div>
          <button onClick={submit} disabled={saving} style={{width:"100%",background:saving?"#aaa":"#FF6B35",border:"none",color:"#fff",padding:"13px",borderRadius:10,fontSize:15,fontWeight:700,cursor:saving?"not-allowed":"pointer",marginTop:14}}>
            {saving ? "⏳ Saving..." : isEdit ? "✅ Update Product" : "✅ Upload Product"}
          </button>
        </div>
        <div style={{background:"#fff",borderRadius:12,padding:18,position:"sticky",top:18}}>
          <div style={{fontWeight:700,marginBottom:12,fontSize:13,color:"#555"}}>👁️ Preview</div>
          <div style={{border:"1px solid #f0f0f0",borderRadius:12,overflow:"hidden"}}>
            <div style={{background:"#FFF5F0",padding:"20px",textAlign:"center",fontSize:58,minHeight:110,display:"flex",alignItems:"center",justifyContent:"center"}}>
              {imgPreview ? (imgPreview.startsWith("data:") ? <img src={imgPreview} alt="p" style={{width:85,height:85,objectFit:"contain"}} /> : <span>{imgPreview}</span>) : <span style={{color:"#ccc",fontSize:30}}>📦</span>}
            </div>
            <div style={{padding:10}}>
              <div style={{fontSize:12,fontWeight:600,color:"#222",marginBottom:3}}>{form.name||"Product Name"}</div>
              <div style={{fontSize:11,color:"#999",marginBottom:5}}>{form.category}</div>
              {form.price && form.oldPrice && (
                <div style={{display:"flex",alignItems:"center",gap:6}}>
                  <span style={{fontSize:14,fontWeight:800,color:"#FF6B35"}}>{formatPrice(form.price)}</span>
                  <span style={{fontSize:10,color:"#ccc",textDecoration:"line-through"}}>{formatPrice(form.oldPrice)}</span>
                  {Number(form.oldPrice)>0 && <span style={{background:"#FF6B35",color:"#fff",fontSize:9,padding:"1px 5px",borderRadius:4}}>-{discount(form.price,form.oldPrice)}%</span>}
                </div>
              )}
              {form.badge && <span style={{display:"inline-block",marginTop:5,background:form.badge==="HOT"?"#FF6B35":form.badge==="NEW"?"#4CAF50":"#E91E8C",color:"#fff",fontSize:9,fontWeight:700,padding:"2px 7px",borderRadius:4}}>{form.badge}</span>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StoreSettings({ storeConfig, saveStoreConfig, showToast }) {
  const [form, setForm] = useState({ ...storeConfig });
  const [saving, setSaving] = useState(false);
  const set = (k,v) => setForm(f=>({...f,[k]:v}));
  const save = async () => { setSaving(true); await saveStoreConfig({ ...storeConfig, ...form }); showToast("✅ Store settings saved!"); setSaving(false); };
  return (
    <div>
      <h2 style={{margin:"0 0 18px",fontSize:20,color:"#222"}}>⚙️ Store Settings</h2>
      <div style={{background:"#fff",borderRadius:12,padding:24}}>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
          <div style={{gridColumn:"1/-1"}}><label style={{fontSize:12,fontWeight:600,color:"#555",marginBottom:4,display:"block"}}>Store Name</label><input value={form.name||""} onChange={e=>set("name",e.target.value)} style={{width:"100%",padding:"10px 12px",border:"1px solid #e0e0e0",borderRadius:9,fontSize:14,outline:"none"}} /></div>
          <div style={{gridColumn:"1/-1"}}><label style={{fontSize:12,fontWeight:600,color:"#555",marginBottom:4,display:"block"}}>Tagline</label><input value={form.tagline||""} onChange={e=>set("tagline",e.target.value)} style={{width:"100%",padding:"10px 12px",border:"1px solid #e0e0e0",borderRadius:9,fontSize:14,outline:"none"}} /></div>
          <div><label style={{fontSize:12,fontWeight:600,color:"#555",marginBottom:4,display:"block"}}>Display Phone</label><input value={form.displayPhone||""} onChange={e=>set("displayPhone",e.target.value)} style={{width:"100%",padding:"10px 12px",border:"1px solid #e0e0e0",borderRadius:9,fontSize:14,outline:"none"}} /></div>
          <div><label style={{fontSize:12,fontWeight:600,color:"#555",marginBottom:4,display:"block"}}>WhatsApp (no +)</label><input value={form.whatsapp||""} onChange={e=>set("whatsapp",e.target.value)} style={{width:"100%",padding:"10px 12px",border:"1px solid #e0e0e0",borderRadius:9,fontSize:14,outline:"none"}} /></div>
          <div><label style={{fontSize:12,fontWeight:600,color:"#555",marginBottom:4,display:"block"}}>JazzCash Number</label><input value={form.jazz||""} onChange={e=>set("jazz",e.target.value)} style={{width:"100%",padding:"10px 12px",border:"1px solid #e0e0e0",borderRadius:9,fontSize:14,outline:"none"}} /></div>
          <div><label style={{fontSize:12,fontWeight:600,color:"#555",marginBottom:4,display:"block"}}>EasyPaisa Number</label><input value={form.easypaisa||""} onChange={e=>set("easypaisa",e.target.value)} style={{width:"100%",padding:"10px 12px",border:"1px solid #e0e0e0",borderRadius:9,fontSize:14,outline:"none"}} /></div>
          <div><label style={{fontSize:12,fontWeight:600,color:"#555",marginBottom:4,display:"block"}}>Delivery Charges (Rs.)</label><input value={form.delivery||""} onChange={e=>set("delivery",Number(e.target.value))} type="number" style={{width:"100%",padding:"10px 12px",border:"1px solid #e0e0e0",borderRadius:9,fontSize:14,outline:"none"}} /></div>
          <div style={{gridColumn:"1/-1"}}><label style={{fontSize:12,fontWeight:600,color:"#555",marginBottom:4,display:"block"}}>Address</label><input value={form.address||""} onChange={e=>set("address",e.target.value)} style={{width:"100%",padding:"10px 12px",border:"1px solid #e0e0e0",borderRadius:9,fontSize:14,outline:"none"}} /></div>
        </div>
        <button onClick={save} disabled={saving} style={{marginTop:20,background:saving?"#aaa":"#FF6B35",border:"none",color:"#fff",padding:"12px 28px",borderRadius:10,fontSize:14,fontWeight:700,cursor:saving?"not-allowed":"pointer"}}>
          {saving ? "⏳ Saving..." : "💾 Save to Firebase"}
        </button>
      </div>
    </div>
  );
}

function BannerManager({ storeConfig, saveStoreConfig, showToast }) {
  const [banners, setBanners] = useState(storeConfig.banners || DEFAULT_STORE.banners);
  const [saving, setSaving] = useState(false);
  const updateBanner = (idx, key, val) => setBanners(prev => prev.map((b,i) => i===idx ? {...b,[key]:val} : b));
  const addBanner = () => setBanners(prev => [...prev, { title: "New Banner", sub: "Subtitle here", bg: "linear-gradient(135deg,#FF6B35,#F7931E)", emoji: "🛍️" }]);
  const removeBanner = (idx) => { if (banners.length <= 1) { showToast("⚠️ Kam se kam 1 banner!"); return; } setBanners(prev => prev.filter((_,i) => i!==idx)); };
  const save = async () => { setSaving(true); await saveStoreConfig({ ...storeConfig, banners }); showToast("✅ Banners saved!"); setSaving(false); };
  const bgPresets = ["linear-gradient(135deg,#FF6B35,#F7931E)","linear-gradient(135deg,#1565C0,#0097A7)","linear-gradient(135deg,#2E7D32,#66BB6A)","linear-gradient(135deg,#6A1B9A,#E91E8C)","linear-gradient(135deg,#E65100,#F57F17)","linear-gradient(135deg,#880E4F,#AD1457)"];
  return (
    <div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:18}}>
        <h2 style={{margin:0,fontSize:20,color:"#222"}}>🖼️ Banner Manager</h2>
        <div style={{display:"flex",gap:8}}>
          <button onClick={addBanner} style={{background:"#FF9800",border:"none",color:"#fff",padding:"9px 16px",borderRadius:10,cursor:"pointer",fontWeight:600,fontSize:13}}>+ Add Banner</button>
          <button onClick={save} disabled={saving} style={{background:saving?"#aaa":"#FF6B35",border:"none",color:"#fff",padding:"9px 16px",borderRadius:10,cursor:saving?"not-allowed":"pointer",fontWeight:600,fontSize:13}}>{saving?"⏳ Saving...":"💾 Save All"}</button>
        </div>
      </div>
      {banners.map((banner, idx) => (
        <div key={idx} style={{background:"#fff",borderRadius:12,padding:20,marginBottom:16,boxShadow:"0 2px 8px rgba(0,0,0,.06)"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
            <div style={{fontWeight:700,fontSize:14,color:"#222"}}>Banner #{idx+1}</div>
            <button onClick={()=>removeBanner(idx)} style={{background:"#FFEBEE",border:"none",color:"#C62828",padding:"5px 10px",borderRadius:6,cursor:"pointer",fontSize:12}}>🗑️ Delete</button>
          </div>
          <div style={{background:banner.bg,borderRadius:10,padding:"16px 20px",display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14,minHeight:80}}>
            <div><div style={{fontSize:16,fontWeight:900,color:"#fff"}}>{banner.title}</div><div style={{fontSize:12,color:"rgba(255,255,255,.9)"}}>{banner.sub}</div></div>
            <div style={{fontSize:40}}>{banner.emoji}</div>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
            <div><label style={{fontSize:11,fontWeight:600,color:"#555",marginBottom:3,display:"block"}}>Title</label><input value={banner.title} onChange={e=>updateBanner(idx,"title",e.target.value)} style={{width:"100%",padding:"8px 10px",border:"1px solid #e0e0e0",borderRadius:8,fontSize:13,outline:"none"}} /></div>
            <div><label style={{fontSize:11,fontWeight:600,color:"#555",marginBottom:3,display:"block"}}>Emoji</label><input value={banner.emoji} onChange={e=>updateBanner(idx,"emoji",e.target.value)} style={{width:"100%",padding:"8px 10px",border:"1px solid #e0e0e0",borderRadius:8,fontSize:20,outline:"none"}} /></div>
            <div style={{gridColumn:"1/-1"}}><label style={{fontSize:11,fontWeight:600,color:"#555",marginBottom:3,display:"block"}}>Subtitle</label><input value={banner.sub} onChange={e=>updateBanner(idx,"sub",e.target.value)} style={{width:"100%",padding:"8px 10px",border:"1px solid #e0e0e0",borderRadius:8,fontSize:13,outline:"none"}} /></div>
            <div style={{gridColumn:"1/-1"}}>
              <label style={{fontSize:11,fontWeight:600,color:"#555",marginBottom:6,display:"block"}}>Background Color:</label>
              <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:8}}>
                {bgPresets.map((bg,bi)=>(<div key={bi} onClick={()=>updateBanner(idx,"bg",bg)} style={{width:40,height:30,borderRadius:6,background:bg,cursor:"pointer",border:banner.bg===bg?"3px solid #222":"2px solid transparent"}} />))}
              </div>
              <input value={banner.bg} onChange={e=>updateBanner(idx,"bg",e.target.value)} style={{width:"100%",padding:"8px 10px",border:"1px solid #e0e0e0",borderRadius:8,fontSize:12,outline:"none",fontFamily:"monospace"}} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
5f5f5",border:"none",color:"#555",padding:"12px",borderRadius:10,cursor:"pointer",fontWeight:600}}>← Back</button>
              <button onClick={()=>{const e={};if(!form.name.trim())e.name="Required";if(!form.phone.trim())e.phone="Required";if(!form.house.trim())e.house="Required";if(!form.area.trim())e.area="Required";if(!form.city.trim())e.city="Required";setErrors(e);if(Object.keys(e).length===0)setStep(3);}}
                style={{flex:2,background:"#FF6B35",border:"none",color:"#fff",padding:"12px",borderRadius:10,fontSize:14,fontWeight:700,cursor:"pointer"}}>Payment →</button>
            </div>
          </div>
        )}
        {step===3 && (
          <div style={{background:"#fff",borderRadius:12,padding:16}}>
            <h3 style={{margin:"0 0 14px",fontSize:16}}>💳 Payment Method</h3>
            {[{v:"COD",icon:"💵",label:"Cash on Delivery",desc:"Pay when delivered"},{v:"jazz",icon:"📱",label:"JazzCash",desc:`Transfer to: ${STORE.jazz}`},{v:"easypaisa",icon:"💜",label:"EasyPaisa",desc:`Transfer to: ${STORE.easypaisa}`}].map(pm=>(
              <div key={pm.v} onClick={()=>set("payMethod",pm.v)}
                style={{display:"flex",alignItems:"center",gap:12,padding:12,borderRadius:12,border:`2px solid ${form.payMethod===pm.v?"#FF6B35":"#e0e0e0"}`,marginBottom:8,cursor:"pointer",background:form.payMethod===pm.v?"#FFF5F0":"#fff"}}>
                <span style={{fontSize:26}}>{pm.icon}</span>
                <div style={{flex:1}}>
                  <div style={{fontWeight:600,color:"#222",fontSize:14}}>{pm.label}</div>
                  <div style={{fontSize:12,color:"#888"}}>{pm.desc}</div>
                </div>
                <div style={{width:18,height:18,borderRadius:"50%",border:`2px solid ${form.payMethod===pm.v?"#FF6B35":"#ccc"}`,background:form.payMethod===pm.v?"#FF6B35":"transparent",display:"flex",alignItems:"center",justifyContent:"center"}}>
                  {form.payMethod===pm.v && <div style={{width:7,height:7,background:"#fff",borderRadius:"50%"}} />}
                </div>
              </div>
            ))}
            {form.payMethod!=="COD" && (
              <div style={{background:"#FFF5F0",borderRadius:10,padding:14,marginTop:4}}>
                <div style={{fontWeight:600,marginBottom:6,fontSize:13}}>📲 Payment Instructions:</div>
                <div style={{fontSize:12,color:"#555",lineHeight:1.8}}>
                  1. Transfer <strong>Rs. {total.toLocaleString()}</strong> to {form.payMethod==="jazz"?STORE.jazz:STORE.easypaisa}<br/>
                  2. Enter Transaction ID below<br/>
                  3. Send screenshot to WhatsApp: <a href={`https://wa.me/${STORE.whatsapp}`} style={{color:"#25D366"}}>{STORE.displayPhone}</a>
                </div>
                <Field label="Transaction ID *" val={form.transId} onChange={v=>set("transId",v)} err={errors.transId} placeholder="Enter Transaction ID" />
                <div style={{marginTop:8}}>
                  <label style={{fontSize:12,fontWeight:600,color:"#555",marginBottom:5,display:"block"}}>Upload Screenshot (optional)</label>
                  <input ref={fileRef} type="file" accept="image/*" onChange={e=>{const f=e.target.files[0];if(f){const r=new FileReader();r.onload=ev=>set("screenshot",ev.target.result);r.readAsDataURL(f);}}} style={{fontSize:12,color:"#555"}} />
                  {form.screenshot && <img src={form.screenshot} alt="receipt" style={{width:110,height:90,objectFit:"cover",borderRadius:8,marginTop:6,border:"1px solid #e0e0e0"}} />}
                </div>
              </div>
            )}
            <div style={{display:"flex",gap:8,marginTop:14}}>
              <button onClick={()=>setStep(2)} style={{flex:1,background:"#f5f5f5",border:"none",color:"#555",padding:"12px",borderRadius:10,cursor:"pointer",fontWeight:600}}>← Back</button>
              <button onClick={placeOrder} disabled={placing} style={{flex:2,background:placing?"#aaa":"#FF6B35",border:"none",color:"#fff",padding:"12px",borderRadius:10,fontSize:14,fontWeight:700,cursor:placing?"not-allowed":"pointer"}}>
                {placing ? "⏳ Placing Order..." : "✅ Place Order"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Field({ label, val, onChange, err, placeholder, type="text" }) {
  return (
    <div style={{marginBottom:10}}>
      <label style={{fontSize:12,fontWeight:600,color:"#555",marginBottom:3,display:"block"}}>{label}</label>
      <input value={val} type={type} onChange={e=>onChange(e.target.value)} placeholder={placeholder}
        style={{width:"100%",padding:"9px 11px",border:`1px solid ${err?"#f44336":"#e0e0e0"}`,borderRadius:8,fontSize:13,outline:"none",background:"#fafafa"}} />
      {err && <div style={{fontSize:11,color:"#f44336",marginTop:2}}>⚠️ {err}</div>}
    </div>
  );
}

function SuccessPage({ order, STORE, onHome }) {
  return (
    <div style={{fontFamily:"'Segoe UI',sans-serif",minHeight:"100vh",background:"#F5F5F5",display:"flex",alignItems:"center",justifyContent:"center",padding:14}}>
      <div style={{background:"#fff",borderRadius:18,padding:32,maxWidth:480,width:"100%",textAlign:"center",boxShadow:"0 8px 40px rgba(0,0,0,.1)"}}>
        <div style={{fontSize:64,marginBottom:14}}>🎉</div>
        <h2 style={{color:"#4CAF50",margin:"0 0 6px",fontSize:22}}>Order Placed Successfully!</h2>
        <div style={{fontSize:13,color:"#888",marginBottom:18}}>Order ID: <strong style={{color:"#FF6B35"}}>{order?.id}</strong></div>
        <div style={{background:"#F5F5F5",borderRadius:10,padding:14,textAlign:"left",marginBottom:18}}>
          <div style={{fontSize:13,color:"#555",lineHeight:2}}>
            <b>Customer:</b> {order?.customer?.name}<br/>
            <b>Phone:</b> {order?.customer?.phone}<br/>
            <b>City:</b> {order?.customer?.city}<br/>
            <b>Payment:</b> {order?.customer?.payMethod==="COD"?"Cash on Delivery":order?.customer?.payMethod==="jazz"?"JazzCash":"EasyPaisa"}<br/>
            <b>Total:</b> <span style={{color:"#FF6B35",fontWeight:700}}>{formatPrice(order?.total)}</span>
          </div>
        </div>
        {order?.customer?.payMethod!=="COD" && (
          <div style={{background:"#FFF5F0",borderRadius:10,padding:10,marginBottom:14,fontSize:12,color:"#555"}}>
            ⚠️ Please send payment screenshot to WhatsApp:<br/>
            <a href={`https://wa.me/${STORE.whatsapp}`} style={{color:"#25D366",fontWeight:700}}>{STORE.displayPhone}</a>
          </div>
        )}
        <a href={`https://wa.me/${STORE.whatsapp}?text=Order ID: ${order?.id}. Name: ${order?.customer?.name}, Phone: ${order?.customer?.phone}, Total: Rs.${order?.total}`}
          target="_blank" rel="noopener noreferrer"
          style={{display:"block",background:"#25D366",color:"#fff",padding:"12px",borderRadius:10,fontWeight:700,fontSize:13,textDecoration:"none",marginBottom:8}}>
          💬 Confirm on WhatsApp
        </a>
        <button onClick={onHome} style={{width:"100%",background:"#FF6B35",border:"none",color:"#fff",padding:"12px",borderRadius:10,fontSize:13,fontWeight:700,cursor:"pointer"}}>
          🏠 Back to Home
        </button>
      </div>
    </div>
  );
}

function AdminLogin({ onLogin }) {
  const [user, setUser] = useState(""); const [pass, setPass] = useState(""); const [err, setErr] = useState("");
  const login = () => {
    if (user===ADMIN_CREDS.name && pass===ADMIN_CREDS.password) onLogin();
    else setErr("Wrong username or password!");
  };
  return (
    <div style={{fontFamily:"'Segoe UI',sans-serif",minHeight:"100vh",background:"linear-gradient(135deg,#FF6B35,#E85520)",display:"flex",alignItems:"center",justifyContent:"center",padding:14}}>
      <div style={{background:"#fff",borderRadius:18,padding:36,maxWidth:380,width:"100%",boxShadow:"0 20px 60px rgba(0,0,0,.2)"}}>
        <div style={{textAlign:"center",marginBottom:24}}>
          <div style={{fontSize:44}}>🔒</div>
          <h2 style={{margin:"6px 0 3px",color:"#222"}}>Admin Login</h2>
          <div style={{fontSize:12,color:"#888"}}>Lifestyle Collections</div>
        </div>
        <Field label="Admin Name" val={user} onChange={setUser} placeholder="Admin name" />
        <Field label="Password" val={pass} onChange={setPass} placeholder="Password" type="password" />
        {err && <div style={{color:"#f44336",fontSize:13,marginBottom:10,background:"#ffebee",padding:"8px 12px",borderRadius:8}}>⚠️ {err}</div>}
        <button onClick={login} style={{width:"100%",background:"#FF6B35",border:"none",color:"#fff",padding:"13px",borderRadius:10,fontSize:14,fontWeight:700,cursor:"pointer"}}>Login</button>
      </div>
    </div>
  );
}

function AdminPanel({ page, go, products, orders, storeConfig, categories, saveProduct, deleteProduct, updateOrderStatus, saveStoreConfig, saveCategories, editingProduct, showToast, onLogout }) {
  const totalRevenue = orders.reduce((s,o)=>s+(o.total||0),0);
  const pendingOrders = orders.filter(o=>o.status==="Pending").length;
  return (
    <div style={{fontFamily:"'Segoe UI',sans-serif",display:"flex",minHeight:"100vh",background:"#F0F2F5"}}>
      <div style={{width:200,background:"#1A1A2E",color:"#fff",padding:"18px 0",flexShrink:0,display:"flex",flexDirection:"column"}}>
        <div style={{padding:"0 16px 16px",borderBottom:"1px solid #2d2d4e"}}>
          <div style={{fontSize:13,fontWeight:800,color:"#FF6B35"}}>Lifestyle Collections</div>
          <div style={{fontSize:10,color:"#888",marginTop:2}}>Admin Panel</div>
          <div style={{fontSize:9,color:"#4CAF50",marginTop:2}}>🟢 Firebase Connected</div>
        </div>
        <nav style={{flex:1,padding:"10px 0"}}>
          {[
            {id:"adminDash",icon:"📊",label:"Dashboard"},
            {id:"adminProds",icon:"📦",label:"Products"},
            {id:"adminOrders",icon:"📋",label:"Orders"},
            {id:"adminCats",icon:"🗂️",label:"Categories"},
            {id:"adminStore",icon:"⚙️",label:"Store Settings"},
            {id:"adminBanners",icon:"🖼️",label:"Banners"},
          ].map(item=>(
            <button key={item.id} onClick={()=>go(item.id)}
              style={{width:"100%",display:"flex",alignItems:"center",gap:10,padding:"11px 16px",background:page===item.id?"rgba(255,107,53,.2)":"transparent",border:"none",color:page===item.id?"#FF6B35":"#ccc",cursor:"pointer",fontSize:13,borderLeft:page===item.id?"3px solid #FF6B35":"3px solid transparent",textAlign:"left"}}>
              <span>{item.icon}</span> {item.label}
            </button>
          ))}
        </nav>
        <button onClick={onLogout} style={{margin:"0 12px 12px",background:"rgba(255,255,255,.1)",border:"none",color:"#ccc",padding:"9px",borderRadius:8,cursor:"pointer",fontSize:12}}>🚪 Logout</button>
      </div>
      <div style={{flex:1,padding:20,overflowY:"auto"}}>
        {page==="adminDash" && (
          <div>
            <h2 style={{margin:"0 0 18px",fontSize:20,color:"#222"}}>📊 Dashboard</h2>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(160px,1fr))",gap:14,marginBottom:20}}>
              {[{icon:"📦",label:"Total Products",val:products.length,color:"#FF6B35"},{icon:"📋",label:"Total Orders",val:orders.length,color:"#2196F3"},{icon:"⏳",label:"Pending Orders",val:pendingOrders,color:"#FF9800"},{icon:"💰",label:"Total Revenue",val:formatPrice(totalRevenue),color:"#4CAF50"}].map(s=>(
                <div key={s.label} style={{background:"#fff",borderRadius:12,padding:18,boxShadow:"0 2px 8px rgba(0,0,0,.06)"}}>
                  <div style={{fontSize:28,marginBottom:6}}>{s.icon}</div>
                  <div style={{fontSize:20,fontWeight:800,color:s.color}}>{s.val}</div>
                  <div style={{fontSize:11,color:"#888",marginTop:3}}>{s.label}</div>
                </div>
              ))}
            </div>
            <div style={{background:"#fff",borderRadius:12,padding:18}}>
              <h3 style={{margin:"0 0 12px",fontSize:15}}>⚡ Quick Actions</h3>
              <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
                <button onClick={()=>go("adminAddProd",{editProduct:null})} style={{background:"#FF6B35",border:"none",color:"#fff",padding:"11px 18px",borderRadius:10,cursor:"pointer",fontWeight:600,fontSize:13}}>+ New Product</button>
                <button onClick={()=>go("adminOrders")} style={{background:"#2196F3",border:"none",color:"#fff",padding:"11px 18px",borderRadius:10,cursor:"pointer",fontWeight:600,fontSize:13}}>📋 Orders</button>
                <button onClick={()=>go("adminCats")} style={{background:"#4CAF50",border:"none",color:"#fff",padding:"11px 18px",borderRadius:10,cursor:"pointer",fontWeight:600,fontSize:13}}>🗂️ Categories</button>
                <button onClick={()=>go("adminStore")} style={{background:"#9C27B0",border:"none",color:"#fff",padding:"11px 18px",borderRadius:10,cursor:"pointer",fontWeight:600,fontSize:13}}>⚙️ Store Settings</button>
                <button onClick={()=>go("adminBanners")} style={{background:"#FF9800",border:"none",color:"#fff",padding:"11px 18px",borderRadius:10,cursor:"pointer",fontWeight:600,fontSize:13}}>🖼️ Banners</button>
              </div>
            </div>
          </div>
        )}
        {page==="adminProds" && (
          <div>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:18}}>
              <h2 style={{margin:0,fontSize:20,color:"#222"}}>📦 Products ({products.length})</h2>
              <button onClick={()=>go("adminAddProd",{editProduct:null})} style={{background:"#FF6B35",border:"none",color:"#fff",padding:"9px 18px",borderRadius:10,cursor:"pointer",fontWeight:600,fontSize:13}}>+ New Product</button>
            </div>
            <div style={{background:"#fff",borderRadius:12,overflow:"hidden"}}>
              <div style={{display:"grid",gridTemplateColumns:"54px 1fr 90px 90px 90px 110px",padding:"10px 14px",fontWeight:600,fontSize:11,color:"#555",background:"#F5F5F5"}}>
                <span>Img</span><span>Product</span><span>Category</span><span>Price</span><span>Sold</span><span>Actions</span>
              </div>
              {products.map((p,idx)=>(
                <div key={p.fbKey||p.id} style={{display:"grid",gridTemplateColumns:"54px 1fr 90px 90px 90px 110px",padding:"10px 14px",borderBottom:"1px solid #f5f5f5",alignItems:"center",background:idx%2===0?"#fff":"#fafafa"}}>
                  <div style={{width:40,height:40,background:"#FFF5F0",borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22}}>
                    {p.image&&p.image.startsWith("data:")? <img src={p.image} alt="" style={{width:34,height:34,objectFit:"contain"}} /> : p.image}
                  </div>
                  <div>
                    <div style={{fontSize:12,fontWeight:600,color:"#222",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{p.name}</div>
                    {p.badge && <span style={{background:"#FFF5F0",color:"#FF6B35",padding:"1px 5px",borderRadius:4,fontSize:9,fontWeight:700}}>{p.badge}</span>}
                  </div>
                  <div style={{fontSize:11,color:"#555",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{p.category}</div>
                  <div style={{fontSize:12,fontWeight:700,color:"#FF6B35"}}>{formatPrice(p.price)}</div>
                  <div style={{fontSize:11,color:"#888"}}>{p.sold||0}</div>
                  <div style={{display:"flex",gap:4}}>
                    <button onClick={()=>go("adminAddProd",{editProduct:p})} style={{background:"#E3F2FD",border:"none",color:"#1565C0",padding:"4px 8px",borderRadius:6,cursor:"pointer",fontSize:11,fontWeight:600}}>Edit</button>
                    <button onClick={async()=>{if(window.confirm(`Delete "${p.name}"?`)){await deleteProduct(p.fbKey);showToast("Deleted!");}}} style={{background:"#FFEBEE",border:"none",color:"#C62828",padding:"4px 8px",borderRadius:6,cursor:"pointer",fontSize:11,fontWeight:600}}>Del</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        {page==="adminAddProd" && (
          <AddProductForm editingProduct={editingProduct} showToast={showToast} categories={categories}
            onSave={async (productData, fbKey) => { await saveProduct(productData, fbKey); showToast(fbKey ? "✅ Updated!" : "✅ Added!"); go("adminProds"); }}
            onDone={()=>go("adminProds")} />
        )}
        {page==="adminOrders" && (
          <div>
            <h2 style={{margin:"0 0 18px",fontSize:20,color:"#222"}}>📋 Orders ({orders.length})</h2>
            {orders.length===0 ? (
              <div style={{background:"#fff",borderRadius:12,padding:40,textAlign:"center",color:"#aaa"}}><div style={{fontSize:46}}>📭</div><p>No orders yet</p></div>
            ) : (
              orders.map(order=>(
                <div key={order.fbKey||order.id} style={{background:"#fff",borderRadius:12,padding:18,marginBottom:12,boxShadow:"0 2px 8px rgba(0,0,0,.06)"}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"start",marginBottom:12,flexWrap:"wrap",gap:8}}>
                    <div>
                      <div style={{fontSize:14,fontWeight:700,color:"#222"}}>#{order.id}</div>
                      <div style={{fontSize:11,color:"#888"}}>{order.date}</div>
                    </div>
                    <div style={{textAlign:"right"}}>
                      <div style={{fontSize:17,fontWeight:800,color:"#FF6B35"}}>{formatPrice(order.total)}</div>
                      <select value={order.status} onChange={async e=>{await updateOrderStatus(order.fbKey,e.target.value);showToast("Status updated!");}}
                        style={{fontSize:12,padding:"4px 7px",borderRadius:6,border:"1px solid #e0e0e0",cursor:"pointer"}}>
                        {["Pending","Confirmed","Shipped","Delivered","Cancelled"].map(s=><option key={s}>{s}</option>)}
                      </select>
                    </div>
                  </div>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,fontSize:12}}>
                    <div style={{background:"#F5F5F5",borderRadius:8,padding:10}}>
                      <div style={{fontWeight:600,marginBottom:5,color:"#555"}}>👤 Customer</div>
                      <div style={{color:"#555",lineHeight:1.9}}><b>Name:</b> {order.customer?.name}<br/><b>Phone:</b> {order.customer?.phone}<br/><b>Address:</b> {order.customer?.house}, {order.customer?.area}, {order.customer?.city}</div>
                    </div>
                    <div style={{background:"#F5F5F5",borderRadius:8,padding:10}}>
                      <div style={{fontWeight:600,marginBottom:5,color:"#555"}}>💳 Payment</div>
                      <div style={{color:"#555",lineHeight:1.9}}><b>Method:</b> {order.customer?.payMethod==="COD"?"Cash on Delivery":order.customer?.payMethod==="jazz"?"JazzCash":"EasyPaisa"}<br/>{order.customer?.transId && <><b>Trans ID:</b> {order.customer.transId}<br/></>}<b>Total:</b> <span style={{color:"#FF6B35",fontWeight:700}}>{formatPrice(order.total)}</span></div>
                    </div>
                  </div>
                  <div style={{marginTop:10}}>
                    <div style={{fontWeight:600,fontSize:12,color:"#555",marginBottom:6}}>📦 Items:</div>
                    <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
                      {order.items?.map((item,i)=>(
                        <div key={i} style={{background:"#FFF5F0",padding:"5px 10px",borderRadius:7,fontSize:11,color:"#555"}}>{item.name} ×{item.qty} = {formatPrice(item.price*item.qty)}</div>
                      ))}
                    </div>
                  </div>
                  <a href={`https://wa.me/${order.customer?.phone?.replace(/[^0-9]/g,"")}?text=Assalam o Alaikum ${order.customer?.name}! Your order #${order.id} is ${order.status}. Lifestyle Collections`}
                    target="_blank" rel="noopener noreferrer"
                    style={{display:"inline-flex",alignItems:"center",gap:5,background:"#25D366",color:"#fff",padding:"7px 12px",borderRadius:7,fontSize:11,fontWeight:600,textDecoration:"none",marginTop:8}}>
                    💬 WhatsApp Customer
                  </a>
                </div>
              ))
            )}
          </div>
        )}
        {page==="adminCats" && <CategoriesManager categories={categories} saveCategories={saveCategories} showToast={showToast} />}
        {page==="adminStore" && <StoreSettings storeConfig={storeConfig} saveStoreConfig={saveStoreConfig} showToast={showToast} />}
        {page==="adminBanners" && <BannerManager storeConfig={storeConfig} saveStoreConfig={saveStoreConfig} showToast={showToast} />}
      </div>
    </div>
  );
}

function CategoriesManager({ categories, saveCategories, showToast }) {
  const [cats, setCats] = useState(categories.map(c=>({...c})));
  const [saving, setSaving] = useState(false);
  const update = (idx, key, val) => setCats(prev => prev.map((c,i) => i===idx ? {...c,[key]:val} : c));
  const addCat = () => setCats(prev => [...prev, { name: "New Category", icon: "🛍️", color: "#FF6B35" }]);
  const removeCat = (idx) => { if(cats.length<=1){showToast("⚠️ Kam se kam 1 category!"); return;} setCats(prev=>prev.filter((_,i)=>i!==idx)); };
  const save = async () => { setSaving(true); await saveCategories(cats); showToast("✅ Categories saved!"); setSaving(false); };
  const colorPresets = ["#2196F3","#E91E8C","#FF6B35","#4CAF50","#9C27B0","#FF9800","#F44336","#795548","#009688","#FF5722","#607D8B","#E91E63"];
  return (
    <div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:18}}>
        <h2 style={{margin:0,fontSize:20,color:"#222"}}>🗂️ Categories Manager</h2>
        <div style={{display:"flex",gap:8}}>
          <button onClick={addCat} style={{background:"#4CAF50",border:"none",color:"#fff",padding:"9px 16px",borderRadius:10,cursor:"pointer",fontWeight:600,fontSize:13}}>+ Add Category</button>
          <button onClick={save} disabled={saving} style={{background:saving?"#aaa":"#FF6B35",border:"none",color:"#fff",padding:"9px 16px",borderRadius:10,cursor:saving?"not-allowed":"pointer",fontWeight:600,fontSize:13}}>{saving?"⏳ Saving...":"💾 Save All"}</button>
        </div>
      </div>
      <div style={{background:"#E8F5E9",borderRadius:10,padding:12,marginBottom:16,fontSize:12,color:"#2E7D32"}}>
        ℹ️ Category name change karne ke baad <b>Save All</b> click karo. Products automatically naye naam se match honge agar aap products bhi update karen.
      </div>
      {cats.map((cat, idx) => (
        <div key={idx} style={{background:"#fff",borderRadius:12,padding:18,marginBottom:12,boxShadow:"0 2px 8px rgba(0,0,0,.06)"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
            <div style={{display:"flex",alignItems:"center",gap:10}}>
              <div style={{width:40,height:40,borderRadius:10,background:cat.color,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20}}>{cat.icon}</div>
              <div style={{fontWeight:700,fontSize:14,color:"#222"}}>{cat.name}</div>
            </div>
            <button onClick={()=>removeCat(idx)} style={{background:"#FFEBEE",border:"none",color:"#C62828",padding:"5px 10px",borderRadius:6,cursor:"pointer",fontSize:12}}>🗑️ Delete</button>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
            <div>
              <label style={{fontSize:11,fontWeight:600,color:"#555",marginBottom:3,display:"block"}}>Category Name</label>
              <input value={cat.name} onChange={e=>update(idx,"name",e.target.value)}
                style={{width:"100%",padding:"9px 11px",border:"1px solid #e0e0e0",borderRadius:8,fontSize:13,outline:"none"}} />
            </div>
            <div>
              <label style={{fontSize:11,fontWeight:600,color:"#555",marginBottom:3,display:"block"}}>Icon (Emoji)</label>
              <input value={cat.icon} onChange={e=>update(idx,"icon",e.target.value)}
                style={{width:"100%",padding:"9px 11px",border:"1px solid #e0e0e0",borderRadius:8,fontSize:20,outline:"none"}} />
            </div>
            <div style={{gridColumn:"1/-1"}}>
              <label style={{fontSize:11,fontWeight:600,color:"#555",marginBottom:6,display:"block"}}>Color:</label>
              <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                {colorPresets.map((clr,ci)=>(
                  <div key={ci} onClick={()=>update(idx,"color",clr)}
                    style={{width:32,height:32,borderRadius:8,background:clr,cursor:"pointer",border:cat.color===clr?"3px solid #222":"2px solid transparent"}} />
                ))}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function AddProductForm({ editingProduct, showToast, onSave, onDone, categories }) {
  const isEdit = !!editingProduct;
  const [form, setForm] = useState({
    name: editingProduct?.name||"", category: editingProduct?.category||categories[0]?.name||"",
    price: editingProduct?.price||"", oldPrice: editingProduct?.oldPrice||"",
    desc: editingProduct?.desc||"", badge: editingProduct?.badge||"",
    image: editingProduct?.image||"", rating: editingProduct?.rating||4.5, sold: editingProduct?.sold||0,
  });
  const [errors, setErrors] = useState({});
  const [imgPreview, setImgPreview] = useState(editingProduct?.image||"");
  const [saving, setSaving] = useState(false);
  const fileRef = useRef();
  const set = (k,v) => setForm(f=>({...f,[k]:v}));

  const handleImg = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => { set("image", ev.target.result); setImgPreview(ev.target.result); };
    reader.readAsDataURL(file);
  };

  const submit = async () => {
    const e = {};
    if (!form.name.trim()) e.name = "Enter product name";
    if (!form.price || isNaN(form.price)) e.price = "Enter valid price";
    if (!form.oldPrice || isNaN(form.oldPrice)) e.oldPrice = "Enter old price";
    setErrors(e);
    if (Object.keys(e).length > 0) return;
    setSaving(true);
    const catObj = categories.find(c=>c.name===form.category);
    const productData = { ...form, id: editingProduct?.id||Date.now(), price: Number(form.price), oldPrice: Number(form.oldPrice), rating: Number(form.rating), sold: Number(form.sold)||0, image: form.image||(catObj?.icon||"📦") };
    await onSave(productData, editingProduct?.fbKey||null);
    setSaving(false);
  };

  return (
    <div>
      <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:18}}>
        <button onClick={onDone} style={{background:"none",border:"none",color:"#FF6B35",cursor:"pointer",fontSize:13}}>← Back</button>
        <h2 style={{margin:0,fontSize:20,color:"#222"}}>{isEdit?"✏️ Edit Product":"➕ Add New Product"}</h2>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 300px",gap:18,alignItems:"start"}}>
        <div style={{background:"#fff",borderRadius:12,padding:20}}>
          <div style={{marginBottom:18}}>
            <label style={{fontSize:13,fontWeight:700,color:"#333",marginBottom:8,display:"block"}}>📷 Product Image</label>
            <div style={{border:"2px dashed #FF6B35",borderRadius:12,padding:20,textAlign:"center",cursor:"pointer",background:"#FFF5F0"}} onClick={()=>fileRef.current.click()}>
              {imgPreview ? (imgPreview.startsWith("data:") ? <img src={imgPreview} alt="preview" style={{width:130,height:130,objectFit:"contain",borderRadius:8}} /> : <div style={{fontSize:72}}>{imgPreview}</div>) : (
                <div><div style={{fontSize:42,marginBottom:6}}>📸</div><div style={{color:"#FF6B35",fontWeight:600,fontSize:13}}>Click to upload</div></div>
              )}
              <input ref={fileRef} type="file" accept="image/*" onChange={handleImg} style={{display:"none"}} />
            </div>
            {imgPreview && <button onClick={()=>{setImgPreview("");set("image","");}} style={{marginTop:7,background:"#FFEBEE",border:"none",color:"#C62828",padding:"5px 12px",borderRadius:7,cursor:"pointer",fontSize:11}}>🗑️ Remove</button>}
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
            <div style={{gridColumn:"1/-1"}}>
              <label style={{fontSize:12,fontWeight:600,color:"#555",marginBottom:3,display:"block"}}>Product Name *</label>
              <input value={form.name} onChange={e=>set("name",e.target.value)} placeholder="Product ka naam"
                style={{width:"100%",padding:"10px 12px",border:`1px solid ${errors.name?"#f44336":"#e0e0e0"}`,borderRadius:9,fontSize:13,outline:"none"}} />
              {errors.name && <div style={{fontSize:11,color:"#f44336",marginTop:2}}>⚠️ {errors.name}</div>}
            </div>
            <div>
              <label style={{fontSize:12,fontWeight:600,color:"#555",marginBottom:3,display:"block"}}>Category</label>
              <select value={form.category} onChange={e=>set("category",e.target.value)} style={{width:"100%",padding:"10px 12px",border:"1px solid #e0e0e0",borderRadius:9,fontSize:13,outline:"none",background:"#fff"}}>
                {categories.map(c=><option key={c.name}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label style={{fontSize:12,fontWeight:600,color:"#555",marginBottom:3,display:"block"}}>Badge</label>
              <select value={form.badge} onChange={e=>set("badge",e.target.value)} style={{width:"100%",padding:"10px 12px",border:"1px solid #e0e0e0",borderRadius:9,fontSize:13,outline:"none",background:"#fff"}}>
                <option value="">None</option><option>HOT</option><option>NEW</option><option>SALE</option>
              </select>
            </div>
            <div>
              <label style={{fontSize:12,fontWeight:600,color:"#555",marginBottom:3,display:"block"}}>Sale Price (Rs.) *</label>
              <input value={form.price} onChange={e=>set("price",e.target.value)} placeholder="2500" type="number"
                style={{width:"100%",padding:"10px 12px",border:`1px solid ${errors.price?"#f44336":"#e0e0e0"}`,borderRadius:9,fontSize:13,outline:"none"}} />
              {errors.price && <div style={{fontSize:11,color:"#f44336",marginTop:2}}>⚠️ {errors.price}</div>}
            </div>
            <div>
              <label style={{fontSize:12,fontWeight:600,color:"#555",marginBottom:3,display:"block"}}>Original Price (Rs.) *</label>
              <input value={form.oldPrice} onChange={e=>set("oldPrice",e.target.value)} placeholder="3500" type="number"
                style={{width:"100%",padding:"10px 12px",border:`1px solid ${errors.oldPrice?"#f44336":"#e0e0e0"}`,borderRadius:9,fontSize:13,outline:"none"}} />
              {errors.oldPrice && <div style={{fontSize:11,color:"#f44336",marginTop:2}}>⚠️ {errors.oldPrice}</div>}
            </div>
            <div>
              <label style={{fontSize:12,fontWeight:600,color:"#555",marginBottom:3,display:"block"}}>Rating (1-5)</label>
              <input value={form.rating} onChange={e=>set("rating",e.target.value)} type="number" min="1" max="5" step="0.1"
                style={{width:"100%",padding:"10px 12px",border:"1px solid #e0e0e0",borderRadius:9,fontSize:13,outline:"none"}} />
            </div>
            <div style={{gridColumn:"1/-1"}}>
              <label style={{fontSize:12,fontWeight:600,color:"#555",marginBottom:3,display:"block"}}>Description</label>
              <textarea value={form.desc} onChange={e=>set("desc",e.target.value)} rows={3} placeholder="Product ki description..."
                style={{width:"100%",padding:"10px 12px",border:"1px solid #e0e0e0",borderRadius:9,fontSize:13,outline:"none",resize:"vertical"}} />
            </div>
          </div>
          <button onClick={submit} disabled={saving} style={{width:"100%",background:saving?"#aaa":"#FF6B35",border:"none",color:"#fff",padding:"13px",borderRadius:10,fontSize:15,fontWeight:700,cursor:saving?"not-allowed":"pointer",marginTop:14}}>
            {saving ? "⏳ Saving..." : isEdit ? "✅ Update Product" : "✅ Upload Product"}
          </button>
        </div>
        <div style={{background:"#fff",borderRadius:12,padding:18,position:"sticky",top:18}}>
          <div style={{fontWeight:700,marginBottom:12,fontSize:13,color:"#555"}}>👁️ Preview</div>
          <div style={{border:"1px solid #f0f0f0",borderRadius:12,overflow:"hidden"}}>
            <div style={{background:"#FFF5F0",padding:"20px",textAlign:"center",fontSize:58,minHeight:110,display:"flex",alignItems:"center",justifyContent:"center"}}>
              {imgPreview ? (imgPreview.startsWith("data:") ? <img src={imgPreview} alt="p" style={{width:85,height:85,objectFit:"contain"}} /> : <span>{imgPreview}</span>) : <span style={{color:"#ccc",fontSize:30}}>📦</span>}
            </div>
            <div style={{padding:10}}>
              <div style={{fontSize:12,fontWeight:600,color:"#222",marginBottom:3}}>{form.name||"Product Name"}</div>
              <div style={{fontSize:11,color:"#999",marginBottom:5}}>{form.category}</div>
              {form.price && form.oldPrice && (
                <div style={{display:"flex",alignItems:"center",gap:6}}>
                  <span style={{fontSize:14,fontWeight:800,color:"#FF6B35"}}>{formatPrice(form.price)}</span>
                  <span style={{fontSize:10,color:"#ccc",textDecoration:"line-through"}}>{formatPrice(form.oldPrice)}</span>
                  {Number(form.oldPrice)>0 && <span style={{background:"#FF6B35",color:"#fff",fontSize:9,padding:"1px 5px",borderRadius:4}}>-{discount(form.price,form.oldPrice)}%</span>}
                </div>
              )}
              {form.badge && <span style={{display:"inline-block",marginTop:5,background:form.badge==="HOT"?"#FF6B35":form.badge==="NEW"?"#4CAF50":"#E91E8C",color:"#fff",fontSize:9,fontWeight:700,padding:"2px 7px",borderRadius:4}}>{form.badge}</span>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StoreSettings({ storeConfig, saveStoreConfig, showToast }) {
  const [form, setForm] = useState({ ...storeConfig });
  const [saving, setSaving] = useState(false);
  const set = (k,v) => setForm(f=>({...f,[k]:v}));
  const save = async () => {
    setSaving(true);
    await saveStoreConfig({ ...storeConfig, ...form });
    showToast("✅ Store settings saved!");
    setSaving(false);
  };
  return (
    <div>
      <h2 style={{margin:"0 0 18px",fontSize:20,color:"#222"}}>⚙️ Store Settings</h2>
      <div style={{background:"#fff",borderRadius:12,padding:24}}>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
          <div style={{gridColumn:"1/-1"}}><label style={{fontSize:12,fontWeight:600,color:"#555",marginBottom:4,display:"block"}}>Store Name</label><input value={form.name||""} onChange={e=>set("name",e.target.value)} style={{width:"100%",padding:"10px 12px",border:"1px solid #e0e0e0",borderRadius:9,fontSize:14,outline:"none"}} /></div>
          <div style={{gridColumn:"1/-1"}}><label style={{fontSize:12,fontWeight:600,color:"#555",marginBottom:4,display:"block"}}>Tagline</label><input value={form.tagline||""} onChange={e=>set("tagline",e.target.value)} style={{width:"100%",padding:"10px 12px",border:"1px solid #e0e0e0",borderRadius:9,fontSize:14,outline:"none"}} /></div>
          <div><label style={{fontSize:12,fontWeight:600,color:"#555",marginBottom:4,display:"block"}}>Display Phone</label><input value={form.displayPhone||""} onChange={e=>set("displayPhone",e.target.value)} style={{width:"100%",padding:"10px 12px",border:"1px solid #e0e0e0",borderRadius:9,fontSize:14,outline:"none"}} /></div>
          <div><label style={{fontSize:12,fontWeight:600,color:"#555",marginBottom:4,display:"block"}}>WhatsApp (no +)</label><input value={form.whatsapp||""} onChange={e=>set("whatsapp",e.target.value)} style={{width:"100%",padding:"10px 12px",border:"1px solid #e0e0e0",borderRadius:9,fontSize:14,outline:"none"}} /></div>
          <div><label style={{fontSize:12,fontWeight:600,color:"#555",marginBottom:4,display:"block"}}>JazzCash Number</label><input value={form.jazz||""} onChange={e=>set("jazz",e.target.value)} style={{width:"100%",padding:"10px 12px",border:"1px solid #e0e0e0",borderRadius:9,fontSize:14,outline:"none"}} /></div>
          <div><label style={{fontSize:12,fontWeight:600,color:"#555",marginBottom:4,display:"block"}}>EasyPaisa Number</label><input value={form.easypaisa||""} onChange={e=>set("easypaisa",e.target.value)} style={{width:"100%",padding:"10px 12px",border:"1px solid #e0e0e0",borderRadius:9,fontSize:14,outline:"none"}} /></div>
          <div><label style={{fontSize:12,fontWeight:600,color:"#555",marginBottom:4,display:"block"}}>Delivery Charges (Rs.)</label><input value={form.delivery||""} onChange={e=>set("delivery",Number(e.target.value))} type="number" style={{width:"100%",padding:"10px 12px",border:"1px solid #e0e0e0",borderRadius:9,fontSize:14,outline:"none"}} /></div>
          <div style={{gridColumn:"1/-1"}}><label style={{fontSize:12,fontWeight:600,color:"#555",marginBottom:4,display:"block"}}>Address</label><input value={form.address||""} onChange={e=>set("address",e.target.value)} style={{width:"100%",padding:"10px 12px",border:"1px solid #e0e0e0",borderRadius:9,fontSize:14,outline:"none"}} /></div>
        </div>
        <button onClick={save} disabled={saving} style={{marginTop:20,background:saving?"#aaa":"#FF6B35",border:"none",color:"#fff",padding:"12px 28px",borderRadius:10,fontSize:14,fontWeight:700,cursor:saving?"not-allowed":"pointer"}}>
          {saving ? "⏳ Saving..." : "💾 Save to Firebase"}
        </button>
      </div>
    </div>
  );
}

function BannerManager({ storeConfig, saveStoreConfig, showToast }) {
  const [banners, setBanners] = useState(storeConfig.banners || DEFAULT_STORE.banners);
  const [saving, setSaving] = useState(false);
  const updateBanner = (idx, key, val) => setBanners(prev => prev.map((b,i) => i===idx ? {...b,[key]:val} : b));
  const addBanner = () => setBanners(prev => [...prev, { title: "New Banner", sub: "Subtitle here", bg: "linear-gradient(135deg,#FF6B35,#F7931E)", emoji: "🛍️" }]);
  const removeBanner = (idx) => { if (banners.length <= 1) { showToast("⚠️ Kam se kam 1 banner!"); return; } setBanners(prev => prev.filter((_,i) => i!==idx)); };
  const save = async () => { setSaving(true); await saveStoreConfig({ ...storeConfig, banners }); showToast("✅ Banners saved!"); setSaving(false); };
  const bgPresets = ["linear-gradient(135deg,#FF6B35,#F7931E)","linear-gradient(135deg,#1565C0,#0097A7)","linear-gradient(135deg,#2E7D32,#66BB6A)","linear-gradient(135deg,#6A1B9A,#E91E8C)","linear-gradient(135deg,#E65100,#F57F17)","linear-gradient(135deg,#880E4F,#AD1457)"];
  return (
    <div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:18}}>
        <h2 style={{margin:0,fontSize:20,color:"#222"}}>🖼️ Banner Manager</h2>
        <div style={{display:"flex",gap:8}}>
          <button onClick={addBanner} style={{background:"#FF9800",border:"none",color:"#fff",padding:"9px 16px",borderRadius:10,cursor:"pointer",fontWeight:600,fontSize:13}}>+ Add Banner</button>
          <button onClick={save} disabled={saving} style={{background:saving?"#aaa":"#FF6B35",border:"none",color:"#fff",padding:"9px 16px",borderRadius:10,cursor:saving?"not-allowed":"pointer",fontWeight:600,fontSize:13}}>{saving?"⏳ Saving...":"💾 Save All"}</button>
        </div>
      </div>
      {banners.map((banner, idx) => (
        <div key={idx} style={{background:"#fff",borderRadius:12,padding:20,marginBottom:16,boxShadow:"0 2px 8px rgba(0,0,0,.06)"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
            <div style={{fontWeight:700,fontSize:14,color:"#222"}}>Banner #{idx+1}</div>
            <button onClick={()=>removeBanner(idx)} style={{background:"#FFEBEE",border:"none",color:"#C62828",padding:"5px 10px",borderRadius:6,cursor:"pointer",fontSize:12}}>🗑️ Delete</button>
          </div>
          <div style={{background:banner.bg,borderRadius:10,padding:"16px 20px",display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14,minHeight:80}}>
            <div><div style={{fontSize:16,fontWeight:900,color:"#fff"}}>{banner.title}</div><div style={{fontSize:12,color:"rgba(255,255,255,.9)"}}>{banner.sub}</div></div>
            <div style={{fontSize:40}}>{banner.emoji}</div>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
            <div><label style={{fontSize:11,fontWeight:600,color:"#555",marginBottom:3,display:"block"}}>Title</label><input value={banner.title} onChange={e=>updateBanner(idx,"title",e.target.value)} style={{width:"100%",padding:"8px 10px",border:"1px solid #e0e0e0",borderRadius:8,fontSize:13,outline:"none"}} /></div>
            <div><label style={{fontSize:11,fontWeight:600,color:"#555",marginBottom:3,display:"block"}}>Emoji</label><input value={banner.emoji} onChange={e=>updateBanner(idx,"emoji",e.target.value)} style={{width:"100%",padding:"8px 10px",border:"1px solid #e0e0e0",borderRadius:8,fontSize:20,outline:"none"}} /></div>
            <div style={{gridColumn:"1/-1"}}><label style={{fontSize:11,fontWeight:600,color:"#555",marginBottom:3,display:"block"}}>Subtitle</label><input value={banner.sub} onChange={e=>updateBanner(idx,"sub",e.target.value)} style={{width:"100%",padding:"8px 10px",border:"1px solid #e0e0e0",borderRadius:8,fontSize:13,outline:"none"}} /></div>
            <div style={{gridColumn:"1/-1"}}>
              <label style={{fontSize:11,fontWeight:600,color:"#555",marginBottom:6,display:"block"}}>Background Color:</label>
              <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:8}}>
                {bgPresets.map((bg,bi)=>(
                  <div key={bi} onClick={()=>updateBanner(idx,"bg",bg)} style={{width:40,height:30,borderRadius:6,background:bg,cursor:"pointer",border:banner.bg===bg?"3px solid #222":"2px solid transparent"}} />
                ))}
              </div>
              <input value={banner.bg} onChange={e=>updateBanner(idx,"bg",e.target.value)} style={{width:"100%",padding:"8px 10px",border:"1px solid #e0e0e0",borderRadius:8,fontSize:12,outline:"none",fontFamily:"monospace"}} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}