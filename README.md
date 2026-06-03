# 🌳 ID3 — Árbol de Decisión Interactivo

Visualizador web del algoritmo **ID3** con cálculo de **Entropía** y **Ganancia de Información**.
Compatible con archivos `.arff` de **Weka**.

---

## 🚀 Demo en vivo

👉 `https://TU_USUARIO.github.io/id3-arbol/`

*(reemplaza `TU_USUARIO` con tu nombre de usuario de GitHub)*

---

## 📁 Estructura de archivos

```
id3-arbol/
│
├── index.html        ← Estructura HTML de la página
├── style.css         ← Estilos y diseño visual
├── id3.js            ← Algoritmo ID3 + Parser ARFF + SVG
├── prestamos.arff    ← Dataset de ejemplo (Weka)
└── README.md         ← Este archivo
```

---

## 📤 Cómo subir a GitHub Pages (paso a paso)

### Paso 1 — Crear el repositorio

1. Ve a [https://github.com/new](https://github.com/new)
2. Nombre del repositorio: `id3-arbol`
3. Selecciona **Public**
4. Haz clic en **Create repository**

---

### Paso 2 — Subir los archivos

1. En tu repositorio, haz clic en **"Add file" → "Upload files"**
2. Arrastra o selecciona estos 5 archivos:
   - `index.html`
   - `style.css`
   - `id3.js`
   - `prestamos.arff`
   - `README.md`
3. En la sección *Commit changes*, escribe: `Subir visualizador ID3`
4. Haz clic en **Commit changes**

---

### Paso 3 — Activar GitHub Pages

1. Ve a **Settings** (engranaje en la barra superior del repo)
2. En el menú izquierdo, haz clic en **Pages**
3. En *Source*, selecciona **"Deploy from a branch"**
4. Branch: **main** — carpeta: **/ (root)**
5. Haz clic en **Save**

⏳ Espera 1-2 minutos y tu sitio estará disponible en:
```
https://TU_USUARIO.github.io/id3-arbol/
```

---

## 🧪 Usar con Weka

Puedes verificar los resultados en **Weka Explorer**:

1. Abre Weka → **Explorer**
2. **Open file** → selecciona `prestamos.arff`
3. Ve a la pestaña **Classify**
4. Haz clic en **Choose** → `trees` → `Id3`
5. Clic en **Start**

Los valores de entropía y ganancia que muestra la web deben coincidir con los de Weka.

---

## 📂 Cargar tu propio ARFF

Para usar tu propio dataset, el archivo `.arff` debe:

- Tener solo **atributos nominales** (valores entre `{}`)
- El **último atributo** es la clase objetivo
- Tener al menos 2 valores en la clase (ej: `{Si, No}`)

**Ejemplo de estructura:**

```arff
@relation mi_dataset

@attribute Atributo1 {ValA, ValB, ValC}
@attribute Atributo2 {X, Y}
@attribute Clase     {Positivo, Negativo}

@data
ValA,X,Positivo
ValB,Y,Negativo
...
```

Luego arrastra ese archivo a la zona de carga en la web y el árbol se actualizará automáticamente.

---

## ⚙️ Cómo funciona el algoritmo

### Entropía de Shannon
```
H(S) = -Σ p(c) · log₂(p(c))
```
- `S` = conjunto de instancias
- `p(c)` = proporción de instancias de clase `c`
- Valor 0 = conjunto puro, Valor 1 = máxima mezcla

### Ganancia de Información
```
IG(S, A) = H(S) - Σ (|Sv| / |S|) · H(Sv)
```
- `A` = atributo a evaluar
- `Sv` = subconjunto donde el atributo vale `v`
- Se elige el atributo con **mayor IG** como nodo de división

---

## 🛠 Tecnologías

| Tecnología | Uso |
|---|---|
| HTML5 | Estructura de la página |
| CSS3 | Diseño visual y animaciones |
| JavaScript (Vanilla) | Algoritmo ID3 + Parser ARFF + SVG |
| SVG | Renderizado del árbol |
| Google Fonts | Tipografías (Space Mono + Syne) |
| GitHub Pages | Hosting gratuito |

---

## 👤 Autor

Generado con IA · Compatible con Weka · Algoritmo ID3 puro en JavaScript
