import { useMemo, useState } from "react";
import { Routes, Route, Link, useNavigate, useParams, useLocation } from "react-router-dom";
import { Search, ShoppingBag, Heart, User, Menu, X, Star, Plus, Minus, Trash2, ArrowRight, ShieldCheck, Truck, RotateCcw, CheckCircle2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { products } from "./data/products";
import { addToCart, increment, decrement, removeFromCart, clearCart } from "./redux/cartSlice";
import { toggleWishlist } from "./redux/wishlistSlice";
import { addOrder } from "./redux/orderSlice";
import { login, logout } from "./redux/userSlice";

const money = n => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);

function Header() {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const count = useSelector(s => s.cart.items.reduce((a, i) => a + i.quantity, 0));
  const wish = useSelector(s => s.wishlist.items.length);
  const user = useSelector(s => s.user.profile);
  const nav = useNavigate();
  const submit = e => { e.preventDefault(); nav(`/?search=${encodeURIComponent(search)}`); setOpen(false); };
  return <header className="header">
    <div className="nav wrap">
      <Link className="brand" to="/">SHOP<span>KART</span></Link>
      <form className="search" onSubmit={submit}><Search size={18}/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search products..." /></form>
      <button className="mobile-menu" onClick={()=>setOpen(!open)}>{open?<X/>:<Menu/>}</button>
      <nav className={open ? "navlinks active" : "navlinks"}>
        <Link to="/" onClick={()=>setOpen(false)}>Shop</Link>
        <Link to="/wishlist" onClick={()=>setOpen(false)}>Wishlist <b>{wish}</b></Link>
        <Link to={user ? "/account" : "/login"} onClick={()=>setOpen(false)}><User size={17}/> {user ? user.name.split(" ")[0] : "Account"}</Link>
        <Link className="cart-link" to="/cart" onClick={()=>setOpen(false)}><ShoppingBag size={19}/><span className="cart-count">{count}</span></Link>
      </nav>
    </div>
  </header>
}
function ProductCard({p}) {
  const dispatch = useDispatch();

  const quantity = useSelector(
    s => s.cart.items.find(i => i.id === p.id)?.quantity || 0
  );
  return <article className="card">
    <div className="product-img"><img src={p.image} alt={p.title}/>{p.badge && <span className="badge">{p.badge}</span>}
      <button className={"heart "+(liked?"liked":"")} onClick={()=>dispatch(toggleWishlist(p))}><Heart size={18} fill={liked?"currentColor":"none"}/></button>
    </div>
    <div className="card-body">
      <div className="category">{p.category}</div>
      <Link to={`/product/${p.id}`} className="product-title">{p.title}</Link>
      <div className="rating"><Star size={15} fill="currentColor"/><b>{p.rating}</b><span>({Math.floor(p.rating*31)} reviews)</span></div>
      <div className="card-bottom"><strong>{money(p.price)}</strong>{quantity === 0 ? (
  <button className="add-btn" onClick={() => dispatch(addToCart(p))}>
    <Plus size={17}/> Add
  </button>
) : (
  <div className="quantity-control">
    <button onClick={() => dispatch(decrement(p.id))}>−</button>
    <span>{quantity}</span>
    <button onClick={() => dispatch(increment(p.id))}>+</button>
  </div>
)}</div>
    </div>
  </article>
}

