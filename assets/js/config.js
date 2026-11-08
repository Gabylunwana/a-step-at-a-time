/* =========================================================================
   ONE STEP AT A TIME — PROGRAMME CONFIGURATION
   Edit this file to adapt the guide to your setting. No coding needed:
   change the text between the quotes and save.
   ========================================================================= */
window.SBS_CONFIG = {
  programmeName: "One Step at a Time",
  tagline: "A five-week self-help guide for low mood and stress",
  organisation: "", // e.g. "Port Harcourt Community Health Programme"

  // true = each session opens only after the one before is finished
  // (recommended: the skills build on each other)
  sequentialUnlock: true,

  // Companion characters. The reader picks one in "Getting started".
  // Change names/descriptions to suit your community.
  characters: [
    { id: "amara", name: "Amara", blurb: "A woman in her thirties juggling work and family", skin: "#8d5524", hair: "#1b1b1b", hairStyle: "wrap", shirt: "#c0603a" },
    { id: "chidi", name: "Chidi", blurb: "A man in his thirties who recently lost his job",   skin: "#6b4226", hair: "#141414", hairStyle: "short", shirt: "#3a6ea5" }
  ],

  // The trusted figure who teaches the skills in the story.
  guide: { name: "Ada", role: "a community health worker", skin: "#7a4a2a", hair: "#202020", hairStyle: "bun", shirt: "#2f8f83" },

  // Optional human support ("helper") — see docs/HELPER_GUIDE.md
  helper: {
    enabled: false,
    contactText: "Your helper will call you once a week for about 15 minutes.",
    contactDetails: "" // e.g. "WhatsApp: +234 ... (Mon–Fri, 9am–5pm)"
  },

  // ---------------------------------------------------------------------
  // URGENT HELP — YOU MUST FILL THIS IN BEFORE GIVING THE GUIDE TO ANYONE.
  // Use only numbers you have checked are working in your area.
  // While these are empty the app shows a safe generic message instead.
  // ---------------------------------------------------------------------
  crisis: {
    emergencyNumber: "112",       // Nigeria national emergency number
    emergencyLabel: "National Emergency (life-threatening emergencies)",
    lines: [
      // { name: "Name of helpline", phone: "+000 000 0000", hours: "24 hours", note: "Free, confidential" }
      { name: "MANI (Mentally Aware Nigeria Initiative)", phone: "0809 111 6264", note: "Mental-health crisis support" },
      { name: "MANI (Mentally Aware Nigeria Initiative)", phone: "0811 168 0686", note: "Alternative support line" },
      { name: "SURPIN (Suicide Research and Prevention Initiative)", phone: "0800 0787 7464", note: "Suicide prevention support" },
      { name: "SURPIN (Suicide Research and Prevention Initiative)", phone: "0908 021 7555", note: "Crisis support" },
      { name: "SURPIN (Suicide Research and Prevention Initiative)", phone: "0903 440 0009", note: "Alternative crisis line" },
      { name: "She Writes Woman", phone: "0800 800 2000", note: "Mental-health support" },
      { name: "Smart Suicide Prevention Initiative", phone: "0806 210 6493", note: "Suicide prevention support" },
      { name: "Smart Suicide Prevention Initiative", phone: "0809 210 6493", note: "Alternative support" }
    ],
    nearestCare: "the nearest hospital emergency department or primary health centre"
  }
};
