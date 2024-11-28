const pool = require("../util/connectionPool");
const jwt = require("jsonwebtoken");

exports.getHome = (req, res, next) => {
  console.log("Connection to student path established succesfully");
  return res.status(200).send({ status: "valid", role: "student" });
};

exports.getError = (req, res, next) => {
  console.log("Student Error");
  pool
    .execute("SELECT * FROM STUDENT")
    .then(([rows, fields]) => {
      console.log("Query Fields:\n");
      consocol_names = fields.map((val) => val.name);
      const data = { fields: col_names, rows: rows };
      res.status(200).send(data);
    })
    .catch((err) => {
      console.error(err);
    });
  // res.render("index");
};

exports.getUpdates = (req, res, next) => {
  console.log("Student Updates");
  pool
    .execute("SELECT MID, TITLE, CONTENT, LINK FROM MESSAGES")
    .then(([rows, fields]) => {
      col_names = fields.map((val) => val.name);
      const data = { fields: col_names, rows: rows };
      res.status(200).send(data);
    })
    .catch((err) => {
      console.error(err);
    });
};

exports.getAllJobs = (req, res, next) => {
  console.log("Student All Jobs");
  pool
    .execute(
      "SELECT JID ID , JROLE Role, JSAL 'Monthly Salary', Jdesc Description FROM JOB WHERE JSTATUS = 'approved'"
    )
    .then(([rows, fields]) => {
      col_names = fields.map((val) => val.name);
      const data = { fields: col_names, rows: rows };
      res.status(200).send(data);
    })
    .catch((err) => {
      console.error(err);
    });
};

exports.getStudentProfiles = (req, res, next) => {
  console.log("Student Profile Requested\n");

  const sroll = req.body.user_id;
  pool
    .execute("SELECT * FROM STUDENT WHERE SROLL = ?", [sroll])
    .then(([rows, fields]) => {
      const data = rows[0];
      res.send(data);
      console.log(data);
    })
    .catch((err) => {
      console.error(err);
    });
};

exports.postStudentProfile = (req, res, next) => {
  const sroll = req.body.user_id;
  const email = req.body.EMAIL;
  const linkedin = req.body.LINKEDIN;
  const resume = req.body.RESUME;
  const github = req.body.GITHUB;
  const about = req.body.ABOUT;
  console.log("Student POST PROFILE");
  console.log(req.body);
  pool
    .execute(
      "UPDATE STUDENT SET LINKEDIN = ? , EMAIL = ? , RESUME = ? , GITHUB = ? , ABOUT = ? WHERE SROLL = ?",
      [linkedin, email, resume, github, about, sroll]
    )
    .then(([rows, fields]) => {
      res.status(200).send({ status: "Updated Successfully" });
    })
    .catch((err) => console.log(err));
};

exports.getEligibleJobs = (req, res, next) => {
  const user_id = req.body.user_id;
  console.log("STUDENT ELIGIBILE JOBS");
  pool
    .execute("SELECT * FROM STUDENT WHERE sroll = ?", [user_id])
    .then(([rows, fields]) => {
      return pool.execute(
        "SELECT JID FROM ELIGIBILITY u WHERE CGPA<=? AND BR_ID = ? AND PR_ID = ? AND NOT EXISTS (SELECT JID FROM APPLICATION t WHERE t.JID = u.JID AND sroll = ?)",
        [rows[0].CGPA, rows[0].BR_ID, rows[0].PR_ID, user_id]
      );
    })
    .then(([rows, fields]) => {
      console.log("rows", rows);
      jids = rows.map((val) => val.JID);
      console.log("jids", jids);
      const placeholders = jids.map(() => "?").join(",");

      if (!jids.length) {
        col_names = ["ID", "Role", "Monthly Salary", "Description"];
        const data = { fields: col_names, rows: [] };
        return res.status(200).send(data);
      }
      return pool.execute(
        `SELECT JID ID , JROLE Role, 
      JSAL 'Monthly Salary', Jdesc Description 
      FROM JOB WHERE JSTATUS = 'approved' AND JID IN (${placeholders})`,
        jids
      );
    })
    .then(([rows, fields]) => {
      col_names = fields.map((val) => val.name);
      const data = { fields: col_names, rows: rows };
      res.status(200).send(data);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send({ status: "Inavlid Request to Database" });
    });
};

