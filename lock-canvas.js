// Synostik-Schloss als Canvas-2D-Animation
// Eine einzige Datei, keine Abhängigkeiten (kein three.js, keine GLB, kein Build-Schritt).
//
// Einbindung in Webflow:
//   <div id="lock-hero" data-bg="#0a0f1e"></div>      (data-bg ist optional)
//   <script src="https://.../lock-canvas.min.js" defer></script>
//
// Neu abspielen: window.synostikLock.replay()

;(function () {
  'use strict'

  // Form des Schlosses (aus Synostik-Schloss.glb übernommen): Eckpunkte x,y und Dreiecke
  var SHAPE = {"v":[-0.749,0.293,-0.749,0.751,-0.742,0.853,-0.722,0.95,-0.69,1.042,-0.647,1.129,-0.593,1.208,-0.529,1.28,-0.457,1.344,-0.378,1.398,-0.291,1.441,-0.199,1.473,-0.102,1.493,0.0,1.5,0.102,1.493,0.199,1.473,0.291,1.441,0.378,1.398,0.457,1.344,0.529,1.28,0.593,1.208,0.647,1.129,0.69,1.042,0.722,0.95,0.742,0.853,0.749,0.751,0.749,0.742,0.749,0.717,0.749,0.679,0.749,0.632,0.749,0.579,0.749,0.522,0.749,0.465,0.749,0.411,0.749,0.364,0.749,0.327,0.749,0.302,0.749,0.293,0.5,0.293,0.5,0.302,0.5,0.327,0.5,0.364,0.5,0.411,0.5,0.465,0.5,0.522,0.5,0.579,0.5,0.632,0.5,0.679,0.5,0.717,0.5,0.742,0.5,0.751,0.496,0.819,0.483,0.884,0.461,0.946,0.432,1.004,0.396,1.057,0.354,1.105,0.306,1.147,0.253,1.183,0.195,1.212,0.133,1.234,0.068,1.247,0.0,1.251,-0.068,1.247,-0.133,1.234,-0.195,1.212,-0.253,1.183,-0.306,1.147,-0.354,1.105,-0.396,1.057,-0.432,1.004,-0.461,0.946,-0.483,0.884,-0.496,0.819,-0.5,0.751,-0.5,0.742,-0.5,0.717,-0.5,0.679,-0.5,0.632,-0.5,0.579,-0.5,0.522,-0.5,0.465,-0.5,0.411,-0.5,0.364,-0.5,0.327,-0.5,0.302,-0.5,0.293,-1.004,0.219,-1.004,-1.5,1.004,-1.5,1.004,0.219,0.11,-0.62,0.11,-1.081,0.109,-1.081,0.109,-1.081,0.109,-1.081,0.11,-1.082,0.11,-1.082,0.11,-1.082,0.11,-1.082,0.11,-1.082,0.11,-1.082,0.11,-1.083,0.11,-1.083,0.11,-1.083,0.11,-1.083,0.109,-1.098,0.106,-1.112,0.101,-1.126,0.095,-1.138,0.087,-1.15,0.077,-1.161,0.067,-1.17,0.055,-1.178,0.043,-1.184,0.029,-1.189,0.015,-1.192,0.0,-1.193,-0.015,-1.192,-0.029,-1.189,-0.043,-1.184,-0.055,-1.178,-0.067,-1.17,-0.077,-1.161,-0.087,-1.15,-0.095,-1.138,-0.101,-1.126,-0.106,-1.112,-0.109,-1.098,-0.11,-1.083,-0.11,-1.083,-0.11,-1.083,-0.11,-1.083,-0.11,-1.082,-0.11,-1.082,-0.11,-1.082,-0.11,-1.082,-0.11,-1.082,-0.11,-1.082,-0.11,-1.081,-0.11,-1.081,-0.11,-1.081,-0.11,-0.62,-0.126,-0.609,-0.142,-0.598,-0.157,-0.585,-0.171,-0.57,-0.183,-0.555,-0.194,-0.538,-0.203,-0.521,-0.211,-0.502,-0.218,-0.483,-0.222,-0.463,-0.225,-0.443,-0.226,-0.422,-0.224,-0.391,-0.218,-0.362,-0.208,-0.334,-0.195,-0.308,-0.179,-0.284,-0.16,-0.262,-0.138,-0.243,-0.114,-0.227,-0.088,-0.214,-0.06,-0.204,-0.031,-0.198,0.0,-0.196,0.031,-0.198,0.06,-0.204,0.088,-0.214,0.114,-0.227,0.138,-0.243,0.16,-0.262,0.179,-0.284,0.195,-0.308,0.208,-0.334,0.218,-0.362,0.224,-0.391,0.226,-0.422,0.225,-0.443,0.222,-0.463,0.218,-0.483,0.211,-0.503,0.203,-0.521,0.194,-0.538,0.183,-0.555,0.171,-0.57,0.157,-0.585,0.142,-0.598,0.126,-0.609],"t":[12,14,13,12,15,14,11,15,12,11,16,15,10,16,11,9,16,10,9,17,16,8,17,9,8,18,17,7,18,8,7,19,18,6,63,7,63,62,7,62,19,7,62,61,19,61,20,19,6,64,63,60,20,61,6,65,64,59,20,60,6,66,65,58,20,59,58,21,20,5,66,6,5,67,66,57,21,58,5,68,67,56,21,57,56,22,21,4,68,5,4,69,68,55,22,56,4,70,69,54,22,55,54,23,22,3,70,4,3,71,70,53,23,54,53,24,23,2,71,3,2,72,71,52,24,53,2,73,72,51,24,52,51,25,24,1,73,2,1,74,73,50,25,51,0,74,1,0,75,74,49,25,50,49,26,25,0,76,75,49,27,26,48,27,49,0,77,76,48,28,27,47,28,48,0,78,77,47,29,28,46,29,47,0,79,78,46,30,29,45,30,46,0,80,79,45,31,30,44,31,45,0,81,80,44,32,31,43,32,44,0,82,81,42,32,43,42,33,32,0,83,82,41,33,42,41,34,33,0,84,83,40,34,41,40,35,34,0,85,84,39,35,40,39,36,35,0,86,85,38,36,39,38,37,36,88,159,87,159,160,87,160,161,87,161,162,87,162,163,87,163,90,87,163,164,90,164,165,90,165,166,90,166,167,90,167,168,90,168,169,90,169,170,90,170,171,90,171,172,90,172,173,90,173,89,90,174,89,173,88,158,159,175,89,174,88,157,158,176,89,175,88,156,157,177,89,176,88,155,156,178,89,177,88,154,155,88,153,154,179,89,178,88,152,153,180,89,179,88,151,152,181,89,180,88,150,151,182,89,181,88,149,150,183,89,182,88,148,149,184,89,183,88,147,148,185,89,184,88,146,147,186,89,185,88,145,146,187,89,186,88,144,145,188,89,187,88,143,144,189,89,188,88,142,143,91,89,189,88,141,142,92,89,91,88,140,141,94,92,93,94,89,92,88,139,140,95,89,94,88,138,139,96,89,95,88,137,138,97,89,96,88,136,137,98,89,97,88,135,136,99,89,98,88,134,135,100,89,99,88,133,134,101,89,100,88,132,133,102,89,101,88,131,132,103,89,102,88,130,131,104,89,103,88,129,130,105,89,104,88,128,129,106,89,105,88,127,128,107,89,106,88,126,127,108,89,107,88,125,126,109,89,108,88,124,125,110,89,109,88,123,124,111,89,110,88,122,123,112,89,111,88,121,122,113,89,112,88,120,121,114,89,113,88,119,120,115,89,114,88,118,119,116,89,115,88,117,118,117,89,116,88,89,117]}

  // ---------------------------------------------------------------
  // Einstellungen zum Herumspielen
  // ---------------------------------------------------------------
  var S = {
    surfacePoints: 420,   // Punkte auf der Fläche
    edgePoints: 330,      // Punkte entlang der Kontur (Außenrand, Schlüsselloch)
    neighbors: 4,         // Linien pro Punkt
    neighborPool: 18,     // Linien werden zufällig aus den N nächsten Punkten gewählt
    maxLineDist: 1.1,     // maximale Linienlänge
    outlineLinks: 2,      // jeder Konturpunkt wird mit N Nachbarn auf der Kontur verbunden
    triangleChance: 0.12, // Anteil der Dreiecke, die als helle Fläche gefüllt werden
    color: [255, 143, 163], // Rosa
    lineOpacity: 0.45,
    triangleOpacity: 0.1,
    buildDuration: 5,     // Sekunden, bis sich das Schloss aufgebaut hat
    drift: 0.03,          // wie stark die Punkte ständig leicht schweben
    dustCount: 140,       // frei herumfliegende Partikel (ohne Linien)
    glow: 1,              // Stärke des Leuchtens (0 = aus)
    mobileFactor: 0.6,    // Anteil der Punkte auf schmalen Bildschirmen (< 700 px)
    tilt: 0.06,           // wie stark sich das Schloss zur Maus neigt (0 = gar nicht)
    sway: 0.12,           // wie stark das Schloss von selbst hin und her schwenkt (0 = gar nicht)
    scatter: 1            // wie stark die Maus die Punkte wegschleudert (0 = aus, 2 = doppelt so stark)
  }

  var container = document.getElementById('lock-hero')
  if (!container) {
    console.warn('Element #lock-hero nicht gefunden')
    return
  }

  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  var dpr = Math.min(window.devicePixelRatio || 1, 1.5) // Retina-Displays nicht voll auflösen (spart Rechenzeit)

  // ---------------------------------------------------------------
  // Canvas einrichten (transparent: es scheint der Hintergrund aus Webflow durch)
  // ---------------------------------------------------------------
  if (getComputedStyle(container).position === 'static') container.style.position = 'relative'
  container.style.overflow = 'hidden'
  if (container.dataset.bg) container.style.background = container.dataset.bg

  var canvas = document.createElement('canvas')
  canvas.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;display:block;touch-action:pan-y'
  canvas.setAttribute('aria-hidden', 'true')
  container.appendChild(canvas)
  var ctx = canvas.getContext('2d')

  // kleinere Kopien für den Glow (Ersatz für den Bloom-Effekt)
  var g2 = document.createElement('canvas')
  var g3 = document.createElement('canvas')
  var c2 = g2.getContext('2d')
  var c3 = g3.getContext('2d')

  var W = 0 // Breite in CSS-Pixeln
  var H = 0
  var scale = 1 // Pixel pro Szeneneinheit
  var camZ = 6.5

  function resize() {
    W = container.clientWidth
    H = container.clientHeight
    if (!W || !H) return
    canvas.width = Math.round(W * dpr)
    canvas.height = Math.round(H * dpr)
    g2.width = Math.max(2, canvas.width >> 2)
    g2.height = Math.max(2, canvas.height >> 2)
    g3.width = Math.max(2, canvas.width >> 3)
    g3.height = Math.max(2, canvas.height >> 3)
    // gleiche Sicht wie die three.js-Version: Kamera bei z = 6.5, 45° Blickwinkel;
    // auf Hochkant-Bildschirmen weiter weg, damit alles ins Bild passt
    camZ = Math.max(6.5, 5.6 / (W / H))
    // data-zoom am Div vergrößert (> 1) oder verkleinert (< 1) das Schloss, z. B. data-zoom="1.5"
    var zoom = parseFloat(container.dataset.zoom) || 1
    scale = (H / (2 * camZ * Math.tan((45 / 2) * Math.PI / 180))) * zoom
  }

  // ---------------------------------------------------------------
  // Hilfsfunktionen
  // ---------------------------------------------------------------
  function sm(a, b, x) {
    var t = (x - a) / (b - a)
    t = t < 0 ? 0 : t > 1 ? 1 : t
    return t * t * (3 - 2 * t)
  }
  function clamp01(x) {
    return x < 0 ? 0 : x > 1 ? 1 : x
  }
  var rnd = Math.random

  // Leuchtpunkt-Sprite: heller Kern + weicher Schein (wie der Shader der three.js-Version)
  var sprite = (function () {
    var N = 64
    var c = document.createElement('canvas')
    c.width = c.height = N
    var g = c.getContext('2d')
    var img = g.createImageData(N, N)
    for (var y = 0; y < N; y++) {
      for (var x = 0; x < N; x++) {
        var dx = (x + 0.5) / N - 0.5
        var dy = (y + 0.5) / N - 0.5
        var d = Math.sqrt(dx * dx + dy * dy)
        var o = (y * N + x) * 4
        if (d >= 0.5) continue
        var core = 1 - sm(0, 0.16, d)
        var glow = Math.pow(1 - 2 * d, 2.5)
        var a = Math.min(1, core + glow * 0.7)
        img.data[o] = S.color[0] + (255 - S.color[0]) * core
        img.data[o + 1] = S.color[1] + (255 - S.color[1]) * core
        img.data[o + 2] = S.color[2] + (255 - S.color[2]) * core
        img.data[o + 3] = a * 255
      }
    }
    g.putImageData(img, 0, 0)
    return c
  })()

  // ---------------------------------------------------------------
  // Form vorbereiten: Dreiecke, Konturkanten, Innen-Test
  // ---------------------------------------------------------------
  var V = SHAPE.v
  var T = SHAPE.t
  var triCount = T.length / 3
  var tri = new Float32Array(triCount * 6)
  var tbb = new Float32Array(triCount * 4) // minX, maxX, minY, maxY
  var cumArea = new Float32Array(triCount)
  var totalArea = 0
  var edgeCount = {}
  var i, k

  for (i = 0; i < triCount; i++) {
    var ia = T[i * 3]
    var ib = T[i * 3 + 1]
    var ic = T[i * 3 + 2]
    var ax = V[ia * 2], ay = V[ia * 2 + 1]
    var bx = V[ib * 2], by = V[ib * 2 + 1]
    var cx = V[ic * 2], cy = V[ic * 2 + 1]
    tri.set([ax, ay, bx, by, cx, cy], i * 6)
    tbb[i * 4] = Math.min(ax, bx, cx)
    tbb[i * 4 + 1] = Math.max(ax, bx, cx)
    tbb[i * 4 + 2] = Math.min(ay, by, cy)
    tbb[i * 4 + 3] = Math.max(ay, by, cy)
    totalArea += Math.abs((bx - ax) * (cy - ay) - (cx - ax) * (by - ay)) / 2
    cumArea[i] = totalArea
    ;[[ia, ib], [ib, ic], [ic, ia]].forEach(function (e) {
      var key = Math.min(e[0], e[1]) * 1000 + Math.max(e[0], e[1])
      edgeCount[key] = (edgeCount[key] || 0) + 1
    })
  }

  // Randkanten = Kanten, die nur zu einem Dreieck gehören (Außenrand und Schlüsselloch)
  var segs = []
  var cumLen = []
  var totalLen = 0
  Object.keys(edgeCount).forEach(function (key) {
    if (edgeCount[key] !== 1) return
    var a = Math.floor(key / 1000)
    var b = key % 1000
    segs.push([V[a * 2], V[a * 2 + 1], V[b * 2], V[b * 2 + 1]])
    totalLen += Math.hypot(V[a * 2] - V[b * 2], V[a * 2 + 1] - V[b * 2 + 1])
    cumLen.push(totalLen)
  })

  function pick(cum, total) {
    var r = rnd() * total
    var lo = 0
    var hi = cum.length - 1
    while (lo < hi) {
      var mid = (lo + hi) >> 1
      if (cum[mid] < r) lo = mid + 1
      else hi = mid
    }
    return lo
  }

  function inside(x, y) {
    for (var t = 0; t < triCount; t++) {
      // schneller Vorab-Test mit der Umgebung des Dreiecks
      if (x < tbb[t * 4] - 0.03 || x > tbb[t * 4 + 1] + 0.03 || y < tbb[t * 4 + 2] - 0.03 || y > tbb[t * 4 + 3] + 0.03) continue
      var o = t * 6
      var ax = tri[o], ay = tri[o + 1], bx = tri[o + 2], by = tri[o + 3], cx = tri[o + 4], cy = tri[o + 5]
      var d = (by - cy) * (ax - cx) + (cx - bx) * (ay - cy)
      if (d === 0) continue
      var u = ((by - cy) * (x - cx) + (cx - bx) * (y - cy)) / d
      var v = ((cy - ay) * (x - cx) + (ax - cx) * (y - cy)) / d
      var w = 1 - u - v
      if (u >= -0.02 && v >= -0.02 && w >= -0.02) return true
    }
    return false
  }
  function insideNear(x, y, r) {
    return inside(x, y) || inside(x + r, y) || inside(x - r, y) || inside(x, y + r) || inside(x, y - r)
  }

  // ---------------------------------------------------------------
  // Punkte, Linien und Flächen erzeugen (einmalig beim Start)
  // ---------------------------------------------------------------
  var n, X0, Y0, size, phase, edge, delay, ddx, ddy, ddist, bx0, by0, bdist, hh, hh2
  var linkA, linkB, triIdx
  var amt, es, wx, wy, sx, sy, gz
  var ox, oy, vx, vy // Verschiebung und Geschwindigkeit jedes Punktes durch die Maus
  var dustN, dX, dY, dZ, dH, dH2, dH3, dSize, dPhase
  var dox, doy, dvx, dvy
  var minX, maxX, minY, maxY

  function build() {
    var lite = container.clientWidth < 700 ? S.mobileFactor : 1
    var surfaceCount = Math.round(S.surfacePoints * lite)
    var edgeCnt = Math.round(S.edgePoints * lite)
    n = surfaceCount + edgeCnt
    X0 = new Float32Array(n)
    Y0 = new Float32Array(n)

    // Punkte auf den Flächen
    var p = 0
    for (i = 0; i < surfaceCount; i++, p++) {
      var t = pick(cumArea, totalArea)
      var r1 = rnd()
      var r2 = rnd()
      if (r1 + r2 > 1) {
        r1 = 1 - r1
        r2 = 1 - r2
      }
      var o = t * 6
      X0[p] = tri[o] + r1 * (tri[o + 2] - tri[o]) + r2 * (tri[o + 4] - tri[o])
      Y0[p] = tri[o + 1] + r1 * (tri[o + 3] - tri[o + 1]) + r2 * (tri[o + 5] - tri[o + 1])
    }
    // Punkte auf der Kontur (nach Länge gewichtet)
    for (i = 0; i < edgeCnt; i++, p++) {
      var s = segs[pick(cumLen, totalLen)]
      var f = rnd()
      X0[p] = s[0] + f * (s[2] - s[0])
      Y0[p] = s[1] + f * (s[3] - s[1])
    }

    // Verbindungen
    var links = {}
    var adj = []
    for (i = 0; i < n; i++) adj.push({})
    var linkList = []
    function addLink(a, b) {
      var key = a < b ? a * n + b : b * n + a
      if (links[key]) return
      links[key] = 1
      adj[a][b] = 1
      adj[b][a] = 1
      linkList.push(a < b ? [a, b] : [b, a])
    }
    function segmentInside(a, b) {
      for (var q = 1; q <= 3; q++) {
        var f = q / 4
        if (!inside(X0[a] + (X0[b] - X0[a]) * f, Y0[a] + (Y0[b] - Y0[a]) * f)) return false
      }
      return true
    }
    var maxD2 = S.maxLineDist * S.maxLineDist
    var j
    for (i = 0; i < n; i++) {
      var cand = []
      for (j = 0; j < n; j++) {
        if (j === i) continue
        var dx = X0[i] - X0[j]
        var dy = Y0[i] - Y0[j]
        var d2 = dx * dx + dy * dy
        if (d2 < maxD2) cand.push([d2, j])
      }
      cand.sort(function (a, b) { return a[0] - b[0] })
      var pool = cand.slice(0, S.neighborPool).map(function (c) { return c[1] })
      for (k = pool.length - 1; k > 0; k--) {
        var rr = Math.floor(rnd() * (k + 1))
        var tmp = pool[k]
        pool[k] = pool[rr]
        pool[rr] = tmp
      }
      var accepted = 0
      for (k = 0; k < pool.length && accepted < S.neighbors; k++) {
        if (!segmentInside(i, pool[k])) continue
        addLink(i, pool[k])
        accepted++
      }
    }
    // Kontur: Konturpunkte mit den nächsten Konturpunkten verbinden (nie quer durchs Schlüsselloch)
    for (i = surfaceCount; i < n; i++) {
      var cand2 = []
      for (j = surfaceCount; j < n; j++) {
        if (j === i) continue
        var ex = X0[i] - X0[j]
        var ey = Y0[i] - Y0[j]
        var e2 = ex * ex + ey * ey
        if (e2 < 0.09) cand2.push([e2, j])
      }
      cand2.sort(function (a, b) { return a[0] - b[0] })
      var acc2 = 0
      for (k = 0; k < cand2.length && acc2 < S.outlineLinks; k++) {
        var jj = cand2[k][1]
        if (!insideNear((X0[i] + X0[jj]) / 2, (Y0[i] + Y0[jj]) / 2, 0.05)) continue
        addLink(i, jj)
        acc2++
      }
    }
    linkA = new Uint16Array(linkList.length)
    linkB = new Uint16Array(linkList.length)
    linkList.forEach(function (l, idx) {
      linkA[idx] = l[0]
      linkB[idx] = l[1]
    })

    // helle Dreiecke (drei untereinander verbundene Punkte), nicht über dem Schlüsselloch
    var tl = []
    linkList.forEach(function (l) {
      Object.keys(adj[l[0]]).forEach(function (cs) {
        var c = +cs
        if (c > l[1] && adj[l[1]][c] && rnd() < S.triangleChance) {
          if (inside((X0[l[0]] + X0[l[1]] + X0[c]) / 3, (Y0[l[0]] + Y0[l[1]] + Y0[c]) / 3)) tl.push(l[0], l[1], c)
        }
      })
    })
    triIdx = new Uint16Array(tl)

    // Werte pro Punkt
    minX = Infinity; maxX = -Infinity; minY = Infinity; maxY = -Infinity
    for (i = 0; i < n; i++) {
      minX = Math.min(minX, X0[i]); maxX = Math.max(maxX, X0[i])
      minY = Math.min(minY, Y0[i]); maxY = Math.max(maxY, Y0[i])
    }
    size = new Float32Array(n); phase = new Float32Array(n); edge = new Float32Array(n)
    delay = new Float32Array(n); ddx = new Float32Array(n); ddy = new Float32Array(n)
    ddist = new Float32Array(n); bx0 = new Float32Array(n); by0 = new Float32Array(n)
    bdist = new Float32Array(n); hh = new Float32Array(n); hh2 = new Float32Array(n)
    amt = new Float32Array(n); es = new Float32Array(n)
    ox = new Float32Array(n); oy = new Float32Array(n); vx = new Float32Array(n); vy = new Float32Array(n)
    wx = new Float32Array(n); wy = new Float32Array(n)
    sx = new Float32Array(n); sy = new Float32Array(n); gz = new Float32Array(n)
    for (i = 0; i < n; i++) {
      var h = rnd(), h2 = rnd(), h3 = rnd(), h4 = rnd()
      hh[i] = h
      hh2[i] = h2
      size[i] = rnd() < 0.08 ? 8 + rnd() * 6 : 1.5 + rnd() * 1.5
      phase[i] = rnd()
      edge[i] = (X0[i] - minX) / (maxX - minX)
      delay[i] = ((Y0[i] - minY) / (maxY - minY)) * 0.45 + h4 * 0.25
      // Richtung, in die sich der Punkt am rechten Rand auflöst
      var dl = Math.sqrt(1 + Math.pow((h2 - 0.5) * 1.4, 2) + Math.pow((h3 - 0.5) * 1.4, 2))
      ddx[i] = 1 / dl
      ddy[i] = ((h2 - 0.5) * 1.4) / dl
      ddist[i] = 0.15 + h * h * 1.1
      // Richtung, aus der der Punkt beim Aufbau angeflogen kommt
      var bl = Math.sqrt(Math.pow(h - 0.5, 2) + Math.pow(h2 - 0.5, 2) + Math.pow((h3 - 0.5) * 0.6, 2)) + 0.0001
      bx0[i] = (h - 0.5) / bl
      by0[i] = (h2 - 0.5) / bl
      bdist[i] = 1.5 + h4 * 2.5
    }

    // freie Partikel rund ums Schloss
    dustN = Math.round(S.dustCount * lite)
    dX = new Float32Array(dustN); dY = new Float32Array(dustN); dZ = new Float32Array(dustN)
    dH = new Float32Array(dustN); dH2 = new Float32Array(dustN); dH3 = new Float32Array(dustN)
    dSize = new Float32Array(dustN); dPhase = new Float32Array(dustN)
    dox = new Float32Array(dustN); doy = new Float32Array(dustN)
    dvx = new Float32Array(dustN); dvy = new Float32Array(dustN)
    for (i = 0; i < dustN; ) {
      var x = (rnd() - 0.4) * 6
      var y = (rnd() - 0.5) * 4.6
      if (x > -1.2 && x < 1.2 && y > -1.7 && y < 1.7) continue
      dX[i] = x; dY[i] = y; dZ[i] = (rnd() - 0.5) * 2
      dH[i] = rnd(); dH2[i] = rnd(); dH3[i] = rnd()
      dSize[i] = rnd() < 0.1 ? 7 + rnd() * 6 : 1 + rnd() * 1.5
      dPhase[i] = rnd()
      i++
    }
  }

  // ---------------------------------------------------------------
  // Zustand: Aufbau, Maus, Sichtbarkeit
  // ---------------------------------------------------------------
  var ready = false
  var visible = true
  var buildStart = null
  var t0 = performance.now()
  var pointer = { x: 0, y: 0 }
  var smooth = { x: 0, y: 0 }

  function replay() {
    buildStart = reduceMotion ? -1e6 : performance.now()
  }
  window.synostikLock = { replay: replay }

  // Maus in Szenenkoordinaten (für das Wegschleudern der Punkte); px/py = Weg seit dem letzten Bild
  var mouse = { active: false, has: false, sx: 0, sy: 0, px: 0, py: 0 }
  window.addEventListener('pointermove', function (e) {
    var r = container.getBoundingClientRect()
    pointer.x = Math.max(-1, Math.min(1, ((e.clientX - r.left) / r.width - 0.5) * 2))
    pointer.y = Math.max(-1, Math.min(1, ((e.clientY - r.top) / r.height - 0.5) * 2))
    var inRect = e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom
    mouse.active = inRect
    if (!inRect || !scale) {
      mouse.has = false
      return
    }
    var nx = (e.clientX - r.left - r.width / 2) / scale
    var ny = -(e.clientY - r.top - r.height / 2) / scale - bob
    if (mouse.has) {
      mouse.px += nx - mouse.sx
      mouse.py += ny - mouse.sy
    }
    mouse.sx = nx
    mouse.sy = ny
    mouse.has = true
  })
  document.documentElement.addEventListener('mouseleave', function () {
    mouse.active = false
    mouse.has = false
  })
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (entries) {
      visible = entries[0].isIntersecting
      if (visible && ready && buildStart === null) replay()
    }).observe(container)
  }
  if ('ResizeObserver' in window) new ResizeObserver(resize).observe(container)
  window.addEventListener('resize', resize)

  // ---------------------------------------------------------------
  // Zeichnen
  // ---------------------------------------------------------------
  var B = 12 // Helligkeitsstufen für Linien (damit alle Linien einer Stufe in einem Zug gezeichnet werden)
  var TB = 4
  var lineBucket, triBucket
  var ca = 1, sa = 0, cb = 1, sb = 0, bob = 0
  var PX = 0, PY = 0, PZ = 0
  var physics = !reduceMotion && S.scatter > 0
  var dtF = 1, lastDraw = 0, damp = 0.92, mvx = 0, mvy = 0
  var MR = 0.9 // Reichweite der Maus in Szeneneinheiten

  // Ein Punkt wird von der Maus weggeschubst (in Mausrichtung mitgerissen) und federt danach zurück.
  // ox/oy = Verschiebung, vx/vy = Geschwindigkeit, rk = Empfindlichkeit dieses Punktes
  function physStep(ox_, oy_, vx_, vy_, i, x, y, rk, spring, rr) {
    if (mouse.active) {
      var mdx = x + ox_[i] - mouse.sx
      var mdy = y + oy_[i] - mouse.sy
      var md2 = mdx * mdx + mdy * mdy
      if (md2 < MR * MR) {
        var md = Math.sqrt(md2) + 0.0001
        var fo = 1 - md / MR
        fo *= fo
        // Stoß weg von der Maus plus eine zufällige Richtung pro Punkt, dazu ein wenig Mitnahme
        vx_[i] += (((mdx / md) * 0.6 + Math.cos(rr * 6.2831) * 0.8) * 0.03 + mvx * 0.12) * fo * rk * dtF
        vy_[i] += (((mdy / md) * 0.6 + Math.sin(rr * 6.2831) * 0.8) * 0.03 + mvy * 0.12) * fo * rk * dtF
      }
    }
    vx_[i] = (vx_[i] - ox_[i] * spring * dtF) * damp
    vy_[i] = (vy_[i] - oy_[i] * spring * dtF) * damp
    ox_[i] += vx_[i] * dtF
    oy_[i] += vy_[i] * dtF
  }

  // Szene -> Bildschirm, mit leichter Drehung (Schwenken + Mausneigung) und Perspektive
  function project(x, y, z) {
    var x1 = x * ca + z * sa
    var z1 = -x * sa + z * ca
    var y1 = y * cb - z1 * sb
    var z2 = y * sb + z1 * cb
    var p = camZ / (camZ - z2)
    PX = W / 2 + x1 * p * scale
    PY = H / 2 - (y1 + bob) * p * scale
    PZ = camZ - z2
  }

  function rgba(a) {
    return 'rgba(' + S.color[0] + ',' + S.color[1] + ',' + S.color[2] + ',' + a + ')'
  }

  function draw(now) {
    var t = (now - t0) / 1000
    var buildVal = buildStart === null ? 0 : Math.min((now - buildStart) / (S.buildDuration * 1000), 1)
    var dissolve = 0.19 + Math.sin(t * 0.4) * 0.07
    var drift = reduceMotion ? 0.005 : S.drift

    smooth.x += (pointer.x - smooth.x) * 0.05
    smooth.y += (pointer.y - smooth.y) * 0.05
    var angY = (reduceMotion ? 0 : Math.sin(t * 0.3) * S.sway) + smooth.x * S.tilt
    var angX = smooth.y * S.tilt * 0.5
    ca = Math.cos(angY); sa = Math.sin(angY); cb = Math.cos(angX); sb = Math.sin(angX)
    bob = reduceMotion ? 0 : Math.sin(t) * 0.05

    // Zeit seit dem letzten Bild (1 = 60 Bilder pro Sekunde) und Mausgeschwindigkeit pro Bild
    dtF = lastDraw ? Math.max(0.5, Math.min(2.5, (now - lastDraw) / 16.667)) : 1
    lastDraw = now
    damp = Math.pow(0.92, dtF)
    mvx = Math.max(-0.25, Math.min(0.25, mvx * 0.5 + mouse.px * 0.5))
    mvy = Math.max(-0.25, Math.min(0.25, mvy * 0.5 + mouse.py * 0.5))
    mouse.px = 0
    mouse.py = 0

    // Positionen berechnen (Schweben + Auflösung am rechten Rand + Aufbau)
    var i, x, y
    var bbMinX = 1e9, bbMaxX = -1e9, bbMinY = 1e9, bbMaxY = -1e9 // Bereich, in dem das Schloss gerade liegt
    for (i = 0; i < n; i++) {
      var a = clamp01((edge[i] + (hh[i] - 0.5) * 0.35 - (0.95 - dissolve)) * 2.5)
      amt[i] = a
      var off = ddist[i] * a
      var dr = drift + 0.04 * a
      x = X0[i] + ddx[i] * off + Math.sin(t * 0.8 + hh[i] * 6.28) * dr
      y = Y0[i] + ddy[i] * off + Math.cos(t * 0.6 + hh2[i] * 6.28) * dr
      var prog = clamp01((buildVal - delay[i]) / 0.3)
      var e = 1 - Math.pow(1 - prog, 3)
      es[i] = e
      if (e < 1) {
        var r = (1 - e) * bdist[i]
        var ang = (1 - e) * 1.2
        var cs = Math.cos(ang)
        var sn = Math.sin(ang)
        var kx = bx0[i] * r
        var ky = by0[i] * r
        x += cs * kx + sn * ky
        y += -sn * kx + cs * ky
      }
      if (physics) {
        physStep(ox, oy, vx, vy, i, x, y, (0.6 + 0.8 * hh[i]) * S.scatter, 0.02, hh2[i])
        x += ox[i]
        y += oy[i]
        // weit weggeschleuderte Punkte lösen sich vom Netz: ihre Linien blenden aus
        var dsp = Math.sqrt(ox[i] * ox[i] + oy[i] * oy[i]) / 0.5
        if (dsp > amt[i]) amt[i] = dsp > 1 ? 1 : dsp
      }
      project(x, y, 0)
      sx[i] = PX
      sy[i] = PY
      gz[i] = PZ
      if (PX < bbMinX) bbMinX = PX
      if (PX > bbMaxX) bbMaxX = PX
      if (PY < bbMinY) bbMinY = PY
      if (PY > bbMaxY) bbMaxY = PY
    }

    ctx.setTransform(1, 0, 0, 1, 0, 0)
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    ctx.globalCompositeOperation = 'lighter'

    // helle Flächen
    var nt = triIdx.length / 3
    if (!triBucket || triBucket.length !== nt) triBucket = new Uint8Array(nt)
    for (i = 0; i < nt; i++) {
      var ta = triIdx[i * 3], tb = triIdx[i * 3 + 1], tc = triIdx[i * 3 + 2]
      var mxa = Math.max(amt[ta], amt[tb], amt[tc])
      var mne = Math.min(es[ta], es[tb], es[tc])
      var al = (1 - sm(0, 0.6, mxa)) * sm(0.7, 1, mne)
      triBucket[i] = al < 0.03 ? 255 : Math.min(TB - 1, (al * TB) | 0)
    }
    ctx.globalAlpha = 1
    for (var bk = 0; bk < TB; bk++) {
      ctx.beginPath()
      var any = false
      for (i = 0; i < nt; i++) {
        if (triBucket[i] !== bk) continue
        ctx.moveTo(sx[triIdx[i * 3]], sy[triIdx[i * 3]])
        ctx.lineTo(sx[triIdx[i * 3 + 1]], sy[triIdx[i * 3 + 1]])
        ctx.lineTo(sx[triIdx[i * 3 + 2]], sy[triIdx[i * 3 + 2]])
        any = true
      }
      if (any) {
        ctx.fillStyle = rgba((S.triangleOpacity * (bk + 0.5)) / TB)
        ctx.fill()
      }
    }

    // Linien
    var nl = linkA.length
    if (!lineBucket || lineBucket.length !== nl) lineBucket = new Uint8Array(nl)
    for (i = 0; i < nl; i++) {
      var la = linkA[i], lb = linkB[i]
      var ma = amt[la] > amt[lb] ? amt[la] : amt[lb]
      var me = es[la] < es[lb] ? es[la] : es[lb]
      var f = (1 - sm(0, 0.7, ma)) * sm(0.5, 1, me)
      lineBucket[i] = f < 0.03 ? 255 : Math.min(B - 1, (f * B) | 0)
    }
    ctx.lineWidth = Math.max(0.5, 1 / dpr)
    for (bk = 0; bk < B; bk++) {
      ctx.beginPath()
      any = false
      for (i = 0; i < nl; i++) {
        if (lineBucket[i] !== bk) continue
        ctx.moveTo(sx[linkA[i]], sy[linkA[i]])
        ctx.lineTo(sx[linkB[i]], sy[linkB[i]])
        any = true
      }
      if (any) {
        ctx.strokeStyle = rgba((S.lineOpacity * (bk + 0.5)) / B)
        ctx.stroke()
      }
    }

    // Leuchtpunkte
    for (i = 0; i < n; i++) {
      var pa = (1 - amt[i] * 0.6) * es[i]
      if (pa < 0.02) continue
      var sz = (size[i] * (0.8 + 0.2 * Math.sin(t * 2 + phase[i] * 6.2831)) * 10) / gz[i]
      ctx.globalAlpha = pa > 1 ? 1 : pa
      ctx.drawImage(sprite, sx[i] - sz / 2, sy[i] - sz / 2, sz, sz)
    }

    // freie Partikel
    var dustAlpha = sm(0, 0.6, buildVal)
    if (dustAlpha > 0.01) {
      ctx.globalAlpha = dustAlpha
      for (i = 0; i < dustN; i++) {
        x = dX[i] + Math.sin(t * (0.15 + dH[i] * 0.2) + dH2[i] * 6.28) * 0.5
        y = dY[i] + Math.cos(t * (0.12 + dH2[i] * 0.2) + dH3[i] * 6.28) * 0.5
        var z = dZ[i] + Math.sin(t * (0.1 + dH3[i] * 0.2) + dH[i] * 6.28) * 0.5
        if (physics) {
          // freie Partikel sind leichter: fliegen weiter und kommen langsamer zurück
          physStep(dox, doy, dvx, dvy, i, x, y, (0.6 + 0.8 * dH[i]) * S.scatter * 2, 0.008, dH2[i])
          x += dox[i]
          y += doy[i]
        }
        project(x, y, z)
        var ds = (dSize[i] * (0.8 + 0.2 * Math.sin(t * 2 + dPhase[i] * 6.2831)) * 10) / PZ
        ctx.drawImage(sprite, PX - ds / 2, PY - ds / 2, ds, ds)
      }
    }

    // Glow: verkleinerte, weich vergrößerte Kopien des Bildes obendrauf addieren.
    // Gerechnet wird nur in dem Rechteck, in dem das Schloss liegt (spart viel Rechenzeit).
    if (S.glow > 0) {
      var m = 90
      var gx0 = Math.max(0, Math.floor(((bbMinX - m) * dpr) / 8) * 8)
      var gy0 = Math.max(0, Math.floor(((bbMinY - m) * dpr) / 8) * 8)
      var gx1 = Math.min(canvas.width, Math.ceil(((bbMaxX + m) * dpr) / 8) * 8)
      var gy1 = Math.min(canvas.height, Math.ceil(((bbMaxY + m) * dpr) / 8) * 8)
      var rw = gx1 - gx0
      var rh = gy1 - gy0
      if (rw >= 16 && rh >= 16) {
        var w2 = rw >> 2, h2 = rh >> 2, w3 = rw >> 3, h3 = rh >> 3
        c2.clearRect(0, 0, w2, h2)
        c2.drawImage(canvas, gx0, gy0, rw, rh, 0, 0, w2, h2)
        c3.clearRect(0, 0, w3, h3)
        c3.drawImage(g2, 0, 0, w2, h2, 0, 0, w3, h3)
        ctx.setTransform(1, 0, 0, 1, 0, 0)
        ctx.imageSmoothingEnabled = true
        ctx.imageSmoothingQuality = 'high'
        ctx.globalAlpha = Math.min(1, 0.9 * S.glow)
        ctx.drawImage(g2, 0, 0, w2, h2, gx0, gy0, rw, rh)
        ctx.globalAlpha = Math.min(1, 1.1 * S.glow)
        ctx.drawImage(g3, 0, 0, w3, h3, gx0, gy0, rw, rh)
      }
    }
    ctx.globalAlpha = 1
    ctx.globalCompositeOperation = 'source-over'
  }

  // Automatische Qualitätsstufe: Läuft es auf diesem Gerät zu langsam, wird zuerst der Glow
  // abgeschaltet, danach die freien Partikel. So ruckelt es auf schwachen Rechnern nicht.
  // Gemessen wird in Fenstern von 90 Bildern; das erste Fenster (Seitenstart) zählt nicht mit.
  var lastFrame = 0
  var winSum = 0
  var winN = 0
  var warm = true
  function frame(now) {
    requestAnimationFrame(frame)
    if (!ready || !visible || !W || !H) {
      lastFrame = 0
      return
    }
    if (lastFrame && now - lastFrame < 200) {
      winSum += now - lastFrame
      winN++
      if (winN === 90) {
        if (warm) warm = false
        else if (winSum / 90 > 32) {
          if (S.glow > 0) S.glow = 0
          else dustN = 0
        }
        winSum = 0
        winN = 0
      }
    }
    lastFrame = now
    draw(now)
  }

  // ---------------------------------------------------------------
  // Start: erst nach dem Laden der Seite und wenn der Browser Zeit hat
  // ---------------------------------------------------------------
  function init() {
    resize()
    build()
    ready = true
    if (visible) replay()
    requestAnimationFrame(frame)
  }
  function schedule() {
    ;(window.requestIdleCallback || function (f) { setTimeout(f, 50) })(init)
  }
  if (document.readyState === 'complete') schedule()
  else window.addEventListener('load', schedule)
})()
