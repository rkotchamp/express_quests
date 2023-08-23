// const movies = [
//   {
//     id: 1,
//     title: "Citizen Kane",
//     director: "Orson Wells",
//     year: "1941",
//     colors: false,
//     duration: 120,
//   },
//   {
//     id: 2,
//     title: "The Godfather",
//     director: "Francis Ford Coppola",
//     year: "1972",
//     colors: true,
//     duration: 180,
//   },
//   {
//     id: 3,
//     title: "Pulp Fiction",
//     director: "Quentin Tarantino",
//     year: "1994",
//     color: true,
//     duration: 180,
//   },
// ];
const database = require("./database");

const getMovies = (req, res) => {
  let initialSql = "select * from movies";
  const where = [];

  if (req.query.color != null) {
    where.push({
      column: "color",
      value: req.query.color,
      operator: "=",
    });
  }
  if (req.query.max_duration != null) {
    where.push({
      column: "duration",
      value: req.query.max_duration,
      operator: "<=",
    });
  }
  const query = where.reduce((sql, { column, operator }, index) => {
    return `${sql} ${index === 0 ? "where" : "and"} ${column} ${operator}?`;
  }, initialSql);
  const value = where.map(({ value }) => value);
  database
    .query(query, value)
    .then(([movies]) => {
      res.json(movies);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error retrieving data from database");
    });
  // if (req.query.color != null) {
  //   sql += "where color=?";
  //   sqlValue.push(req.query.color);
  // }
  // if (req.query.max_duration != null) {
  //   sql += "WHERE duration<=?";
  //   sqlValue.push(req.query.max_duration);
  // }

  // if (req.query.max_duration != null && req.query.color != null) {
  //   sql += `Where duration<=? AND color=?`;
  //   sqlValue.push(req.query.max_duration,req.query.);
  // }

  // database
  //   .query(sql, sqlValue)
  //   .then(([movies]) => {
  //     res.json(movies);
  //   })
  //   .catch((err) => {
  //     res.status(500).send("Error retrieving data from database");
  //   });
};

const getMovieById = (req, res) => {
  const id = parseInt(req.params.id);

  database
    .query("select * from movies where id =?", [id])
    .then(([movies]) => {
      if (movies[0] != null) {
        res.json(movies);
      } else {
        res.status(404).send("Not Found");
      }
    })
    .catch((err) => {
      res.status(500).send("Error retrieving data from database");
    });
};

const getUsers = (req, res) => {
  let initialSql = "select * from users";
  const where = [];
  if (req.query.language != null) {
    where.push({
      column: "language",
      value: req.query.language,
      operator: "=",
    });
  }
  if (req.query.city != null) {
    where.push({
      column: "city",
      value: req.query.city,
      operator: "=",
    });
  }

  const query = where.reduce((sql, { column, operator }, index) => {
    return `${sql} ${index === 0 ? "where" : "and"} ${column} ${operator}?`;
  }, initialSql);

  const values = where.map(({ value }) => value);

  database
    .query(query, values)
    .then((users) => {
      res.json(users);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error retrieving users");
    });
  // console.log(req.query);
  // database
  //   .query("select * from users")
  //   .then(([users]) => {
  //     res.json(users);
  //   })
  //   .catch((err) => {
  //     res.status(500).send("Error retrieving data from database");
  //   });
};

const getUsersByID = (req, res) => {
  const id = parseInt(req.params.id);

  database
    .query("select * from users where id=?", [id])
    .then(([users]) => {
      if (users[0] != null) {
        res.json(users[0]);
      } else {
        res.status(404).send("Not found");
      }
    })
    .catch((err) => {
      res.status(500).send("Error retrieving data from database");
    });
};

const postMovies = (req, res) => {
  console.log(req.body);
  const { title, director, year, color, duration } = req.body;
  res.send("Post route is working");
  database
    .query(
      "INSERT INTO movies(title,director,year,color,duration) VALUES(?,?,?,?,?)",
      [title, director, year, color, duration]
    )
    .then(([result]) => {
      console.log(result);
      res.location(`/api/movies/${result.insertID}`).sendStatus(201);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error saving the movie");
    });
};

const postUsers = (req, res) => {
  console.log(req.body);
  const { id, firstname, lastname, email, city, language } = req.body;
  res.send("can reach now");

  database
    .query(
      "INSERT INTO users(id, firstname, lastname, email, city, language) VALUES(?,?,?,?,?,?)",
      [id, firstname, lastname, email, city, language]
    )
    .then(([result]) => {
      res.location(`/api/users/${result.insertId}`).sendStatus(201);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error saving users ");
    });
};

const updateMovie = (req, res) => {
  const id = parseInt(req.params.id);
  database
    .query("UPDATE movies SET tile=?,year=?,color=?,duration=? WHERE id=?", [
      title,
      director,
      year,
      color,
      duration,
      id,
    ])
    .then(([result]) => {
      if (result.affectedRows === 0) {
        res.status(404).send("Not Found");
      } else {
        res.sendStatus(204);
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error editing the movie");
    });
};

const updateUSers = (req, res) => {
  const id = parseInt(rq.params.id);
  // id, firstname, lastname, email, city, language
  database
    .query(
      "UPDATE users SET Id=?,firstname=?,lastname=?,email=?,city=?,language=? WHERE id=?",
      [id, firstname, lastname, email, city, language]
    )
    .then(([result]) => {
      if (result.affectedRows === 0) {
        res.send(404).send("Not found");
      } else {
        res.sendStatus(204);
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error editing the movie");
    });
};

const deleteMovie = (req, res) => {
  const id = parseInt(req.params.id);
  database
    .query("DELETE FROM movies  WHERE id=?", [id])
    .then(([result]) => {
      if (result.affectedRows === 0) {
        res.status(404).send("Not Found");
      } else {
        res.sendStatus(204);
      }
    })
    .catch((err) => {
      console.err(err);
      res.status(500).send("Error deleting moving");
    });
};

const deleteUSers = (req, res) => {
  const id = parseInt(req.params.id);

  database
    .query("DELETE FROM users WHERE id=?", [id])
    .then(([result]) => {
      if (result.affectedRows === 0) {
        res.status(404).send("Not Found");
      } else {
        res.sendStatus(204);
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error deleting User");
    });
};

// exporting modules
module.exports = {
  getMovies,
  getMovieById,
  getUsers,
  getUsersByID,
  postMovies,
  postUsers,
  updateMovie,
  updateUSers,
  deleteMovie,
  deleteUSers,
};
