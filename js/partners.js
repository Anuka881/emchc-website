 const partnersDiv = document.getElementById("partners");

fetch("http://localhost:3000/partners")
  .then(res => res.json())
  .then(data => {
    if (!Array.isArray(data) || data.length === 0) {
      partnersDiv.innerHTML = "<p>Одоогоор хамтрагч алга байна.</p>";
      return;
    }

    partnersDiv.innerHTML = data.map(p => {
      const logo = p.logo ? `<img src="assets/images/${p.logo}" style="width:90px;height:auto;">` : "";
      const website = p.website ? `<a href="${p.website}" target="_blank">${p.website}</a>` : "";
      const country = p.country ? `<div style="opacity:.7;font-size:12px">${p.country}</div>` : "";

      return `
        <div class="news-item" style="padding:12px; border:1px solid #ddd; border-radius:12px; margin:10px 0;">
          <b>${p.name ?? ""}</b>
          ${country}
          <div>${website}</div>
          ${logo}
        </div>
      `;
    }).join("");
  })
  .catch(err => {
    console.error(err);
    partnersDiv.innerHTML = "<p>Алдаа гарлаа.</p>";
  });