// ---------------- AI SUMMARY GENERATOR ----------------
async function generateAISummary() {
  const skills = document.getElementById("skills").value.trim();
  const experience = document.getElementById("experience").value.trim();
  const education = document.getElementById("education").value.trim();

  if (!skills && !experience && !education) {
    return alert("Please enter skills, experience, or education for AI to generate a summary.");
  }

  const btn = document.getElementById("generateAI");
  btn.disabled = true;
  btn.innerText = "Generating...";

  try {
    const res = await fetch("http://localhost:5000/api/ai/skills", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        skills,
        experience,
        education
      })
    });

    const data = await res.json();
    document.getElementById("aiSummary").value = data.result;

    if (data.fallback) {
      alert("⚠ AI quota exceeded — using fallback AI output.");
    }

  } catch (err) {
    alert("Network Error");
  }

  btn.disabled = false;
  btn.innerText = "✨ Generate Summary with AI";
}

document.getElementById("generateAI").addEventListener("click", generateAISummary);


// ---------------- SEND DATA TO PREVIEW PAGE ----------------
document.getElementById("generateBtn").addEventListener("click", () => {

  // Collect all form data
  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const phone = document.getElementById("phone").value.trim();

  const summary =
    document.getElementById("aiSummary").value.trim() ||
    document.getElementById("summary").value.trim();

  const skills = document.getElementById("skills").value.trim();
  const education = document.getElementById("education").value.trim();
  const experience = document.getElementById("experience").value.trim();

  const profilePicInput = document.getElementById("profilePic");

  let profilePic = "";
  if (profilePicInput.files[0]) {
    profilePic = URL.createObjectURL(profilePicInput.files[0]);
  }

  const resumeData = {
    name,
    email,
    phone,
    summary,
    skills,
    education,
    experience,
    profilePic
  };

  // Store in localStorage
  localStorage.setItem("resumeData", JSON.stringify(resumeData));

  // Go to preview page
  window.location.href = "preview.html";
});
