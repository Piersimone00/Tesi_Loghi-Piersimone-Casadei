# AGENTS.md

Progetto di tesi magistrale di graphic design, "Computational Brand Identity": ripensare l'identità di sei brand globali (Apple, Coca-Cola, McDonald's, Nike, Amazon, Google) proiettandoli in un contesto futuro. I loghi non sono statici: vivono in una griglia digitale reattiva e generativa, animata con HTML, CSS e p5.js.

## Esecuzione / verifica

- Nessun package manager, build, test, lint o CI. Apri `index.html` direttamente nel browser, oppure servilo (`Start-Process index.html` / `python -m http.server`).
- p5.js 1.9.0 è caricato da CDN in `index.html` e nelle pagine di documentazione; le animazioni richiedono accesso alla rete.
- Le modifiche si verificano solo visivamente. Non esiste alcun controllo automatizzato.

## Architettura

- `index.html` contiene il markup della griglia e i path SVG completi dei loghi (alcuni attributi `d` sono righe singole molto lunghe; modifica tramite gli ID, non riformattare). Ogni card linka la propria pagina di documentazione tramite `.doc-link`.
- `sketch.js` usa p5.js in modalità globale con `noCanvas()`. `setup()` memorizza gli elementi SVG per ID; `draw()` richiama ogni frame le sei funzioni `animate*()`.
- `style.css` gestisce la griglia a 3 colonne e il dimensionamento uniforme degli SVG.
- `documentazione/` contiene una pagina per logo (`apple.html`, `coca-cola.html`, `mcdonalds.html`, `nike.html`, `amazon.html`, `google.html`) e il CSS condiviso `documentazione.css`. Ogni pagina ha un'anteprima live che include solo l'SVG del proprio logo e carica `../sketch.js`: le altre funzioni `animate*()` escono subito perché gli elementi mancano.

## Convenzioni da rispettare

- Per aggiungere un logo animato servono tutte e tre le cose: un SVG inline con ID univoci in `index.html`, la memorizzazione in `setup()` e una chiamata da `draw()` in `sketch.js`. Non dare per scontato che un elemento esista; il codice esistente si protegge con `if (!el) return`.
- Le pagine di documentazione duplicano gli SVG presenti in `index.html`: se modifichi forma o attributi di un logo, aggiorna anche la copia nella pagina corrispondente.
- Se cambi formule o parametri in `sketch.js`, aggiorna anche le sezioni "Sistema generativo" e "Parametri" della pagina di documentazione interessata.
- Nelle pagine di documentazione mantieni l'ordine dei riferimenti: `../style.css`, `documentazione.css`, p5 da CDN e infine `../sketch.js`. Il CSS condiviso sovrascrive il layout della griglia; p5 deve caricarsi prima dello sketch.
- Le didascalie dei loghi esistono nell'HTML ma sono volutamente nascoste da `style.css` (`.caption { display: none; }`). Mantieni il markup a meno che non si voglia intenzionalmente riattivarne la visualizzazione.
- Il contenuto della pagina, la documentazione e i commenti del codice sono in italiano; mantieni questa lingua per i testi rivolti all'utente e per i commenti.
- Le animazioni usano le globali di p5 (`sin`, `map`, `frameCount`, `mouseX`, `mouseY`, `windowWidth`, `windowHeight`) applicate come transform/fill CSS inline sugli elementi SVG.
- `overflow: visible` su card e SVG è intenzionale, così le trasformazioni e i loghi sovradimensionati non vengono tagliati.

## Memoria di sessione

- Questo file è la memoria persistente del progetto: a ogni sessione annota qui decisioni, modifiche strutturali e stato del lavoro, senza duplicare l'architettura già descritta sopra.
- 2026-10-31: aggiunte le sei pagine di documentazione in `documentazione/` con anteprima live, testi in italiano e navigazione reciproca; aggiunti i link `.doc-link` nelle card di `index.html` e il CSS condiviso `documentazione.css`. Verificato il caricamento di p5.js e delle animazioni in tutte le pagine.
- 2026-11-14: importati i testi storici da `Allegati/Storia di *.docx` in una nuova sezione "02 Storia del marchio" di ogni pagina di documentazione, con sottosezioni "Nascita e origini", "Evoluzione e analisi critica" e "La svolta contemporanea"; le sezioni successive sono state rinumerate da 03 a 07. Aggiunti a `documentazione.css` gli stili per `h3` e `.doc-history-title`.
