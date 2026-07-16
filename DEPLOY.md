# Deploy to GitHub Pages (no admin rights needed)

Your project is ready in `C:\Users\kdclay\grokdaddy`.  
Portable Git is at: `%USERPROFILE%\tools\PortableGit\cmd\git.exe`

## Part A — Create the GitHub repo (browser)

1. Open [https://github.com/new](https://github.com/new) (sign in or create a free account).
2. **Repository name:** `engineering-tools` (or any name you like).
3. Set visibility to **Public** (required for free GitHub Pages).
4. **Do not** check “Add a README” (you already have files).
5. Click **Create repository**.
6. Copy your repo URL, e.g.  
   `https://github.com/YOUR_USERNAME/engineering-tools.git`

## Part B — Push from this PC (PowerShell)

Open PowerShell and run (replace `YOUR_USERNAME`):

```powershell
$git = "$env:USERPROFILE\tools\PortableGit\cmd\git.exe"
cd C:\Users\kdclay\grokdaddy

& $git remote remove origin 2>$null
& $git remote add origin https://github.com/YOUR_USERNAME/engineering-tools.git
& $git branch -M main
& $git push -u origin main
```

When prompted:

- **Username:** your GitHub username  
- **Password:** a **Personal Access Token** (not your GitHub password)

### Create a token (one time)

1. [https://github.com/settings/tokens](https://github.com/settings/tokens)  
2. **Generate new token (classic)**  
3. Note: `engineering-tools-push`  
4. Expiration: 90 days (or your preference)  
5. Scope: check **`repo`**  
6. Generate → **copy the token** and paste it when Git asks for a password  

## Part C — Turn on GitHub Pages

1. Open your repo on GitHub  
2. **Settings → Pages**  
3. **Source:** Deploy from a branch  
4. **Branch:** `main`  
5. **Folder:** `/ (root)`  
6. **Save**

Wait 1–2 minutes, then open:

```
https://YOUR_USERNAME.github.io/engineering-tools/
```

Fire Pump Sizer:

```
https://YOUR_USERNAME.github.io/engineering-tools/fire-pump-sizer/
```

## Part D — Test checklist

- [ ] Portal home page loads  
- [ ] Click **Fire Pump Sizer**  
- [ ] Summary numbers update when you change flow/pressure  
- [ ] **Load DoD Example** works  
- [ ] **Verify & Curve** tab shows chart + test points table  
- [ ] **Copy Results** works  
- [ ] On iPad Safari: same URL → optional **Add to Home Screen**

## Alternative: upload in the browser (no git push)

If push is blocked by company policy:

1. Create empty public repo as in Part A  
2. On the empty repo page, choose **uploading an existing file**  
3. Drag in everything from `C:\Users\kdclay\grokdaddy` **except** the hidden `.git` folder  
4. Commit  
5. Enable Pages as in Part C  

## Local test (before GitHub)

```powershell
cd C:\Users\kdclay\grokdaddy
# PowerShell mini-server (no install):
$root = (Get-Location).Path
$listener = [System.Net.HttpListener]::new()
$listener.Prefixes.Add('http://127.0.0.1:4173/')
$listener.Start()
Write-Host 'Open http://127.0.0.1:4173/  (Ctrl+C to stop)'
while ($listener.IsListening) {
  $ctx = $listener.GetContext()
  $rel = $ctx.Request.Url.LocalPath.TrimStart('/').Replace('/','\')
  if ([string]::IsNullOrWhiteSpace($rel)) { $rel = 'index.html' }
  $file = Join-Path $root $rel
  if (Test-Path $file -PathType Container) { $file = Join-Path $file 'index.html' }
  if (Test-Path $file -PathType Leaf) {
    $bytes = [IO.File]::ReadAllBytes($file)
    $ctx.Response.StatusCode = 200
    $ctx.Response.OutputStream.Write($bytes,0,$bytes.Length)
  } else { $ctx.Response.StatusCode = 404 }
  $ctx.Response.Close()
}
```
