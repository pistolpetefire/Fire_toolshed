# FA Power Extenders — User Guide

**Version 1.1.1** · Fire Toolshed · Preliminary design tool only

This guide assumes you are **new to fire alarm design**. Every button and box is explained. If a word is in **bold** the first time, a plain-English meaning follows.

Open this same guide in the app with **Help / Guide**.

---

## What this tool is for

A **fire alarm control panel (FACP)** is the main box that runs the building’s fire alarm. It has a limited amount of electrical power for the devices that make noise and flash lights.

Those 24-volt light/horn circuits are called **NACs** (notification appliance circuits). Speakers for voice messages use a different circuit (25 V or 70.7 V audio).

If you put too many devices on a circuit, or run the wire too far, two things happen:

1. The circuit **overloads** (too many amps or too many speaker watts).
2. Voltage **drops** along the wire, and the last device may not work.

A **power extender** (also called a booster panel) is a second power supply you place closer to the devices. For speakers, the equivalent is a **remote amplifier**.

This app answers: *can the main panel handle this takeoff, or do you need a booster / remote amp?*

**It is a first-cut estimate only.** It is not a listed calculation and does not replace the manufacturer’s manual, a stamped design, or the authority having jurisdiction (**AHJ** — the fire marshal or reviewing official).

---

## What to gather before you start

You do not need every document to try the **Example**. For a real building, collect:

| Item | Where you get it | What you will type |
|------|------------------|--------------------|
| Floor plans | Architect / CAD | How many devices, which floor, about how far from the panel |
| FACP data sheet | Panel manufacturer (Notifier, Fire-Lite, Edwards, Simplex, Siemens, etc.) | How many NAC circuits, amps per circuit, total NAC power, whether there is a built-in speaker amplifier |
| Device cut sheet or **submittal** | The product data for the exact horn, strobe, or speaker you will buy | Candela, alarm current in milliamps (mA), speaker tap in watts, minimum voltage |
| Wire spec | Electrical / FA typicals | 16 AWG or 14 AWG unshielded fire-alarm cable is common |
| Code path | Project criteria | Commercial **NFPA 72**, or **UFC** for Department of Defense / military work |

If you do not have cut sheets yet, the app fills in **typical** currents. Replace those numbers when the submittal arrives.

---

## The five numbers at the top

These update as you type. You do not enter them.

| Card | Meaning |
|------|---------|
| **Circuits failing** | How many circuits did not pass. Red = at least one fail. |
| **FACP NAC load** | Total 24 V alarm current still on the main panel, versus the panel’s budget. If you added speakers, it also shows amplifier watts. |
| **Worst last-device V** | The lowest voltage the app thinks the farthest device still has. Need about 16 V on a 24 V NAC, or 85% of 25 / 70.7 V on speakers. |
| **Extenders** | How many booster / remote-amp boxes you have placed. |
| **Verdict** | The short answer: no extender, optional changes, or extender / remote amp required. |

---

## Toolbar (every control)

Work left to right the first time.

| Control | What to do |
|---------|------------|
| **NFPA 72 / UFC** | Leave **NFPA 72** for most civilian buildings. Turn **UFC** on for military / DoD. UFC uses a longer battery standby (60 hours). If you also have speakers, UFC 4-021-01 sizes mass-notification alarm time at **60 minutes**. |
| **Dark / Light** | Screen theme only. Does not change the math. |
| **Methodology** | Shows the formulas. You can ignore this until you are comfortable. |
| **Help / Guide** | Opens this document. |
| **Example** | Loads a practice building (Bldg 1442). Safe way to see a “fail” and a recommended booster. Overwrites the current project — save first if you care about your numbers. |
| **Save project** | Stores a snapshot in *this browser only* (last 5). Not in the cloud. |
| **CSV** | Downloads the device table for Excel. |
| **Copy summary** | Copies a short paragraph for email or a basis-of-design. |
| **Print to PDF** | Browser print dialog. Choose “Save as PDF.” |
| **Save report** | Downloads an HTML report you can attach or print later. |
| **Portal** | Back to the Engineering Tools home page. Does not erase your save. |
| **Reset** | Empty generic panel. Asks first. |
| **⚠** | Disclaimer. |

---

## Step 1 — Project & criteria (every box)

These boxes do **not** size the system. They label the report so someone else knows whose job this is.

