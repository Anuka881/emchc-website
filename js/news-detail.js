 const params = new URLSearchParams(window.location.search);
const id = params.get("id");

const titleEl = document.getElementById("newsTitle");
const dateEl = document.getElementById("newsDate");
const imgEl = document.getElementById("newsImg");
const contentEl = document.getElementById("newsContent");

if (!id) {
  titleEl.textContent = "Мэдээ олдсонгүй (id байхгүй)";
} else {
  fetch(`http://localhost:3000/news/${encodeURIComponent(id)}`)
    .then(res => res.json())
    .then(one => {
      if (!one || one.message === "News not found") {
        titleEl.textContent = "Мэдээ олдсонгүй";
        return;
      }

      titleEl.textContent = one.title || "";
      contentEl.textContent = one.content || "";

      if (one.created_at) {
        const d = new Date(one.created_at);
        dateEl.textContent = "Огноо: " + (isNaN(d) ? one.created_at : d.toLocaleString());
      } else dateEl.textContent = "";

      if (one.image) {
        imgEl.src = `assets/images/${one.image}`;
        imgEl.alt = one.title || "news";
        imgEl.style.display = "block";
      } else {
        imgEl.style.display = "none";
      }
    })
    .catch(() => {
      titleEl.textContent = "Мэдээ олдсонгүй";
    });
}