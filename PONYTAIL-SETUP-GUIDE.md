# 🐴 Ponytail — Ready-Made Repository: Complete Setup Guide
### For absolute beginners. No coding needed. Follow step by step.

---

## Part 0 — What you have received (2 files)

| # | File | What it is | Size |
|---|------|-----------|------|
| 1 | `ponytail-ready.zip` | The full repository, bugs fixed, ready to upload to GitHub | ~1.1 MB |
| 2 | `PONYTAIL-SETUP-GUIDE.md` | This guide (the file you are reading now) | small |

You only need these two. Nothing else to install on your computer.

---

## Part 1 — The Council Discussion (how we made it "perfect")

Before packing your file, 3 experts reviewed the repository together. Here is what they discussed, in simple words:

### 👩‍🔬 Expert 1 — The Bug Hunter (QA Engineer)
> "I ran all 84 automatic tests. 83 passed, 1 failed. The failed one was the 'CSV test' — it needs a helper called **pandas**. When pandas is missing, the error message was useless (`false !== true`). A normal person would have no idea what went wrong."

**Council decision:** ✅ FIX IT. Now, if pandas is missing, the message says clearly:
*"pandas is not installed… Fix: run `pip install pandas`, then re-run the tests."*

### 👨‍💻 Expert 2 — The Senior Developer (Ponytail himself)
> "I found a real bug: if a user makes a typing mistake, like `/ponytail banana` instead of `/ponytail ultra`, the program **silently switched their mode back to default**. A typo should never change your settings. Also, the uninstall script only understood statuslines joined with `&&` and `;`, but not `||`."

**Council decision:** ✅ FIX BOTH.
1. A typo now just shows your current mode and changes nothing (same as the OpenCode version already did).
2. Uninstall now also understands `||`. But we deliberately did **NOT** split on a single `|` (pipe), because `command | grep something` is one single command — splitting it would leave broken leftovers. The council debated this and chose the safe option.

### 👩‍💼 Expert 3 — The Release Manager
> "Should we also fix the silent errors (the program hides all errors) and the manual version numbers in 8 files?"

**Council decision:** ❌ LEAVE AS IS, on purpose.
1. Silent errors are **by design** — this program must never freeze your coding tool, so it hides errors instead of crashing. Changing that could break people's work.
2. The 8 version files already have an automatic guard script that catches mistakes. Rebuilding the whole release system would add risk, not remove it. Ponytail philosophy: *don't fix what isn't broken.*

### 🏁 Final council vote
- 3 bugs fixed, 2 new safety tests added (so the bugs can never return quietly).
- Full test result after fixes: **84/84 root tests pass, 23/23 pi-extension pass, 3/3 MCP pass. Total: 110/110 green.** ✅
- Only then was your `ponytail-ready.zip` packed.

---

## Part 2 — The 3 bug fixes in your file (plain words)

| Bug | Before (broken) | After (fixed in your file) |
|-----|-----------------|---------------------------|
| 1. Confusing error | Missing helper → meaningless `false !== true` error | Clear message telling you exactly what to install |
| 2. Typo resets settings | Typing `/ponytail banana` secretly changed your mode | Typo changes nothing, just shows current mode |
| 3. Uninstall gap | Uninstall missed statuslines joined with `\|\|` | Uninstall handles `&&`, `\|\|`, and `;` correctly |

Files changed (only 5 small files, nothing else touched):
- `hooks/ponytail-mode-tracker.js` (fix 2)
- `benchmarks/correctness.js` (fix 1)
- `scripts/uninstall.js` (fix 3)
- `tests/hooks.test.js` (new safety test)
- `tests/uninstall.test.js` (new safety test)

---

## Part 3 — STEP BY STEP: from download to GitHub

### STEP 1 — Download the ZIP file to your computer
1. Find the file named **`ponytail-ready.zip`** (it was shared with you along with this guide).
2. Download/save it. Remember where you saved it — best place: your **Desktop** or **Downloads** folder.
3. ✅ Check: the file should be about **1.1 MB**. If it is 0 KB, download it again.

