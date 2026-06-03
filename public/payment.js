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
   GET LOGGED-IN STUDENT
========================================= */

const loggedStudent =
JSON.parse(
    localStorage.getItem("student")
);

if(!loggedStudent){

    window.location.href = "/";
}

const alreadyUploaded =
localStorage.getItem(

    "paymentUploaded_" +
    loggedStudent.regNo
);

if(alreadyUploaded === "yes"){

    window.addEventListener(

        "DOMContentLoaded",

        ()=>{

            const btn =
            document.getElementById(
                "submitBtn"
            );

            btn.disabled = true;

            btn.innerHTML =
            "✅ Already Uploaded";
        }
    );
}

/* =========================================
   PAYMENT LINK
========================================= */

// ADD YOUR PAYMENT LINK HERE

document
.getElementById("paymentLink")
.href =
"https://rzp.io/rzp/iNd7SAFd";

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
   LOAD STUDENT DETAILS
========================================= */

async function loadPaymentPage(){

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
            .getElementById(
                "studentCard"
            )
            .innerHTML =

            "<h2>Student not found</h2>";

            return;
        }

        document
        .getElementById(
            "studentCard"
        )
        .innerHTML = `

        <h2>
            Student Information
        </h2>

        <p>
            <b>Name :</b>
            ${studentRecord.name}
        </p>

        <p>
            <b>Register Number :</b>
            ${studentRecord.regno}
        </p>

        <p>
            <b>Section :</b>
            ${studentRecord.section}
        </p>

        <p>
            <b>Course :</b>
            ${studentRecord.course}
        </p>

        <p>
            <b>Batch :</b>
            ${studentRecord.batch}
        </p>

        `;

    }

    catch(error){

        console.error(error);

        document
        .getElementById(
            "studentCard"
        )
        .innerHTML =

        "<h2>Error Loading Data</h2>";
    }
}

/* =========================================
   INITIAL LOAD
========================================= */

loadPaymentPage();

/* =========================================
   PAYMENT SCREENSHOT VALIDATION
========================================= */

document
.getElementById("submitBtn")
.addEventListener(

"click",

async ()=>{

    const confirm =
    document.getElementById(
        "confirmPayment"
    );

    if(!confirm.checked){

        alert(
            "Please confirm payment first"
        );

        return;
    }

    const file =
    document.getElementById(
        "paymentFile"
    ).files[0];

    if(!file){

        alert(
            "Select screenshot first"
        );

        return;
    }

    if(file.size > 2 * 1024 * 1024){

        alert(
            "Image size must be less than 2 MB"
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
            "Only JPG and PNG allowed"
        );

        return;
    }

const submitBtn =
document.getElementById(
    "submitBtn"
);

submitBtn.disabled = true;

submitBtn.innerHTML =
"⏳ Uploading...";

const formData =
new FormData();

formData.append(
    "file",
    file
);

formData.append(
    "regNo",
    loggedStudent.regNo
);

formData.append(
    "section",
    loggedStudent.section
);

try{

    const response =
    await fetch(

        "/upload-payment",

        {

            method:"POST",

            body:formData
        }
    );

    const data =
    await response.json();

    if(data.success){

        localStorage.setItem(

            "paymentUploaded_" +
            loggedStudent.regNo,

            "yes"
        );

        submitBtn.innerHTML =
        "✅ Uploaded";

        alert(
            "Payment proof uploaded successfully"
        );

    }

    else{

        submitBtn.disabled =
        false;

        submitBtn.innerHTML =
        "Submit Screenshot";

        alert(
            data.message
        );
    }

}

catch(error){

    console.log(error);

    submitBtn.disabled =
    false;

    submitBtn.innerHTML =
    "Submit Screenshot";

    alert(
        "Upload failed"
    );
}

});