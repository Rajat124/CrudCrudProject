const myform = document.getElementById("myform");
const btn1 = document.getElementById("btn");
const itemlist = document.getElementById("item");

btn1.addEventListener("mouseover", (e) => {
  btn1.style.background = "red";
  btn1.classList.add("zoom");
});

btn1.addEventListener("mouseout", (e) => {
  btn1.style.background = "white";
  btn1.classList.remove("zoom");
});

myform.addEventListener("submit", (e) => {
  e.preventDefault();
  const name1 = document.getElementById("nameid").value;
  const uemail = document.getElementById("emailid").value;
  const phone = document.getElementById("phoneid").value;
  if (name1 == "" || uemail == "" || phone == "") {
    alert("Please Enter All");
  } else {
    showOnScreen(name1, uemail, phone);

    let obj = {
      name: name1,
      email: uemail,
      phone: phone,
    };
    localStorage.setItem(uemail, JSON.stringify(obj));

    async function postAppointment() {
      try {
        const res = await axios.post(
          "https://crudcrud.com/api/45155744af414f21a14eae555408eed5/appointmentData",
          obj
        );
        console.log(res.data);
      } catch (err) {
        console.log(err);
      }
    }
    postAppointment();
  }
});

window.addEventListener("DOMContentLoaded", async () => {
  try {
    const res = await axios.get(
      "https://crudcrud.com/api/45155744af414f21a14eae555408eed5/appointmentData"
    );
    console.log(res);
    for (let i = 0; i < res.data.length; i++) {
      showOnScreen(res.data[i].name, res.data[i].email, res.data[i].phone);
    }
  } catch (err) {
    console.log(err);
  }
});

function showOnScreen(name1, uemail, phone) {
  var li = document.createElement("li");
  li.appendChild(
    document.createTextNode(name1 + " | " + uemail + " | " + phone)
  );

  /// delete button

  var delbtn = document.createElement("button");
  delbtn.className = "btn btn-danger btn-sm float-right delete";
  delbtn.appendChild(document.createTextNode("Delete"));
  li.appendChild(delbtn);

  /// edit button

  var editbtn = document.createElement("button");
  editbtn.className = "btn btn-dark btn-sm float-right edit";
  editbtn.appendChild(document.createTextNode("Edit"));
  li.appendChild(editbtn);

  itemlist.appendChild(li);
}

itemlist.addEventListener("click", (e) => {
  if (e.target.classList.contains("delete")) {
    if (confirm("Are U Sure?")) {
      var li = e.target.parentElement;
      var details = li.childNodes[0].textContent.split(" | ");
      localStorage.removeItem(details[1]);
      itemlist.removeChild(li);

      async function deleteAppointment() {
        try {
          const res = await axios.get(
            "https://crudcrud.com/api/45155744af414f21a14eae555408eed5/appointmentData"
          );
          const itemToDelete = res.data.find(
            (item) => item.email === details[1]
          );
          if (itemToDelete) {
            const itemId = itemToDelete._id;
            const deleteRes = await axios.delete(
              `https://crudcrud.com/api/45155744af414f21a14eae555408eed5/appointmentData/${itemId}`
            );
            console.log(deleteRes);
          }
        } catch (err) {
          console.log(err);
        }
      }
      deleteAppointment();
    }
  }
  e.stopPropagation();
});

itemlist.addEventListener("click", (e) => {
  if (e.target.classList.contains("edit")) {
    var li = e.target.parentElement;
    var details = li.childNodes[0].textContent.split(" | ");
    localStorage.removeItem(details[1]);

    async function updateAppointment() {
      try {
        const res = await axios.get(
          "https://crudcrud.com/api/45155744af414f21a14eae555408eed5/appointmentData"
        );
        console.log(res);

        const itemToUpdate = res.data.find((item) => item.email === details[1]);

        if (itemToUpdate) {
          const itemId = itemToUpdate._id;

          var namebox = document.getElementById("nameid");
          var emailbox = document.getElementById("emailid");
          var phonebox = document.getElementById("phoneid");

          namebox.value = itemToUpdate.name;
          emailbox.value = itemToUpdate.email;
          phonebox.value = itemToUpdate.phone;

          var updatebtn = document.createElement("button");
          updatebtn.className = "btn btn-danger btn-sm float-right update";
          updatebtn.appendChild(document.createTextNode("Update"));
          li.appendChild(updatebtn);

          updatebtn.addEventListener("click", async (e) => {
            var updatedName = namebox.value;
            var updatedEmail = emailbox.value;
            var updatedPhone = phonebox.value;

            var updatedItem = {
              name: updatedName,
              email: updatedEmail,
              phone: updatedPhone,
            };

            try {
              const putRes = await axios.put(
                `https://crudcrud.com/api/45155744af414f21a14eae555408eed5/appointmentData/${itemId}`,
                updatedItem
              );
              localStorage.setItem(updatedEmail, JSON.stringify(updatedItem));
              li.childNodes[0].textContent = `${updatedName} | ${updatedEmail} | ${updatedPhone}`;
              li.removeChild(updatebtn);
              console.log(putRes);
            } catch (err) {
              console.log(err);
            }
          });
        }
      } catch (err) {
        console.log(err);
      }
    }
    updateAppointment();
  }
  e.stopPropagation();
});
