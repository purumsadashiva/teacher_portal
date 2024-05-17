import React, { useState } from "react";
import "./TablePage.css";
import * as XLSX from "xlsx";
import * as FileSaver from "file-saver";
import PopupMessage from "./PopupMessage";
import { useDispatch, useSelector } from "react-redux";
import {
  addStudent,
  updateStudent,
  deleteStudent,
  deleteSelectedStudents,
} from "./Actions";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Checkbox,
  TextField,
  Button,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@material-ui/core";
import { auth } from "../../firebase";

function TablePage() {
  const dispatch = useDispatch();
  const students = useSelector((state) => state.students);
  console.log(students);

  const [isFormOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState("create");
  const [formIndex, setFormIndex] = useState(null);
  const [formData, setFormData] = useState({
    Name: "",
    Email: "",
    Subject: "",
    Marks: "",
  });

  const [selectedRows, setSelectedRows] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");
  const [nameQuery, setNameQuery] = useState("");
  const [emailQuery, setEmailQuery] = useState("");
  const [subjectQuery, setSubjectQuery] = useState("");

  const openForm = (mode, index) => {
    setFormOpen(true);
    setFormMode(mode);
    setFormIndex(index);
    setFormData(
      index !== null
        ? students[index]
        : {
            Name: "",
            Email: "",
            Subject: "",
            Marks: "",
          }
    );
  };

  const closeForm = () => {
    setFormOpen(false);
    setFormMode("create");
    setFormIndex(null);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleAction = () => {
    if (formMode === "update" && formIndex !== null) {
      // Check if any changes have been made
      const hasChanges = Object.keys(students[formIndex]).some(
        (key) => students[formIndex][key] !== formData[key]
      );

      if (!hasChanges) {
        setSuccessMessage("No changes made.");
        closeForm();
        return;
      }
    }

    // Perform action (add or update)
    if (typeof formData.Name !== "string") {
      setSuccessMessage("Please enter a valid name");
      return;
    }
    if (
      formData.Name === "" ||
      formData.Email === "" ||
      formData.Subject === "" ||
      formData.Marks === ""
    ) {
      setSuccessMessage("Please fill in all fields.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.Email.trim())) {
      setSuccessMessage("Please enter a valid email address.");
      return;
    }

    const marks = parseInt(formData.Marks);
    if (isNaN(marks) || marks < 0 || marks > 100) {
      setSuccessMessage("Please enter valid marks (0-100).");
      return;
    }

    if (formMode === "create") {
      dispatch(addStudent(formData));
      setSuccessMessage("Student added successfully");
    } else if (formMode === "update" && formIndex !== null) {
      dispatch(updateStudent(formIndex, formData));
      setSuccessMessage("Student updated successfully");
    }
    closeForm();
  };

  const handleDelete = (index) => {
    dispatch(deleteStudent(index));
    setSelectedRows((prevSelectedRows) =>
      prevSelectedRows.filter((i) => i !== index)
    );
    setSuccessMessage("Student data deleted successfully");
  };

  const handleDeleteSelected = () => {
    if (selectedRows.length === 0) {
      setSuccessMessage("No rows selected.");
      return;
    }

    dispatch(deleteSelectedStudents(selectedRows));
    setSelectedRows([]);
    setSuccessMessage("Selected rows deleted successfully");
  };

  const downloadExcel = (Data, fileName) => {
    const fileType =
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
    const fileExtension = ".xlsx";
    const ws = XLSX.utils.json_to_sheet(Data);
    const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const blob = new Blob([excelBuffer], { type: fileType });

    FileSaver.saveAs(blob, fileName + fileExtension);
    setSuccessMessage("Downloaded successfully");
  };

  const handleDownload = () => {
    const fileName = "StudentData";
    downloadExcel(students, fileName);
  };

  const filteredData = students.filter((row) => {
    if (!row) return false;

    const name = (row.Name || "").toLowerCase();
    const email = (row.Email || "").toLowerCase();
    const subject = (row.Subject || "").toLowerCase();

    return (
      (nameQuery === "" || name.startsWith(nameQuery.toLowerCase())) &&
      (emailQuery === "" || email.startsWith(emailQuery.toLowerCase())) &&
      (subjectQuery === "" || subject.startsWith(subjectQuery.toLowerCase()))
    );
  });

  const handleSignOut = () => {
    auth
      .signOut()
      .then(() => {
        window.location.href = "/";
      })
      .catch((error) => {
        console.error("Error signing out:", error);
      });
  };

  return (
    <div className="main-div">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "0 20px",
        }}
      >
        <Typography
          variant="h4"
          style={{ color: "#336d3c", fontWeight: "bold", fontFamily: "Arial" }}
        >
          Students List
        </Typography>

        <Button
          variant="contained"
          color="secondary"
          onClick={handleSignOut}
          style={{
            backgroundColor: "red",
            marginLeft: "auto",
            marginRight: "20px",
          }}
        >
          Sign Out
        </Button>
      </div>

      <div className="search-filters">
        <TextField
          type="text"
          placeholder="Filter Student Name"
          value={nameQuery}
          onChange={(e) => setNameQuery(e.target.value)}
          style={{ marginRight: "10px" }}
        />
        <TextField
          type="text"
          placeholder="Filter student Email"
          value={emailQuery}
          onChange={(e) => setEmailQuery(e.target.value)}
          style={{ marginRight: "10px" }}
        />
        <TextField
          type="text"
          placeholder="Filter by Subject"
          value={subjectQuery}
          onChange={(e) => setSubjectQuery(e.target.value)}
        />
      </div>
      <div className="table-div">
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <Checkbox
                    checked={
                      selectedRows.length === students.length &&
                      students.length > 0
                    }
                    onChange={() =>
                      setSelectedRows(
                        selectedRows.length === students.length
                          ? []
                          : students.map((_, index) => index)
                      )
                    }
                  />
                  Select All
                </TableCell>
                <TableCell>Student Name</TableCell>
                <TableCell>Email-Address</TableCell>
                <TableCell>Subject</TableCell>
                <TableCell>Marks</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredData.map((row, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Checkbox
                      checked={selectedRows.includes(index)}
                      onChange={() =>
                        setSelectedRows((prevSelectedRows) => {
                          if (prevSelectedRows.includes(index)) {
                            return prevSelectedRows.filter((i) => i !== index);
                          } else {
                            return [...prevSelectedRows, index];
                          }
                        })
                      }
                    />
                  </TableCell>
                  <TableCell>{row.Name}</TableCell>
                  <TableCell>{row.Email}</TableCell>
                  <TableCell>{row.Subject}</TableCell>
                  <TableCell>{row.Marks}</TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color="success"
                      onClick={() => openForm("update", index)}
                      style={{ marginRight: "10px" }}
                    >
                      Update
                    </Button>
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={() => handleDelete(index)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
      <div style={{ textAlign: "center", marginTop: "20px" }}>
        <Button
          variant="contained"
          color="success"
          onClick={() => openForm("create", null)}
          style={{ marginRight: "10px" }}
        >
          Add Student
        </Button>
        <Button
          variant="contained"
          color="secondary"
          onClick={handleDownload}
          style={{ marginRight: "10px", backgroundColor: "green" }}
        >
          Download Excel
        </Button>
        <Button
          variant="contained"
          color="secondary"
          onClick={handleDeleteSelected}
        >
          Delete Selected
        </Button>
      </div>
      <Dialog open={isFormOpen} onClose={closeForm}>
        <DialogTitle
          style={{
            color: "#00d7b9",
            fontWeight: 600,
            fontFamily: "Arial",
            textAlign: "center",
          }}
        >
          {formMode === "create" ? "Add Student" : "Update Student"}
        </DialogTitle>
        <DialogContent>
          <TextField
            type="text"
            name="Name"
            value={formData.Name}
            onChange={handleFormChange}
            id="outlined-basic"
            label="Name"
            variant="outlined"
            style={{ marginRight: "10px", marginBottom: "10px" }}
          />
          <TextField
            type="email"
            name="Email"
            id="outlined-basic"
            label="Email"
            variant="outlined"
            value={formData.Email}
            onChange={handleFormChange}
          />
          <TextField
            type="text"
            name="Subject"
            id="outlined-basic"
            label="Subject"
            variant="outlined"
            value={formData.Subject}
            onChange={handleFormChange}
            style={{ marginRight: "10px", marginBottom: "10px" }}
          />
          <TextField
            type="number"
            name="Marks"
            id="outlined-basic"
            label="Marks"
            variant="outlined"
            value={formData.Marks}
            onChange={handleFormChange}
          />
        </DialogContent>
        <DialogActions>
          <Button variant="contained" color="primary" onClick={handleAction}>
            {formMode === "create" ? "Add" : "Update"}
          </Button>
          <Button variant="contained" color="secondary" onClick={closeForm}>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
      {successMessage && (
        <PopupMessage
          message={successMessage}
          onClose={() => setSuccessMessage("")}
        />
      )}
    </div>
  );
}

export default TablePage;