function Home() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const query = params.get("search") || "";
  const [category,setCategory] = useState("All");
  const [sort,setSort] = useState("featured");
  const [max,setMax] = useState(17000);
  const cartCount = useSelector(s => s.cart.items.reduce((a,i) => a + i.quantity, 0));
  const categories = ["All", ...new Set(products.map(p=>p.category))];
  const list = useMemo(()=>products.filter(p=>(category==="All"||p.category===category)&&p.price<=max&&p.title.toLowerCase().includes(query.toLowerCase())).sort((a,b)=>{
    if(sort==="price-low") return a.price-b.price;
    if(sort==="price-high") return b.price-a.price;
    if(sort==="rating") return b.rating-a.rating;
    return a.id-b.id;
  }),[category,max,sort,query]);
  return <><section className="hero"><div className="wrap hero-inner"><div><span className="eyebrow">NEW SEASON · 2026</span><h1>Everything you need.<br/><em>One cart away.</em></h1><p>Curated everyday essentials with fast delivery, easy returns and prices you'll love.</p><Link to="#products" className="hero-btn">Shop collection <ArrowRight size={18}/></Link></div><div className="hero-art"><div className="float-card"><span>4.9 ★</span><small>Customer rating</small></div><div className="circle">SK</div></div></div></section>
  <main id="products" className="wrap products-section">
    <div className="section-head"><div><span className="eyebrow">THE COLLECTION</span><h2>Shop all products</h2></div><div className="controls"><select value={sort} onChange={e=>setSort(e.target.value)}><option value="featured">Featured</option><option value="price-low">Price: Low to High</option><option value="price-high">Price: High to Low</option><option value="rating">Top Rated</option></select></div></div>
    <div className="filters"><div className="chips">{categories.map(c=><button key={c} className={category===c?"chip active":"chip"} onClick={()=>setCategory(c)}>{c}</button>)}</div><label className="range">Up to {money(max)}<input type="range" min="2500" max="17000" value={max} onChange={e=>setMax(+e.target.value)}/></label></div>
    {query && <div className="search-note">Showing results for <b>“{query}”</b></div>}
    <div className="grid">{list.map(p=><ProductCard key={p.id} p={p}/>)}</div>
    {!list.length && <div className="empty"><Search size={38}/><h3>No products found</h3><p>Try another search or category.</p></div>}
  </main>
   <section className="trust"><div className="wrap trust-grid"><div><Truck/><b>Free shipping</b><span>On orders over ₹1,500</span></div><div><ShieldCheck/><b>Secure checkout</b><span>100% protected payments</span></div><div><RotateCcw/><b>Easy returns</b><span>30-day return policy</span></div></div></section>

  {cartCount > 0 && <Link to="/cart" className="floating-bag"><ShoppingBag size={20}/> Go to Bag <span>{cartCount}</span></Link>}
  </>;
}

function ProductDetails() { 
  const {id}=useParams(); const p=products.find(x=>x.id===Number(id)); const dispatch=useDispatch();
  const cartCount=useSelector(s=>s.cart.items.reduce((a,i)=>a+i.quantity,0));
  if(!p) return <div className="wrap empty"><h2>Product not found</h2><Link to="/">Back to shop</Link></div>;
  return <main className="wrap detail"><div className="detail-image"><img src={p.image}/></div><div className="detail-info"><span className="eyebrow">{p.category}</span><h1>{p.title}</h1><div className="rating large"><Star fill="currentColor"/><b>{p.rating}</b><span>Highly rated by customers</span></div><div className="price">{money(p.price)}</div><p className="desc">Designed for everyday use with premium materials, thoughtful details and a clean modern finish. A versatile choice for your daily routine.</p><div className="stock"><span/> {p.stock} left in stock</div><button className="primary big" onClick={()=>dispatch(addToCart(p))}>
  <ShoppingBag size={19}/>
  Add to Bag
</button><div className="detail-benefits"><span><Truck/> Free delivery over ₹1,500</span><span><RotateCcw/> 30-day returns</span></div></div></main>
{cartCount > 0 && <Link to="/cart" className="floating-bag"><ShoppingBag size={20}/> Go to Bag <span>{cartCount}</span></Link>}
}