| Box | What to type | Novice tip |
|-----|----------------|------------|
| **Project name** | Job name, e.g. `Bldg 1442 fire alarm` | Shows on the report filename. |
| **Building / area** | Which building or wing | Helps when one job has several areas. |
| **Engineer** | Your name | Signature block on the report. |
| **Company** | Your firm | Same. |
| **PE number** | License number if you have one | Optional. Leave blank if you are not sealing this. |
| **Date** | Report date | Defaults to today. |
| **Occupancy / notification** | e.g. `B office, horn-strobe` or `school, voice / MNS` | Reminder of the system type. Does not change the math by itself. Speakers in the tables *do* change battery time. |
| **NFPA 72 edition** | Year the project uses (2016–2025) | Printed on the report only. The drop formulas stay the same. |
| **Source voltage** | Keep **20.4 V** unless a reviewer tells you otherwise | 20.4 V is 85% of 24 V — the voltage when batteries are nearly worn out. Using 24 V makes the answer look better than the worst day. |
| **Custom source voltage** | Only if you picked Custom | Type the manufacturer’s starting voltage from the NAC calculator notes. |
| **Spare capacity target** | Keep **20** unless the spec says otherwise | Means “do not fill a 2.0 A circuit past 1.6 A.” Leaves room for a few added devices. |
| **Notes** | AHJ comments, manufacturer, “strobes must sync” | Prints on the report. |
| **Report logo** | Benham, MeadHunt JV, Haskell (pick the project state), or upload | Shared with other Fire Toolshed report tools in this browser. |

---

## Step 2 — FACP inventory (every box)

This is the **main panel’s power**. Look at the FACP data sheet, usually a table titled “NAC ratings,” “notification circuit,” or “output circuits.”

| Box | What to type | How to find it |
|-----|----------------|----------------|
| **Panel preset** | Start with **Generic 24 V — 4 × 2.0 A (6 A budget)** | A starter. Change it if your data sheet is different. Changing a preset **erases device rows** after you confirm. |
| **Panel name / model** | e.g. `Fire-Lite ES-50X` | Cover of the installation manual. |
| **System voltage** | **24 VDC** for almost all new work | 12 V is old or special. |
| **Total circuits** | How many NAC + audio rows you want on screen | You can also press **Add NAC** / **Add audio circuit**. Lowering this number can delete rows. |
| **Default amps / NAC** | e.g. `2` or `3` | Data sheet: “NAC 1–4: 2.0 A each” or “3.0 A special application.” This is only the default for **new** NAC rows. Each circuit has its own rating you can edit. |
| **Panel NAC budget** | e.g. `6` | Data sheet: “total NAC power” or “alarm current, all NACs.” Often **less** than (circuits × amps). Four 3 A circuits might still share only 6 A. |
| **Onboard amplifier** | Watts of **built-in** speaker amp, or `0` | Data sheet: “25 W integrated amplifier,” “50 W audio.” Type **0** if the panel is horns/strobes only. The first time you add an audio circuit, the app offers 50 W if this is still 0. |
| **Default speaker voltage** | **25 V** or **70.7 V** | Data sheet or the amplifier module. 25 V is common inside one building. 70.7 V is used for longer runs. New audio circuits inherit this. |
| **Default circuit class** | **Class B** unless the spec requires Class A | **Class B** = two wires out to the last device, then an end-of-line resistor. **Class A** = the pair comes back to the panel (a loop). Class A uses more copper, so voltage drop is worse in this conservative method. |
| **Default wire** | **16 AWG** is a typical start | See “How to choose wire” below. New device rows inherit this. |
| **Default placement** | **Distributed (½ run)** for a corridor of devices; **End of line** if you want to be extra safe | See “Placement” below. |

---

## Step 3 — Notification circuits

### Add the right kind of circuit

| Button | Use when |
|--------|----------|
| **Add NAC** | Horns, strobes, horn-strobes, chimes, or the **strobe half** of a speaker-strobe. These are 24 V. |
| **Add audio circuit** | Speakers, or the **speaker half** of a speaker-strobe. These are 25 V or 70.7 V. |

A **speaker-strobe** is one physical device that is **two electrical loads**. Enter it twice:

1. On a NAC: type **Speaker-strobe**, set **candela**, use the mA the app fills (or the cut sheet).
2. On an audio circuit: type **Speaker-strobe** or **Speaker**, set the **tap** in watts.

