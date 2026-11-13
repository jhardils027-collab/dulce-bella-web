const products = [
  {id:"cupcake",name:"Cupcake",category:"bocaditos",subcategory:"dulces",tag:"",quoteOnly:true,quoteLabel:"Consultar precio",description:"Cupcake suave con cobertura cremosa, decorado a mano.",image:"chocolate-cupcakes.jpg",alt:"Cupcakes decorados a mano",position:"50% 54%"},
  {id:"mini-brownies",name:"Brownies de abrazo",category:"bocaditos",subcategory:"dulces",tag:"Para compartir",quoteOnly:true,quoteLabel:"Consultar precio",description:"Brownie de chocolate húmedo, perfecto para compartir.",image:"bocaditos/dulces/brownie.jpg",alt:"Brownie de chocolate preparado por Dulce Bella",position:"50% 54%"},
  {id:"empanaditas",name:"Empanadita de carne",category:"bocaditos",subcategory:"salados",tag:"Para compartir",quoteOnly:true,quoteLabel:"Consultar precio",description:"Masa dorada rellena de carne, para compartir en reuniones.",image:"bocaditos/salados/empanada-carne.jpg",alt:"Empanadita de carne horneada",position:"50% 50%"},
  {id:"tematicos",name:"Bocaditos temáticos",category:"bocaditos-tematicos",tag:"A tu tema",quoteOnly:true,quoteLabel:"Consultar precio",description:"Dulces decorados para acompañar tu celebración favorita.",image:"torta-tematica.jpg",alt:"Torta infantil decorada con dinosaurio",position:"50% 50%"},
  {id:"keke-chocolate",name:"Keke de chocolate",category:"kekes",tag:"Clásico",description:"Keke de chocolate, suave y esponjoso.",image:"kekes/keke-chocolate.jpg",alt:"Keke de chocolate preparado por Dulce Bella",position:"50% 50%",sizes:[["Medio kilo",45],["Un kilo",90]]},
  {id:"keke-vainilla",name:"Keke de vainilla",category:"kekes",tag:"Suavecito",description:"Keke aromático y esponjoso, ideal para compartir.",image:"kekes/keke-vainilla.jpg",alt:"Keke de vainilla preparado por Dulce Bella",position:"50% 55%",sizes:[["Medio kilo",45],["Un kilo",90]]},
  {id:"keke-infantil",name:"Keke de frutos secos",category:"kekes",tag:"Receta especial",description:"Con pecanas, pasas y almendras.",image:"kekes/keke-frutos-secos.jpg",alt:"Keke de frutos secos preparado por Dulce Bella",position:"50% 52%",sizes:[["Medio kilo",55],["Un kilo",110]]},
  {id:"keke-red-velvet",name:"Keke red velvet",category:"kekes",tag:"Red velvet",quoteOnly:true,quoteLabel:"Consultar precio",description:"Keke red velvet de miga suave y sabor delicado a cacao.",image:"keke-red-velvet.jpg",alt:"Keke red velvet",position:"50% 50%"},
  {id:"keke-naranja",name:"Keke de naranja",category:"kekes",tag:"Cítrico",description:"Keke esponjoso con el aroma fresco de la naranja.",image:"kekes/keke-naranja.jpg",alt:"Keke de naranja preparado por Dulce Bella",position:"50% 50%",sizes:[["Medio kilo",45],["Un kilo",90]]},
  {id:"keke-pina",name:"Keke de piña",category:"kekes",tag:"Frutal",quoteOnly:true,quoteLabel:"Consultar precio",description:"Keke de piña con un toque dulce y frutal.",image:"keke-pina.jpg",alt:"Keke de piña",position:"50% 50%"},
];
products.push(...tortaProducts,...bocaditosProducts,...postresProducts);
const whatsappNumber = "51962200300";
function whatsappUrl(message="") {
  return `https://wa.me/${whatsappNumber}${message ? `?text=${encodeURIComponent(message)}` : ""}`;
}
const money = value => new Intl.NumberFormat("es-PE", {maximumFractionDigits:0}).format(value);
const categoryNames = {tortas:"Tortas",postres:"Postres",bocaditos:"Bocaditos","bocaditos-tematicos":"Bocaditos temáticos",kekes:"Kekes"};
const categoryDescriptions = {todos:"Encuentra ese saborcito perfecto para compartir… o para ti.",tortas:"Elige el acabado perfecto para tu celebración.",postres:"Un antojo dulce para disfrutar a cualquier hora.",bocaditos:"Pequeños favoritos para compartir en cada reunión.","bocaditos-tematicos":"Detalles dulces para celebrar a tu manera.",kekes:"Recetas caseras para acompañar tus mejores momentos."};
const subcategoryNames = {chantilly:"Chantilly",fondant:"Fondant",buttercream:"Buttercream",dulces:"Dulces",salados:"Salados"};
const grid = document.querySelector("#product-grid");
const search = document.querySelector("#catalog-search");
const sort = document.querySelector("#sort-products");
const count = document.querySelector("#result-count");
const catalogTitle = document.querySelector("#catalog-title");
const catalogDescription = document.querySelector("#catalog-description");
const empty = document.querySelector(".empty-results");
const cartDrawer = document.querySelector("#cart-drawer");
const backdrop = document.querySelector(".cart-backdrop");
const cartLines = document.querySelector(".cart-items");
const cartEmpty = document.querySelector(".cart-empty");
const cartSummary = document.querySelector(".cart-summary");
const drawerCount = document.querySelector(".drawer-count");
const totalText = document.querySelector(".cart-total");
const toast = document.querySelector(".toast");
const dialog = document.querySelector(".product-dialog");
const dialogArt = document.querySelector(".dialog-art");
let activeCategory = "todos";
let activeSubcategory = "todos";
let selectedProduct = null;
let cart = [];
let toastTimer;
const catalogConfig = {prices:{},promotion:{name:"",start:"",end:"",discounts:{}}};