function Cart() {
  const items=useSelector(s=>s.cart.items); const dispatch=useDispatch(); const nav=useNavigate();
  const subtotal=items.reduce((a,i)=>a+i.price*i.quantity,0), shipping=subtotal>=1500||subtotal===0?0:99, tax=subtotal*.08, total=subtotal+shipping+tax;
  if(!items.length) return <main className="wrap empty cart-empty"><ShoppingBag size={54}/><h1>Your cart is empty</h1><p>Looks like you haven't added anything yet.</p><Link className="primary" to="/">Start shopping <ArrowRight/></Link></main>;
  return <main className="wrap cart-page"><div className="section-head"><div><span className="eyebrow">YOUR BAG</span><h1>Shopping cart</h1></div><button className="clear" onClick={()=>dispatch(clearCart())}>Clear cart</button></div><div className="cart-layout"><div className="cart-items">{items.map(i=><div className="cart-item" key={i.id}><img src={i.image}/><div className="cart-main"><span className="category">{i.category}</span><Link to={`/product/${i.id}`}><h3>{i.title}</h3></Link><div className="qty"><button onClick={()=>dispatch(decrement(i.id))}><Minus/></button><b>{i.quantity}</b><button onClick={()=>dispatch(increment(i.id))}><Plus/></button></div></div><div className="cart-price"><b>{money(i.price*i.quantity)}</b><button onClick={()=>dispatch(removeFromCart(i.id))}><Trash2 size={18}/></button></div></div>)}</div><aside className="summary"><h2>Order summary</h2><div><span>Subtotal</span><b>{money(subtotal)}</b></div><div><span>Shipping</span><b>{shipping?money(shipping):"FREE"}</b></div><div><span>Estimated tax</span><b>{money(tax)}</b></div><hr/><div className="total"><span>Total</span><b>{money(total)}</b></div><button className="primary checkout" onClick={()=>nav("/checkout")}>Proceed to checkout <ArrowRight/></button><small>Taxes calculated at checkout. Secure payment.</small></aside></div></main>
}

function Wishlist() {
  const items=useSelector(s=>s.wishlist.items);
  return <main className="wrap products-section"><div className="section-head"><div><span className="eyebrow">SAVED ITEMS</span><h1>Wishlist</h1></div></div>{items.length?<div className="grid">{items.map(p=><ProductCard key={p.id} p={p}/>)}</div>:<div className="empty"><Heart size={42}/><h2>Your wishlist is empty</h2><p>Save products you love for later.</p><Link className="primary" to="/">Discover products</Link></div>}</main>
}

function Login() {
  const [form,setForm]=useState({name:"",email:""}); const dispatch=useDispatch(); const nav=useNavigate();
  const submit=e=>{e.preventDefault(); if(!form.name||!form.email)return; dispatch(login(form)); nav("/account");};
  return <main className="auth"><form className="auth-card" onSubmit={submit}><div className="brand center">SHOP<span>KART</span></div><h1>Welcome back</h1><p>Sign in to manage your orders and profile.</p><label>Full name<input required value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="Alex Johnson"/></label><label>Email address<input required type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} placeholder="alex@email.com"/></label><button className="primary" type="submit">Continue <ArrowRight/></button></form></main>
}

