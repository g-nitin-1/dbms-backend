const pool = require("../util/connectionPool");

exports.getHome = (req, res, next) => {
  console.log("COMPANY JOBS");
  return res.status(200).send({ status: "valid", role: "admin" });
};

exports.getMyJobs = (req, res, next) => {
  const cid = req.body.user_id;
  console.log("COMPANY JOBS");
  pool
    .execute("SELECT * FROM JOB WHERE cid = ?", [cid])
    .then(([rows, fields]) => {
      col_names = fields.map((val) => val.name);
      const data = { fields: col_names, rows: rows };
      res.status(200).send(data);
    })
    .catch((err) => {
      console.error(err);
    });
};

exports.getProfile = (req, res, next) => {
  console.log("COMPANY PROFILE");
  const cid = req.body.user_id;
  pool
    .execute(
      "SELECT CNAME, CITY, CPROFILE, CREGDATE FROM COMPANY WHERE cid = ?",
      [cid]
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

exports.getApplication = (req, res, next) => {
  console.log("COMPANY APPLICATIONS");
  const cid = req.body.user_id;
  const jid = req.body.jid;
  pool
    .execute("SELECT * FROM APPLICATION WHERE jid = ?", [jid])
    .then(([rows, fields]) => {
      col_names = fields.map((val) => val.name);
      const data = { fields: col_names, rows: rows };
      res.status(200).send(data);
    })
    .catch((err) => {
      console.error(err);
    });
};

exports.getBranches = (req, res, next) => {
  console.log("COMPANY BRANCHES");
  pool
    .execute("SELECT * FROM BRANCH")
    .then(([rows, fields]) => {
      // rows = rows.map((val) => val.BR_NAME);
      const data = { rows: rows };
      res.status(200).send(data);
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.postApplicants = (req, res, next) => {
  console.log("postApplicants");
  const jid = req.body.JID;
  pool
    .execute("SELECT * FROM APPLICATION WHERE JID = ?", [jid])
    .then(([rows, fields]) => {
      col_names = fields.map((val) => val.name);
      const data = { rows: rows, fields: col_names };
      console.log(data);
      res.status(200).send(data);
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getInterviews = (req, res, next) => {
  console.log("getInterviews");
  const jid = req.body.ID;
  pool
    .execute("SELECT * FROM INTERVIEW WHERE JID = ?", [jid])
    .then(([rows, fields]) => {
      col_names = fields.map((val) => val.name);
      const data = { rows: rows, fields: col_names };
      res.status(200).send(data);
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.postJob = (req, res, next) => {
  console.log("Hey");
  console.log(req.body);
  const jrole = req.body.JobRole;
  const jsal = parseInt(req.body.JobSalary);
  // console.log(typeof(jsal))
  const jdesc = req.body.JobDescription;
  const jstart = req.body.JobStartDate;
  const jdur = parseInt(req.body.JobDuration);
  const cgpa = parseFloat(req.body.MinimumCGPA);
  const maxArr = parseInt(req.body.MaximumArrears);
  const branches = req.body.Branches;
  const gender = req.body.Gender;
  const cid = parseInt(req.body.user_id);
  let str = "";
  branches.forEach((element) => {
    str += element;
    str += ",";
  });
  str = str.slice(0, -1);
  console.log(str);

  let Gen = "";
  if (gender.includes("Male") && gender.includes("Female")) Gen = "B";
  else if (gender.includes("Male")) Gen = "M";
  else if (gender.includes("Female")) Gen = "F";
  else Gen = "B";
  console.log(Gen);
  // return res.send({status : "valid"});
  pool
    .execute("CALL  InsertJob(?,?,?,?,?,?,?,?,?,?)", [
      jrole,
      jsal,
      jdesc,
      jstart,
      jdur,
      cgpa,
      maxArr,
      str,
      cid,
      Gen,
    ])
    .then(([rows, fields]) => {
      console.log(rows);
      console.log("Job Inserted Successfully");
      res.status(200).send({ status: "Job Inserted Successfully" });
    })
    .catch((err) => {
      console.log(err);
      res.send({ status: "Error Occurred" });
    });
};

exports.getApplicants = (req, res, next) => {
  console.log("Post request for Students List");
  console.log(req.body);
  const jid = req.body.JID;
  pool
    .execute("SELECT * FROM APPLICATION WHERE JID = ? AND APP_STATUS = ?", [
      jid,
      "pending",
    ])
    .then(([rows, fields]) => {
      console.log(rows);
      col_names = fields.map((field) => field.name);
      res.status(200).send({ rows: rows, fields: col_names });
    })
    .catch((err) => console.log(err));
};

exports.getInterviewDetails = (req, res, next) => {
  console.log("Post request for Interview Details");
  console.log(req.body);
  const jid = req.body.JID;
  // return res.status(200).send({ status: "Valid" });
  pool
    .execute(
      "SELECT IDATE INTERVIEW_DATE, ITIME INTERVIEW_TIME FROM JOB  WHERE JID = ?",
      [jid]
    )
    .then(([rows, fields]) => {
      if (rows[0].INTERVIEW_DATE) {
        rows[0].INTERVIEW_DATE =
          rows[0].INTERVIEW_DATE.toISOString().split("T")[0];
      }
      console.log(rows);
      res.status(200).send(rows[0]);
    })
    .catch((err) => console.log(err));
};

exports.postInterviewDetails = (req, res, next) => {
  console.log("Post request for Update Interview Details");
  console.log(req.body);
  const jid = req.body.JID;
  const itime = req.body.INTERVIEW_TIME || "";
  const idate = req.body.INTERVIEW_DATE || "";
  if (!idate) {
    return res.status(400).send({ status: "Invalid" });
  }
  // console.log(idate)
  // return res.status(200).send({ status: "Valid" });

  pool
    .execute("UPDATE JOB SET IDATE = ?, ITIME = ?  WHERE JID = ?", [
      idate,
      itime,
      jid,
    ])
    .then(([rows, fields]) => {
      console.log(rows);
      res.status(200).send({ status: "Valid" });
    })
    .catch((err) => console.log(err));
};

exports.postInterviewSelected = (req, res, next) => {
  console.log("Post request for Accepting Applicant");
  console.log(req.body);
  // res.status(200).send({ status: "valid" });
  pool
    .execute("UPDATE APPLICATION SET APP_STATUS = ? WHERE APP_ID = ?", [
      "interview",
      req.body.APP_ID,
    ])
    .then(([rows, fields]) => {
      console.log(rows);
      pool
        .execute(
          "SELECT SROLL FROM APPLICATION WHERE APP_ID = ?",
          [req.body.APP_ID]
        )
        .then(([rows, fields]) => {
          console.log(rows)
          pool
            .execute(
              "INSERT INTO INTERVIEW (APP_ID, SROLL, JID) VALUES (?, ?, ?)",
              [
                req.body.APP_ID,
                rows[0]["SROLL"],
                req.body.user_id
              ]
            )
            .then(([rows, fields]) => {
              console.log(rows);
              res.status(200).send({ status: "valid" });
            })
            .catch((err) => console.log(err));
        });
    })
    .catch((err) => console.log(err));
};

exports.postOfferSelected = (req, res, next) => {
  console.log("Post request for Offering Applicant");
  console.log(req.body);
  // res.status(200).send({ status: "valid" });
  pool
    .execute("UPDATE APPLICATION SET APP_STATUS = ? WHERE APP_ID = ?", [
      "offered",
      req.body.APP_ID,
    ])
    .then(([rows, fields]) => {
      console.log(rows);
      pool
        .execute(
          "SELECT SROLL, INT_ID FROM INTERVIEW WHERE APP_ID = ? AND JID = ?",
          [
            req.body.APP_ID,
            req.body.user_id
          ]
        )
        .then(([rows, fields]) => {
          console.log(rows)
          pool
            .execute(
              "INSERT INTO OFFERS (SROLL, INT_ID, JID) VALUES (?, ?, ?)",
              [
                rows[0]["SROLL"],
                rows[0]["INT_ID"],
                req.body.user_id
              ]
            )
            .then(([rows, fields]) => {
              console.log(rows);
              res.status(200).send({ status: "valid" });
            })
            .catch((err) => console.log(err));
        });
    })
    .catch((err) => console.log(err));
};

exports.postInterviewRejected = (req, res, next) => {
  console.log("Post request for Rejecting Applicant");
  console.log(req.body);
  // res.status(200).send({ status: "valid" });
  pool
    .execute("UPDATE APPLICATION SET APP_STATUS = ? WHERE APP_ID = ?", [
      "rejected",
      req.body.APP_ID,
    ])
    .then(([rows, fields]) => {
      console.log(rows);
      res.status(200).send({ status: "valid" });
    })
    .catch((err) => console.log(err));
};

exports.getInterviewListDetails = (req, res, next) => {
  console.log("Post request for Fetching Interview List Details");
  console.log(req.body);
  const jid = req.body.JID;
  // return res.status(200).send({ status: "Valid" });
  pool
    .execute(
      "SELECT INT_ID, APP_ID, SROLL ROLL_NO, IDATE INTERVIEW_DATE, ITIME INTERVIEW_TIME FROM INTERVIEW  WHERE JID = ?",
      [jid]
    )
    .then(([rows, fields]) => {
      if (rows[0].INTERVIEW_DATE) {
        rows[0].INTERVIEW_DATE =
          rows[0].INTERVIEW_DATE.toISOString().split("T")[0];
      }
      console.log(rows);
      col_names = fields.map((field) => field.name);
      res.status(200).send({rows:rows, fields:col_names});
    })
    .catch((err) => console.log(err));
};


exports.postOfferList = (req, res, next) => {
  console.log("/c/postOfferList");
  const jid = req.body.JID;
  const status = ['offered', 'accepted', 'rejected'];

  pool
    .execute("SELECT * FROM APPLICATION WHERE JID = ? AND APP_STATUS IN (?, ?, ?)", [jid, ...status])
    .then(([rows, fields]) => {
      console.log(rows);
      col_names = fields.map((field) => field.name);
      res.status(200).send({ rows: rows, fields: col_names });
    })
    .catch((err) => console.log(err));
};