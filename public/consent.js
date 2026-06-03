/* =========================================
   GOOGLE SHEET CONFIG
========================================= */

const SPREADSHEET_ID =
"1Jy2AtIPFJmz6nLao5wzvsLt0f7TTYFNi8XWDqhEXME4";

/* =========================================
   SHEET NAMES
========================================= */

const courses = [

    {
        name:"AWS",
        gid:"1607824551"
    },

    {
        name:"Cyber Security",
        gid:"578817017"
    },

    {
        name:"SQL for data analysis",
        gid:"1330432124"
    },

    {
        name:"Power Bi",
        gid:"1604268348"
    }
];

/* =========================================
   BATCH DETAILS
========================================= */

const batchDetails = {

    "AWS-Batch 1": {
        date: "18th to 20th June 2026",
        venue: "Lan Room"
    },

    "AWS-Batch 2": {
        date: "22nd to 24th June 2026",
        venue: "Lan Room"
    },

    "Cyber Security-Batch 1": {
        date: "8th to 10th June 2026",
        venue: "Auditorium"
    },

    "Cyber Security-Batch 2": {
        date: "11th to 13th June 2026",
        venue: "Auditorium"
    },

    "SQL for data analysis-Batch 1": {
        date: "15th to 17th June 2026",
        venue: "Lan Room"
    },

    "SQL for data analysis-Batch 2": {
        date: "22nd to 24th June 2026",
        venue: "Auditorium"
    },

    "Power Bi-Batch 1": {
        date: "8th to 10th June 2026",
        venue: "Lan Room"
    },

    "Power Bi-Batch 2": {
        date: "11th to 13th June 2026",
        venue: "Lan Room"
    }
};

/* =========================================
   GET LOGGED-IN STUDENT
========================================= */

const loggedStudent =
JSON.parse(
    localStorage.getItem("student")
);

const uploaded =
localStorage.getItem(
    "consentUploaded_" +
    loggedStudent.regNo
);

if(!loggedStudent){

    window.location.href = "/";
}

/* =========================================
   FETCH GOOGLE SHEET DATA
========================================= */

async function fetchCourseData(course){

    try{

        const url =
        `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/gviz/tq?tqx=out:json&gid=${course.gid}`;

        const response =
        await fetch(url);

        const text =
        await response.text();

        const json =
        JSON.parse(
            text.substring(47).slice(0,-2)
        );

        const rows =
        json.table.rows.filter(
            row => row.c && row.c[1]
        );

        return rows.map(row => {

            const cells = row.c;

            return {

                regno:
                String(cells[1]?.v || "").trim(),

                name:
                String(cells[2]?.v || "").trim(),

                section:
                String(cells[3]?.v || "").trim(),

                course:
                course.name,

                batch:
                String(cells[5]?.v || "").trim()
            };

        });

    }catch(error){

        console.error(error);

        return [];
    }
}

/* =========================================
   LOAD CONSENT DATA
========================================= */