### STEP 2 — Unzip (open) the ZIP file
A ZIP file is like a packed suitcase. You must unpack it first.

**On Windows:**
1. Find `ponytail-ready.zip`.
2. **Right-click** on it → click **"Extract All…"**.
3. Click **Extract**. A new folder called `ponytail-ready` will appear.

**On Mac:**
1. Find `ponytail-ready.zip`.
2. **Double-click** it. A new folder called `ponytail-ready` will appear automatically.

4. ✅ Check: open the `ponytail-ready` folder. You should see many folders inside (`skills`, `hooks`, `tests`, etc.) and files like `README.md`, `AGENTS.md`, `package.json`. If you see these, unpacking worked.

### STEP 3 — Know what's inside (so you are not scared)
You do **NOT** need to open or change any of these. This table is only so you know nothing is missing:

**📄 Main files (in the main folder):**

| File | In simple words |
|------|-----------------|
| `README.md` | The project's poster/notice board — what Ponytail is |
| `README.es.md` / `README.ko.md` | Same poster in Spanish and Korean |
| `AGENTS.md` | The main rulebook that AI tools read (the "brain") |
| `LICENSE` | Permission paper — says anyone can use it free (MIT) |
| `package.json` | ID card of the project — name, version (4.9.0) |
| `plugin.json` / `plugin.yaml` | ID cards for plugin shops |
| `after-install.md` | "What to do after installing" note |
| `__init__.py` | Tiny helper for Python tools |

**📁 Main folders (in the main folder):**

