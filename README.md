# Step — adaptive nicotine tapering

Each evening you rate your craving 0–10; each morning the app gives you a
number of cigarettes for the day — the smallest one your own answers support.
English and Romanian.

It implements the integral controller from *Online Control for Adaptive
Tapering of Medications* (Gradu & Recht, 2023,
[arXiv:2309.11629](https://arxiv.org/abs/2309.11629)), Eq. 5.1.

Live: https://paula-gradu.github.io/tapering-app-2/

## Running it

Plain HTML, CSS and JavaScript modules — no framework, no build step, no
dependencies. Serve the folder and open it:

```sh
python3 -m http.server 8000
# then http://localhost:8000/        the app
#      http://localhost:8000/tests/  the tests
```

(Opening `index.html` straight from disk won't work: browsers refuse to load
JavaScript modules from `file://`.) Pushing to `main` deploys via GitHub Pages.

## Layout

| File | What it holds |
| --- | --- |
| `js/model.js` | The maths: gains from the setup answers, and tomorrow's number. Pure functions. |
| `js/strings.js` | Every word on screen, in both languages. |
| `js/store.js` | What is saved on the phone, and loading older records. |
| `js/derive.js` | Values computed from state that the screens and actions share. |
| `js/app.js` | State, actions, sliders, sync, and event wiring. |
| `js/views/*.js` | One file per screen or sheet; each is a function from state to markup. |
| `js/dom.js` | `html` (escaping templates) and `morph` (in-place DOM updates). |
| `styles.css` | Design tokens and all styling. |
| `fonts/` | Caprasimo, Figtree and Fraunces, bundled so the app needs no network. All three are under the SIL Open Font License. |
| `tests/` | Model, strings and storage tests. |

## The model

Each evening, with craving `y` and today's floor `y_min`:

```
err  = y_min − y                          // positive: room to step down
K    = err ≥ 0 ? K+ : K−                  // K+ = 1/g_high, K− = 1/g_low
raw  = clamp(0, ceiling, round(taken − K·err))
next = clamp(today − step, today + step, raw)
```

- `taken` is what he confirmed he smoked, not the day's number (Eq. 3.1).
- `g` comes from setup: `without` points of craving over `nLow–nHigh` cigarettes.
- `ceiling` is the count from first setup; never exceeded, never lowered by a restart.
- `step` is a fifth of the ceiling (at least 1): the number never moves further
  than that from one day to the next, in either direction.
- `y_min` is the tolerable level from Settings. (The first build let a hard day
  raise it for that day only; such days keep `raised: true` in their record.)

The number going up after a hard day is the protocol, not a bug.

## Saved data

`localStorage` key `step.nicotine.v2`, the same key and shape as the first
build. Both builds are on `paula-gradu.github.io`, so a phone that used the
first one carries its history straight over. If the shape changes, bump the
key and migrate in `js/store.js`.

## Cloud sync (not switched on)

`SYNC_URL` in `js/app.js` is empty, so days stay on the phone. Setting it to a
Google Apps Script web-app URL sends each day as `{"rows": [...]}`. Before
turning it on, add a shared secret checked in `doPost`, and tell the person
using the app where their data goes.