### Every field on a NAC card

| Field | What it means | How to fill it |
|-------|----------------|----------------|
| **Circuit name** | Your label | `NAC 1 — Floor 1` is clearer than `NAC 1`. |
| **Kind** | NAC 24 V vs audio | Switch only if you created the wrong type. |
| **Class** | B or A | Match the drawings. When in doubt, Class B. |
| **Rating (A)** | How many amps this one circuit may carry | From the FACP sheet for that NAC. Commonly 1.5, 2.0, or 3.0 A. |
| **Powered by** | FACP or a booster you added later | Leave **FACP** until the verdict tells you to move the circuit. |
| **Role** | Notification vs extender trigger | Keep **Notification**. After you add a booster, one leftover NAC (or an SLC control module) is used only to **tell the booster to turn on**. Set that spare NAC to **Extender trigger**. |
| **Remove** | Deletes the whole circuit | |

### Every column on a NAC device row

| Column | What it means | How to determine it |
|--------|----------------|---------------------|
| **Zone** | Where the devices sit | Floor, wing, or room name from the plan. Used in the recommendation text. |
| **Type** | What the device is | See the device-type list below. |
| **Cd** (candela) | How bright the strobe is | See “How to pick candela.” |
| **Qty** | How many of that exact type/candela on **this** circuit | Count them on the plan. Do not put Floor 1 and Floor 2 on the same row if they are on different circuits. |
| **mA** | Alarm current, milliamps | See “How to find mA.” The app starts with a typical number. **Replace from the cut sheet.** |
| **Ft** | One-way wire length, feet | See “How to measure distance.” |
| **AWG** | Wire thickness | Larger number = thinner wire = more voltage drop. 16 is thinner than 14. |
| **Place** | Where the load sits on the run | **End** = all current treated as at the far end (safest). **Distributed** = halfway (typical corridor). **Start** = devices clustered near the panel. |
| **Vmin** | Lowest voltage the device still works | Cut sheet, often **16 V** for 24 V horns/strobes. Leave 16 if you are unsure. |
| **I (A)** | Calculated amps for that row | Qty × (mA ÷ 1000). You do not type this. |
| **×** | Deletes the row | |

**Bulk add** (bottom of the card): pick type, candela, quantity, feet, and zone, then **Bulk add**. Good for “20 horn-strobes at 75 cd along a 180 ft corridor.”

### Every field on an audio card

| Field | What it means | How to fill it |
|-------|----------------|----------------|
| **Voltage** | 25 V or 70.7 V | Must match the amplifier. Do not mix 25 V speakers on a 70.7 V circuit. |
| **Channel (W)** | Watts this circuit / amp channel may deliver | From the amp sheet, e.g. 25, 50, or 75 W. Leave spare (the 20% target applies here too). |
| **Tap** | Speaker transformer setting, watts | See “How to pick a speaker tap.” |
| **W** | Calculated watts | Qty × tap. You do not type this. |
| **I (A)** | Current on the speaker pair | Watts ÷ voltage. Used only for voltage drop. |

---

## How to determine device details

This is the part most first-time users get stuck on.

### 1. What kind of device is it?

Walk the plan or the room and match the symbol:

| You see on the plan | Choose in the app |
|---------------------|-------------------|
| Horn or sounder only | **Horn** (or **Mini-horn** for a small unit) |
| Strobe (light) only | **Strobe** |
| Horn and strobe in one plate | **Horn-strobe** |
| Chime, or chime-strobe | **Chime** / **Chime-strobe** |
| Speaker grille (voice) | **Speaker** on an **audio** circuit |
| Speaker + strobe | **Speaker-strobe** on **both** a NAC and an audio circuit |

If you only have a symbol legend, look for “H/S,” “S,” “SPKR,” or “SP/ST.”

### 2. How to pick strobe candela (Cd)

**Candela** is brightness. A small room might use 15 cd. A large open office or corridor often uses 75 or 110 cd. Sleeping rooms and restrooms have special rules in NFPA 72.

How designers usually get it:

1. Measure the room (length × width, and whether the strobe is on the wall or ceiling).
2. Open NFPA 72’s visible-notification tables (wall or ceiling).
3. Pick the listed candela that covers that room size.

You do **not** need those tables to use this app, but you **do** need a candela to get the right current — brighter strobes draw more milliamps.