function productPhoto(item) {
  return `<img src="assets/${item.image}" alt="${item.alt}" style="object-position:${item.position}" loading="lazy">`;
}
function productPrice(product,index=0) {
  return Number(product.sizes[index][1]);
}
function localDateString(date=new Date()) {
  const parts=new Intl.DateTimeFormat("en-CA",{year:"numeric",month:"2-digit",day:"2-digit"}).formatToParts(date);
  const part=type=>parts.find(item=>item.type===type).value;
  return `${part("year")}-${part("month")}-${part("day")}`;
}
function promotionIsActive() {
  const promotion=catalogConfig.promotion;
  const today=localDateString();
  return Boolean(promotion.name && promotion.start && promotion.end && promotion.start<=today && today<=promotion.end);
}
function productDiscount(product) {
  if(!promotionIsActive()) return 0;
  return Math.min(90,Math.max(0,Number(catalogConfig.promotion.discounts[product.id])||0));
}
function currentPrice(product,index=0) {
  const price=productPrice(product,index);
  return Math.round(price*(1-productDiscount(product)/100));
}
function priceDisplay(product) {
  if(product.quoteOnly) return `<strong class="quote-price">${product.quoteLabel || "Consultar precio"}</strong>`;
  const original=productPrice(product,0), discount=productDiscount(product), price=currentPrice(product,0);
  return `<strong class="price-display">${discount?`<span class="price-before">S/ ${money(original)}</span>`:""}<span>Desde S/ ${money(price)}</span></strong>`;
}
function quoteUrl(product) {
  const message=product.category==="tortas"
    ? `Hola, Dulce Bella. Quisiera cotizar el diseño de torta “${product.name}”. El sabor del keke interior (chocolate, vainilla u otro), las porciones y los detalles los elegiré para mi celebración. ¿Me comparten su disponibilidad y cotización?`
    : product.category==="postres"
      ? `Hola, Dulce Bella. Quisiera consultar si tienen disponible hoy ${product.name} y cuál es su precio. ¿Me confirman, por favor?`
      : product.category==="bocaditos"
      ? `Hola, Dulce Bella. Quisiera consultar precio y disponibilidad de ${product.name}. Para bocaditos puedo pedir cuarto de ciento (25 unidades), medio ciento (50) o un ciento (100). ¿Me confirman los precios?`
      : product.category==="kekes"
        ? `Hola, Dulce Bella. Quisiera consultar precio y disponibilidad de ${product.name}. ¿Me indican las opciones de medio kilo y un kilo?`
        : `Hola, Dulce Bella. Quisiera consultar precio y disponibilidad de ${product.name}. ¿Me comparten las presentaciones?`;
  return whatsappUrl(message);
}
function renderProducts() {
  const query = search.value.trim().toLocaleLowerCase("es");
  let result = products.filter(p => (activeCategory === "todos" || p.category === activeCategory) && (!p.subcategory || activeSubcategory === "todos" || p.subcategory === activeSubcategory) && `${p.name} ${p.description} ${p.tag} ${subcategoryNames[p.subcategory] || ""}`.toLocaleLowerCase("es").includes(query));
  if (sort.value === "price-asc") result = [...result].sort((a,b)=>(a.quoteOnly?Infinity:currentPrice(a))-(b.quoteOnly?Infinity:currentPrice(b)));
  if (sort.value === "price-desc") result = [...result].sort((a,b)=>(b.quoteOnly?-Infinity:currentPrice(b))-(a.quoteOnly?-Infinity:currentPrice(a)));
  grid.innerHTML = result.map(p => {
    const quoteLabel=p.category==="tortas"?"Cotizar diseño":"Consultar precio";
    const action=p.quoteOnly?`<a class="text-action quote-action" href="${quoteUrl(p)}" target="_blank" rel="noopener">${quoteLabel} <span aria-hidden="true">↗</span></a>`:`<button class="text-action" type="button" data-detail="${p.id}">${p.category==="kekes"?"Elegir peso":p.category.startsWith("bocaditos")?"Elegir cantidad":"Elegir presentación"}</button>`;
    const price=p.category==="tortas"||p.quoteOnly?"":`<div class="product-price">${priceDisplay(p)}</div>`;
    return `<article class="product-card"><div class="product-art">${productPhoto(p)}</div><div class="product-info"><h3>${p.name}</h3><p>${p.description}</p>${price}<div class="product-actions">${action}</div></div></article>`;
  }).join("");
  const banner=document.querySelector("#promotion-banner");
  banner.hidden=!promotionIsActive();
  if(!banner.hidden) banner.textContent=`${catalogConfig.promotion.name} · Descuentos activos en productos seleccionados hasta el ${new Date(`${catalogConfig.promotion.end}T12:00:00`).toLocaleDateString("es-PE",{day:"numeric",month:"long"})}.`;
  const label = activeCategory === "todos" ? "Nuestros favoritos" : `${categoryNames[activeCategory]}${activeSubcategory !== "todos" ? ` · ${subcategoryNames[activeSubcategory]}` : ""}`;
  count.textContent = query ? `${result.length} ${result.length === 1 ? "resultado" : "resultados"}` : activeCategory === "todos" ? label : `${result.length} ${result.length === 1 ? "opción" : "opciones"}`;
  catalogTitle.textContent = activeCategory === "todos" ? "Elige tu antojo" : label;
  catalogDescription.textContent = activeCategory === "todos" ? categoryDescriptions.todos : categoryDescriptions[activeCategory];
  document.querySelector(".catalog-layout").classList.toggle("is-focused", activeCategory !== "todos");
  grid.dataset.count = result.length;
  empty.hidden = result.length !== 0;
}
function showToast(message) {
  toast.textContent = message; toast.classList.add("is-visible"); clearTimeout(toastTimer);
  toastTimer = setTimeout(()=>toast.classList.remove("is-visible"),2200);
}
function addToCart(product, size, price) {
  const line = cart.find(item=>item.id===product.id && item.size===size);
  if(line) line.quantity++; else cart.push({id:product.id,size,price,quantity:1});
  renderCart(); showToast(`${product.name} agregado a tu pedido`);
}
function renderCart() {
  const totalCount=cart.reduce((sum,item)=>sum+item.quantity,0);
  document.querySelectorAll(".cart-count").forEach(el=>el.textContent=totalCount);
  drawerCount.textContent=`(${totalCount})`;
  const total=cart.reduce((sum,item)=>sum+item.price*item.quantity,0);
  totalText.textContent=money(total);
  cartEmpty.hidden=totalCount>0; cartSummary.hidden=totalCount===0;
  cartLines.innerHTML=cart.map(item=>{
    const p=products.find(entry=>entry.id===item.id);
    return `<article class="cart-line"><div class="cart-line-art">${productPhoto(p)}</div><div><h3>${p.name}</h3><p>${item.size}</p><div class="qty-control"><button type="button" data-qty="-1" data-id="${p.id}" data-size="${item.size}" aria-label="Quitar una unidad">−</button><span>${item.quantity}</span><button type="button" data-qty="1" data-id="${p.id}" data-size="${item.size}" aria-label="Agregar una unidad">+</button></div></div><strong class="cart-line-price">S/ ${money(item.price*item.quantity)}</strong></article>`;
  }).join("");
  const summary = cart.map(item=>{
    const p=products.find(entry=>entry.id===item.id);
    return `• ${p.name} — ${item.size} — ${item.quantity} x S/ ${money(item.price)}`;
  }).join("\n");
  const message=`Hola, Dulce Bella. Quisiera consultar disponibilidad para este pedido:\n${summary}\nTotal: S/ ${money(total)}. ¿Me confirman fecha de entrega?`;
  document.querySelector(".button-whatsapp").href=whatsappUrl(message);
}
function openCart() { cartDrawer.classList.add("is-open"); cartDrawer.setAttribute("aria-hidden","false"); backdrop.hidden=false; document.body.style.overflow="hidden"; cartDrawer.querySelector(".drawer-close").focus(); }
function closeCart() { cartDrawer.classList.remove("is-open"); cartDrawer.setAttribute("aria-hidden","true"); backdrop.hidden=true; document.body.style.overflow=""; document.querySelector(".cart-trigger").focus(); }
function openDetails(id) {
  selectedProduct=products.find(p=>p.id===id); if(!selectedProduct)return;
  dialogArt.innerHTML=productPhoto(selectedProduct);
  document.querySelector("#dialog-title").textContent=selectedProduct.name;
  document.querySelector(".dialog-description").textContent=selectedProduct.description;
  const selector=document.querySelector("#product-size");
  const optionLabel=selectedProduct.category==="kekes"?"Peso":selectedProduct.category.startsWith("bocaditos")?"Cantidad":"Presentación";
  document.querySelector("#product-option-label").textContent=optionLabel;
  selector.innerHTML=selectedProduct.sizes.map(([label],i)=>`<option value="${i}">${label} · S/ ${money(currentPrice(selectedProduct,i))}${productDiscount(selectedProduct)?` (${catalogConfig.promotion.name})`:""}</option>`).join("");
  updateDialogPrice();
  if(!dialog.open) dialog.showModal();
}
function updateDialogPrice() { if(selectedProduct){const index=Number(document.querySelector("#product-size").value);document.querySelector(".dialog-price").textContent=`S/ ${money(currentPrice(selectedProduct,index))}${productDiscount(selectedProduct)?` · ${catalogConfig.promotion.name}`:""}`;} }



