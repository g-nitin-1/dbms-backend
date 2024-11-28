const path = require("path");

const express = require("express");

const companyController = require("../controllers/company");
const exp = require("constants");

const router = express.Router();

router.get("/", companyController.getHome);
router.get("/jobs", companyController.getMyJobs);
router.get("/application", companyController.getApplication);
router.get("/profile", companyController.getProfile);
router.get("/branches", companyController.getBranches);
router.get("/interviews", companyController.getInterviews);

router.post("/addjob", companyController.postJob);
// router.post("/studentslist", companyController.postStudentList);
router.post("/studentslist", companyController.getApplicants);
router.post("/interviewdetails", companyController.getInterviewDetails);
router.post("/interviewselected", companyController.postInterviewSelected);
router.post("/offeredjob", companyController.postOfferSelected);
router.post("/rejected", companyController.postInterviewRejected);
router.post("/interviewlist", companyController.getInterviewListDetails);
router.post("/updateinterviewdetails", companyController.postInterviewDetails);
router.post("/applicants", companyController.postApplicants);
// router.post("/registerCompany", companyController.registerCompany);
router.post("/offerlist", companyController.postOfferList);

module.exports = router;
