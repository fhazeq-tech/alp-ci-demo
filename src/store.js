// In-memory store. In the real capstone this becomes PostgreSQL.
function createStore() {
  const students = new Map();
  const attendance = [];
  const instructors = new Map();
  let nextId = 1;
  let nextInstructorId = 1;
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
    addInstructor({ name, languages, available }) {
      const i = { id: nextInstructorId++, name, languages, available };
      instructors.set(i.id, i);
      return i;
    },
    listInstructors({ language } = {}) {
      return [...instructors.values()].filter((i) => !language || i.languages.includes(language));
    },
    getInstructor: (id) => instructors.get(id),
    removeInstructor: (id) => instructors.delete(id),
  };
}
module.exports = { createStore };
