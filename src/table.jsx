import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
  width: 80%;
  margin: 0 auto;
  font-family: Arial, sans-serif;
`;

const Logo = styled.div`
  border-bottom: 2px solid #ccc;
  padding: 20px 0;
  display: flex;
  justify-content: space-between;
`;

const SchoolInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const SchoolName = styled.h1`
  font-size: 28px;
  margin: 0;
`;

const SchoolLocation = styled.p`
  font-size: 18px;
  margin: 0;
`;

const TableWrapper = styled.div`
  margin-top: 20px;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const Th = styled.th`
  border: 1px solid #ddd;
  padding: 10px;
  text-align: left;
`;

const Td = styled.td`
  border: 1px solid #ddd;
  padding: 10px;
`;

const Input = styled.input`
  width: 60px;
  padding: 5px;
  border: 1px solid #ddd;
`;

const Button = styled.button`
  background-color: #007bff;
  color: #fff;
  border: none;
  padding: 10px 20px;
  cursor: pointer;
  border-radius: 5px;
  font-size: 16px;
  margin-right: 10px;

  &:hover {
    background-color: #0056b3;
  }
`;

const calculateTotalMark = (ca, cbt, exam) => {
  const caInt = parseInt(ca) || 0; // If ca is empty, use 0
  const cbtInt = parseInt(cbt) || 0; // If cbt is empty, use 0
  const examInt = parseInt(exam) || 0; // If exam is empty, use 0
  return caInt + cbtInt + examInt;
};

const calculateGrade = totalMark => {
  if (totalMark >= 70) {
    return 'A';
  } else if (totalMark >= 60) {
    return 'B';
  } else if (totalMark >= 50) {
    return 'C';
  } else if (totalMark >= 45) {
    return 'D';
  } else if (totalMark >= 40) {
    return 'E';
  } else {
    return 'F';
  }
};

const getRandomColor = () => {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

const TableComponent = () => {
  const [data, setData] = useState({});
  const [deletedRows, setDeletedRows] = useState([]);

  useEffect(() => {
    const savedData = JSON.parse(localStorage.getItem('scoreData')) || {};
    const savedDeletedRows = JSON.parse(localStorage.getItem('deletedRows')) || [];
    setData(savedData);
    setDeletedRows(savedDeletedRows);
  }, []);

  const saveData = newData => {
    setData(newData);
    localStorage.setItem('scoreData', JSON.stringify(newData));
  };

  const saveDeletedRows = newDeletedRows => {
    setDeletedRows(newDeletedRows);
    localStorage.setItem('deletedRows', JSON.stringify(newDeletedRows));
  };

  const updateRow = (subject, values) => {
    const newData = { ...data, [subject]: values };
    saveData(newData);
  };

  const deleteRow = subject => {
    const updatedDeletedRows = [...deletedRows, subject];
    saveDeletedRows(updatedDeletedRows);
  };

  const isRowDeleted = subject => {
    return deletedRows.includes(subject);
  };

  const changeColor = (subject) => {
    setData((prevData) => {
      const colors = ['#ff9999', '#99ff99', '#9999ff', '#ffff99', '#ff99ff', '#99ffff', '#fff'];
      const colorNames = ['Red', 'Green', 'Blue', 'Yellow', 'Pink', 'Cyan', 'White'];
      const currentIndex = parseInt(prevData[subject]?.colorIndex) || 0;
      const nextIndex = (currentIndex + 1) % colors.length;
  
      // Create a copy of the data object excluding the deleted rows
      const updatedData = Object.fromEntries(
        Object.entries(prevData)
          .filter(([key]) => !deletedRows.includes(key))
          .map(([key, value]) => {
            if (key === subject) {
              return [
                key,
                {
                  ...value,
                  backgroundColor: colors[nextIndex],
                  colorName: colorNames[nextIndex],
                  colorIndex: nextIndex,
                },
              ];
            }
            return [key, value];
          })
      );
  
      localStorage.setItem('scoreData', JSON.stringify(updatedData)); // Update local storage with the new color data
      return updatedData; // Return updated data
    });
  };

  const addRow = () => {
    const subject = prompt('Enter subject name:');
    if (subject) {
      const values = ['', '', ''];
      const newData = { ...data, [subject]: values };
      saveData(newData);
    }
  };

  return (
    <Wrapper>
      <Logo>
        <SchoolInfo>
          <SchoolName>Blissful School</SchoolName>
          <SchoolLocation>Ketu, Lagos State, Nigeria</SchoolLocation>
        </SchoolInfo>
        <div>
          <Button onClick={addRow}>Add Row</Button>
          <Button onClick={() => window.print()}>Save or Print This Page</Button>
        </div>
      </Logo>

      <TableWrapper>
        <Table border="1">
          <thead>
            <tr>
              <Th>Subject</Th>
              <Th>CA</Th>
              <Th>CBT</Th>
              <Th>Exam</Th>
              <Th>Total Mark</Th>
              <Th>Grade</Th>
              <Th>Actions</Th>
            </tr>
          </thead>
          <tbody>
          {Object.entries(data).map(([subject, values]) => {
  if (!Array.isArray(values)) return null; // Add this line to check if values is an array
  const [ca, cbt, exam] = values;
  const totalMark = calculateTotalMark(ca, cbt, exam);
  const grade = calculateGrade(totalMark);
  return (
    <React.Fragment key={subject}>
      {!isRowDeleted(subject) && (
        <tr style={{ backgroundColor: data[subject]?.backgroundColor }}>
          <Td>{subject}</Td>
          <Td>
            <Input
              type="number"
              value={ca}
              onChange={e => {
                const newValues = [...values];
                newValues[0] = e.target.value;
                updateRow(subject, newValues);
              }}
            />
          </Td>
          <Td>
            <Input
              type="number"
              value={cbt}
              onChange={e => {
                const newValues = [...values];
                newValues[1] = e.target.value;
                updateRow(subject, newValues);
              }}
            />
          </Td>
          <Td>
            <Input
              type="number"
              value={exam}
              onChange={e => {
                const newValues = [...values];
                newValues[2] = e.target.value;
                updateRow(subject, newValues);
              }}
            />
          </Td>
          <Td>{totalMark}</Td>
          <Td>{grade}</Td>
          <Td>
            <Button
              onClick={() => {
                deleteRow(subject);
              }}
            >
              Delete
            </Button>
            <Button
              onClick={() => {
                changeColor(subject);
              }}
            >
              Change Color
            </Button>
          </Td>
        </tr>
      )}
    </React.Fragment>
  );
})}
          </tbody>
        </Table>
      </TableWrapper>
    </Wrapper>
  );
};

export default TableComponent;
