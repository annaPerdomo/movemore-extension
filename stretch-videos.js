// Curated YouTube video IDs for stretch demonstrations.
// Each maps a stretch name to a short, clear tutorial video.
// Stretches not listed here fall back to SVG illustrations.

const STRETCH_VIDEOS = {
  "Neck Rolls":                   "X-CUlo4zf0Y",
  "Shoulder Shrugs & Rolls":      "2G2Z1JrDLxw",
  "Seated Spinal Twist":          "4faLXO2bLFU",
  "Chest Opener":                 "EswbusODZ7o",
  "Wrist Flexor Stretch":         "Rfat8z_tX1I",
  "Standing Forward Fold":        "g7Uhp5tphAs",
  "Cat-Cow (Seated)":             "PMxA3xlFpAk",
  "Hip Flexor Stretch":           "OCPxQpO-4DE",
  "Chin Tucks":                   "gIBoxQ6AlS0",
  "Wall Angels":                  "1UU4VvklQ44",
  "Figure-4 Stretch":             "2VE_NLcNMvQ",
  "Doorway Chest Stretch":        "M850sCj9LHQ",
  "Overhead Reach":               "_JGWt2BDCl4",
  "Calf Raises":                  "gwLzBJYoWlI",
  "Trapezius Release":            "-r0eoFS7_5Q",
  "Scapular Squeeze":             "p1UZuTf8ZEo",
  "Thread the Needle":            "MfUx9FCOb1E",
  "Cross-Body Shoulder Stretch":  "1Sfl3iYM1Jg",
  "Eagle Arms":                   "vcl11PTFGOc",
  "Levator Scapulae Stretch":     "RQZ2kEiKm3c",
  "Prone Y Raise":                "juoKsTqy77E",
  "Bruegger's Relief Position":   "TP0X8wITwmI",
  "Seated Pigeon Pose":           "9duW9HncInY",
  "90/90 Hip Stretch":            "t4Zz6-aG8Iw",
};

function getVideoId(name) {
  return STRETCH_VIDEOS[name] || null;
}