function Account() {
 const user=useSelector(s=>s.user.profile); const orders=useSelector(s=>s.orders.items); const dispatch=useDispatch();
 if(!user) return <NavigateLogin/>;
 return <main className="wrap account"><div className="account-head"><div><span className="eyebrow">MY ACCOUNT</span><h1>Hi, {user.name.split(" ")[0]} 👋</h1><p>{user.email}</p></div><button className="clear" onClick={()=>dispatch(logout())}>Sign out</button></div><h2>Recent orders</h2>{orders.length?<div className="orders">{orders.map(o=><div className="order" key={o.id}><div><b>#{o.id}</b><span>{o.date}</span></div><strong>{money(o.total)}</strong><span className="status">Confirmed</span></div>)}</div>:<div className="empty"><CheckCircle2/><h3>No orders yet</h3><Link to="/">Start shopping</Link></div>}</main>
}
function NavigateLogin(){ const nav=useNavigate(); nav("/login"); return null; }

function Checkout() {
 const items=useSelector(s=>s.cart.items); const user=useSelector(s=>s.user.profile); const dispatch=useDispatch(); const nav=useNavigate();
 const subtotal=items.reduce((a,i)=>a+i.price*i.quantity,0), shipping=subtotal>=1500?0:99, tax=subtotal*.08,total=subtotal+shipping+tax;
 const [form,setForm]=useState({name:user?.name||"",email:user?.email||"",address:"",city:"",zip:"",card:""});
 const submit=e=>{e.preventDefault(); if(!items.length)return; const id="SK"+Date.now().toString().slice(-7);
  const order={id,date:new Date().toLocaleDateString("en-IN"),total,items,email:form.email,name:form.name,address:form.address,city:form.city,zip:form.zip};
  dispatch(addOrder(order)); dispatch(clearCart()); nav(`/success/${id}`,{state:order});};
 return <main className="wrap checkout-page"><div><span className="eyebrow">SECURE CHECKOUT</span><h1>Complete your order</h1><form className="checkout-form" onSubmit={submit}><section><h2>Contact</h2><div className="two"><label>Name<input required value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/></label><label>Email<input required type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})}/></label></div></section><section><h2>Delivery address</h2><label>Street address<input required value={form.address} onChange={e=>setForm({...form,address:e.target.value})} placeholder="123 Market Street"/></label><div className="two"><label>City<input required value={form.city} onChange={e=>setForm({...form,city:e.target.value})}/></label><label>ZIP code<input required value={form.zip} onChange={e=>setForm({...form,zip:e.target.value})}/></label></div></section><section><h2>Payment</h2><label>Card number<input required minLength="12" value={form.card} onChange={e=>setForm({...form,card:e.target.value})} placeholder="4242 4242 4242 4242"/></label><div className="secure-note"><ShieldCheck/> Demo checkout — no real payment is processed.</div></section><button className="primary big" type="submit">Place order · {money(total)} <ArrowRight/></button></form></div><aside className="summary checkout-summary"><h2>Order summary</h2>{items.map(i=><div className="mini" key={i.id}><img src={i.image}/><span>{i.title} × {i.quantity}</span><b>{money(i.price*i.quantity)}</b></div>)}<hr/><div><span>Subtotal</span><b>{money(subtotal)}</b></div><div><span>Shipping</span><b>{shipping?money(shipping):"FREE"}</b></div><div><span>Tax</span><b>{money(tax)}</b></div><div className="total"><span>Total</span><b>{money(total)}</b></div></aside></main>
}

function Success(){
  const {id}=useParams(); const location=useLocation(); const order=location.state;
  const sendEmail=()=>{
    if(!order?.email)return;
    const lines=order.items.map(i=>`${i.title} x ${i.quantity} - ${money(i.price*i.quantity)}`).join("\\n");
    const body=`Hello ${order.name},\\n\\nThank you for shopping with ShopKart.\\n\\nOrder: #${order.id}\\nDate: ${order.date}\\n\\nItems:\\n${lines}\\n\\nTotal: ${money(order.total)}\\nDelivery address: ${order.address}, ${order.city} - ${order.zip}\\n\\nYour order has been confirmed.\\n\\nRegards,\\nShopKart`;
    window.location.href=`mailto:${order.email}?subject=${encodeURIComponent(`ShopKart Order Confirmation #${order.id}`)}&body=${encodeURIComponent(body)}`;
  };
  return <main className="success"><div><CheckCircle2 size={68}/><span className="eyebrow">ORDER CONFIRMED</span><h1>Thank you for your order!</h1><p>Your order <b>#{id}</b> has been placed successfully.</p>{order?.email&&<><p className="email-note">Confirmation prepared for <b>{order.email}</b>.</p><button className="primary email-btn" onClick={sendEmail}>Send order details by email</button></>}<Link className="primary" to="/">Continue shopping <ArrowRight/></Link></div></main>}

export default function App(){return <><Header/><Routes><Route path="/" element={<Home/>}/><Route path="/product/:id" element={<ProductDetails/>}/><Route path="/cart" element={<Cart/>}/><Route path="/wishlist" element={<Wishlist/>}/><Route path="/login" element={<Login/>}/><Route path="/account" element={<Account/>}/><Route path="/checkout" element={<Checkout/>}/><Route path="/success/:id" element={<Success/>}/></Routes><footer><div className="wrap"><div className="brand">SHOP<span>KART</span></div><p>A modern shopping experience built with React + Redux Toolkit.</p><small>© 2026 ShopKart. Demo project.</small></div></footer></>}
