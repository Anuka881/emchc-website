const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "emcc_db"
});

db.connect(err => {
  if (err) {
    console.log("DB error", err);
  } else {
    console.log("MySQL connected");
  }
});
// news list
app.get("/news", (req, res) => {
  db.query("SELECT * FROM news ORDER BY id DESC", (err, result) => {
    if (err) return res.status(500).json(err);
    return res.json(result);
  });
});

// news detail
app.get("/news/:id", (req, res) => {
  const id = req.params.id;

  db.query("SELECT * FROM news WHERE id = ?", [id], (err, result) => {
    if (err) return res.status(500).json(err);

    if (result.length === 0) {
      return res.status(404).json({ message: "News not found" });
    }

    return res.json(result[0]);
  });
});
  // news create
app.post("/news", (req, res) => {
  let { title, content, image } = req.body;

  title = (title || "").trim();
  content = (content || "").trim();
  image = (image || "").trim();

  if (!title || !content) {
    return res.status(400).json({ message: "title and content required" });
  }

  // image нь NOT NULL байвал хоосон үед default өгнө
  if (!image) image = "default.jpg";

  const sql = "INSERT INTO news (title, content, image, created_at) VALUES (?, ?, ?, NOW())";
  db.query(sql, [title, content, image], (err, result) => {
    if (err) {
      console.log("INSERT error:", err);
      return res.status(500).json({ message: "DB error", sqlMessage: err.sqlMessage });
    }
    return res.status(201).json({ message: "News created", id: result.insertId });
  });
});
 // news update
app.put("/news/:id", (req, res) => {
  const id = req.params.id;
  let { title, content, image } = req.body;

  title = (title || "").trim();
  content = (content || "").trim();
  image = (image || "").trim();

  if (!title || !content) {
    return res.status(400).json({ message: "title and content required" });
  }

  if (!image) image = "default.jpg";

  const sql = "UPDATE news SET title=?, content=?, image=? WHERE id=?";
  db.query(sql, [title, content, image, id], (err, result) => {
    if (err) {
      console.log("UPDATE error:", err);
      return res.status(500).json({ message: "DB error", sqlMessage: err.sqlMessage });
    }
    if (result.affectedRows === 0) return res.status(404).json({ message: "News not found" });
    return res.json({ message: "News updated" });
  });
});

// news delete
app.delete("/news/:id", (req, res) => {
  const id = req.params.id;

  db.query("DELETE FROM news WHERE id=?", [id], (err, result) => {
    if (err) return res.status(500).json(err);
    if (result.affectedRows === 0) return res.status(404).json({ message: "News not found" });
    return res.json({ message: "News deleted" });
  });
});
 // partners list
app.get("/partners", (req, res) => {
  db.query("SELECT * FROM partners ORDER BY id DESC", (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).json(err);
    }
    res.json(result);
  });
});
// partner create

app.post("/partners", (req, res) => {
  const { name, country, website, logo } = req.body;

  if (!name) return res.status(400).json({ message: "name required" });

  const sql = "INSERT INTO partners (name, country, website, logo, created_at) VALUES (?, ?, ?, ?, NOW())";
  db.query(sql, [name, country || null, website || null, logo || null], (err, result) => {
    if (err) return res.status(500).json(err);
    res.json({ message: "Partner created", id: result.insertId });
  });
});

// partner delete
app.delete("/partners/:id", (req, res) => {
  const id = req.params.id;

  db.query("DELETE FROM partners WHERE id=?", [id], (err, result) => {
    if (err) return res.status(500).json(err);
    res.json({ message: "Partner deleted" });
  });
});
 // events list
app.get("/events", (req, res) => {
  db.query("SELECT * FROM events ORDER BY id DESC", (err, result) => {
    if (err) return res.status(500).json(err);
    return res.json(result);
  });
});

// events create
app.post("/events", (req, res) => {
  const { title, content, image, event_date } = req.body;

  if (!title || !content) {
    return res.status(400).json({ message: "title and content required" });
  }

  const sql = "INSERT INTO events (title, content, image, event_date) VALUES (?, ?, ?, ?)";
  db.query(sql, [title, content, image || null, event_date || null], (err, result) => {
    if (err) return res.status(500).json(err);
    return res.json({ message: "Event created", id: result.insertId });
  });
});

// event detail
app.get("/events/:id", (req, res) => {
  const id = req.params.id;

  db.query("SELECT * FROM events WHERE id = ?", [id], (err, result) => {
    if (err) return res.status(500).json({ message: "DB error", sqlMessage: err.sqlMessage });
    if (result.length === 0) return res.status(404).json({ message: "Event not found" });
    return res.json(result[0]);
  });
});

// event create
app.post("/events", (req, res) => {
  let { title, content, image, event_date } = req.body;

  title = (title || "").trim();
  content = (content || "").trim();
  image = (image || "").trim();
  event_date = (event_date || "").trim();

  if (!title || !content) {
    return res.status(400).json({ message: "title and content required" });
  }

  // image хоосон бол null болгож хадгална (DB дээр image NULL зөвшөөрсөн байх хэрэгтэй)
  const sql = "INSERT INTO events (title, content, image, event_date, created_at) VALUES (?, ?, ?, ?, NOW())";
  db.query(sql, [title, content, image || null, event_date || null], (err, result) => {
    if (err) return res.status(500).json({ message: "DB error", sqlMessage: err.sqlMessage });
    return res.status(201).json({ message: "Event created", id: result.insertId });
  });
});

// event update
app.put("/events/:id", (req, res) => {
  const id = req.params.id;
  let { title, content, image, event_date } = req.body;

  title = (title || "").trim();
  content = (content || "").trim();
  image = (image || "").trim();
  event_date = (event_date || "").trim();

  if (!title || !content) {
    return res.status(400).json({ message: "title and content required" });
  }

  const sql = "UPDATE events SET title=?, content=?, image=?, event_date=? WHERE id=?";
  db.query(sql, [title, content, image || null, event_date || null, id], (err, result) => {
    if (err) return res.status(500).json({ message: "DB error", sqlMessage: err.sqlMessage });
    if (result.affectedRows === 0) return res.status(404).json({ message: "Event not found" });
    return res.json({ message: "Event updated" });
  });
});

// event delete
app.delete("/events/:id", (req, res) => {
  const id = req.params.id;

  db.query("DELETE FROM events WHERE id=?", [id], (err, result) => {
    if (err) return res.status(500).json({ message: "DB error", sqlMessage: err.sqlMessage });
    if (result.affectedRows === 0) return res.status(404).json({ message: "Event not found" });
    return res.json({ message: "Event deleted" });
  });
});
// trainings list
app.get("/trainings", (req, res) => {
  db.query("SELECT * FROM trainings ORDER BY id DESC", (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
});

// training create
app.post("/trainings", (req, res) => {
  const { title, content, image } = req.body;

  const sql = "INSERT INTO trainings (title, content, image, created_at) VALUES (?, ?, ?, NOW())";

  db.query(sql, [title, content, image || null], (err, result) => {
    if (err) return res.status(500).json(err);

    res.json({
      message: "Training created",
      id: result.insertId
    });
  });
});

// training delete
app.delete("/trainings/:id", (req, res) => {
  const id = req.params.id;

  db.query("DELETE FROM trainings WHERE id=?", [id], (err, result) => {
    if (err) return res.status(500).json(err);
    res.json({ message: "Training deleted" });
  });
});
 


 app.listen(3000, () => {
  console.log("Server running on port 3000");
});