If you do not know yet, **75 cd** is a common corridor starting point. Change it when the lighting layout is done.

### 3. How to find alarm current (mA)

This number is on the **device cut sheet** or the **installation instruction**, in a table of “operating current,” “alarm current,” or “FWR / DC current” at 24 VDC.

Steps:

1. Find the exact model (example: `P2RL`, `HSR`, `GCS24`).
2. Find the **24 VDC** column (not 12 V, not FWR if a DC column exists).
3. Find the row for your **candela** and horn setting (high/low).
4. Read milliamps (mA) or amps (A). If it says 0.165 A, that is 165 mA.
5. Type that number in the **mA** box. The app then marks it as a user override.

Until you have the sheet, leave the typical value. Write in **Notes**: “currents are typical catalog — replace at submittal.”

### 4. How to pick a speaker tap (watts)

A speaker has a small transformer with settings such as ¼, ½, 1, or 2 watts. Higher tap = louder = more load on the amplifier.

How to choose:

1. The acoustical designer or the FACP/amp manufacturer’s speaker-layout guide sets the tap so the room meets the required dB (often 15 dB above ambient, or 75 dBA in many occupancies — confirm in NFPA 72 / UFC 4-021-01).
2. If you only have a drawing, the tap is often written next to the speaker (`1W`, `2W`).
3. If nothing is shown, **1 W** is a common interior starting point; **2 W** is louder / larger rooms. Confirm later.

Add all taps on a circuit. They must stay under the amplifier channel rating with spare.

### 5. How to count quantity

Count devices that share **the same type, candela (or tap), and roughly the same distance** on **one circuit**.

Split the row if:

- Candela or tap changes
- The run length is very different (a 40 ft closet vs a 300 ft wing)
- They are on different NAC or audio circuits

### 6. How to measure distance (Ft)

Type the **one-way** cable length from the **power source of that circuit** to the last device on that row.

| Situation | What to measure |
|-----------|-----------------|
| Devices still on the FACP | FACP to the farthest device, along the wire route (down corridors, up shafts), not a straight line through walls |
| After you apply a booster | **Booster to the farthest device**, not the old homerun back to the FACP |
| You only have a scale plan | Scale the route with a ruler or CAD polyline, then add 10–15% for rises and slack if you have not routed it yet |

**Class A:** this app also uses a return length (defaults to the same as the outgoing length). That is the conservative 4-wire method.

If you are unsure, enter a **longer** distance. That makes voltage drop worse, which is the safe direction.

### 7. How to choose wire (AWG)

| AWG | Typical use |
|-----|-------------|
| 18 | Short, lightly loaded (often too thin for strobe NACs) |
| 16 | Common default for NAC and speaker pair |
| 14 | Longer run or heavier load |
| 12 | Long homerun; last practical size this app will recommend |
| 10 | Allowed for what-if only; rarely used for FA NAC cable |

Thicker wire (smaller AWG number) reduces voltage drop but costs more and is harder to land on terminals. If 12 AWG still fails, you need a booster or remote amp, not a bigger wire.

### 8. Placement (End / Distributed / Start)

| Choice | When to use |
|--------|-------------|
| **End of line** | You want a conservative answer, or most devices sit at the far end |
| **Distributed** | Devices are spread along the corridor (usual) |
| **Start** | Almost everything is next to the panel |

When unsure, use **End** (safer) or **Distributed** (typical).

### 9. Minimum voltage (Vmin)

| Circuit | Typical Vmin | Source |
|---------|--------------|--------|
| 24 V horn/strobe | **16 V** | Device cut sheet |
| 25 V speakers | **21.3 V** (85% of 25) | This app’s default |
| 70.7 V speakers | **60.1 V** (85% of 70.7) | This app’s default |

If the cut sheet lists a different minimum, type it.

---

## Step 4 — Read the verdict

The colored box under **Verdict & recommended fix** is the answer.

| Color / title | What it means | What you do next |
|---------------|----------------|------------------|
| Green — **No extender required** | Current, watts, drop, spare, and budgets pass | Document it. Still verify with the real cut sheets. |
| Amber — **Optional** | 12 AWG or moving devices onto a spare circuit may clear it | Try a thicker wire in the compare table, or split the load. A booster is still allowed. |
| Red — **Required** | Overload with no spare, or even 12 AWG is still too long | Press **Apply recommended extender**. |

