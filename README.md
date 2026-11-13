# Dulce Bella

Sitio estático de catálogo para una pastelería. No requiere instalación de dependencias.

## Vista local

Desde esta carpeta puedes abrir `index.html` o iniciar un servidor local en PowerShell:

```powershell
python -m http.server 8765
```

Luego visita `http://localhost:8765`.

## Catálogo y precios

Los precios confirmados se muestran en soles. El keke de chocolate, vainilla y naranja cuesta S/ 45 por medio kilo y S/ 90 por kilo. El keke de frutos secos cuesta S/ 55 por medio kilo y S/ 110 por kilo. Los productos sin precio confirmado muestran «Consultar precio» y se consultan por WhatsApp.

Las tortas se cotizan por diseño; el sabor del keke interior y los detalles se definen al cotizar. Los bocaditos se cotizan por cantidad: cuarto de ciento, medio ciento o ciento.

## Fotografías

Las fotos propias de tortas están optimizadas en `assets/tortas/`; las de kekes, en `assets/kekes/`; y las de bocaditos, en `assets/bocaditos/`, con subcarpetas `dulces` y `salados`. Los productos de tortas se describen en `tortas-catalog.js`, los bocaditos en `bocaditos-catalog.js` y los postres diarios en `postres-catalog.js`.

El catálogo incluye tortas por cobertura (chantilly, fondant y buttercream), postres diarios, bocaditos, bocaditos temáticos y kekes. Los postres diarios incluyen chocopecanoso, porciones de keke, pie de manzana, trufas y alfajores. El keke de frutos secos lleva pecanas, pasas y almendras.