async function loadConsentForm(){

    try{

        const results =
        await Promise.all(

            courses.map(course =>
                fetchCourseData(course)
            )

        );

        const allStudents =
        results.flat();

        const studentRecord =
        allStudents.find(

            student =>

            student.regno ===
            loggedStudent.regNo

        );

        if(!studentRecord){

            document
            .getElementById("consentForm")
            .innerHTML =

            "<h2>Student not found</h2>";

            return;
        }

        const key =
        `${studentRecord.course}-${studentRecord.batch}`;

        const details =
        batchDetails[key];

document.getElementById("consentForm").innerHTML = `



<div class="letter">

<div class="letter-header">

    <img
        src="clg-logo.png"
        class="college-logo">

    <div class="form-details">

        <div>
            FORM NO. F / IIPC / 011
        </div>

        <div>
            Rev.00 Date 20.03.2020
        </div>

        <div>
            Page 1 of 1
        </div>

    </div>

</div>

<h2 class="letter-title">
    Letter of Undertaking for Technical Skill-I by Parents and Student
</h2>

<p class="date-line">
    Date : ${new Date().toLocaleDateString("en-GB")}
</p>

<p style="margin-top:25px;">

    To,<br>

    The Head of the Department<br>

    Department of Data Science<br>

    Dr. M.G.R. Educational and Research Institute<br>

    Maduravoyal, Chennai – 600095

</p>

<p style="margin-top:20px;">

    <strong>
        Subject:
    </strong>

    Submission of Technical Skill-I Undertaking

</p>

<p style="margin-top:20px;">

    <strong>
        Respected Madam,
    </strong>

</p>

<p style="margin-top:20px; line-height:1.8;">

    We, Mr./Mrs. ____________________,

    parents of

    <strong>
        ${studentRecord.name}
    </strong>,

    studying in

    <strong>
        IV Semester
    </strong>,

    Department of

    <strong>
        ${studentRecord.section}
    </strong>,

    hereby permit our son/daughter to participate in the
    Technical Skill-I Programme on

    <strong>
        ${studentRecord.course}
    </strong>

    organized by

    <strong>
        AVNL Institute of Learning, Avadi
    </strong>

    from

    <strong>
        ${details.date}
    </strong>.

</p>

<p style="margin-top:20px; line-height:1.8;">

    We assure that our son/daughter will follow all the
    University rules and instructions given by the faculty
    members during the programme.

</p>

<p style="margin-top:20px; line-height:1.8;">

    We understand that the University will not be responsible
    for any accident, injury, or loss during the programme,
    and we take full responsibility for our son/daughter's
    actions.

</p>

<p style="margin-top:50px;">

    Yours faithfully,

</p>

<div
    class="signature-row"
    style="margin-top:60px;">

    <div>

        <strong>
            Father's / Mother's Signature
        </strong>

        <br><br>

        Mobile No :
        ___________________

    </div>

    <div>

        <strong>
            Student Signature
        </strong>

        <br><br>

        Mobile No :
        ___________________

    </div>

</div>

</div>

`;

if(uploaded === "yes"){

    document.querySelector(
        ".upload-card"
    ).insertAdjacentHTML(

        "afterbegin",

        `
        <div style="
            color:green;
            font-size:18px;
            font-weight:bold;
            margin-bottom:15px;
        ">
            ✅ You have already uploaded your consent form.
        </div>
        `
    );
}


    }

    

    catch(error){

        console.error(error);

        document
        .getElementById("consentForm")
        .innerHTML =

        "<h2>Error Loading Data</h2>";
    }
}

/* =========================================
   INITIAL LOAD
========================================= */


loadConsentForm();

document
.getElementById("uploadBtn")
.addEventListener(

"click",

async ()=>{

    const file =
    document
    .getElementById(
        "signedFile"
    )
    .files[0];

    if(file.size > 2 * 1024 * 1024){

    alert(
        "Image size must be less than 2 MB"
    );

    return;
}

    if(!file){

        alert(
        "Select image first"
        );

        return;
    }

    const allowed = [

        "image/jpeg",

        "image/png"
    ];

    if(
        !allowed.includes(
            file.type
        )
    ){

        alert(
        "Only JPG or PNG allowed"
        );

        return;
    }

    const student =
    JSON.parse(
        localStorage
        .getItem("student")
    );

    const uploadBtn =
document.getElementById(
    "uploadBtn"
);

uploadBtn.disabled = true;

uploadBtn.innerHTML =
"⏳ Uploading...";

    const formData =
    new FormData();

    

    formData.append(
        "file",
        file
    );

    formData.append(
        "regNo",
        student.regNo
    );

    formData.append(
        "section",
        student.section
    );

    const response =
    await fetch(

        "/upload-consent",

        {

            method:"POST",

            body:formData
        }
    );

    const data =
    await response.json();

if(data.success){

    localStorage.setItem(
        "consentUploaded_" + student.regNo,
        "yes"
    );

    alert(
        "Uploaded Successfully"
    );

    location.reload();
}

else{

    uploadBtn.disabled = false;

    uploadBtn.innerHTML =
    "Upload Document";

    alert(
        data.message
    );
}
});