The **wire compare** table shows each FACP circuit as entered, then as if it were 16 / 14 / 12 AWG. Current overload does **not** improve with thicker wire.

**Apply recommended extender** will:

- Create a 24 V booster for failing NAC circuits, and/or
- Create a remote amplifier for failing speaker circuits
- Move those circuits onto the new box

Then **change the Ft column** to the short run from the new box. Leave the old 400 ft homerun in place and the circuit will still look like a fail.

Strobes that flash in the same area must stay **synchronized** (they flash together). The extender must be listed to sync with the FACP.

---

## Step 5 — Power extenders (every box)

You can add a box by hand with **Add extender**, then set **Kind**.

| Field | NAC extender | Remote amplifier |
|-------|----------------|------------------|
| **Name / location** | `EXT-1 west wing` | `AMP-1 Bldg 1442A` |
| **Kind** | NAC extender | Remote amplifier |
| **Size band (A)** | 6, 8, or 10 A class | — |
| **A / NAC** | Amps on each booster NAC | — |
| **Amp (W)** | — | 25–150 W band |
| **η (efficiency)** | — | Leave **0.55** unless the amp sheet gives a better 24 V current method |
| **Channels** | How many NAC or speaker circuits the box has | Same idea |
| **Idle (A)** | Electronics current with no alarm (sheet: “standby current”). Default 0.09 A (booster) or 0.15 A (amp). | |
| **Remove** | Circuits on it return to the FACP | |

The booster needs a dedicated 120 VAC circuit and a listed cabinet location. The FACP still needs a **trigger** (one NAC or an addressable control module) so the booster turns on in alarm.

---

## Step 6 — Extender batteries (every box)

Only the **booster / remote amp** batteries are sized. The main FACP battery is **not** sized here (smoke detectors and the panel electronics are not in this app).

| Box | Default | What it is |
|-----|---------|------------|
| **Aging factor** | 1.25 | Batteries lose capacity over years. NFPA-style aging. |
| **Temperature factor** | 1.0 | Use about **1.2** if the box is in a cold garage or exterior cabinet. |
| **Battery spare factor** | 1.2 | Extra 20% on the calculated amp-hours. |

The app prints required amp-hours and suggests a common sealed-lead pair (for example `12 V 18 Ah × 2`).

| Code path | Standby | Alarm |
|-----------|---------|--------|
| NFPA 72, horns/strobes only | 24 h | 5 min |
| NFPA 72, any speaker circuit | 24 h | 15 min |
| UFC, horns/strobes only | 60 h | 5 min |
| UFC + speakers (mass notification) | 60 h | **60 min** (UFC 4-021-01, max connected load) |

---

## Step 7 — Save, history, and reports

| Control | What it does |
|---------|--------------|
| **Save project** | Adds a snapshot to **Project history** (last 5, this browser). |
| **Restore** | Reloads the snapshot you picked in the list. |
| **CSV** | Device table for Excel. |
| **Copy summary** | Short text for email. |
| **Save report / Print to PDF** | Formal package: inputs, circuits, verdict, batteries, assumptions, signature line. |

Data never leaves your computer except the file you download.

---

## A first practice run (15 minutes)

1. Click **Example**. Read the red verdict.
2. Open **NAC 2** and **Audio 2**. Note the 620 ft distance — that is why they fail.
3. Click **Apply recommended extender**. Two boxes appear.
4. Change those circuits’ **Ft** to something local (for example 80 ft) as if the booster sat in 1442A.
5. Watch the verdict go greener as drop improves.
6. Toggle **UFC** and look at the battery suggestion — MNS alarm time becomes 60 minutes.
7. Click **Help / Guide** if any label is still unclear.

---

## Formulas (optional)

```
I_NAC = Σ (qty × device alarm current)
W = Σ (qty × tap)
I_pair = W / V_audio
L_eff = k × L_one-way     k = 1 (end), 0.5 (distributed), 0.15 (start)
Class A: L_eff = k × L_one-way + L_return
VD = 2 × I × (Ω/kft / 1000) × L_eff
V_last = V_source − VD
I_amp_24V = idle + W / (η × 24)
```

Wire resistance is from NEC Chapter 9 Table 8 (stranded copper). The whole circuit current is applied over each row’s length (conservative). Not a node-by-node listed calculation.