exports.getAppliedJobs = (req, res, next) => {
  console.log("Get Applied Jobs\n");
  pool
    .execute("SELECT * FROM APPLICATION WHERE SROLL = ?", [req.body.user_id])
    .then(([rows, fields]) => {
      col_names = fields.map((val) => val.name);
      const data = { fields: col_names, rows: rows };
      // console.log(data);
      res.status(200).send(data);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send({ status: "Inavlid Request to Databse" });
    });
};

exports.getInterviews = (req, res, next) => {
  console.log("Get Interviews");
  const sroll = req.body.user_id;
  pool
    .execute("SELECT * FROM INTERVIEW WHERE SROLL = ?", [sroll])
    .then(([rows, fields]) => {
      col_names = fields.map((val) => val.name);
      const data = { fields: col_names, rows: rows };
      res.status(200).send(data);
    })
    .catch((err) => console.log(err));
};

exports.getStudentOffers = (req, res, next) => {
  console.log("Get Student Offers");
  const sroll = req.body.user_id;

  // const query = `
  // SELECT S.SNAME, C.CNAME, J.JROLE FROM OFFERS O
  // INNER JOIN STUDENT S
  //   ON O.SROLL = S.SROLL
  // INNER JOIN JOB J
  //   ON O.JID = J.JID
  // INNER JOIN COMPANY C
  //   ON J.CID = C.CID
  // WHERE O.SROLL =?`;
  const query = `
  SELECT APP.APP_ID, C.CNAME, J.JROLE, APP.APP_STATUS FROM APPLICATION APP
  INNER JOIN STUDENT S
    ON APP.SROLL = S.SROLL
  INNER JOIN JOB J
    ON APP.JID = J.JID
  INNER JOIN COMPANY C
    ON J.CID = C.CID
  WHERE APP.SROLL =?
    AND APP.APP_STATUS IN ('offered', 'accepted', 'rejected')
  `;

  pool
    .execute(query, [sroll])
    .then(([rows, fields]) => {
      col_names = fields.map((val) => val.name);
      const data = { fields: col_names, rows: rows };
      res.status(200).send(data);
    })
    .catch((err) => console.log(err));
}
exports.getAuth = (req, res, next) => {
  console.log("Auth Page Requested\n");
  res.render("Auth/login");
};

exports.postApply = (req, res, next) => {
  console.log(req.body);
  console.log("Student Apply");
  pool
    .execute(
      'INSERT INTO APPLICATION (SROLL, JID, APP_STATUS) VALUES (?, ?, ?)',  
      [req.body.user_id, req.body.jid, 'pending'] 
    )
    .then(([rows, fields]) => {
      console.log(rows);
      res.status(200).send({ status: "Applied Successfully" });
    })
    .catch(err => console.log(err));
};

exports.postOfferAccepted = (req, res, next) => {
  console.log("Offer Accepted");
  const appId = req.body.APP_ID;
  const sroll = req.body.user_id;

  pool
    .execute("UPDATE APPLICATION SET APP_STATUS = 'accepted' WHERE APP_ID = ? AND SROLL = ?", [appId, sroll])
    .then(([rows, fields]) => {
      pool
       .execute("UPDATE APPLICATION SET APP_STATUS = 'rejected' WHERE APP_ID <> ? AND SROLL = ?", [appId, sroll])
       .then(([rows, fields]) => {
          res.status(200).send({ status: "Offer Accepted and Offered" });
        })
        .catch((err) => console.log(err));
    })
    .catch((err) => console.log(err));
}

exports.postOfferRejected = (req, res, next) => {
  console.log("Offer Rejected");
  const appId = req.body.APP_ID;
  const sroll = req.body.user_id;

  pool
    .execute("UPDATE APPLICATION SET APP_STATUS = 'rejected' WHERE APP_ID = ? AND SROLL = ?", [appId, sroll])
    .then(([rows, fields]) => {
      res.status(200).send({ status: "Offer Rejected" });
    })
    .catch((err) => console.log(err));
}
