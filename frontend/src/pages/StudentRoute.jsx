import { useEffect, useState } from "react";
import api from "../services/api";

const Students = () => {
  const [students, setStudents] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");

  // Add Student Modal
  const [openAddModal, setOpenAddModal] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Student Details Modal
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [detailsLoading, setDetailsLoading] = useState(false);

  // Fetch Students
  const fetchStudents = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await api.get("/students");
      setStudents(res.data);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load students");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // Add Student
  const addStudent = async (e) => {
    e.preventDefault();

    try {
      setError("");

      await api.post("/students", {
        name,
        email,
        password,
      });

      setName("");
      setEmail("");
      setPassword("");

      setOpenAddModal(false);

      fetchStudents();
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to add student");
    }
  };

  // Open Student Details
  const openStudentDetails = async (id) => {
    try {
      setDetailsOpen(true);
      setDetailsLoading(true);

      const res = await api.get(`/students/${id}`);

      setSelectedStudent(res.data);
    } catch (err) {
      setError(
        err?.response?.data?.message || "Failed to load student details",
      );
    } finally {
      setDetailsLoading(false);
    }
  };

  // Search Filter
  const filteredStudents = students.filter((student) =>
    `${student.name} ${student.email}`
      .toLowerCase()
      .includes(search.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Students</h1>
          <p className="text-slate-500">Manage all student records</p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={fetchStudents}
            className="px-4 py-2 bg-white border rounded-lg shadow-sm hover:bg-slate-100"
          >
            Refresh
          </button>

          <button
            onClick={() => setOpenAddModal(true)}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            + Add Student
          </button>
        </div>
      </div>

      {/* STUDENT COUNT CARD */}
      <div className="mb-6">
        <div className="bg-white rounded-2xl shadow-sm border p-6 max-w-xs">
          <p className="text-slate-500 text-sm">Total Students</p>

          <h2 className="text-4xl font-bold text-slate-800 mt-2">
            {students.length}
          </h2>
        </div>
      </div>

      {/* ERROR */}
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl">
          {error}
        </div>
      )}

      {/* SEARCH */}
      <div className="bg-white border rounded-xl shadow-sm p-3 mb-6">
        <input
          type="text"
          placeholder="Search students..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full outline-none"
        />
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
        {loading ? (
          <div className="p-10 text-center text-slate-500">
            Loading students...
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-slate-100">
              <tr>
                <th className="text-left p-4">Name</th>
                <th className="text-left p-4">Email</th>
              </tr>
            </thead>

            <tbody>
              {filteredStudents.length > 0 ? (
                filteredStudents.map((student) => (
                  <tr
                    key={student.id}
                    onClick={() => openStudentDetails(student.id)}
                    className="border-t hover:bg-slate-50 cursor-pointer transition"
                  >
                    <td className="p-4 font-medium">{student.name}</td>

                    <td className="p-4 text-slate-600">{student.email}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="2" className="text-center p-8 text-slate-500">
                    No students found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* ADD STUDENT MODAL */}
      {openAddModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-md rounded-2xl p-6 shadow-xl">
            <h2 className="text-xl font-bold mb-4">Add Student</h2>

            <form onSubmit={addStudent} className="space-y-4">
              <input
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border rounded-lg p-3"
                required
              />

              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border rounded-lg p-3"
                required
              />

              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border rounded-lg p-3"
                required
              />

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setOpenAddModal(false)}
                  className="px-4 py-2 bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* STUDENT DETAILS MODAL */}
      {detailsOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-md rounded-2xl p-6 shadow-xl relative">
            <button
              onClick={() => {
                setDetailsOpen(false);
                setSelectedStudent(null);
              }}
              className="absolute top-4 right-4 text-slate-500 hover:text-black"
            >
              ✕
            </button>

            {detailsLoading ? (
              <div className="text-center py-10">
                Loading student details...
              </div>
            ) : selectedStudent ? (
              <>
                <h2 className="text-2xl font-bold mb-4">Student Details</h2>

                <div className="space-y-3">
                  <div>
                    <p className="text-slate-500 text-sm">Name</p>
                    <p className="font-semibold">{selectedStudent.name}</p>
                  </div>

                  <div>
                    <p className="text-slate-500 text-sm">Email</p>
                    <p className="font-semibold">{selectedStudent.email}</p>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center text-red-500">
                Failed to load student
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Students;
