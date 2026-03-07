const form = document.getElementById("newsForm");
const msg = document.getElementById("msg");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const title = document.getElementById("title").value.trim();
  const content = document.getElementById("content").value.trim();
  const image = document.getElementById("image").value.trim();

  if (!title || !content) {
    msg.textContent = "Гарчиг ба контент заавал!";
    return;
  }

  try {
    const res = await fetch("http://localhost:3000/news", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, content, image })
    });

    const out = await res.json();

    if (!res.ok) {
      msg.textContent = "Алдаа: " + (out.message || "unknown");
      return;
    }

    msg.textContent = `Амжилттай нэмлээ! ID = ${out.id}`;
    form.reset();
  } catch (err) {
    msg.textContent = "Сервертэй холбогдож чадсангүй.";
  }
});