// ======================
// LOGIN PAGE
// ======================

async function login() {

    const regNo =
        document.getElementById("regNo").value.trim();

    const section =
        document.getElementById("section").value;

    const message =
        document.getElementById("message");

    if (!regNo || !section) {

        message.style.color = "red";

        message.innerText =
            "Please fill all fields";

        return;
    }

    try {

        const response = await fetch("/login", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                regNo,
                section
            })
        });

        const data =
            await response.json();

        if (data.success) {

            localStorage.setItem(
                "student",
                JSON.stringify(data.student)
            );
window.location.href =
"consent.html";

        } else {

            message.style.color = "red";

            message.innerText =
                data.message;
        }

    } catch(error) {

        console.log(error);

        message.style.color = "red";

        message.innerText =
            "Server Error";
    }
}



// ======================
// SELECTION PAGE
// ======================

const student =
    JSON.parse(
        localStorage.getItem("student")
    );


// Prevent direct access
if (
    window.location.pathname.includes(
        "selection.html"
    ) &&
    !student
) {

    window.location.href = "/";
}



// ======================
// SHOW STUDENT DETAILS
// ======================

if (
    student &&
    document.getElementById(
        "studentDetails"
    )
) {

    document.getElementById(
        "studentDetails"
    ).innerHTML = `

        <p><b>Name :</b>
        ${student.name}</p>

        <p><b>Register Number :</b>
        ${student.regNo}</p>

        <p><b>Section :</b>
        ${student.section}</p>
    `;
}



// ======================
// PRIORITY SELECTION
// ======================

let priority1 = "";
let priority2 = "";


// PRIORITY 1

document
    .querySelectorAll(".priority1")
    .forEach(box => {

        box.addEventListener("click", () => {

            // stop clicking after submit
            if (
                document.getElementById(
                    "submitBtn"
                ).disabled
            ) return;

            document
                .querySelectorAll(".priority1")
                .forEach(b => {

                    b.classList.remove(
                        "selected"
                    );
                });

            box.classList.add(
                "selected"
            );

            priority1 =
                box.dataset.value;
        });

    });


// PRIORITY 2

document
    .querySelectorAll(".priority2")
    .forEach(box => {

        box.addEventListener("click", () => {

            // stop clicking after submit
            if (
                document.getElementById(
                    "submitBtn"
                ).disabled
            ) return;

            document
                .querySelectorAll(".priority2")
                .forEach(b => {

                    b.classList.remove(
                        "selected"
                    );
                });

            box.classList.add(
                "selected"
            );

            priority2 =
                box.dataset.value;
        });

    });



// ======================
// ALREADY SUBMITTED CHECK
// ======================

if (
    student &&
    student.submitted === 1
) {

    // SHOW SELECTED PRIORITIES

    priority1 =
        student.priority1;

    priority2 =
        student.priority2;


    // HIGHLIGHT PRIORITY 1

    document
        .querySelectorAll(".priority1")
        .forEach(box => {

            if (
                box.dataset.value ===
                student.priority1
            ) {

                box.classList.add(
                    "selected"
                );
            }
        });


    // HIGHLIGHT PRIORITY 2

    document
        .querySelectorAll(".priority2")
        .forEach(box => {

            if (
                box.dataset.value ===
                student.priority2
            ) {

                box.classList.add(
                    "selected"
                );
            }
        });

    disableForm();

    document.getElementById(
        "message"
    ).style.color = "red";

    document.getElementById(
        "message"
    ).innerText =
        "You have already submitted";
}



// ======================
// SUBMIT FUNCTION
// ======================

async function submitSelection() {

    const message =
        document.getElementById(
            "message"
        );

    const submitBtn =
        document.getElementById(
            "submitBtn"
        );

    if (!priority1 || !priority2) {

        message.style.color = "red";

        message.innerText =
            "Please select both priorities";

        return;
    }

    if (priority1 === priority2) {

        message.style.color = "red";

        message.innerText =
            "Priorities cannot be same";

        return;
    }

    try {

        // DISABLE BUTTON
        submitBtn.disabled = true;

        submitBtn.innerText =
            "Submitting...";

        const response =
            await fetch("/submit", {

            method: "POST",

            headers: {
                "Content-Type":
                    "application/json"
            },

            body: JSON.stringify({

                regNo: student.regNo,

                priority1,

                priority2
            })
        });

        const data =
            await response.json();

            if (data.success) {

message.style.color =
    "green";

message.innerText =
    "Submitted Successfully";

submitBtn.innerText =
    "Submitted";

submitBtn.style.background =
    "linear-gradient(135deg, #34c759, #7dff9b)";

disableForm();

            // UPDATE LOCAL STORAGE
            student.submitted = 1;

            student.priority1 =
                priority1;

            student.priority2 =
                priority2;

            localStorage.setItem(
                "student",
                JSON.stringify(student)
            );

        } else {

            submitBtn.disabled = false;

            submitBtn.innerText =
                "Submit";

            message.style.color = "red";

            message.innerText =
                data.message;
        }

    } catch(error) {

        console.log(error);

        submitBtn.disabled = false;

        submitBtn.innerText =
            "Submit";

        message.style.color = "red";

        message.innerText =
            "Server Error";
    }
}



// ======================
// DISABLE FORM
// ======================

function disableForm() {

    // DISABLE BUTTON

    document.getElementById(
        "submitBtn"
    ).disabled = true;


    // DISABLE CLICKING

    document
        .querySelectorAll(".course-box")
        .forEach(box => {

            box.style.pointerEvents =
                "none";

            box.style.opacity = "0.85";
        });
}


async function paymentLogin() {

    const regNo =
        document.getElementById(
            "paymentRegNo"
        ).value.trim();

    const section =
        document.getElementById(
            "paymentSection"
        ).value;

    const message =
        document.getElementById(
            "paymentMessage"
        );

    if (!regNo || !section) {

        message.style.color = "red";

        message.innerText =
            "Please fill all fields";

        return;
    }

    try {

        const response =
        await fetch("/login", {

            method: "POST",

            headers: {
                "Content-Type":
                "application/json"
            },

            body: JSON.stringify({
                regNo,
                section
            })
        });

        const data =
        await response.json();

        if (data.success) {

            localStorage.setItem(
                "student",
                JSON.stringify(
                    data.student
                )
            );

            window.location.href =
                "payment.html";

        } else {

            message.style.color =
                "red";

            message.innerText =
                data.message;
        }

    } catch(error) {

        message.style.color =
            "red";

        message.innerText =
            "Server Error";
    }
}

function feedbackLogin(){

    const regNo =
    document.getElementById(
        "feedbackRegNo"
    ).value.trim();

    const section =
    document.getElementById(
        "feedbackSection"
    ).value;

    if(!regNo || !section){

        document.getElementById(
            "feedbackMessage"
        ).innerText =
        "Enter Register Number and Section";

        return;
    }

    localStorage.setItem(
        "feedbackRegNo",
        regNo
    );

    localStorage.setItem(
        "feedbackSection",
        section
    );

    window.location.href =
    "feedback.html";
}