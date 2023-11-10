import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [file, setFile] = useState(null);
  const [characterName, setCharacterName] = useState('');
  const [pdfBlob, setPdfBlob] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('file', file);
    formData.append('character', characterName);

    try {
      const response = await axios.post('http://localhost:5000/process-pdf', formData, {
        responseType: 'blob',
      });

      if (response && response.data) {
        setPdfBlob(response.data);
      } else {
        console.error('Response or response data is undefined');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const downloadPdf = () => {
    const url = window.URL.createObjectURL(new Blob([pdfBlob]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'processed_script.pdf');
    document.body.appendChild(link);
    link.click();
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input type="file" onChange={e => setFile(e.target.files[0])} />
        <input type="text" value={characterName} onChange={e => setCharacterName(e.target.value)} placeholder="Character Name" />
        <button type="submit">Generate PDF</button>
      </form>
      {pdfBlob && (
        <div>
          <p>PDF processed successfully!</p>
          <button onClick={downloadPdf}>Download PDF</button>
        </div>
      )}
    </div>
  );
}

export default App;
