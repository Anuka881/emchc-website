const eventsDiv = document.getElementById("events");

fetch("http://localhost:3000/events")
  .then(res => res.json())
  .then(data => {
    if (!Array.isArray(data) || data.length === 0) {
      eventsDiv.innerHTML = "<p>Одоогоор арга хэмжээ алга байна.</p>";
      return;
    }

    eventsDiv.innerHTML = data.map(e => {
      const img = e.image ? `<img src="assets/images/${e.image}" width="300" alt="${e.title ?? "event"}">` : "";
      const date = e.event_date ? `<div style="opacity:.7;font-size:12px;">Огноо: ${e.event_date}</div>` : "";

      return `
        <article class="news-item">
          <h3>${e.title ?? ""}</h3>
          ${date}
          ${img}
          <p>${e.content ?? ""}</p>
        </article>
      `;
    }).join("");
  })
  .catch(err => {
    console.error(err);
    eventsDiv.innerHTML = "<p>Алдаа гарлаа.</p>";
  });