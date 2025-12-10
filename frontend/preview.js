// Load stored resume data
const data = JSON.parse(localStorage.getItem("resumeData"));

// Load chosen template CSS if user selected template
const selectedTemplate = localStorage.getItem("selectedTemplate");
if (selectedTemplate) {
  document.getElementById("themeCSS").href = "styles/" + selectedTemplate + ".css";
}

// Fill data into preview page
document.getElementById("namePreview").innerText = data.name;
document.getElementById("emailPreview").innerText = "📧 " + data.email;
document.getElementById("phonePreview").innerText = "📞 " + data.phone;
document.getElementById("summaryPreview").innerText = data.summary;
document.getElementById("educationPreview").innerText = data.education;
document.getElementById("experiencePreview").innerText = data.experience;

// Profile Picture Preview
if (data.profilePic) {
  document.getElementById("profilePicPreview").src = data.profilePic;
}

// Skill list (convert comma values to bullet points)
const skillsArray = data.skills.split(",");
const skillsList = document.getElementById("skillsPreview");

skillsArray.forEach(skill => {
  if (skill.trim() !== "") {
    const li = document.createElement("li");
    li.textContent = skill.trim();
    skillsList.appendChild(li);
  }
});

// PDF Download
document.getElementById("downloadBtn").addEventListener("click", () => {
  const resumeContent = document.querySelector(".resume-container");

  const options = {
    margin: 0.5,
    filename: `${data.name}-resume.pdf`,
    image: { type: "jpeg", quality: 1 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: "in", format: "a4", orientation: "portrait" }
  };

  html2pdf().from(resumeContent).set(options).save();
});
