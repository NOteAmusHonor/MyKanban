# MyKanban

Ein ultra-modernes, lokales Kanban-Board mit KI-Integration und Echtzeit-Sync.  
Läuft auf **Port 3737** – einfach URL öffnen, fertig.

---

## Installation in ein bestehendes Projekt

### 1. Paket installieren

```bash
npm install git+https://github.com/NOteAmusHonor/MyKanban.git
```

### 2. Script in `package.json` eintragen

```json
{
  "scripts": {
    "kanban": "mykanban"
  }
}
```

### 3. Board starten

```bash
npm run kanban
```

→ Öffnet automatisch `http://localhost:3737` im Browser.  
→ Daten werden in **`kanban.json`** im Projektordner gespeichert (wird beim ersten Start erstellt).

---

## Dieses Repo lokal ausführen

### 1. Abhängigkeiten installieren & Frontend bauen

```bash
npm install
npm run build
```

### 2. Board starten

```bash
node bin/mykanban.mjs
# oder
npm start
```

→ Öffnet automatisch `http://localhost:3737` im Browser.

---

## Entwicklung (Hot Reload)

Zwei Terminals öffnen:

```bash
# Terminal 1 – API-Server
node server/index.mjs

# Terminal 2 – Vue Dev-Server
npm run dev
```

→ Board läuft auf `http://localhost:5173`.

---

## Datenspeicherung

Alle Daten werden in **`kanban.json`** im Projektordner gespeichert.  
Die Datei wird beim ersten Start automatisch erstellt.

---

## KI-Integration

KIs (Copilot, Cursor, Claude …) können die `kanban.json` direkt lesen und bearbeiten.  
Das Board erkennt externe Änderungen sofort und aktualisiert sich automatisch.

Das Schema für KIs liegt in [`kanban.schema.json`](./kanban.schema.json).

**Beispiel-Prompt für deine KI:**

```
Lies die Datei kanban.json und erstelle ein neues Ticket in der Spalte "In Bearbeitung"
mit dem Titel "Login-Seite bauen", Priorität "high" und dem Label "Frontend".
Schreibe die geänderte JSON zurück in die Datei.
```

---

## Tastenkürzel

| Taste | Aktion          |
| ----- | --------------- |
| `N`   | Neues Ticket    |
| `C`   | Neue Spalte     |
| `D`   | Dark/Light Mode |
| `S`   | Statistiken     |
| `/`   | KI-Panel        |
| `Esc` | Schließen       |

---

## Prioritäten

| Level | Bezeichnung |
| ----- | ----------- |
| 🟢    | Niedrig     |
| 🔵    | Mittel      |
| 🟠    | Hoch        |
| 🔴    | Dringend    |

---

## Ticket-Nummern

Jedes Ticket bekommt automatisch eine eindeutige Nummer im Format `TK-XXXX` (z. B. `TK-4821`).

---

## Lizenz

MIT
