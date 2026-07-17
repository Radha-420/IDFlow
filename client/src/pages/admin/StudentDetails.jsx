import React, { useEffect, useState } from 'react';
import axios from 'axios';

const StudentDetails = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const { data } = await axios.get('/api/admin/students');
        setStudents(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
  }, []);

  const filteredStudents = students.filter(student => 
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    student.collegeId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.department?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="flex h-full items-center justify-center"><div className="animate-pulse w-8 h-8 bg-brand-500 rounded-full"></div></div>;

  return (
    <div className="max-w-7xl mx-auto animate-fade-in">
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Student Directory</h1>
          <p className="text-gray-500 mt-1">View all registered students in the system.</p>
        </div>
        
        <div className="w-full md:w-72">
          <input
            type="text"
            placeholder="Search by Name, ID, or Dept..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-field shadow-sm"
          />
        </div>
      </div>

      <div className="card-container overflow-hidden p-0 mb-8">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-500 uppercase bg-gray-50/50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 font-medium">Student Name</th>
                <th className="px-6 py-4 font-medium">PIN Number</th>
                <th className="px-6 py-4 font-medium">Department</th>
                <th className="px-6 py-4 font-medium">Year</th>
                <th className="px-6 py-4 font-medium">Contact</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((student) => (
                <tr key={student._id} className="bg-white border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <img src={student.photo} alt="" className="w-8 h-8 rounded-full mr-3 object-cover border border-gray-200" />
                      <div>
                        <span className="font-medium text-gray-800 block">{student.name}</span>
                        <span className="text-xs text-gray-500">{student.email}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-mono font-medium text-gray-700">{student.collegeId || 'N/A'}</td>
                  <td className="px-6 py-4 text-gray-700">
                    <span className="block font-medium">{student.department || 'N/A'}</span>
                    <span className="text-xs text-gray-500">{student.branch !== 'Pending' ? student.branch : ''}</span>
                  </td>
                  <td className="px-6 py-4 text-gray-700">{student.year || 'N/A'}</td>
                  <td className="px-6 py-4 text-gray-600">{student.phone || 'N/A'}</td>
                </tr>
              ))}
              {filteredStudents.length === 0 && (
                <tr><td colSpan="5" className="px-6 py-8 text-center text-gray-500">No students found matching your search.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default StudentDetails;
