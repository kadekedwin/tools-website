const express = require('express')
const formidable = require("formidable")
const fs = require('fs')
const { exec } = require("child_process");

const router = express.Router();
const path = process.cwd()

const imageToAsciiJSON = JSON.parse(fs.readFileSync("./image-to-ascii.json"))

router.get('/', (req, res) => {
    res.sendFile(`${path}/html/image-to-ascii/index.html`)
})

router.post('/', (req, res, next) => {
    const form = new formidable.IncomingForm()

    form.parse(req, (err, fields, files) => {
        if (err) {
            next(err);
            return;
        }

        // files["file-upload"] = files.file-upload, because in javascript - sign cannot used in a variable
        const fileUpload = files["file-upload"][0]

        const fileType = fileUpload.mimetype
        const fileSize = fileUpload.size
        const fileName = fileUpload.originalFilename
        const filePath = fileUpload.filepath

        if(fileSize > 5000000) {
            console.log("file too large, max 5 mb")
            return
        }
        fs.readFile(filePath, function (err, data) {
            const convertCount = imageToAsciiJSON.convertCount + 1

            imageToAsciiJSON.convertCount = convertCount
            fs.writeFileSync("./image-to-ascii.json", JSON.stringify(imageToAsciiJSON))

            fs.mkdirSync(`${path}/image-to-ascii/${convertCount}`)
            
            fs.writeFile(`${path}/image-to-ascii/${convertCount}/${fileName}`, data, async function (err) {

                // rename the filename to image.jpg also convert it to jpg if it's not jpg
                exec(`cd image-to-ascii/${convertCount} && convert "${fileName}" image.jpg`, (error, stdout, stderr) => {
                    if (error) console.log(`error: ${error.message}`)
                    if (stderr) console.log(`stderr: ${stderr}`)
                    // console.log(`stdout: ${stdout}`);

                    exec(`cd image-to-ascii/${convertCount} && jp2a image.jpg --html --width=128 --background=light --output=ascii.html`, (error, stdout, stderr) => {
                        if (error) console.log(`error: ${error.message}`)
                        if (stderr) console.log(`stderr: ${stderr}`)
                        // console.log(`stdout: ${stdout}`);
    
                        exec(`cd image-to-ascii/${convertCount} && jp2a image.jpg --width=128 --background=light --output=ascii.txt`, (error, stdout2, stderr) => {
                            if (error) console.log(`error: ${error.message}`)
                            if (stderr) console.log(`stderr: ${stderr}`)
                            // console.log(`stdout: ${stdout2}`);
    
                            res.sendFile(`${path}/image-to-ascii/${convertCount}/ascii.html`)
                        })
                    })
                })

            })
        })

    })
})

router.use((req, res) => {
    res.status(404).send('404')
})
  
module.exports = router
