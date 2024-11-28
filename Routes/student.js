const path = require("path");

const express = require("express");

const studentController = require("../controllers/student");
const exp = require("constants");

const router = express.Router();

router.get("/", studentController.getHome);
router.get("/allJobs", studentController.getAllJobs);
router.get("/eligibleJobs", studentController.getEligibleJobs);
router.get("/appliedJobs", studentController.getAppliedJobs);
router.get("/interviews", studentController.getInterviews);
router.get("/updates", studentController.getUpdates);
router.get("/auth", studentController.getAuth);
router.get("/user", studentController.getStudentProfiles);
router.get("/offers", studentController.getStudentOffers);
router.post("/updateProfile", studentController.postStudentProfile);
router.post("/apply", studentController.postApply);
router.post("/offeraccepted", studentController.postOfferAccepted);
router.post("/offerrejected", studentController.postOfferRejected);

module.exports = router;

