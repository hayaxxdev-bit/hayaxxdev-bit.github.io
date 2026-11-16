/* ===== LOGIKA (terpisah dari styling) ===== */
      const TOKENS = [
        ["color-bg", "Latar utama"],
        ["color-bg-soft", "Latar alternatif"],
        ["color-surface", "Panel dan kartu"],
        ["color-surface-raised", "Panel menonjol"],
        ["color-border", "Garis pembatas"],
        ["color-primary", "Dark red"],
        ["color-primary-hover", "Hover merah"],
        ["color-secondary", "Dark purple"],
        ["color-secondary-hover", "Hover ungu"],
        ["color-accent", "Golden white / gold"],
        ["color-text", "Teks utama"],
        ["color-text-muted", "Teks sekunder"],
        ["color-text-subtle", "Teks tambahan"],
        ["color-success", "Berhasil"],
        ["color-warning", "Peringatan"],
        ["color-error", "Kesalahan"],
      ];
      const RAMPS = [
        ["Dark red", "--color-primary"],
        ["Dark purple", "--color-secondary"],
        ["Golden white", "--color-accent"],
      ];
      const MIX = [-0.55, -0.3, 0, 0.14, 0.3, 0.46, 0.62, 0.78, 0.9, 0.97];
      const root = document.documentElement;
      const cssVar = (n) => getComputedStyle(root).getPropertyValue(n).trim();
      const $ = (id) => document.getElementById(id);

      const toRgb = (h) =>
        [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
      const toHex = (a) =>
        "#" +
        a
          .map((v) =>
            Math.round(Math.max(0, Math.min(255, v)))
              .toString(16)
              .padStart(2, "0"),
          )
          .join("")
          .toUpperCase();
      function mix(hex, t) {
        const c = toRgb(hex),
          target = t < 0 ? 0 : 255,
          k = Math.abs(t);
        return toHex(c.map((v) => v + (target - v) * k));
      }
      const lum = (hex) => {
        const [r, g, b] = toRgb(hex).map((v) => {
          v /= 255;
          return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
        });
        return 0.2126 * r + 0.7152 * g + 0.0722 * b;
      };
      const ratio = (a, b) => {
        const x = lum(a),
          y = lum(b);
        return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
      };
      const readable = (hex) => (lum(hex) > 0.35 ? "#09070C" : "#F5F0E8");

      let toastT;
      function copy(text) {
        const done = () => {
          const t = $("toast");
          t.textContent = "Disalin: " + (text.length > 20 ? "CSS" : text);
          t.classList.add("show");
          clearTimeout(toastT);
          toastT = setTimeout(() => t.classList.remove("show"), 1400);
        };
        try {
          navigator.clipboard.writeText(text).then(done, done);
        } catch (e) {
          done();
        }
      }

      function renderTokens() {
        $("tokens").innerHTML = TOKENS.map(([n, d]) => {
          const v = cssVar("--" + n);
          return `<button class="tok" data-copy="${v}"><i style="background:${v}"></i><div><code>${n}</code><span class="hex">${v}</span><br><em>${d}</em></div></button>`;
        }).join("");
      }
      function renderRamps() {
        $("ramps").innerHTML = RAMPS.map(([name, v]) => {
          const base = cssVar(v);
          return (
            `<div class="ramp-label">${name} · ${base}</div><div class="ramp">` +
            MIX.map((m) => {
              const c = mix(base, m);
              return `<button class="${m === 0 ? "base" : ""}" data-copy="${c}" style="background:${c};color:${readable(c)}" title="${c}">${c.slice(1)}</button>`;
            }).join("") +
            `</div>`
          );
        }).join("");
      }
      function renderLive() {
        const t = +$("lift").value / 100;
        $("liftVal").textContent = Math.round(t * 100) + "%";
        const r = mix(cssVar("--color-primary"), t),
          p = mix(cssVar("--color-secondary"), t),
          g = mix(cssVar("--color-accent"), t);
        $("liveDemo").innerHTML = [
          ["red", r, "Merah"],
          ["purple", p, "Ungu"],
          ["gold", g, "Gold"],
        ]
          .map(
            ([cls, c, n]) =>
              `<div class="glass live" style="background:linear-gradient(145deg,${c}cc,${mix(c, -0.55)}dd);color:${readable(c)}">${n}<br><small style="font-family:system-ui;font-size:.8rem;opacity:.85">${c}</small></div>`,
          )
          .join("");
      }
      function renderContrast() {
        const v = (n) => cssVar("--" + n);
        const pairs = [
          ["Teks utama / background", "color-text", "color-bg"],
          ["Teks utama / panel", "color-text", "color-surface"],
          ["Teks sekunder / panel", "color-text-muted", "color-surface"],
          ["Teks tambahan / panel", "color-text-subtle", "color-surface"],
          ["Dark red / background", "color-primary", "color-bg"],
          ["Merah hover / background", "color-primary-hover", "color-bg"],
          ["Dark purple / background", "color-secondary", "color-bg"],
          ["Ungu hover / background", "color-secondary-hover", "color-bg"],
          ["Gold / background", "color-accent", "color-bg"],
          ["Teks utama / tombol merah", "color-text", "color-primary"],
          ["Teks utama / tombol ungu", "color-text", "color-secondary"],
          ["Error / panel", "color-error", "color-surface"],
        ];
        $("contrast").innerHTML = pairs
          .map(([l, f, b]) => {
            const r = ratio(v(f), v(b));
            const res =
              r >= 7
                ? ['<span class="ok">AAA</span>']
                : r >= 4.5
                  ? ['<span class="ok">AA</span>']
                  : r >= 3
                    ? ['<span class="warn">Hanya teks besar / UI</span>']
                    : ['<span class="err">Gagal — jangan untuk teks</span>'];
            return `<tr><td>${l}</td><td><span class="sample" style="color:${v(f)};background:${v(b)}">Aa Portofolio</span></td><td>${r.toFixed(2)} : 1</td><td>${res}</td></tr>`;
          })
          .join("");
      }
      function renderCss() {
        let out =
          ":root{\n" +
          TOKENS.map(([n]) => `  --${n}: ${cssVar("--" + n)};`).join("\n") +
          "\n";
        RAMPS.forEach(([name, v]) => {
          const key = v.replace("--color-", "");
          MIX.forEach((m, i) => {
            out += `  --${key}-${i + 1}: ${mix(cssVar(v), m)};\n`;
          });
        });
        out += "}";
        $("cssOut").textContent = out;
      }

      document.addEventListener("click", (e) => {
        const el = e.target.closest("[data-copy]");
        if (el) copy(el.dataset.copy);
      });
      $("copyCss").addEventListener("click", () =>
        copy($("cssOut").textContent),
      );
      $("lift").addEventListener("input", renderLive);
      renderTokens();
      renderRamps();
      renderLive();
      renderContrast();
      renderCss();