// In-memory store. In the real capstone this becomes PostgreSQL.
function createStore() {
  const students = new Map();
  const attendance = [];
  let nextId = 1;
  return {
    addStudent({ name, language, level }) {
      const s = { id: nextId++, name, language, level };
      students.set(s.id, s);
      return s;
    },
    listStudents({ language, level } = {}) {
      return [...students.values()].filter(
        (s) => (!language || s.language === language) && (!level || s.level === level)
      );
    },
    getStudent: (id) => students.get(id),
    removeStudent: (id) => students.delete(id),
    logAttendance(studentId, date, present) {
      const rec = { studentId, date, present };
      attendance.push(rec);
      return rec;
    },
    attendanceFor: (studentId) => attendance.filter((a) => a.studentId === studentId),
  };
}
module.exports = { createStore };
