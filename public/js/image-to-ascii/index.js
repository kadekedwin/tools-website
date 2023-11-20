
const fileUpload = document.getElementById("file-upload")
const filePreview = document.getElementById("file-preview")
const fileLabel = document.getElementById("file-label")

fileUpload.onchange = () => { 
    if (fileUpload.files[0]) {
        fileLabel.style.display = "none"
        filePreview.src = URL.createObjectURL(fileUpload.files[0])
    }
}