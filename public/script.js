const form = document.getElementById("uploadForm");
const statusText = document.getElementById("status");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const fileInput = document.getElementById("fileInput");

  if (!fileInput.files.length) {
    alert("Please select a file first!");
    return;
  }

  const formData = new FormData();
  formData.append("file", fileInput.files[0]);
  statusText.textContent = "Uploading...";

  try {
    const res = await fetch("/upload", { method: "POST", body: formData });
    if (res.redirected) window.location.href = res.url;
    else statusText.textContent = "File uploaded successfully!";
  } catch {
    statusText.textContent = "Error uploading file!";
  }
});