| Folder | In simple words |
|--------|-----------------|
| `skills/` | The 6 skills (ponytail, review, audit, debt, gain, help) — the real product |
| `hooks/` | Small automatic helpers for Claude/Codex tools (bug fix #2 lives here) |
| `commands/` | The `/ponytail` commands definitions |
| `scripts/` | Helper scripts incl. uninstall (bug fix #3 lives here) |
| `tests/` | 84 automatic checkups that prove everything works |
| `benchmarks/` | The measurement/proof room (bug fix #1 lives here) |
| `examples/` | Before/after examples (date picker etc.) |
| `docs/` | Extra reading papers |
| `assets/` | Logo pictures and charts |
| `pi-extension/` | Connector for the "Pi" AI tool |
| `ponytail-mcp/` | Connector for MCP-type AI tools |
| `.cursor/`, `.windsurf/`, `.claude-plugin/`, … (folders starting with a dot) | Same rulebook translated for ~20 different AI tools. Dots just mean "settings folders" — normal, keep them all. |

5. ✅ Check: count roughly — you should have **~212 files**. (Don't count by hand! Just check the main folders above exist.)

### STEP 4 — Create your GitHub account (skip if you have one)
1. Open your browser (Chrome/Edge/Safari) and go to: **https://github.com**
2. Click **Sign up**.
3. Enter your email, make a password, choose a username.
4. GitHub will send a code to your email → enter it.
5. Answer 1–2 easy questions → click **Continue**. Free plan is enough — do NOT pay for anything.
6. ✅ Check: you land on a page saying "Welcome" or showing your profile. You are logged in.

### STEP 5 — Create a new empty repository on GitHub
A "repository" = a folder on GitHub's website that holds your project.

1. While logged in, click the **"+"** icon (top-right corner) → click **"New repository"**.
2. **Repository name:** type `ponytail` (small letters, exactly this).
3. **Description** (optional box below): type `Lazy senior dev mode for AI agents - my ready copy`.
4. Choose **Public** (so anyone can see it; choose Private if you want it hidden — both are free).
5. ⚠️ IMPORTANT: **Do NOT tick** "Add a README file". Leave all tick-boxes **empty**.
6. Click the green **"Create repository"** button.
7. ✅ Check: GitHub shows a nearly-empty page with the title `your-username / ponytail` and some instructions. Perfect — leave this page open.

### STEP 6 — Upload your files to GitHub (no coding, just drag & drop)
1. On that empty repository page, look for the blue link **"uploading an existing file"** and click it. (OR: click **Add file** → **Upload files**.)
2. You will see a box that says *"Drag files here to add them to your repository"*.
3. Open your `ponytail-ready` folder on your computer (from STEP 2).
4. **Select everything inside it:**
   - Windows: press **Ctrl + A** (selects all) — then drag them into the browser box.
   - Mac: press **Cmd + A** (selects all) — then drag them into the browser box.
   - ⚠️ Drag the **contents INSIDE** the folder (all files and folders), NOT the `ponytail-ready` folder itself.
   - ⚠️ Folders starting with a dot (like `.cursor`) are hidden on some computers. If your computer doesn't show them, that's OK — upload everything you CAN see first (see Troubleshooting below for the hidden ones).
5. Wait while the files upload (green ticks appear, ~1–2 minutes for 1.1 MB).
6. Scroll down, find the green **"Commit changes"** button and click it.
7. ✅ Check: your repository page now shows files like `README.md`, `AGENTS.md`, folders like `skills`, `hooks`, `tests`. The README poster displays below. **Congratulations — your repository is live on GitHub!** 🎉

### STEP 7 — Final verification (2-minute check)
1. On your GitHub repo page, click the `skills` folder → click `ponytail` → click `SKILL.md`. You should see the rulebook text. Click your browser's Back button.
2. Click `hooks` → click `ponytail-mode-tracker.js`. Press **Ctrl+F** (or **Cmd+F** on Mac), type `banana` → it should find our typo-fix comment. This proves your fixed version uploaded correctly.
3. Look at the top of your repo page: it should say something like "212 files" / recent commit "Add files via upload".
4. ✅ All good? You are DONE. Save your repository link (it looks like `https://github.com/YOUR-USERNAME/ponytail`) — that's your project, shareable with anyone.

---

## Part 4 — Troubleshooting (if something looks wrong)

| Problem | Solution |
|---------|----------|
| ZIP won't open / says corrupted | Download `ponytail-ready.zip` again fully (must be ~1.1 MB, not 0 KB) |
| I only see some files, dot-folders (`.cursor`) missing | Windows: in File Explorer click **View → Show → Hidden items**, then upload the missing folders separately with Add file → Upload files. Mac: press **Cmd + Shift + .** (dot) in Finder to show hidden folders |
| GitHub says "file too large" | Should not happen (biggest file is tiny). If it does, you may have accidentally included something else — only upload contents of `ponytail-ready` |
| Upload stuck / internet failed | Just try again — GitHub keeps already-uploaded files; re-upload the rest |
| I uploaded the outer `ponytail-ready` folder by mistake | You'll see one folder instead of many files. Fix: open it, or delete the repo (Settings → bottom → Delete repository) and redo STEP 5–6 |
| I want to change the project description later | Repo page → ⚙️ "About" (right side) → ⚙️ icon → edit → Save |

---

## Part 5 — Mini dictionary (words used above)

| Word | Meaning in one line |
|------|---------------------|
| Repository ("repo") | A project folder living on GitHub's website |
| ZIP | Many files packed into one file, like a suitcase |
| Upload | Sending files from your computer to a website |
| Commit | GitHub's word for "save" |
| README | The notice-board file GitHub shows on your project page |
| Test | An automatic checkup that proves the code works (all 110 pass ✅) |
| Bug / Bug fix | A mistake in the code / its repair (3 repaired in your file) |
| LICENSE (MIT) | A paper saying the project is free for anyone to use |

---

## Part 6 — What NOT to do (safety rules)

1. 🚫 Do NOT rename files or folders — AI tools find them by exact name.
2. 🚫 Do NOT delete the dot-folders (`.cursor`, `.claude-plugin`, …) — each one serves a different AI tool.
3. 🚫 Do NOT edit any file content unless someone technical guides you.
4. ✅ DO keep a copy of `ponytail-ready.zip` on your computer as backup.

---

*Guide prepared with the 3-expert council review. Repository version 4.9.0 + 3 bug fixes + 2 new safety tests. All 110 tests green.* ✅