const subcategoryTabs = document.querySelector("#subcategory-tabs");
function renderSubcategoryTabs(){
  const optionsByCategory = {tortas:[["todos","Todas las tortas"],["chantilly","Chantilly"],["fondant","Fondant"],["buttercream","Buttercream"]],bocaditos:[["todos","Todos los bocaditos"],["dulces","Dulces"],["salados","Salados"]]};
  const options = optionsByCategory[activeCategory];
  subcategoryTabs.hidden = !options;
  if(!options) return;
  subcategoryTabs.setAttribute("aria-label",`Filtrar ${categoryNames[activeCategory].toLocaleLowerCase("es")}`);
  subcategoryTabs.innerHTML=options.map(([key,label])=>`<button class="subcategory-tab${activeSubcategory===key?" is-active":""}" type="button" data-subcategory="${key}" aria-pressed="${activeSubcategory===key}">${label}</button>`).join("");
}
document.querySelectorAll(".category-tab").forEach(button=>button.addEventListener("click",()=>{
  document.querySelectorAll(".category-tab").forEach(tab=>{const active=tab===button;tab.classList.toggle("is-active",active);tab.setAttribute("aria-pressed",String(active));});
  activeCategory=button.dataset.category;activeSubcategory="todos";renderSubcategoryTabs();renderProducts();
}));
subcategoryTabs.addEventListener("click",event=>{const button=event.target.closest("[data-subcategory]");if(!button)return;activeSubcategory=button.dataset.subcategory;renderSubcategoryTabs();renderProducts();});
document.querySelectorAll("[data-jump-category]").forEach(link=>link.addEventListener("click",()=>{const tab=document.querySelector(`[data-category="${link.dataset.jumpCategory}"]`);tab?.click();}));
search.addEventListener("input",renderProducts); sort.addEventListener("change",renderProducts);
document.querySelector(".clear-filters").addEventListener("click",()=>{search.value="";activeCategory="todos";activeSubcategory="todos";sort.value="featured";document.querySelectorAll(".category-tab").forEach(tab=>{const active=tab.dataset.category==="todos";tab.classList.toggle("is-active",active);tab.setAttribute("aria-pressed",String(active));});renderSubcategoryTabs();renderProducts();});
grid.addEventListener("click",event=>{
  const add=event.target.closest("[data-add]"); const details=event.target.closest("[data-detail]");
  if(add){const p=products.find(item=>item.id===add.dataset.add);addToCart(p,p.sizes[0][0],p.sizes[0][1]);}
  if(details)openDetails(details.dataset.detail);
});
document.querySelector(".dialog-add").addEventListener("click",()=>{if(!selectedProduct)return;const index=Number(document.querySelector("#product-size").value);addToCart(selectedProduct,selectedProduct.sizes[index][0],currentPrice(selectedProduct,index));dialog.close();});
document.querySelector("#product-size").addEventListener("change",updateDialogPrice);
document.querySelector(".dialog-close").addEventListener("click",()=>dialog.close());
dialog.addEventListener("click",event=>{if(event.target===dialog)dialog.close();});
document.querySelector(".cart-trigger").addEventListener("click",openCart);
document.querySelectorAll("[data-open-cart]").forEach(button=>button.addEventListener("click",openCart));
document.querySelectorAll("[data-close-cart]").forEach(button=>button.addEventListener("click",closeCart));
document.querySelector(".drawer-close").addEventListener("click",closeCart);backdrop.addEventListener("click",closeCart);
cartLines.addEventListener("click",event=>{const button=event.target.closest("[data-qty]");if(!button)return;const index=cart.findIndex(item=>item.id===button.dataset.id&&item.size===button.dataset.size);if(index<0)return;cart[index].quantity+=Number(button.dataset.qty);if(cart[index].quantity<=0)cart.splice(index,1);renderCart();});
document.addEventListener("keydown",event=>{if(event.key==="Escape"&&cartDrawer.classList.contains("is-open"))closeCart();});
const revealObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add("is-visible");revealObserver.unobserve(entry.target);}}),{threshold:.12});
document.querySelectorAll(".section-head,.catalog-tools,.personalized-section,.story-image,.story-copy,.order-paper").forEach(node=>{node.classList.add("reveal");revealObserver.observe(node);});
document.querySelector("#year").textContent=new Date().getFullYear();
renderProducts();renderCart();


